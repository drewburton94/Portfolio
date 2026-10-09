import { json } from '../../_lib/util.js';
import { guard } from '../../_lib/auth.js';

export async function onRequestGet({ request, env }) {
  const denied = await guard(request, env);
  if (denied) return denied;
  if (!env.MEDIA) return json({ items: [] });
  const list = await env.MEDIA.list({ prefix: 'uploads/', limit: 500 });
  const items = list.objects
    .map((o) => ({ key: o.key, url: `/media/${o.key}`, size: o.size, uploaded: o.uploaded }))
    .sort((a, b) => String(b.uploaded).localeCompare(String(a.uploaded)));
  return json({ items });
}

export async function onRequestDelete({ request, env }) {
  const denied = await guard(request, env);
  if (denied) return denied;
  const key = new URL(request.url).searchParams.get('key') || '';
  if (!env.MEDIA || !/^uploads\/[\w.\-]+$/.test(key)) return json({ error: 'Invalid file.' }, 400);
  await env.MEDIA.delete(key);
  return json({ ok: true });
}
