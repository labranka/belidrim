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

## Hosting
Deployed with **GitHub Pages** — pushing to the `main` branch publishes the site.
