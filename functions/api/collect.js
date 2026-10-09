// Cookie-free analytics collector. Stores no IP address and no persistent visitor id.
import { sha256Hex, clientIp, deviceClass, isBot, sameOrigin, overLimit } from '../_lib/util.js';

const TYPES = new Set(['pageview', 'section', 'project', 'click']);
const NAME = /^[\w\- /.:#]{1,60}$/;
const done = () => new Response(null, { status: 204 });

export async function onRequestPost({ request, env }) {
  if (!env.DB) return done();
  const ua = request.headers.get('user-agent') || '';
  if (isBot(ua) || !sameOrigin(request)) return done();

  let b;
  try { b = await request.json(); } catch { return done(); }
  if (!b || !TYPES.has(b.type)) return done();
  const name = b.name == null ? null : String(b.name);
  if (name !== null && !NAME.test(name)) return done();

  // Daily-rotating visitor hash: counts uniques within a day, cannot follow anyone across days.
  const day = new Date().toISOString().slice(0, 10);
  const vid = (await sha256Hex(`${env.SESSION_SECRET || 'salt'}|${day}|${clientIp(request)}|${ua}`)).slice(0, 16);
  if (await overLimit(env, `c:${vid}`, 150, 60 * 60 * 1000)) return done();

  let ref = null;
  if (b.type === 'pageview' && typeof b.ref === 'string' && b.ref) {
    try {
      const h = new URL(b.ref).hostname.replace(/^www\./, '');
      if (h && h !== new URL(request.url).hostname) ref = h.slice(0, 80);
    } catch { /* ignore */ }
  }

  try {
    await env.DB.prepare('INSERT INTO events (ts, type, name, ref, country, device, vid) VALUES (?, ?, ?, ?, ?, ?, ?)')
      .bind(Date.now(), b.type, name, ref, request.cf?.country || request.headers.get('cf-ipcountry') || null, deviceClass(ua), vid)
      .run();
  } catch { /* never surface analytics errors */ }
  return done();
}
