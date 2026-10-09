import { json } from '../../_lib/util.js';
import { guard } from '../../_lib/auth.js';

const DAY = 86400000;

export async function onRequestGet({ request, env }) {
  const denied = await guard(request, env);
  if (denied) return denied;
  if (!env.DB) return json({ error: 'Database is not connected.' }, 503);
  const days = Math.min(365, Math.max(1, Number(new URL(request.url).searchParams.get('days')) || 30));
  const since = Date.now() - days * DAY;
  const q = (sql, ...args) => env.DB.prepare(sql).bind(since, ...args).all().then((r) => r.results || []);

  const [totals, daily, referrers, countries, devices, sections, projects, clicks, chats, unique] = await Promise.all([
    q("SELECT COUNT(*) AS views FROM events WHERE type='pageview' AND ts >= ?"),
    q("SELECT strftime('%Y-%m-%d', ts/1000, 'unixepoch') AS day, COUNT(*) AS views, COUNT(DISTINCT vid) AS visitors FROM events WHERE type='pageview' AND ts >= ? GROUP BY day ORDER BY day"),
    q("SELECT ref AS name, COUNT(*) AS n FROM events WHERE type='pageview' AND ref IS NOT NULL AND ts >= ? GROUP BY ref ORDER BY n DESC LIMIT 10"),
    q("SELECT country AS name, COUNT(*) AS n FROM events WHERE type='pageview' AND country IS NOT NULL AND ts >= ? GROUP BY country ORDER BY n DESC LIMIT 10"),
    q("SELECT device AS name, COUNT(*) AS n FROM events WHERE type='pageview' AND ts >= ? GROUP BY device ORDER BY n DESC"),
    q("SELECT name, COUNT(*) AS n, COUNT(DISTINCT vid || '-' || (ts/86400000)) AS people FROM events WHERE type='section' AND ts >= ? GROUP BY name ORDER BY n DESC"),
    q("SELECT name, COUNT(*) AS n FROM events WHERE type='project' AND ts >= ? GROUP BY name ORDER BY n DESC"),
    q("SELECT name, COUNT(*) AS n FROM events WHERE type='click' AND ts >= ? GROUP BY name ORDER BY n DESC"),
    q("SELECT ts, name, country FROM events WHERE type='chat' AND ts >= ? ORDER BY ts DESC LIMIT 50"),
    q("SELECT COUNT(DISTINCT vid || '-' || (ts/86400000)) AS visitors FROM events WHERE type='pageview' AND ts >= ?"),
  ]);

  // Fill days with no traffic so the chart has a continuous axis.
  const byDay = new Map(daily.map((d) => [d.day, d]));
  const series = [];
  for (let i = days - 1; i >= 0; i--) {
    const day = new Date(Date.now() - i * DAY).toISOString().slice(0, 10);
    series.push(byDay.get(day) || { day, views: 0, visitors: 0 });
  }

  return json({
    days,
    views: totals[0]?.views || 0,
    visitors: unique[0]?.visitors || 0,
    series,
    referrers, countries, devices, sections, projects, clicks, chats,
  });
}
