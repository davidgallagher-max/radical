import UIKit
import AVFoundation
import MediaPlayer
import Capacitor

@UIApplicationMain
class AppDelegate: UIResponder, UIApplicationDelegate {

    var window: UIWindow?

    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
        // v63: speech and the chimes play with the ring/silent switch on (the Sounds switch in Settings turns chimes off).
        // Mixed with other audio, so a chime never stops someone's music.
        playThroughSilent()
        return true
    }

    func applicationWillResignActive(_ application: UIApplication) {
        // Sent when the application is about to move from active to inactive state. This can occur for certain types of temporary interruptions (such as an incoming phone call or SMS message) or when the user quits the application and it begins the transition to the background state.
        // Use this method to pause ongoing tasks, disable timers, and invalidate graphics rendering callbacks. Games should use this method to pause the game.
    }

    func applicationDidEnterBackground(_ application: UIApplication) {
        // Use this method to release shared resources, save user data, invalidate timers, and store enough application state information to restore your application to its current state in case it is terminated later.
        // If your application supports background execution, this method is called instead of applicationWillTerminate: when the user quits.
    }

    func applicationWillEnterForeground(_ application: UIApplication) {
        // Called as part of the transition from the background to the active state; here you can undo many of the changes made on entering the background.
    }

    func applicationDidBecomeActive(_ application: UIApplication) {
        // Restart any tasks that were paused (or not yet started) while the application was inactive. If the application was previously in the background, optionally refresh the user interface.
        playThroughSilent()
    }

    func playThroughSilent() {
        if VoicePlugin.active { return }  // 1.0.1: Listen holds the session (not mixed, so the lock screen shows it)
        try? AVAudioSession.sharedInstance().setCategory(.playback, mode: .default, options: [.mixWithOthers])
        try? AVAudioSession.sharedInstance().setActive(true)
    }

    func applicationWillTerminate(_ application: UIApplication) {
        // Called when the application is about to terminate. Save data if appropriate. See also applicationDidEnterBackground:.
    }

    func application(_ application: UIApplication,
                     configurationForConnecting connectingSceneSession: UISceneSession,
                     options: UIScene.ConnectionOptions) -> UISceneConfiguration {
        let config = UISceneConfiguration(name: "Default Configuration",
                                          sessionRole: connectingSceneSession.role)
        config.delegateClass = SceneDelegate.self
        return config
    }
}

// v79: the page's chimes (guzheng and woodblock) play here, not in web audio. WebKit keeps its own audio session for
// web audio, which either obeys the silent switch or interrupts music; native audio uses the app's session
// (.playback, mixed with others), so chimes sound on silent; someone's music dips under a chime and comes back.
// The page renders each chime once (OfflineAudioContext), sends it as a WAV with load, then plays it by id.
@objc(ChimePlugin)
public class ChimePlugin: CAPPlugin, CAPBridgedPlugin, AVAudioPlayerDelegate {
    public let identifier = "ChimePlugin"
    public let jsName = "Chime"
    public let pluginMethods: [CAPPluginMethod] = [
        CAPPluginMethod(name: "load", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "play", returnType: CAPPluginReturnPromise)
    ]
    private var sounds: [String: Data] = [:]
    private var playing: [AVAudioPlayer] = []

    @objc func load(_ call: CAPPluginCall) {
        guard let id = call.getString("id"), let b64 = call.getString("data"), let data = Data(base64Encoded: b64) else {
            call.reject("bad sound"); return
        }
        DispatchQueue.main.async { self.sounds[id] = data; call.resolve() }
    }

    @objc func play(_ call: CAPPluginCall) {
        guard let id = call.getString("id") else { call.reject("no id"); return }
        // 1.0.1: Settings, Chimes: "always" plays on silent; "quiet" (Not on silent) uses .ambient, which the switch mutes
        let quiet = call.getString("mode") == "quiet"
        DispatchQueue.main.async {
            guard let data = self.sounds[id], let p = try? AVAudioPlayer(data: data) else { call.reject("not loaded"); return }
            let s = AVAudioSession.sharedInstance()
            // Other audio (music, a podcast) dips while a chime plays (v79, David). WebKit can also change the
            // shared session, so set it before each chime. While Listen reads, the session is left alone.
            if !VoicePlugin.active {
                if quiet {
                    if s.category != .ambient { try? s.setCategory(.ambient, mode: .default, options: []) }
                } else if s.category != .playback || !s.categoryOptions.contains(.duckOthers) {
                    try? s.setCategory(.playback, mode: .default, options: [.mixWithOthers, .duckOthers])
                }
                try? s.setActive(true)
            }
            self.playing.removeAll { !$0.isPlaying }
            self.playing.append(p)
            p.delegate = self
            p.prepareToPlay()
            p.play()
            call.resolve()
        }
    }
}

extension ChimePlugin {
    // The last chime finished: bring the other audio back up (ducking lasts while the session is active).
    public func audioPlayerDidFinishPlaying(_ player: AVAudioPlayer, successfully flag: Bool) {
        DispatchQueue.main.asyncAfter(deadline: .now() + 0.2) {
            self.playing.removeAll { !$0.isPlaying }
            guard self.playing.isEmpty, !VoicePlugin.active else { return }
            let s = AVAudioSession.sharedInstance()
            try? s.setCategory(.playback, mode: .default, options: [.mixWithOthers])
            try? s.setActive(false, options: .notifyOthersOnDeactivation)
        }
    }
}

// The app's web view; registers the plugins that live in this file.
class MainViewController: CAPBridgeViewController {
    override open func capacitorDidLoad() {
        bridge?.registerPluginInstance(ChimePlugin())
        bridge?.registerPluginInstance(VoicePlugin())
        bridge?.registerPluginInstance(FeelPlugin())
    }
}

// 1.0.1: Listen reads here with the phone's own voice, so it keeps going with the screen locked or in another app
// (UIBackgroundModes audio). The page sends every sentence at once; the voice queues them, and the page hears back
// through window events "radicalvoice" {kind: chunk|word|end|state, i, at, len, bg, playing} to light up the
// sentence and pay reading credit (never for what was said in the background). The lock screen shows the text's
// Chinese and English titles with play/pause.
@objc(VoicePlugin)
public class VoicePlugin: CAPPlugin, CAPBridgedPlugin, AVSpeechSynthesizerDelegate {
    public let identifier = "VoicePlugin"
    public let jsName = "Voice"
    public let pluginMethods: [CAPPluginMethod] = [
        CAPPluginMethod(name: "speak", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "stop", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "pause", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "resume", returnType: CAPPluginReturnPromise)
    ]
    static var active = false
    private let synth = AVSpeechSynthesizer()
    private var index: [ObjectIdentifier: Int] = [:]
    private var count = 0
    private var base = 0
    private var title = ""
    private var sub = ""
    private var paused = false
    private var remote = false

    override public func load() { synth.delegate = self }

    private func bg() -> Bool { UIApplication.shared.applicationState != .active }
    private func send(_ d: [String: Any]) {
        guard let j = try? JSONSerialization.data(withJSONObject: d), let t = String(data: j, encoding: .utf8) else { return }
        bridge?.triggerWindowJSEvent(eventName: "radicalvoice", data: t)
    }

    @objc func speak(_ call: CAPPluginCall) {
        let chunks = (call.getArray("chunks") ?? []).compactMap { $0 as? String }
        let b = call.getInt("base") ?? 0
        let rate = Float(call.getDouble("rate") ?? 0.5)
        let lang = call.getString("lang") ?? "zh-TW"
        let vid = call.getString("voice") ?? ""
        let vname = call.getString("voiceName") ?? ""
        let t = call.getString("title") ?? "", st = call.getString("subtitle") ?? ""
        DispatchQueue.main.async {
            self.index = [:]
            if self.synth.isSpeaking || self.synth.isPaused { self.synth.stopSpeaking(at: .immediate) }
            guard !chunks.isEmpty else { call.resolve(); return }
            var voice: AVSpeechSynthesisVoice? = vid.isEmpty ? nil : AVSpeechSynthesisVoice(identifier: vid)
            if voice == nil && !vname.isEmpty { voice = AVSpeechSynthesisVoice.speechVoices().first { $0.language == lang && $0.name == vname } }
            if voice == nil { voice = AVSpeechSynthesisVoice(language: lang) }
            VoicePlugin.active = true
            let s = AVAudioSession.sharedInstance()
            try? s.setCategory(.playback, mode: .spokenAudio, options: [])
            try? s.setActive(true)
            self.count = chunks.count; self.base = b; self.title = t; self.sub = st; self.paused = false
            for (i, c) in chunks.enumerated() {
                let u = AVSpeechUtterance(string: c)
                u.voice = voice
                u.rate = max(AVSpeechUtteranceMinimumSpeechRate, min(AVSpeechUtteranceMaximumSpeechRate, rate))
                u.postUtteranceDelay = 0.06
                self.index[ObjectIdentifier(u)] = i
                self.synth.speak(u)
            }
            self.setupRemote()
            self.nowPlaying(1)
            call.resolve()
        }
    }

    @objc func stop(_ call: CAPPluginCall) {
        DispatchQueue.main.async { self.finish(); call.resolve() }
    }
    @objc func pause(_ call: CAPPluginCall) { DispatchQueue.main.async { self.doPause(); call.resolve() } }
    @objc func resume(_ call: CAPPluginCall) { DispatchQueue.main.async { self.doResume(); call.resolve() } }

    private func doPause() {
        guard VoicePlugin.active, !paused else { return }
        synth.pauseSpeaking(at: .word); paused = true; nowPlaying(0); send(["kind": "state", "playing": false, "bg": bg()])
    }
    private func doResume() {
        guard VoicePlugin.active, paused else { return }
        try? AVAudioSession.sharedInstance().setActive(true)
        synth.continueSpeaking(); paused = false; nowPlaying(1); send(["kind": "state", "playing": true, "bg": bg()])
    }
    private func finish() {
        index = [:]
        if synth.isSpeaking || synth.isPaused { synth.stopSpeaking(at: .immediate) }
        paused = false
        guard VoicePlugin.active else { return }
        VoicePlugin.active = false
        MPNowPlayingInfoCenter.default().nowPlayingInfo = nil
        let s = AVAudioSession.sharedInstance()
        try? s.setActive(false, options: .notifyOthersOnDeactivation)
        try? s.setCategory(.playback, mode: .default, options: [.mixWithOthers])
        try? s.setActive(true)
    }

    private func setupRemote() {
        guard !remote else { return }
        remote = true
        let c = MPRemoteCommandCenter.shared()
        c.playCommand.isEnabled = true
        c.pauseCommand.isEnabled = true
        c.togglePlayPauseCommand.isEnabled = true
        c.playCommand.addTarget { [weak self] _ in
            guard let me = self, VoicePlugin.active else { return .noActionableNowPlayingItem }
            me.doResume(); return .success
        }
        c.pauseCommand.addTarget { [weak self] _ in
            guard let me = self, VoicePlugin.active else { return .noActionableNowPlayingItem }
            me.doPause(); return .success
        }
        c.togglePlayPauseCommand.addTarget { [weak self] _ in
            guard let me = self, VoicePlugin.active else { return .noActionableNowPlayingItem }
            if me.paused { me.doResume() } else { me.doPause() }
            return .success
        }
        for x in [c.nextTrackCommand, c.previousTrackCommand, c.skipForwardCommand, c.skipBackwardCommand, c.seekForwardCommand, c.seekBackwardCommand, c.changePlaybackPositionCommand] { x.isEnabled = false }
    }

    private func nowPlaying(_ rate: Double) {
        var info: [String: Any] = [
            MPMediaItemPropertyTitle: title.isEmpty ? "Radical" : title,
            MPMediaItemPropertyArtist: sub.isEmpty ? "Radical" : sub,
            MPNowPlayingInfoPropertyPlaybackRate: rate
        ]
        if let img = UIImage(named: "AppIcon") ?? UIImage(named: "Splash") {
            info[MPMediaItemPropertyArtwork] = MPMediaItemArtwork(boundsSize: img.size) { _ in img }
        }
        MPNowPlayingInfoCenter.default().nowPlayingInfo = info
    }

    public func speechSynthesizer(_ s: AVSpeechSynthesizer, didStart u: AVSpeechUtterance) {
        DispatchQueue.main.async {
            guard let i = self.index[ObjectIdentifier(u)] else { return }
            self.send(["kind": "chunk", "i": self.base + i, "bg": self.bg()])
        }
    }
    public func speechSynthesizer(_ s: AVSpeechSynthesizer, willSpeakRangeOfSpeechString r: NSRange, utterance u: AVSpeechUtterance) {
        DispatchQueue.main.async {
            guard let i = self.index[ObjectIdentifier(u)], !self.bg() else { return }  // no word events while away: they'd only pile up
            self.send(["kind": "word", "i": self.base + i, "at": r.location, "len": r.length, "bg": false])
        }
    }
    public func speechSynthesizer(_ s: AVSpeechSynthesizer, didFinish u: AVSpeechUtterance) {
        DispatchQueue.main.async {
            guard let i = self.index[ObjectIdentifier(u)] else { return }
            let away = self.bg()
            self.send(["kind": "done", "i": self.base + i, "bg": away])
            if i == self.count - 1 { self.send(["kind": "end", "i": self.base + i, "bg": away]); self.finish() }
        }
    }
}

// 1.0.1: taps you feel, only where iPhone apps usually have them (switches, segments, touch and hold, pull to refresh,
// dragging) and once when the day's goal is met. Settings, Haptics turns them off.
@objc(FeelPlugin)
public class FeelPlugin: CAPPlugin, CAPBridgedPlugin {
    public let identifier = "FeelPlugin"
    public let jsName = "Feel"
    public let pluginMethods: [CAPPluginMethod] = [
        CAPPluginMethod(name: "impact", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "selection", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "notify", returnType: CAPPluginReturnPromise)
    ]
    @objc func impact(_ call: CAPPluginCall) {
        let st = call.getString("style") ?? "light"
        DispatchQueue.main.async {
            let style: UIImpactFeedbackGenerator.FeedbackStyle = st == "heavy" ? .heavy : st == "medium" ? .medium : st == "soft" ? .soft : st == "rigid" ? .rigid : .light
            UIImpactFeedbackGenerator(style: style).impactOccurred(); call.resolve()
        }
    }
    @objc func selection(_ call: CAPPluginCall) {
        DispatchQueue.main.async { UISelectionFeedbackGenerator().selectionChanged(); call.resolve() }
    }
    @objc func notify(_ call: CAPPluginCall) {
        let t = call.getString("type") ?? "success"
        DispatchQueue.main.async {
            let k: UINotificationFeedbackGenerator.FeedbackType = t == "error" ? .error : t == "warning" ? .warning : .success
            UINotificationFeedbackGenerator().notificationOccurred(k); call.resolve()
        }
    }
}
