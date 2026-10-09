// Serves the home page, rendered from whatever is saved in D1 (falls back to the built-in defaults).
import { render } from '../src/render.mjs';
import { mergeContent } from '../src/content.mjs';
import { loadRows } from './_lib/util.js';

export async function onRequestGet({ env }) {
  const html = render(mergeContent(await loadRows(env)));
  return new Response(html, {
    headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'public, max-age=0, must-revalidate' },
  });
}
