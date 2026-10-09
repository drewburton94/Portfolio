import { json, loadRows } from '../../_lib/util.js';
import { guard } from '../../_lib/auth.js';
import { mergeContent, validate, DEFAULTS } from '../../../src/content.mjs';

export async function onRequestGet({ request, env }) {
  const denied = await guard(request, env);
  if (denied) return denied;
  const rows = await loadRows(env);
  return json({ content: mergeContent(rows), defaults: DEFAULTS, saved: Object.keys(rows) });
}

// PUT /api/admin/content?key=history  (body: the new JSON value)
export async function onRequestPut({ request, env }) {
  const denied = await guard(request, env);
  if (denied) return denied;
  if (!env.DB) return json({ error: 'Database is not connected.' }, 503);
  const key = new URL(request.url).searchParams.get('key') || '';
  let value;
  try { value = await request.json(); } catch { return json({ error: 'Invalid JSON.' }, 400); }
  const problem = validate(key, value);
  if (problem) return json({ error: problem }, 400);
  await env.DB.prepare('INSERT OR REPLACE INTO content (key, value, updated_at) VALUES (?, ?, ?)')
    .bind(key, JSON.stringify(value), Date.now())
    .run();
  return json({ ok: true });
}

// DELETE /api/admin/content?key=history  (reset one section to the built-in default)
export async function onRequestDelete({ request, env }) {
  const denied = await guard(request, env);
  if (denied) return denied;
  if (!env.DB) return json({ error: 'Database is not connected.' }, 503);
  const key = new URL(request.url).searchParams.get('key') || '';
  if (!(key in DEFAULTS)) return json({ error: 'Unknown content key.' }, 400);
  await env.DB.prepare('DELETE FROM content WHERE key = ?').bind(key).run();
  return json({ ok: true });
}
