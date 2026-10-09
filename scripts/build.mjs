// Static build: renders the site from the built-in defaults into public/index.html.
// This is the fallback page and what the local/artifact preview uses.
// On Cloudflare, functions/index.js renders the same page from D1 on each request.
import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { DEFAULTS } from '../src/content.mjs';
import { render } from '../src/render.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
writeFileSync(join(root, 'public', 'index.html'), render(DEFAULTS));
console.log('built public/index.html from defaults');
