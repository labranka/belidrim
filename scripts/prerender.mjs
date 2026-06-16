// Pre-render the default Serbian copy into the static HTML so crawlers, social
// scrapers and AI bots that don't run JS still see real content. It writes each
// translations.js[sr] string as the inner text of the matching data-i18n
// element. i18n.js still overwrites textContent at runtime (identical for SR,
// translated for EN), so this never changes what visitors see — it only fills
// the server document. Re-run after editing copy:  npm run prerender
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { translations } from '../src/js/translations.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const sr = translations.sr;
const PAGES = [
  'index.html',
  'about-us.html',
  'gallery.html',
  'zaposlenje.html',
  'kontakt.html',
  '404.html',
];

const escHtml = (s) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const escRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

let total = 0;
for (const page of PAGES) {
  const path = join(root, page);
  let html = readFileSync(path, 'utf8');
  let count = 0;
  for (const [key, val] of Object.entries(sr)) {
    // Only leaf text elements carry data-i18n in the page body (nav/footer are
    // built by layout.js at runtime, so they aren't in these files).
    const re = new RegExp(
      `(<([a-z0-9]+)\\b[^>]*\\sdata-i18n="${escRe(key)}"[^>]*>)([^<]*)(</\\2>)`,
      'g'
    );
    html = html.replace(re, (_m, open, _tag, _content, close) => {
      count++;
      return `${open}${escHtml(val)}${close}`;
    });
  }
  writeFileSync(path, html);
  console.log(`${page}: ${count} nodes pre-rendered`);
  total += count;
}
console.log(`Total: ${total} nodes`);
