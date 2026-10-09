import { json, overLimit, clientIp, sha256Hex, sameOrigin } from '../../_lib/util.js';
import { passwordMatches, makeCookie } from '../../_lib/auth.js';

export async function onRequestPost({ request, env }) {
  if (!env.ADMIN_PASSWORD || !env.SESSION_SECRET) return json({ error: 'Admin is not set up yet. Add ADMIN_PASSWORD and SESSION_SECRET.' }, 503);
  if (!sameOrigin(request)) return json({ error: 'Blocked request.' }, 403);
  if (await overLimit(env, `login:${await sha256Hex(clientIp(request))}`, 8, 15 * 60 * 1000)) {
    return json({ error: 'Too many attempts. Try again in 15 minutes.' }, 429);
  }
  let body;
  try { body = await request.json(); } catch { body = {}; }
  if (!(await passwordMatches(env, body?.password ?? ''))) return json({ error: 'That password is not right.' }, 401);
  return json({ ok: true }, 200, { 'set-cookie': await makeCookie(env, request) });
}
