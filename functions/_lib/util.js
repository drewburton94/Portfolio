// Shared helpers for Pages Functions.
export const json = (data, status = 200, headers = {}) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', ...headers },
  });

const enc = new TextEncoder();

export async function sha256Hex(text) {
  const buf = await crypto.subtle.digest('SHA-256', enc.encode(text));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

export async function hmacHex(secret, text) {
  const key = await crypto.subtle.importKey('raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(text));
  return [...new Uint8Array(sig)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

export function timingSafeEqual(a, b) {
  if (a.length !== b.length) return false;
  let r = 0;
  for (let i = 0; i < a.length; i++) r |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return r === 0;
}

export const clientIp = (request) =>
  request.headers.get('cf-connecting-ip') || String(request.headers.get('x-forwarded-for') || '').split(',')[0].trim() || 'unknown';

// Fixed-window rate limit stored in D1. Returns true when the caller is over the limit.
export async function overLimit(env, key, max, windowMs) {
  if (!env.DB) return false;
  const now = Date.now();
  try {
    const row = await env.DB.prepare('SELECT n, start FROM rate WHERE key = ?').bind(key).first();
    if (!row || now - row.start > windowMs) {
      await env.DB.prepare('INSERT OR REPLACE INTO rate (key, n, start) VALUES (?, 1, ?)').bind(key, now).run();
      return false;
    }
    await env.DB.prepare('UPDATE rate SET n = n + 1 WHERE key = ?').bind(key).run();
    return row.n + 1 > max;
  } catch {
    return false;
  }
}

export async function loadRows(env) {
  const rows = {};
  if (!env.DB) return rows;
  try {
    const r = await env.DB.prepare('SELECT key, value FROM content').all();
    for (const row of r.results || []) {
      try { rows[row.key] = JSON.parse(row.value); } catch { /* skip bad row */ }
    }
  } catch { /* table missing: fall back to defaults */ }
  return rows;
}

export function deviceClass(ua = '') {
  if (/ipad|tablet/i.test(ua)) return 'tablet';
  if (/mobi|iphone|android/i.test(ua)) return 'mobile';
  return 'desktop';
}

export const isBot = (ua = '') => !ua || /bot|crawl|spider|slurp|headless|preview|facebookexternalhit|monitor|lighthouse/i.test(ua);

export function sameOrigin(request) {
  const origin = request.headers.get('origin');
  if (!origin) return false;
  try { return new URL(origin).host === new URL(request.url).host; } catch { return false; }
}
