// v61, reworked in v63: payments. $4.99 a month or $39.99 a year (each starting with Apple's 14-day free trial), or
// $79.99 once to own it, bought in the app (Apple, later Google Play) through RevenueCat. Our own record of who has
// paid lives in Storage, so the web app follows the account and switching away from RevenueCat stays cheap:
//   users/<id>/entitlement.json   { unlock: { at, src: "store" | "gift", product?, by? } | null,   (lifetime or a gift)
//                                   sub: { product, until, trial? } | null,                       (monthly or yearly)
//                                   trialFrom: "YYYY-MM-DD" }                                      (the web's own trial)
//   users/<id>/purchases.json     the RevenueCat events for this person, newest last (at most 200)
//   users/<id>/meter.json         this month's and today's AI: what it really cost us and what it counted
//   hits/<YYYY-MM>.json           who ran into their AI allowance this month (owners see it in Admin tools)
// AI comes with Radical as an allowance, the same for subscribers and lifetime: RADICAL_AI_MONTH ($2.50) a month, at
// most RADICAL_AI_DAY (50¢) in a day; a trial gets RADICAL_AI_TRIAL ($1.50) in all, RADICAL_AI_TRIAL_DAY (25¢) a day.
// Until RADICAL_BONUS_UNTIL (the launch bonus, six months from launch) everything is doubled. What counts against the
// allowance is the discounted price (a first ask costs half, see api/claude.js); what it really cost us is checked
// against the same numbers, so nobody can cost more than they pay.
// Nothing is locked until RADICAL_PAYWALL is "on" in Vercel. Env (all optional until launch):
//   RADICAL_PAYWALL            "on" turns the trial, the lock and the allowances on
//   REVENUECAT_IOS_KEY         RevenueCat's public Apple key (appl_...), meant to be in the app
//   REVENUECAT_ANDROID_KEY     RevenueCat's public Google key (goog_...), for the Android app
//   REVENUECAT_SECRET          RevenueCat secret API key (sk_...), Secret type: lets the server check a purchase itself
//   REVENUECAT_WEBHOOK_AUTH    the Authorization value set on RevenueCat's webhook, Secret type
//   RADICAL_AI_MONTH, RADICAL_AI_DAY, RADICAL_AI_TRIAL, RADICAL_AI_TRIAL_DAY, RADICAL_BONUS_UNTIL   (above)
const UNLOCK = "radical_unlock", ENTITLEMENT = "unlock", TRIAL_DAYS = 14;  // radical_unlock is Lifetime ($79.99)
const SUBS = { radical_month: { price: "$4.99", per: "month" }, radical_year: { price: "$39.99", per: "year" } };
const LIFETIME = "$79.99";
const DAY = /^\d{4}-\d{2}-\d{2}$/;
const USER_ID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;
const num = (name, d) => { const v = +process.env[name]; return v > 0 ? v : d; };

module.exports = ({ getJSON, putJSON, isOwner }) => {
  const bonusUntil = () => DAY.test(process.env.RADICAL_BONUS_UNTIL || "") ? process.env.RADICAL_BONUS_UNTIL : "";
  const allow = today => {
    const b = bonusUntil() && today <= bonusUntil() ? 2 : 1;
    return { month: num("RADICAL_AI_MONTH", 2.5), day: num("RADICAL_AI_DAY", .5), trial: num("RADICAL_AI_TRIAL", 1.5), trialDay: num("RADICAL_AI_TRIAL_DAY", .25), x: b, bonus: bonusUntil() };
  };
  const config = () => ({ on: process.env.RADICAL_PAYWALL === "on", ios: process.env.REVENUECAT_IOS_KEY || "", android: process.env.REVENUECAT_ANDROID_KEY || "",
    days: TRIAL_DAYS, product: UNLOCK, lifetime: LIFETIME, entitlement: ENTITLEMENT, subs: Object.entries(SUBS).map(([id, s]) => ({ id, ...s })),
    allow: allow(new Date().toISOString().slice(0, 10)) });
  const subOn = e => !!(e.sub && SUBS[e.sub.product] && +e.sub.until > Date.now());
  const path = id => `users/${id}/entitlement.json`;
  const read = async id => (await getJSON(path(id)).catch(() => null)) || { unlock: null, sub: null, trialFrom: "" };
  const earlier = (a, b) => !a ? b : !b ? a : a < b ? a : b;

  // What the page needs: lifetime or a subscription, and when the web trial began (owners always have it)
  async function get(user) {
    const e = await read(user.id);
    return { unlock: isOwner(user) ? { src: "owner" } : e.unlock || null, sub: subOn(e) ? e.sub : null, trialFrom: e.trialFrom || "" };
  }
  // Ask RevenueCat directly (needs the secret key): lifetime or a live subscription, whichever device bought it
  async function check(user) {
    const key = process.env.REVENUECAT_SECRET; if (!key) return get(user);
    const r = await fetch(`https://api.revenuecat.com/v1/subscribers/${encodeURIComponent(user.id)}`, { headers: { Authorization: `Bearer ${key}` } });
    if (!r.ok) return get(user);
    const s = ((await r.json().catch(() => ({}))).subscriber) || {};
    const e = await read(user.id); let changed = false;
    const life = ((s.non_subscriptions || {})[UNLOCK] || []).find(t => !t.refunded_at);
    if (life && !(e.unlock && e.unlock.src === "store")) { e.unlock = { at: life.purchase_date || new Date().toISOString(), src: "store", product: UNLOCK }; changed = true; }
    for (const [pid, sub] of Object.entries(s.subscriptions || {})) if (SUBS[pid] && sub.expires_date && Date.parse(sub.expires_date) > Date.now() && !sub.refunded_at
      && (!e.sub || +e.sub.until < Date.parse(sub.expires_date))) { e.sub = { product: pid, until: Date.parse(sub.expires_date), ...(sub.period_type === "trial" ? { trial: true } : {}) }; changed = true; }
    if (changed) await putJSON(path(user.id), e);
    return get(user);
  }
  // The web's trial: the page tells us when it began; the earliest day any device reports wins
  async function trial(user, from, today) {
    if (!DAY.test(String(from || "")) || from > today) return get(user);
    const e = await read(user.id), t = earlier(e.trialFrom, from);
    if (t !== e.trialFrom) { e.trialFrom = t; await putJSON(path(user.id), e); }
    return get(user);
  }
  // Owners give lifetime to a friend (by friend code) or take a gift back. Apple doesn't allow our own codes inside
  // the app, so a gift is granted here and the app reads it from the account.
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
    if (body.op === "hits") return isOwner(user) ? { hits: ((await getJSON(`hits/${today.slice(0, 7)}.json`).catch(() => null)) || { list: [] }).list } : { error: "Owners only." };
    return get(user);
  }
  // RevenueCat's webhook: every purchase event is kept, and lifetime or the subscription is written to the buyer's
  // record. Anonymous buyers (not signed in) have no record here; they get it when they sign in (op check).
  async function webhook(req, body) {
    const want = process.env.REVENUECAT_WEBHOOK_AUTH, got = String(req.headers.authorization || "");
    if (!want || (got !== want && got !== `Bearer ${want}`)) return { status: 401, out: { error: "No." } };
    const ev = body && body.event; if (!ev || !ev.type) return { status: 400, out: { error: "No event." } };
    const ids = [...new Set([ev.app_user_id, ev.original_app_user_id, ...(ev.aliases || []), ...(ev.transferred_to || [])].filter(x => USER_ID.test(String(x || ""))))];
    for (const id of ids) {
      const log = (await getJSON(`users/${id}/purchases.json`).catch(() => null)) || { events: [] };
      log.events.push({ id: ev.id, type: ev.type, product: ev.product_id, store: ev.store, env: ev.environment, at: ev.purchased_at_ms || ev.event_timestamp_ms, price: ev.price, currency: ev.currency, reason: ev.cancel_reason, period: ev.period_type });
      log.events = log.events.slice(-200);
      await putJSON(`users/${id}/purchases.json`, log);
      const e = await read(id), pid = SUBS[ev.new_product_id] ? ev.new_product_id : ev.product_id;
      if (ev.product_id === UNLOCK && ["INITIAL_PURCHASE", "NON_RENEWING_PURCHASE", "TRANSFER"].includes(ev.type) && !(ev.transferred_from || []).includes(id))
        e.unlock = { at: new Date(+ev.purchased_at_ms || Date.now()).toISOString(), src: "store", product: UNLOCK, store: ev.store };
      else if (ev.product_id === UNLOCK && ev.type === "CANCELLATION" && e.unlock && e.unlock.src === "store") e.unlock = null;  // a refund
      else if (SUBS[pid] && ["INITIAL_PURCHASE", "RENEWAL", "PRODUCT_CHANGE", "UNCANCELLATION"].includes(ev.type) && ev.expiration_at_ms)
        e.sub = { product: pid, until: +ev.expiration_at_ms, ...(ev.period_type === "TRIAL" ? { trial: true } : {}) };
      else if (SUBS[ev.product_id] && (ev.type === "EXPIRATION" || (ev.type === "CANCELLATION" && ev.cancel_reason === "CUSTOMER_SUPPORT"))) e.sub = null;  // ended or refunded
      // a plain CANCELLATION (auto-renew off) keeps the subscription until it runs out
      else continue;
      await putJSON(path(id), e);
    }
    return { status: 200, out: { ok: true } };
  }

  // ---- the AI allowance (only with RADICAL_PAYWALL on; owners never). null = the usual daily stop (before launch).
  // { locked } once a trial is over without buying; else the limits that apply: paid (a month and a day) or trial
  // (in all and a day).
  async function aiCap(user, today) {
    if (!config().on || !user || isOwner(user)) return null;
    const e = await read(user.id), a = allow(today);
    if (e.unlock || (subOn(e) && !e.sub.trial)) return { kind: "paid", month: a.month * a.x, day: a.day * a.x, base: a.month, bonus: a.x > 1 ? a.bonus : "" };
    if (subOn(e) || (e.trialFrom && Math.round((Date.parse(today) - Date.parse(e.trialFrom)) / 864e5) < TRIAL_DAYS))
      return { kind: "trial", total: a.trial * a.x, day: a.trialDay * a.x, base: a.trial, bonus: a.x > 1 ? a.bonus : "" };
    return { locked: true };
  }
  const meterPath = id => `users/${id}/meter.json`;
  // This month's and today's use (counted = what the allowance sees; real = what it cost us); the trial adds up across months
  async function meter(user, today) {
    const m = (await getJSON(meterPath(user.id)).catch(() => null)) || {}, mo = today.slice(0, 7);
    if (m.month !== mo) Object.assign(m, { month: mo, chg: 0, real: 0 });
    if (m.day !== today) Object.assign(m, { day: today, dchg: 0, dreal: 0 });
    m.trial = m.trial || { chg: 0, real: 0 };
    return m;
  }
  // Is there room for one more call? "" = yes; else "day" or "month" (or "trial")
  function room(cap, m) {
    if (!cap || cap.locked) return "";
    if (m.dchg >= cap.day) return "day";
    if (cap.kind === "trial") return m.trial.chg >= cap.total || m.trial.real >= cap.total ? "trial" : "";
    return m.chg >= cap.month || m.real >= cap.month ? "month" : "";
  }
  async function charge(user, cap, real, chg, today) {
    if (!user) return;
    const m = await meter(user, today), r6 = x => +x.toFixed(6);
    m.chg = r6(m.chg + chg); m.real = r6(m.real + real); m.dchg = r6(m.dchg + chg); m.dreal = r6(m.dreal + real);
    if (cap && cap.kind === "trial") { m.trial.chg = r6(m.trial.chg + chg); m.trial.real = r6(m.trial.real + real); }
    await putJSON(meterPath(user.id), m).catch(() => {});
  }
  // Someone ran into their allowance: noted once a day per person for the owners (hits/<month>.json)
  async function hit(user, why, today) {
    const p = `hits/${today.slice(0, 7)}.json`, h = (await getJSON(p).catch(() => null)) || { list: [] };
    if (h.list.some(x => x.id === user.id && x.day === today)) return;
    const m = await meter(user, today);
    h.list.push({ id: user.id, email: user.email || "", day: today, why, month: m.chg, real: m.real }); h.list = h.list.slice(-500);
    await putJSON(p, h).catch(() => {});
  }
  return { config, act, webhook, get, aiCap, meter, room, charge, hit, allow, SUBS, UNLOCK, TRIAL_DAYS };
};
