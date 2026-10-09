import { json } from '../../_lib/util.js';
import { isAdmin } from '../../_lib/auth.js';

export async function onRequestGet({ request, env }) {
  const configured = Boolean(env.ADMIN_PASSWORD && env.SESSION_SECRET);
  return json({ signedIn: await isAdmin(request, env), configured, hasDb: Boolean(env.DB), hasMedia: Boolean(env.MEDIA), hasChatKey: Boolean(env.ANTHROPIC_API_KEY) });
}
