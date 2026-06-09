# Beli Drim 2014 DOO — website

Static, mobile-first website for the transport company **Beli Drim 2014 DOO**.
Serbian (default) with an English toggle. No build step — plain HTML, CSS and
JavaScript (ES modules).

## Pages
| File | Page |
|------|------|
| `index.html` | Home / Početna |
| `about-us.html` | About / O nama |
| `gallery.html` | Gallery / Galerija |
| `zaposlenje.html` | Careers / Zaposlenje |
| `kontakt.html` | Contact / Kontakt |

## ✅ Before going live (checklist)
1. **Web3Forms key** — set `web3formsKey` in `src/js/site.config.js` (see below), or **both** the contact and careers forms silently fail. Submit each form once after deploy to confirm an email arrives.
2. **Email** — confirm `email` in `site.config.js` is a real, monitored mailbox.
3. **Phone** — `phoneDisplay` / `phoneHref` are already set; double-check they match.
4. *(Optional)* **Social links** — add `social.facebook` / `social.instagram` URLs to show the footer "Pratite nas" column.
5. **Custom domain?** — if you move off `labranka.github.io/belidrim`, update `siteUrl` in `site.config.js` **and** the absolute `canonical` / `og:*` URLs in each page `<head>` and in `sitemap.xml`.

> Anything still tagged `[PLACEHOLDER]` in `site.config.js` must be replaced first.

## Edit your business details (most common change)
Open **`src/js/site.config.js`** — it is the single place for phone, email,
address, map location, social links and the contact-form key. Everything on the
site (footer, contact page, forms) reads from this one file.

## Edit text / translations
All visible text lives in **`src/js/translations.js`** as `sr` (Serbian) and
`en` (English). Change the value next to a key and it updates on every page.

## Contact & careers forms (Web3Forms)
The forms send straight to your email using a free service — no server needed.
1. Go to <https://web3forms.com>, enter your email, and copy the **Access Key**.
2. Paste it into `web3formsKey` in `src/js/site.config.js`.
Until a real key is set, the forms will show an error on submit.

## Map
The contact-page map needs **no API key**. Just set `mapQuery` in
`src/js/site.config.js` to your address (e.g. `"Kralja Petra 1, Beograd, Srbija"`).

## Preview locally
The site uses ES modules, so it must be opened through a small web server
(not by double-clicking the file). From this folder run either:

```bash
python3 -m http.server 3000      # then open http://localhost:3000
# or
npm run serve                    # uses npx serve
```

## Project structure
```
index.html, about-us.html, gallery.html, zaposlenje.html, kontakt.html
src/css/style.css        — all styles (mobile-first)
src/js/
  main.js                — entry point (loaded by every page)
  site.config.js         — YOUR business details (edit this)
  translations.js        — all SR/EN text (edit this)
  layout.js              — shared navbar + footer
  i18n.js                — language toggle engine
  contact.js             — contact info + map
  forms.js               — form submission (Web3Forms)
  controller.js          — gallery slider
src/img/                 — images and logo
```

## Images / performance
Photos are served as optimised **AVIF + WebP + JPEG** via `<picture>` (the browser
picks the smallest format it supports). To re-optimise after adding/replacing
source photos in `src/img/`, run:

```bash
npm run optimize:images   # resizes + recompresses + regenerates webp/avif + favicons
```

This runs `scripts/optimize-images.mjs` (needs `npm install --no-save sharp png-to-ico`).
It also builds the favicon / PWA icon set (`favicon.ico`, `favicon-16/32.png`,
`apple-touch-icon.png`, `icon-192/512.png`) from the brand logo. After resizing,
update the `width`/`height` attributes on the affected `<img>` tags (the script
prints the new dimensions).

## SEO / social
Each page carries a unique title + description, canonical URL, Open Graph +
Twitter card tags, and the site ships `sitemap.xml`, `robots.txt`,
`site.webmanifest` and a branded favicon set. `LocalBusiness` JSON-LD is injected
on every page from `site.config.js` (no fake data — the phone only appears once a
real number is set).

## Hosting
Deployed with **GitHub Pages** — pushing to the `main` branch publishes the site.
The custom `404.html` is served automatically for unknown URLs.
