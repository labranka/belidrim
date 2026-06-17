// Single entry point loaded by every page via <script type="module">.
import { renderLayout } from './layout.js';
import { initI18n } from './i18n.js';
import { initSlider } from './controller.js';
import { initForms } from './forms.js';
import { initContact } from './contact.js';
import { initReveal } from './reveal.js';

// Keep the address bar on the clean, extension-less URL even when someone opens
// a .html path directly (typed, old bookmark, external link). No reload — it
// just rewrites the visible URL. 404.html is served on arbitrary paths, so skip it.
(function cleanUrl() {
  const { pathname, search, hash } = location;
  let clean = pathname;
  if (pathname.endsWith('/index.html')) clean = pathname.slice(0, -'index.html'.length);
  else if (pathname.endsWith('.html') && !pathname.endsWith('/404.html'))
    clean = pathname.slice(0, -'.html'.length);
  if (clean !== pathname) history.replaceState(null, '', clean + search + hash);
})();

function start() {
  renderLayout(); // inject shared navbar + footer
  initContact(); // contact page info + map (no-op when absent)
  initI18n(); // translate everything + wire the SR/EN toggle
  initSlider(); // gallery slider (no-op when absent)
  initForms(); // contact / careers forms (no-op when absent)
  initReveal(); // hide below-the-fold blocks (after layout is final) for scroll-in

  // The footer is the only JS-injected region left (the inline <head> script
  // hid it via .is-loading); fade it in once assembled. Two frames so the first
  // painted state is the hidden one, guaranteeing the opacity transition runs.
  const root = document.documentElement;
  requestAnimationFrame(() =>
    requestAnimationFrame(() => {
      root.classList.remove('is-loading');
      root.classList.add('is-ready');
    })
  );
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', start);
} else {
  start();
}
