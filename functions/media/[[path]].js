// Serves uploaded images from R2.
export async function onRequestGet({ params, env, request }) {
  if (!env.MEDIA) return new Response('Not found', { status: 404 });
  const key = Array.isArray(params.path) ? params.path.join('/') : String(params.path || '');
  if (!/^uploads\/[\w.\-]+$/.test(key)) return new Response('Not found', { status: 404 });
  const obj = await env.MEDIA.get(key);
  if (!obj) return new Response('Not found', { status: 404 });
  const headers = new Headers();
  obj.writeHttpMetadata(headers);
  headers.set('etag', obj.httpEtag);
  headers.set('cache-control', 'public, max-age=31536000, immutable');
  headers.set('x-content-type-options', 'nosniff');
  if (request.headers.get('if-none-match') === obj.httpEtag) return new Response(null, { status: 304, headers });
  return new Response(obj.body, { headers });
}
