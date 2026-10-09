import { json } from '../../_lib/util.js';
import { guard } from '../../_lib/auth.js';

const MAX = 10 * 1024 * 1024;

// Identify the image by its first bytes, never by the filename the browser sent.
function sniff(b) {
  const hex = [...b.slice(0, 12)].map((x) => x.toString(16).padStart(2, '0')).join('');
  if (hex.startsWith('89504e47')) return { ext: 'png', type: 'image/png' };
  if (hex.startsWith('ffd8ff')) return { ext: 'jpg', type: 'image/jpeg' };
  if (hex.startsWith('47494638')) return { ext: 'gif', type: 'image/gif' };
  if (hex.startsWith('52494646') && hex.slice(16, 24) === '57454250') return { ext: 'webp', type: 'image/webp' };
  if (hex.slice(8, 16) === '66747970' && /^(61766966|61766973)$/.test(hex.slice(16, 24))) return { ext: 'avif', type: 'image/avif' };
  return null;
}

export async function onRequestPost({ request, env }) {
  const denied = await guard(request, env);
  if (denied) return denied;
  if (!env.MEDIA) return json({ error: 'Image storage (R2) is not connected.' }, 503);
  let form;
  try { form = await request.formData(); } catch { return json({ error: 'Choose an image to upload.' }, 400); }
  const file = form.get('file');
  if (!file || typeof file === 'string') return json({ error: 'Choose an image to upload.' }, 400);
  if (file.size > MAX) return json({ error: 'That image is over 10 MB. Resize it and try again.' }, 413);
  const bytes = new Uint8Array(await file.arrayBuffer());
  const kind = sniff(bytes);
  if (!kind) return json({ error: 'Use a PNG, JPG, WebP, GIF or AVIF image.' }, 415);
  const rand = crypto.randomUUID().slice(0, 8);
  const key = `uploads/${Date.now()}-${rand}.${kind.ext}`;
  await env.MEDIA.put(key, bytes, { httpMetadata: { contentType: kind.type }, customMetadata: { name: String(file.name || '').slice(0, 120) } });
  return json({ ok: true, key, url: `/media/${key}`, bytes: bytes.length });
}
