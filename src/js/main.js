// Single entry point loaded by every page via <script type="module">.
import { renderLayout } from './layout.js';
import { initI18n } from './i18n.js';
import { initSlider } from './controller.js';
import { initForms } from './forms.js';
import { initContact } from './contact.js';

function start() {
  renderLayout(); // inject shared navbar + footer
  initContact(); // contact page info + map (no-op when absent)
  initI18n(); // translate everything + wire the SR/EN toggle
  initSlider(); // gallery slider (no-op when absent)
  initForms(); // contact / careers forms (no-op when absent)
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', start);
} else {
  start();
}
