// Renders the shared navbar + footer into the #site-header / #site-footer
// placeholders present on every page, so they live in one place only.
import { site } from './site.config.js';

// Clean, extension-less URLs (GitHub Pages serves about-us.html at /about-us).
// `href` is what we link to; `match` is the page slug used to flag the active
// link (compared against the normalised current path). Home links to `/`.
const NAV_ITEMS = [
  { href: '/', match: 'index', key: 'nav.home', id: 'home' },
  { href: 'about-us', match: 'about-us', key: 'nav.about', id: 'about' },
  { href: 'gallery', match: 'gallery', key: 'nav.gallery', id: 'gallery' },
  { href: 'zaposlenje', match: 'zaposlenje', key: 'nav.careers', id: 'careers' },
  { href: 'kontakt', match: 'kontakt', key: 'nav.contact', id: 'contact' },
];

const LOGO_SRC = 'src/img/logoBD.svg';

const ICONS = {
  phone:
    '<svg viewBox="0 0 24 24" aria-hidden="true" width="20" height="20"><path fill="currentColor" d="M6.6 10.8a15.5 15.5 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25c1.1.37 2.3.57 3.6.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.2.2 2.4.57 3.5a1 1 0 0 1-.25 1l-2.22 2.3Z"/></svg>',
  mail:
    '<svg viewBox="0 0 24 24" aria-hidden="true" width="20" height="20"><path fill="currentColor" d="M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Zm8 7L4.5 6.3 4 6v.7l8 5 8-5V6l-.5-.3L12 11Z"/></svg>',
  pin:
    '<svg viewBox="0 0 24 24" aria-hidden="true" width="20" height="20"><path fill="currentColor" d="M12 2a7 7 0 0 1 7 7c0 5-7 13-7 13S5 14 5 9a7 7 0 0 1 7-7Zm0 4.5A2.5 2.5 0 1 0 12 11a2.5 2.5 0 0 0 0-4.5Z"/></svg>',
  facebook:
    '<svg viewBox="0 0 24 24" aria-hidden="true" width="22" height="22"><path fill="currentColor" d="M22 12a10 10 0 1 0-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.2c-1.2 0-1.6.75-1.6 1.5V12h2.7l-.43 2.9h-2.3v7A10 10 0 0 0 22 12Z"/></svg>',
  instagram:
    '<svg viewBox="0 0 24 24" aria-hidden="true" width="22" height="22"><path fill="currentColor" d="M12 2.2c3.2 0 3.6 0 4.8.07 1.2.05 1.8.25 2.2.42.6.2 1 .5 1.4 1 .5.4.8.8 1 1.4.2.4.4 1 .4 2.2.1 1.2.1 1.6.1 4.7s0 3.6-.1 4.8c0 1.2-.2 1.8-.4 2.2-.2.6-.5 1-1 1.4-.4.5-.8.8-1.4 1-.4.2-1 .4-2.2.4-1.2.1-1.6.1-4.8.1s-3.6 0-4.8-.1c-1.2 0-1.8-.2-2.2-.4-.6-.2-1-.5-1.4-1-.5-.4-.8-.8-1-1.4-.2-.4-.4-1-.4-2.2C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.8c0-1.2.2-1.8.4-2.2.2-.6.5-1 1-1.4.4-.5.8-.8 1.4-1 .4-.2 1-.4 2.2-.4C8.4 2.2 8.8 2.2 12 2.2Zm0 1.8c-3.1 0-3.5 0-4.7.07-1.1.05-1.7.24-2.1.4-.5.2-.9.44-1.3.84-.4.4-.64.8-.84 1.3-.16.4-.35 1-.4 2.1C2.6 9.5 2.6 9.9 2.6 13s0 3.5.07 4.7c.05 1.1.24 1.7.4 2.1.2.5.44.9.84 1.3.4.4.8.64 1.3.84.4.16 1 .35 2.1.4 1.2.07 1.6.07 4.7.07s3.5 0 4.7-.07c1.1-.05 1.7-.24 2.1-.4.5-.2.9-.44 1.3-.84.4-.4.64-.8.84-1.3.16-.4.35-1 .4-2.1.07-1.2.07-1.6.07-4.7s0-3.5-.07-4.7c-.05-1.1-.24-1.7-.4-2.1a3.5 3.5 0 0 0-.84-1.3 3.5 3.5 0 0 0-1.3-.84c-.4-.16-1-.35-2.1-.4C15.5 4 15.1 4 12 4Zm0 3.1a4.9 4.9 0 1 1 0 9.8 4.9 4.9 0 0 1 0-9.8Zm0 8.1a3.2 3.2 0 1 0 0-6.4 3.2 3.2 0 0 0 0 6.4Zm6.2-8.3a1.15 1.15 0 1 1-2.3 0 1.15 1.15 0 0 1 2.3 0Z"/></svg>',
};

function currentFile() {
  // Normalise the path to a slug: strip any .html so /about-us and
  // /about-us.html both match, and treat the root '/' as 'index'.
  const file = location.pathname.split('/').pop().replace(/\.html$/, '');
  return file && file.length ? file : 'index';
}

function renderHeader() {
  const active = currentFile();
  const links = NAV_ITEMS.map(
    (item) =>
      `<li class="navbar__item">
        <a href="${item.href}" class="navbar__link${
        item.match === active ? ' is-active' : ''
      }" data-i18n="${item.key}"${
        item.match === active ? ' aria-current="page"' : ''
      }></a>
      </li>`
  ).join('');

  return `
  <a href="#main" class="skip-link" data-i18n="a11y.skip">Pređi na sadržaj</a>
  <nav class="navbar" aria-label="Beli Drim">
    <div class="navbar__container">
      <a href="/" class="navbar__logo" aria-label="${site.companyName}">
        <img src="${LOGO_SRC}" alt="${site.companyName} logo" width="120" height="40" />
      </a>

      <button class="navbar__toggle" id="mobile-menu" aria-label="Meni" aria-expanded="false" aria-controls="primary-menu">
        <span class="bar"></span><span class="bar"></span><span class="bar"></span>
      </button>

      <div class="navbar__menu" id="primary-menu">
        <ul class="navbar__nav">${links}</ul>
        <div class="navbar__actions">
          <div class="lang-switch" role="group" data-i18n-aria="lang.toggleLabel">
            <button type="button" class="lang-switch__btn" data-lang-option="sr">SR</button>
            <button type="button" class="lang-switch__btn" data-lang-option="en">EN</button>
          </div>
          <a href="kontakt" class="btn btn--accent navbar__cta" data-i18n="nav.cta"></a>
        </div>
      </div>
    </div>
  </nav>`;
}

// Author credit shown in the footer corner. Renders a link only when a URL is
// set in site.config (credit.url), so we never publish a broken/placeholder
// link; until then the name shows as styled plain text.
function renderCredit() {
  const credit = site.credit || {};
  const name = credit.name || 'labranka';
  return credit.url
    ? `<a href="${credit.url}" class="footer__credit-link" target="_blank" rel="noopener">${name}</a>`
    : `<span class="footer__credit-link">${name}</span>`;
}

function renderFooter() {
  const year = new Date().getFullYear();
  const quickLinks = NAV_ITEMS.map(
    (item) => `<li><a href="${item.href}" data-i18n="${item.key}"></a></li>`
  ).join('');

  const socials = [];
  if (site.social.facebook)
    socials.push(
      `<a href="${site.social.facebook}" class="footer__social" aria-label="Facebook" target="_blank" rel="noopener">${ICONS.facebook}</a>`
    );
  if (site.social.instagram)
    socials.push(
      `<a href="${site.social.instagram}" class="footer__social" aria-label="Instagram" target="_blank" rel="noopener">${ICONS.instagram}</a>`
    );
  const socialBlock = socials.length
    ? `<div class="footer__col">
        <h3 class="footer__heading" data-i18n="footer.followTitle"></h3>
        <div class="footer__socials">${socials.join('')}</div>
      </div>`
    : '';

  return `
  <footer class="footer">
    <div class="footer__container">
      <div class="footer__col footer__brand">
        <img src="${LOGO_SRC}" alt="${site.companyName} logo" class="footer__logo" width="140" height="46" />
        <p class="footer__tagline" data-i18n="footer.tagline"></p>
        <p class="footer__legal">PIB: ${site.pib} &middot; MB: ${site.mb}</p>
      </div>

      <div class="footer__col">
        <h3 class="footer__heading" data-i18n="footer.quicklinks"></h3>
        <ul class="footer__links">${quickLinks}</ul>
      </div>

      <div class="footer__col">
        <h3 class="footer__heading" data-i18n="footer.contactTitle"></h3>
        <ul class="footer__contact">
          <li>${ICONS.phone}<a href="tel:${site.phoneHref}">${site.phoneDisplay}</a></li>
          <li>${ICONS.mail}<a href="mailto:${site.email}">${site.email}</a></li>
          <li>${ICONS.pin}<span>${site.address}</span></li>
        </ul>
      </div>

      ${socialBlock}
    </div>

    <div class="footer__bottom">
      <p>© ${year} ${site.companyLegal}. <span data-i18n="footer.rights"></span></p>
      <p class="footer__credit">
        <span data-i18n="footer.madeBy"></span> ${renderCredit()}
      </p>
    </div>
  </footer>`;
}

function initMobileMenu() {
  const navbar = document.querySelector('.navbar');
  const toggle = document.querySelector('#mobile-menu');
  const menu = document.querySelector('#primary-menu');
  if (!navbar || !toggle || !menu) return;

  let lastFocused = null;

  const setOpen = (open) => {
    menu.classList.toggle('is-open', open);
    toggle.classList.toggle('is-active', open);
    navbar.classList.toggle('is-menu-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    document.documentElement.style.overflow = open ? 'hidden' : '';

    if (open) {
      lastFocused = document.activeElement;
      menu.querySelector('a, button')?.focus();
    } else if (lastFocused) {
      lastFocused.focus();
      lastFocused = null;
    }
  };

  toggle.addEventListener('click', () =>
    setOpen(!menu.classList.contains('is-open'))
  );

  // Open menu behaves as a modal: Escape closes it, Tab is trapped inside.
  menu.addEventListener('keydown', (e) => {
    if (!menu.classList.contains('is-open')) return;
    if (e.key === 'Escape') {
      setOpen(false);
      return;
    }
    if (e.key !== 'Tab') return;
    const items = menu.querySelectorAll('a[href], button:not([disabled])');
    if (!items.length) return;
    const first = items[0];
    const last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  });

  // Close the menu after navigating or resizing to desktop.
  menu.querySelectorAll('.navbar__link').forEach((l) =>
    l.addEventListener('click', () => setOpen(false))
  );
  window.addEventListener('resize', () => {
    if (window.innerWidth > 900) setOpen(false);
  });
}

// Make the transparent navbar turn solid once the user scrolls past the top.
function initNavScroll() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;
  const update = () => navbar.classList.toggle('is-scrolled', window.scrollY > 30);
  update();
  window.addEventListener('scroll', update, { passive: true });
}

// Inject LocalBusiness/MovingCompany JSON-LD built from site.config (the single
// source of truth). Placeholder phone / empty socials are omitted so we never
// publish fake structured data; the moment real values land in the config they
// appear here too.
function injectStructuredData() {
  if (document.getElementById('ld-localbusiness')) return;

  const data = {
    '@context': 'https://schema.org',
    '@type': 'MovingCompany',
    name: site.companyLegal,
    url: site.siteUrl + '/',
    logo: site.siteUrl + '/src/img/icon-512.png',
    image: site.siteUrl + '/src/img/highway.jpg',
    foundingDate: site.foundingYear,
    taxID: site.pib,
    email: site.email,
    address: {
      '@type': 'PostalAddress',
      // Structured parts of site.address (update here if the address changes).
      streetAddress: 'IV Crnogorska 30g',
      addressLocality: 'Kraljevo',
      addressCountry: 'RS',
    },
    areaServed: ['RS'],
  };

  if (site.phoneHref && site.phoneHref !== '+38163000000') {
    data.telephone = site.phoneDisplay;
  }
  const sameAs = [site.social.facebook, site.social.instagram].filter(Boolean);
  if (sameAs.length) data.sameAs = sameAs;

  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.id = 'ld-localbusiness';
  script.textContent = JSON.stringify(data);
  document.head.appendChild(script);
}

// Injects header + footer and wires the mobile menu. Translation is applied
// afterwards by initI18n() in main.js (covers injected + static content).
export function renderLayout() {
  const header = document.querySelector('#site-header');
  const footer = document.querySelector('#site-footer');
  if (header) header.innerHTML = renderHeader();
  if (footer) footer.innerHTML = renderFooter();
  initMobileMenu();
  initNavScroll();
  injectStructuredData();
}
