// Content model. Defaults live in defaults.mjs; anything saved from the admin
// (stored in D1 as one JSON document per key) overrides the matching key.
import * as D from './defaults.mjs';
import { DEFAULT_KNOWLEDGE } from './knowledge-default.mjs';

export const DEFAULTS = {
  site: D.site,
  hero: { sub: D.hero.sub, headline: D.hero.headline },
  about: D.about,
  projects: D.projects,
  workIntro: D.workIntro,
  history: D.history,
  contact: D.contact,
  knowledge: DEFAULT_KNOWLEDGE,
};

export const KEYS = Object.keys(DEFAULTS);

const isObj = (v) => v && typeof v === 'object' && !Array.isArray(v);

// rows: { key: parsedJSON }. Unknown keys and wrong types are ignored.
export function mergeContent(rows = {}) {
  const out = {};
  for (const k of KEYS) {
    const d = DEFAULTS[k];
    const v = rows[k];
    if (v === undefined || v === null) out[k] = d;
    else if (Array.isArray(d)) out[k] = Array.isArray(v) ? v : d;
    else if (isObj(d)) out[k] = isObj(v) ? { ...d, ...v } : d;
    else out[k] = typeof v === typeof d ? v : d;
  }
  // about.think / about.ai are nested objects: merge one level deeper
  const a = rows.about;
  if (isObj(a)) {
    out.about = { ...DEFAULTS.about, ...a };
    for (const sub of ['think', 'ai']) out.about[sub] = { ...DEFAULTS.about[sub], ...(a[sub] || {}) };
  }
  return out;
}

// Light validation for admin saves. Returns an error string or null.
export function validate(key, value) {
  const d = DEFAULTS[key];
  if (d === undefined) return 'Unknown content key';
  if (Array.isArray(d) && !Array.isArray(value)) return 'Expected a list';
  if (isObj(d) && !isObj(value)) return 'Expected an object';
  if (typeof d === 'string' && typeof value !== 'string') return 'Expected text';
  if (key === 'projects') {
    for (const p of value) if (!p || typeof p.title !== 'string' || !p.title.trim()) return 'Every project needs a title';
  }
  if (JSON.stringify(value).length > 400000) return 'Content is too large';
  return null;
}
