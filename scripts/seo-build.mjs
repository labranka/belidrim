// Build static SEO into each page <head>: locality-rich titles + descriptions,
// a static JSON-LD @graph (MovingCompany + WebSite + BreadcrumbList) so the
// LocalBusiness signal is crawlable on the first non-rendering pass, and a few
// completeness meta tags. Re-run after editing page meta:  npm run seo
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const ORIGIN = 'https://belidrim.rs';
const OG_IMG = `${ORIGIN}/src/img/og-default.jpg`;
const OG_ALT = 'Beli Drim, transport robe iz Kraljeva';

// ---- Per-page title / description / OG title (locality + keywords) ----------
const PAGES = {
  'index.html': {
    title: 'Transport robe Kraljevo | Prevoz robe Srbija i region | Beli Drim',
    desc: 'Beli Drim, pouzdan prevoz i transport robe iz Kraljeva za celu Srbiju i region. Sopstveni vozni park, dugogodišnje iskustvo, domaći i međunarodni transport. Zatražite ponudu.',
    ogTitle: 'Beli Drim | Transport robe Kraljevo, Srbija i region',
    crumb: null,
  },
  'about-us.html': {
    title: 'O nama | Porodična transportna firma iz Kraljeva | Beli Drim',
    desc: 'Beli Drim je porodična transportna firma iz Kraljeva, osnovana 2014. Sopstveni vozni park i iskusni vozači za domaći i međunarodni transport robe.',
    ogTitle: 'O nama | Beli Drim, transport iz Kraljeva',
    crumb: { name: 'O nama', path: '/about-us' },
  },
  'gallery.html': {
    title: 'Galerija voznog parka | Kamioni za transport robe | Beli Drim',
    desc: 'Galerija voznog parka Beli Drim iz Kraljeva, kamioni i šleperi za domaći i međunarodni transport robe u Srbiji i regionu.',
    ogTitle: 'Galerija voznog parka Kraljevo | Beli Drim',
    crumb: { name: 'Galerija', path: '/gallery' },
  },
  'zaposlenje.html': {
    title: 'Posao za vozače C/CE | Zaposlenje u transportu | Beli Drim',
    desc: 'Tražimo pouzdane vozače C/CE kategorije u Kraljevu. Pridružite se timu Beli Drim i prijavite se na otvorene pozicije u transportu robe.',
    ogTitle: 'Zaposlenje za vozače Kraljevo | Beli Drim',
    crumb: { name: 'Zaposlenje', path: '/zaposlenje' },
  },
  'kontakt.html': {
    title: 'Kontakt | Transport robe Kraljevo | Beli Drim',
    desc: 'Kontaktirajte Beli Drim, IV Crnogorska 30g, 36000 Kraljevo. Telefon, email i mapa. Zatražite ponudu za transport robe u Srbiji i regionu.',
    ogTitle: 'Kontakt | Beli Drim Kraljevo',
    crumb: { name: 'Kontakt', path: '/kontakt' },
  },
};

// ---- Static JSON-LD @graph --------------------------------------------------
const localBusiness = {
  '@type': 'MovingCompany',
  '@id': `${ORIGIN}/#localbusiness`,
  name: 'Beli Drim',
  legalName: 'Beli Drim 2014 DOO',
  url: `${ORIGIN}/`,
  logo: `${ORIGIN}/src/img/icon-512.png`,
  image: `${ORIGIN}/src/img/highway.jpg`,
  telephone: '+381 65 3753999',
  email: 'info@belidrim.rs',
  taxID: '108470583',
  foundingDate: '2014-01-01',
  priceRange: '€€',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'IV Crnogorska 30g',
    addressLocality: 'Kraljevo',
    addressRegion: 'Raški okrug',
    postalCode: '36000',
    addressCountry: 'RS',
  },
  geo: { '@type': 'GeoCoordinates', latitude: 43.726, longitude: 20.689 },
  hasMap: 'https://www.google.com/maps?q=IV+Crnogorska+30g,+Kraljevo,+Srbija',
  areaServed: [
    { '@type': 'City', name: 'Kraljevo' },
    { '@type': 'City', name: 'Kragujevac' },
    { '@type': 'City', name: 'Čačak' },
    { '@type': 'City', name: 'Vrnjačka Banja' },
    { '@type': 'AdministrativeArea', name: 'Raški okrug' },
    { '@type': 'Country', name: 'Serbia' },
  ],
  openingHoursSpecification: {
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    opens: '08:00',
    closes: '16:00',
  },
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+381653753999',
    contactType: 'customer service',
    areaServed: 'RS',
    availableLanguage: ['Serbian', 'English'],
  },
};

const website = {
  '@type': 'WebSite',
  '@id': `${ORIGIN}/#website`,
  url: `${ORIGIN}/`,
  name: 'Beli Drim',
  inLanguage: 'sr-RS',
  publisher: { '@id': `${ORIGIN}/#localbusiness` },
};

function jsonLd(crumb) {
  const graph = [localBusiness, website];
  if (crumb) {
    graph.push({
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Početna', item: `${ORIGIN}/` },
        { '@type': 'ListItem', position: 2, name: crumb.name, item: `${ORIGIN}${crumb.path}` },
      ],
    });
  }
  return JSON.stringify({ '@context': 'https://schema.org', '@graph': graph });
}

// ---- Helpers ----------------------------------------------------------------
const enc = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;');

function setMeta(html, attr, name, value) {
  // Replaces the content of <meta attr="name" ... content="..."> (multi-line ok).
  const re = new RegExp(
    `(<meta\\s+${attr}="${name}"\\s+content=")[^"]*(")`,
    'i'
  );
  if (!re.test(html)) {
    console.warn(`  ! not found: ${attr}="${name}"`);
    return html;
  }
  return html.replace(re, `$1${enc(value)}$2`);
}

function insertAfter(html, anchorRe, snippet, guard) {
  if (guard && html.includes(guard)) return html; // already present
  return html.replace(anchorRe, (m) => `${m}\n${snippet}`);
}

// ---- Build ------------------------------------------------------------------
for (const [page, cfg] of Object.entries(PAGES)) {
  const path = join(root, page);
  let html = readFileSync(path, 'utf8');
  console.log(page);

  // Title
  html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${cfg.title}</title>`);

  // Descriptions + OG/Twitter titles
  html = setMeta(html, 'name', 'description', cfg.desc);
  html = setMeta(html, 'property', 'og:description', cfg.desc);
  html = setMeta(html, 'name', 'twitter:description', cfg.desc);
  html = setMeta(html, 'property', 'og:title', cfg.ogTitle);
  html = setMeta(html, 'name', 'twitter:title', cfg.ogTitle);

  // Branded 1200x630 share card on every page
  html = setMeta(html, 'property', 'og:image', OG_IMG);
  html = setMeta(html, 'name', 'twitter:image', OG_IMG);
  html = setMeta(html, 'property', 'og:image:width', '1200');
  html = setMeta(html, 'property', 'og:image:height', '630');
  html = setMeta(html, 'property', 'og:image:alt', OG_ALT);
  html = insertAfter(
    html,
    /<meta property="og:image:height"[^>]*>/i,
    '    <meta property="og:image:type" content="image/jpeg" />',
    'og:image:type'
  );
  html = insertAfter(
    html,
    /<meta name="twitter:image"[^>]*>/i,
    `    <meta name="twitter:image:alt" content="${OG_ALT}" />`,
    'twitter:image:alt'
  );

  // Completeness meta (insert once, next to existing tags)
  html = insertAfter(
    html,
    /<meta name="theme-color"[^>]*>/i,
    '    <meta name="color-scheme" content="light" />',
    'color-scheme'
  );
  html = insertAfter(
    html,
    /<meta property="og:locale"[^>]*>/i,
    '    <meta property="og:locale:alternate" content="en_US" />',
    'og:locale:alternate'
  );

  // Static JSON-LD before </head> (id matches layout.js guard so the JS
  // injection becomes a no-op and never duplicates).
  const ld = `    <script type="application/ld+json" id="ld-localbusiness">${jsonLd(cfg.crumb)}</script>`;
  if (html.includes('id="ld-localbusiness"')) {
    html = html.replace(
      /<script type="application\/ld\+json" id="ld-localbusiness">[\s\S]*?<\/script>/i,
      ld.trim()
    );
  } else {
    html = html.replace(/<\/head>/i, `${ld}\n  </head>`);
  }

  writeFileSync(path, html);
}
// Cloudflare Web Analytics beacon on every page (incl. 404), inserted once
// before </body>. Privacy-first, cookieless visitor/pageview analytics.
const BEACON = `<!-- Cloudflare Web Analytics --><script defer src="https://static.cloudflareinsights.com/beacon.min.js" data-cf-beacon='{"token": "4bbacdec2ebf44bf8f19fb2c37575831"}'></script><!-- End Cloudflare Web Analytics -->`;
for (const page of [...Object.keys(PAGES), '404.html']) {
  const path = join(root, page);
  let html = readFileSync(path, 'utf8');
  if (!html.includes('cloudflareinsights.com/beacon')) {
    html = html.replace(/<\/body>/i, `    ${BEACON}\n  </body>`);
    writeFileSync(path, html);
  }
}

console.log('SEO head build done.');
