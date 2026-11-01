import UIKit
import AVFoundation
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
// (.playback, mixed with others), so chimes sound on silent and play over someone's music.
// The page renders each chime once (OfflineAudioContext), sends it as a WAV with load, then plays it by id.
@objc(ChimePlugin)
public class ChimePlugin: CAPPlugin, CAPBridgedPlugin {
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
        DispatchQueue.main.async {
            guard let data = self.sounds[id], let p = try? AVAudioPlayer(data: data) else { call.reject("not loaded"); return }
            let s = AVAudioSession.sharedInstance()
            // WebKit (speech, web audio) can change the shared session; put it back before each chime.
            if s.category != .playback || !s.categoryOptions.contains(.mixWithOthers) {
                try? s.setCategory(.playback, mode: .default, options: [.mixWithOthers])
            }
            try? s.setActive(true)
            self.playing.removeAll { !$0.isPlaying }
            self.playing.append(p)
            p.prepareToPlay()
            p.play()
            call.resolve()
        }
    }
}

// The app's web view; registers the plugins that live in this file.
class MainViewController: CAPBridgeViewController {
    override open func capacitorDidLoad() {
        bridge?.registerPluginInstance(ChimePlugin())
    }
}
