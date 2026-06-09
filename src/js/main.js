// Single entry point loaded by every page via <script type="module">.
import { renderLayout } from './layout.js';
import { initI18n } from './i18n.js';
import { initSlider } from './controller.js';
import { initForms } from './forms.js';
import { initContact } from './contact.js';
import { initReveal } from './reveal.js';

function start() {
  renderLayout(); // inject shared navbar + footer
  initContact(); // contact page info + map (no-op when absent)
  initI18n(); // translate everything + wire the SR/EN toggle
  initSlider(); // gallery slider (no-op when absent)
  initForms(); // contact / careers forms (no-op when absent)
  initReveal(); // hide below-the-fold blocks (after layout is final) for scroll-in

  // The page is fully assembled — fade it in as one piece (the inline <head>
  // script hid it via .is-loading). Two frames so the first painted state is
  // the hidden one, guaranteeing the opacity transition runs.
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
