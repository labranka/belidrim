// Handles Contact + Careers form submissions via Web3Forms (no backend needed).
// Forms must have class "js-form" and a [data-form-status] element for feedback.
import { site } from './site.config.js';
import { t } from './i18n.js';

const ENDPOINT = 'https://api.web3forms.com/submit';

async function handleSubmit(form) {
  const status = form.querySelector('[data-form-status]');
  const submitBtn = form.querySelector('button[type="submit"]');
  const originalLabel = submitBtn ? submitBtn.textContent : '';

  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.textContent = t('form.sending');
  }
  if (status) {
    status.textContent = '';
    status.className = 'form__status';
  }

  const data = new FormData(form);
  data.append('access_key', site.web3formsKey);

  try {
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { Accept: 'application/json' },
      body: data,
    });
    const json = await res.json();
    if (json.success) {
      form.reset();
      if (status) {
        status.textContent = t('form.success');
        status.classList.add('is-success');
      }
    } else {
      throw new Error(json.message || 'submit failed');
    }
  } catch (err) {
    if (status) {
      status.textContent = t('form.error');
      status.classList.add('is-error');
    }
  } finally {
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = originalLabel || t('form.send');
    }
  }
}

export function initForms() {
  document.querySelectorAll('form.js-form').forEach((form) => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      handleSubmit(form);
    });
  });
}
