// Scroll/load reveal: content blocks fade up when they enter the viewport —
// on first load, on every reload, on bfcache restore, and again each time they
// are scrolled back into view. No dependencies.
//
// Targets are tagged with [data-reveal] from JS, and the hidden state lives
// behind the .reveal-ready class on <html> — added only here. So with JS
// disabled or under prefers-reduced-motion, nothing is ever hidden.

// Block-level elements that fade up as a single unit.
const BLOCK_SELECTORS = [
  '.hero__content',
  '.page-hero',
  '.section__head',
  '.about-preview__img',
  '.about-preview__text',
  '.about__img',
  '.about__text',
  '.contact-info',
  '.form-card',
  '.map',
  '.slider',
  '.cta-band__inner',
];

// Grids/lists whose direct children reveal one after another (staggered).
const GROUP_SELECTORS = ['.stats', '.services__grid', '.values__grid', '.positions'];

const targets = [];
let observer = null;
// The observer's very first batch reports the initial scroll position. We treat
// it specially so a reload mid-page doesn't hide content above the fold.
let firstPass = true;

function tagTargets() {
  document.querySelectorAll(BLOCK_SELECTORS.join(',')).forEach((el) => {
    el.setAttribute('data-reveal', '');
    targets.push(el);
  });

  document.querySelectorAll(GROUP_SELECTORS.join(',')).forEach((group) => {
    Array.from(group.children).forEach((child, i) => {
      child.setAttribute('data-reveal', '');
      child.style.setProperty('--reveal-i', i); // stagger within the group
      targets.push(child);
    });
  });
}

function onIntersect(entries) {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      // In view → fade up. Re-adding the class restarts the keyframe animation,
      // so this replays every time the element scrolls back into view.
      entry.target.classList.add('is-revealed');
    } else if (firstPass && entry.boundingClientRect.bottom <= 0) {
      // Already scrolled past at load/restore: show it (no animation — it's
      // off-screen) so a mid-page reload never strands content above the fold.
      entry.target.classList.add('is-revealed');
    } else {
      // Below the fold, or scrolled away after load → reset to hidden so it
      // animates the next time it enters the viewport.
      entry.target.classList.remove('is-revealed');
    }
  });
  firstPass = false;
}

export function initReveal() {
  // Honour the user's motion preference — leave everything visible.
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  tagTargets();
  if (!targets.length) return;

  // Very old browser without IntersectionObserver: leave content visible.
  if (!('IntersectionObserver' in window)) return;

  try {
    observer = new IntersectionObserver(onIntersect, {
      threshold: 0.15,
      rootMargin: '0px 0px -5% 0px',
    });
    // Switch the hidden state on only after the observer exists, so a failure
    // here can never leave content stranded at opacity:0.
    document.documentElement.classList.add('reveal-ready');
    targets.forEach((el) => observer.observe(el));
  } catch (err) {
    // Anything unexpected → un-hide everything so content is never lost.
    document.documentElement.classList.remove('reveal-ready');
    return;
  }

  // Failsafe: if the observer never qualifies an on-screen target (e.g. a short
  // page where a bottom block can't scroll past the threshold), reveal it so
  // content is never permanently hidden.
  setTimeout(() => {
    targets.forEach((el) => {
      if (el.classList.contains('is-revealed')) return;
      const r = el.getBoundingClientRect();
      if (r.top < window.innerHeight && r.bottom > 0) el.classList.add('is-revealed');
    });
  }, 1200);

  // Back/forward navigation restores the page from the bfcache without
  // re-running this module, so replay the reveal whenever that happens.
  window.addEventListener('pageshow', (e) => {
    if (!e.persisted || !observer) return;
    firstPass = true;
    targets.forEach((el) => {
      observer.unobserve(el);
      el.classList.remove('is-revealed');
    });
    targets.forEach((el) => observer.observe(el));
  });
}
