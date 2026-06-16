// Renders the Contact page info block + map from site.config (single source of
// truth), so business details only ever need editing in site.config.js.
import { site, mapEmbedSrc } from './site.config.js';

const ICON = {
  phone:
    '<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path fill="currentColor" d="M6.6 10.8a15.5 15.5 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25c1.1.37 2.3.57 3.6.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.2.2 2.4.57 3.5a1 1 0 0 1-.25 1l-2.22 2.3Z"/></svg>',
  mail:
    '<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path fill="currentColor" d="M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Zm8 7L4.5 6.3 4 6v.7l8 5 8-5V6l-.5-.3L12 11Z"/></svg>',
  pin:
    '<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path fill="currentColor" d="M12 2a7 7 0 0 1 7 7c0 5-7 13-7 13S5 14 5 9a7 7 0 0 1 7-7Zm0 4.5A2.5 2.5 0 1 0 12 11a2.5 2.5 0 0 0 0-4.5Z"/></svg>',
  clock:
    '<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path fill="currentColor" fill-rule="evenodd" d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm0 2a8 8 0 1 1 0 16 8 8 0 0 1 0-16Zm1 3h-2v5.4l4 2.4 1-1.7-3-1.8V7Z"/></svg>',
};

export function initContact() {
  const infoEl = document.querySelector('#contact-info');
  if (!infoEl) return; // not the contact page

  // The contact info is pre-rendered as static HTML (for SEO). Only build it
  // from config here if the page shipped an empty placeholder (fallback).
  if (infoEl.children.length === 0)
    infoEl.innerHTML = `
    <div class="contact-info__item">
      <span class="contact-info__icon">${ICON.phone}</span>
      <div>
        <div class="contact-info__label" data-i18n="contact.phoneLabel"></div>
        <a class="contact-info__value" href="tel:${site.phoneHref}">${site.phoneDisplay}</a>
      </div>
    </div>
    <div class="contact-info__item">
      <span class="contact-info__icon">${ICON.mail}</span>
      <div>
        <div class="contact-info__label" data-i18n="contact.emailLabel"></div>
        <a class="contact-info__value" href="mailto:${site.email}">${site.email}</a>
      </div>
    </div>
    <div class="contact-info__item">
      <span class="contact-info__icon">${ICON.pin}</span>
      <div>
        <div class="contact-info__label" data-i18n="contact.addressLabel"></div>
        <div class="contact-info__value">${site.address}</div>
      </div>
    </div>
    <div class="contact-info__item">
      <span class="contact-info__icon">${ICON.clock}</span>
      <div>
        <div class="contact-info__label" data-i18n="contact.hoursLabel"></div>
        <div class="contact-info__value" data-i18n="contact.hoursValue"></div>
      </div>
    </div>`;

  const mapFrame = document.querySelector('#contact-map');
  if (mapFrame) mapFrame.src = mapEmbedSrc;
}
