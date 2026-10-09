// Password login with a signed, HTTP-only session cookie. No third-party auth needed.
import { hmacHex, sha256Hex, timingSafeEqual, json, sameOrigin } from './util.js';

const COOKIE = 'admin_session';
const MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export async function passwordMatches(env, given) {
  if (!env.ADMIN_PASSWORD) return false;
  const [a, b] = await Promise.all([sha256Hex(String(given)), sha256Hex(env.ADMIN_PASSWORD)]);
  return timingSafeEqual(a, b);
}

export async function makeCookie(env, request) {
  const exp = Math.floor(Date.now() / 1000) + MAX_AGE;
  const sig = await hmacHex(env.SESSION_SECRET, `admin.${exp}`);
  const secure = new URL(request.url).protocol === 'https:' ? '; Secure' : '';
  return `${COOKIE}=${exp}.${sig}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${MAX_AGE}${secure}`;
}

export const clearCookie = () => `${COOKIE}=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0`;

export async function isAdmin(request, env) {
  if (!env.SESSION_SECRET || !env.ADMIN_PASSWORD) return false;
  const m = (request.headers.get('cookie') || '').match(new RegExp(`(?:^|;\\s*)${COOKIE}=(\\d+)\\.([a-f0-9]+)`));
  if (!m) return false;
  if (Number(m[1]) < Date.now() / 1000) return false;
  return timingSafeEqual(m[2], await hmacHex(env.SESSION_SECRET, `admin.${m[1]}`));
}

// Returns a Response to send when the request is not allowed, or null when it is.
export async function guard(request, env) {
  if (!(await isAdmin(request, env))) return json({ error: 'Please sign in.' }, 401);
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    if (!sameOrigin(request) || request.headers.get('x-admin') !== '1') return json({ error: 'Blocked request.' }, 403);
  }
  return null;
}
