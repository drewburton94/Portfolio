// Writes the two résumé PDFs into public/assets/ from the built-in defaults:
//   Drew-Burton-Resume-Designed.pdf       the creative one-page version
//   Drew-Burton-Resume.pdf   the plain version for applicant tracking systems
// Needs Chromium: `npm install` then point PLAYWRIGHT_BROWSERS_PATH at an install (or `npx playwright install chromium`).
// Run: node scripts/resume-pdf.mjs
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright-core';
import { DEFAULTS } from '../src/content.mjs';
import { renderResume } from '../src/resume.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const out = join(root, 'public', 'assets');
mkdirSync(out, { recursive: true });

// Inline the portrait so the page needs no server.
const html = renderResume(DEFAULTS).replaceAll('src="/assets/img/', `src="file://${join(root, 'public/assets/img')}/`);
const tmp = join(root, 'preview');
mkdirSync(tmp, { recursive: true });
const file = join(tmp, 'resume-pdf.html');
writeFileSync(file, html);

const exe = process.env.CHROMIUM_PATH || undefined;
const browser = await chromium.launch({ executablePath: exe });
for (const [mode, name] of [['creative', 'Drew-Burton-Resume-Designed.pdf'], ['plain', 'Drew-Burton-Resume.pdf']]) {
  const page = await browser.newPage();
  await page.goto(`file://${file}${mode === 'plain' ? '?plain' : ''}`, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  await page.pdf({ path: join(out, name), format: 'Letter', printBackground: true, preferCSSPageSize: true });
  console.log('wrote public/assets/' + name);
  await page.close();
}
await browser.close();
