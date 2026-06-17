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
import { headerMarkup } from '../src/js/layout.js';

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

// Active nav slug for a page = filename without .html ('index', 'about-us', …).
// '404' matches no nav item, so the 404 navbar has no active link.
const activeSlug = (page) => page.replace(/\.html$/, '');

let total = 0;
for (const page of PAGES) {
  const path = join(root, page);
  let html = readFileSync(path, 'utf8');

  // Pre-render the navbar into the static <header> so the top bar paints with
  // the first frame instead of waiting for JS (layout.js skips re-injecting it).
  // Re-built fresh each run from the shared headerMarkup(), then the fill loop
  // below writes the Serbian text into its data-i18n leaves like the body copy.
  // The open-tag match tolerates attribute order / quotes / extra whitespace,
  // and we throw on a miss: a silent non-match would ship a page with NO navbar
  // (reverting to the JS late-paint this build exists to fix) behind a green log.
  const nav = headerMarkup(activeSlug(page));
  let navInjected = false;
  html = html.replace(
    /(<header\b[^>]*\bid=["']site-header["'][^>]*>)[\s\S]*?(<\/header>)/i,
    (_m, open, close) => {
      navInjected = true;
      return `${open}${nav}${close}`;
    }
  );
  if (!navInjected) {
    throw new Error(
      `${page}: <header id="site-header"> not found — navbar NOT pre-rendered. Check the placeholder tag.`
    );
  }

  let count = 0;
  for (const [key, val] of Object.entries(sr)) {
    // Fills leaf data-i18n text in the body AND the navbar injected just above.
    // The footer is still built by layout.js at runtime, so it isn't here.
    const re = new RegExp(
      `(<([a-z0-9]+)\\b[^>]*\\sdata-i18n="${escRe(key)}"[^>]*>)([^<]*)(</\\2>)`,
      'g'
    );
    html = html.replace(re, (_m, open, _tag, _content, close) => {
      count++;
      return `${open}${escHtml(val)}${close}`;
    });
  }
  // Guard: no data-i18n leaf should end up empty. An empty one means its key is
  // missing from translations.sr (e.g. a nav item added without a translation),
  // so the static HTML ships a blank link — the exact cold-load flash this build
  // prevents. Warn (don't fail the whole build) so it's visible at build time.
  const emptyLeaves = [
    ...html.matchAll(/<([a-z0-9]+)\b[^>]*\sdata-i18n="([^"]+)"[^>]*>\s*<\/\1>/gi),
  ].map((m) => m[2]);
  if (emptyLeaves.length) {
    console.warn(
      `  ! ${page}: empty data-i18n (missing SR text): ${[...new Set(emptyLeaves)].join(', ')}`
    );
  }

  writeFileSync(path, html);
  console.log(`${page}: ${count} nodes pre-rendered`);
  total += count;
}
console.log(`Total: ${total} nodes`);
