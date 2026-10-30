// v61: payments. A 14-day trial, then a one-time unlock bought in the app (Apple, later Google Play) through
// RevenueCat. Our own record of who has paid lives in Storage, so the web app follows the account and switching
// away from RevenueCat stays cheap:
//   users/<id>/entitlement.json   { unlock: { at, src: "store" | "gift", product?, by? } | null, trialFrom: "YYYY-MM-DD" }
//   users/<id>/purchases.json     the RevenueCat events for this person, newest last (at most 200)
// Nothing is locked until RADICAL_PAYWALL is "on" in Vercel. Env (all optional until launch):
//   RADICAL_PAYWALL            "on" turns the trial and the lock on
//   REVENUECAT_IOS_KEY         RevenueCat's public Apple key (appl_...), meant to be in the app
//   REVENUECAT_ANDROID_KEY     RevenueCat's public Google key (goog_...), for the Android app
//   REVENUECAT_SECRET          RevenueCat secret API key (sk_...), Secret type: lets the server check a purchase itself
//   REVENUECAT_WEBHOOK_AUTH    the Authorization value set on RevenueCat's webhook, Secret type
const UNLOCK = "radical_unlock", TRIAL = "radical_trial", ENTITLEMENT = "unlock", TRIAL_DAYS = 14;
const DAY = /^\d{4}-\d{2}-\d{2}$/;
const USER_ID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;

module.exports = ({ getJSON, putJSON, isOwner }) => {
  const config = () => ({ on: process.env.RADICAL_PAYWALL === "on", ios: process.env.REVENUECAT_IOS_KEY || "", android: process.env.REVENUECAT_ANDROID_KEY || "",
    days: TRIAL_DAYS, product: UNLOCK, trial: TRIAL, entitlement: ENTITLEMENT });
  const path = id => `users/${id}/entitlement.json`;
  const read = async id => (await getJSON(path(id)).catch(() => null)) || { unlock: null, trialFrom: "" };
  const earlier = (a, b) => !a ? b : !b ? a : a < b ? a : b;

  // What the page needs: unlocked or not, and when the trial began (owners are always unlocked)
  async function get(user) {
    const e = await read(user.id);
    return { unlock: isOwner(user) ? { src: "owner" } : e.unlock || null, trialFrom: e.trialFrom || "" };
  }
  // Ask RevenueCat directly (needs the secret key): the purchase and the $0 trial item, whichever device bought them
  async function check(user) {
    const key = process.env.REVENUECAT_SECRET; if (!key) return get(user);
    const r = await fetch(`https://api.revenuecat.com/v1/subscribers/${encodeURIComponent(user.id)}`, { headers: { Authorization: `Bearer ${key}` } });
    if (!r.ok) return get(user);
    const s = ((await r.json().catch(() => ({}))).subscriber) || {};
    const e = await read(user.id); let changed = false;
    const ent = (s.entitlements || {})[ENTITLEMENT];
    if (ent && (!ent.expires_date || Date.parse(ent.expires_date) > Date.now()) && !(e.unlock && e.unlock.src === "store")) {
      e.unlock = { at: ent.purchase_date || new Date().toISOString(), src: "store", product: ent.product_identifier || UNLOCK }; changed = true;
    }
    const tr = ((s.non_subscriptions || {})[TRIAL] || [])[0];
    if (tr && tr.purchase_date) { const d = tr.purchase_date.slice(0, 10), t = earlier(e.trialFrom, d); if (t !== e.trialFrom) { e.trialFrom = t; changed = true; } }
    if (changed) await putJSON(path(user.id), e);
    return get(user);
  }
  // The page tells us when its trial began; the earliest day any device reports wins (a reinstall can't restart it)
  async function trial(user, from, today) {
    if (!DAY.test(String(from || "")) || from > today) return get(user);
    const e = await read(user.id), t = earlier(e.trialFrom, from);
    if (t !== e.trialFrom) { e.trialFrom = t; await putJSON(path(user.id), e); }
    return get(user);
  }
  // Owners give the unlock to a friend (by friend code) or take a gift back. Apple doesn't allow our own unlock codes
  // inside the app, so a gift is granted here and the app reads it from the account.
  async function gift(user, body) {
    if (!isOwner(user)) return { error: "Owners only." };
    const code = String(body.code || "").toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 12);
    const c = code && await getJSON(`codes/${code}.json`).catch(() => null);
    if (!c || !c.id) return { error: "No one has that friend code." };
    const e = await read(c.id);
    if (body.op === "ungift") {
      if (!e.unlock || e.unlock.src !== "gift") return { error: e.unlock ? "They bought it; that can't be taken back here." : "They don't have a gift." };
      e.unlock = null;
    } else {
      if (e.unlock) return { ok: true, already: true };
      e.unlock = { at: new Date().toISOString(), src: "gift", by: user.email };
    }
    await putJSON(path(c.id), e);
    return { ok: true };
  }
  async function act(user, body, today) {
    if (body.op === "trial") return trial(user, body.from, today);
    if (body.op === "check") return check(user);
    if (body.op === "gift" || body.op === "ungift") return gift(user, body);
    return get(user);
  }
  // RevenueCat's webhook: every purchase event is kept, and the unlock is written to the buyer's record. Anonymous
  // buyers (not signed in) have no record here; they get it when they sign in (the page asks with op check).
  async function webhook(req, body) {
    const want = process.env.REVENUECAT_WEBHOOK_AUTH, got = String(req.headers.authorization || "");
    if (!want || (got !== want && got !== `Bearer ${want}`)) return { status: 401, out: { error: "No." } };
    const ev = body && body.event; if (!ev || !ev.type) return { status: 400, out: { error: "No event." } };
    const ids = [...new Set([ev.app_user_id, ev.original_app_user_id, ...(ev.aliases || []), ...(ev.transferred_to || [])].filter(x => USER_ID.test(String(x || ""))))];
    for (const id of ids) {
      const log = (await getJSON(`users/${id}/purchases.json`).catch(() => null)) || { events: [] };
      log.events.push({ id: ev.id, type: ev.type, product: ev.product_id, store: ev.store, env: ev.environment, at: ev.purchased_at_ms || ev.event_timestamp_ms, price: ev.price, currency: ev.currency, reason: ev.cancel_reason });
      log.events = log.events.slice(-200);
      await putJSON(`users/${id}/purchases.json`, log);
      const e = await read(id);
      const day = new Date(+ev.purchased_at_ms || Date.now()).toISOString().slice(0, 10);
      if (ev.product_id === TRIAL && ["INITIAL_PURCHASE", "NON_RENEWING_PURCHASE"].includes(ev.type)) e.trialFrom = earlier(e.trialFrom, day);
      else if (ev.product_id === UNLOCK && ["INITIAL_PURCHASE", "NON_RENEWING_PURCHASE", "TRANSFER"].includes(ev.type) && (!ev.transferred_from || !(ev.transferred_from || []).includes(id)))
        e.unlock = { at: new Date(+ev.purchased_at_ms || Date.now()).toISOString(), src: "store", product: UNLOCK, store: ev.store };
      else if (ev.product_id === UNLOCK && ev.type === "CANCELLATION" && e.unlock && e.unlock.src === "store") e.unlock = null;  // a refund
      else continue;
      await putJSON(path(id), e);
    }
    return { status: 200, out: { ok: true } };
  }
  return { config, act, webhook, get, UNLOCK, TRIAL, TRIAL_DAYS };
};
