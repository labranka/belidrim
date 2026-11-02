// Single entry point loaded by every page via <script type="module">.
import { renderLayout } from './layout.js';
import { applyTranslations, getLang, initLanguageToggle } from './i18n.js';
import { initSlider } from './controller.js';
import { initForms } from './forms.js';
import { initContact } from './contact.js';
import { initReveal } from './reveal.js';
import { initNavigation } from './navigation.js';

// Everything that belongs to the page content (<main>). Runs on the first
// load and again after every soft navigation (navigation.js swaps <main> and
// calls this with the new element), so each module here is safe to re-run.
function initPage(main = document) {
  initContact(); // contact page info + map (no-op when absent)
  // Translate the (new) content. After initContact so its fallback markup is
  // covered; on a soft navigation the fresh <main> arrives in Serbian from
  // the server and must be in the visitor's language before it is shown.
  applyTranslations(getLang(), main);
  initSlider(); // gallery slider (no-op when absent)
  initForms(); // contact / careers forms (no-op when absent)
  initReveal(); // hide below-the-fold blocks (after layout is final) for scroll-in
}

function start() {
  renderLayout(); // shared navbar + footer behaviour (markup is pre-rendered)
  initLanguageToggle(); // wire the SR/EN toggle
  initPage();
  initNavigation(initPage); // soft navigation between pages

  // The footer was hidden by the inline <head> script (.is-loading) until the
  // shell is assembled; fade it in now. Two frames so the first painted state
  // is the hidden one, guaranteeing the opacity transition runs.
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
