// Optional: renders the site from the built-in defaults into preview/index.html,
// a static copy for quick previews. The live site is rendered by the Worker from D1.
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { DEFAULTS } from '../src/content.mjs';
import { render } from '../src/render.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
mkdirSync(join(root, 'preview'), { recursive: true });
writeFileSync(join(root, 'preview', 'index.html'), render(DEFAULTS));
console.log('wrote preview/index.html from defaults');
