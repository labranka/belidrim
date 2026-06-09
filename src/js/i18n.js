// Lightweight i18n: applies translations to elements carrying data-i18n*,
// persists the chosen language in localStorage, and exposes a toggle.
import { translations } from './translations.js';

const STORAGE_KEY = 'belidrim_lang';
const DEFAULT_LANG = 'sr';
const SUPPORTED = ['sr', 'en'];

export function getLang() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return SUPPORTED.includes(stored) ? stored : DEFAULT_LANG;
  } catch {
    // localStorage can throw (Safari Private Mode, storage disabled).
    return DEFAULT_LANG;
  }
}

export function t(key, lang = getLang()) {
  const dict = translations[lang] || translations[DEFAULT_LANG];
  return dict[key] ?? translations[DEFAULT_LANG][key] ?? key;
}

// Apply the active language to a DOM subtree (defaults to the whole document).
export function applyTranslations(lang = getLang(), root = document) {
  // Text content
  root.querySelectorAll('[data-i18n]').forEach((el) => {
    el.textContent = t(el.dataset.i18n, lang);
  });
  // Attribute translations: data-i18n-placeholder, data-i18n-aria, data-i18n-title, data-i18n-alt
  const attrMap = {
    'i18nPlaceholder': 'placeholder',
    'i18nAria': 'aria-label',
    'i18nTitle': 'title',
    'i18nAlt': 'alt',
  };
  Object.entries(attrMap).forEach(([dataKey, attr]) => {
    root.querySelectorAll(`[data-${dataKey.replace(/[A-Z]/g, (m) => '-' + m.toLowerCase())}]`).forEach((el) => {
      el.setAttribute(attr, t(el.dataset[dataKey], lang));
    });
  });

  document.documentElement.lang = lang;
  // Reflect state on any language toggles present
  document.querySelectorAll('[data-lang-option]').forEach((btn) => {
    btn.classList.toggle('is-active', btn.dataset.langOption === lang);
    btn.setAttribute('aria-pressed', String(btn.dataset.langOption === lang));
  });
}

export function setLang(lang) {
  if (!SUPPORTED.includes(lang)) return;
  try {
    localStorage.setItem(STORAGE_KEY, lang);
  } catch {
    // Storage unavailable — still apply the language for this session.
  }
  applyTranslations(lang);
}

// Wire up any [data-lang-option] buttons (rendered inside the navbar).
export function initLanguageToggle() {
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-lang-option]');
    if (!btn) return;
    setLang(btn.dataset.langOption);
  });
}

export function initI18n() {
  applyTranslations(getLang());
  initLanguageToggle();
}
