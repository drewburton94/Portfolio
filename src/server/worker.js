// Cloudflare Worker entry. Serves the dynamic pages and APIs; everything else
// (styles, scripts, images, the /admin screens) is served from the static assets in /public.
import * as home from './index.js';
import * as chat from './api/chat.js';
import * as collect from './api/collect.js';
import * as login from './api/admin/login.js';
import * as logout from './api/admin/logout.js';
import * as session from './api/admin/session.js';
import * as content from './api/admin/content.js';
import * as upload from './api/admin/upload.js';
import * as adminMedia from './api/admin/media.js';
import * as analytics from './api/admin/analytics.js';
import * as media from './media/serve.js';

const ROUTES = {
  '/': home,
  '/api/chat': chat,
  '/api/collect': collect,
  '/api/admin/login': login,
  '/api/admin/logout': logout,
  '/api/admin/session': session,
  '/api/admin/content': content,
  '/api/admin/upload': upload,
  '/api/admin/media': adminMedia,
  '/api/admin/analytics': analytics,
};

function pick(mod, method) {
  const m = method === 'HEAD' ? 'GET' : method;
  return mod['onRequest' + m[0] + m.slice(1).toLowerCase()] || mod.onRequest || null;
}

async function notFound(request, env) {
  const page = await env.ASSETS.fetch(new Request(new URL('/404.html', request.url)));
  return new Response(page.body, { status: 404, headers: { 'content-type': 'text/html; charset=utf-8' } });
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname.length > 1 ? url.pathname.replace(/\/+$/, '') : url.pathname;
    try {
      let mod = ROUTES[path];
      let params = {};
      if (!mod && path.startsWith('/media/')) {
        mod = media;
        params = { path: path.slice('/media/'.length).split('/') };
      }
      if (mod) {
        const handler = pick(mod, request.method);
        if (!handler) return new Response('Method not allowed', { status: 405 });
        return await handler({ request, env, ctx, params });
      }
      const res = await env.ASSETS.fetch(request);
      return res.status === 404 ? notFound(request, env) : res;
    } catch (err) {
      console.error(err);
      return new Response(JSON.stringify({ error: 'Something went wrong.' }), { status: 500, headers: { 'content-type': 'application/json' } });
    }
  },
};
