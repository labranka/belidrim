// Soft navigation: the "one page" feel between our pages.
//
// Clicking an internal link no longer reloads the document. The next page is
// fetched in the background (usually already prefetched on hover / touch),
// only <main> is swapped, the <head> essentials are synced (title, description,
// canonical, JSON-LD) and the URL is pushed. The navbar and footer are never
// re-rendered, so there is no white flash, no navbar blink and no reflow.
//
// The swap is animated with the View Transitions API where available (Chrome,
// Edge, Safari 18+, Firefox 144+; see the "Page transitions" block in
// style.css) and with a plain Web Animations fade elsewhere. Under
// prefers-reduced-motion the swap is instant. Anything unexpected (offline,
// 404, non-HTML, redirect off-site, missing <main>) falls back to a normal full
// navigation, so the site can never get stuck.
//
// Left to the browser: external links, mailto:/tel:, downloads, target=_blank,
// modifier / middle clicks, same-page #anchors and anything with data-no-swap.
import { setActiveNav, slugFromPath, syncNavScroll } from './layout.js';

const PAGE_CACHE_MAX = 12; // fetched pages kept in memory (the site has 6)
const FADE_OUT_MS = 140; // fallback (no View Transitions) fade timings
const FADE_IN_MS = 260;
const IMAGE_WAIT_MS = 250; // max time to wait for the next page's hero image
const PROGRESS_DELAY_MS = 280; // top progress bar shows only past this
const SCROLL_KEY = 'belidrim_scroll:'; // sessionStorage, for reload restore

const pages = new Map(); // clean path -> Promise<string> (HTML text)
const warmed = new Set(); // clean paths whose hero image was prefetched
const scrollPositions = new Map(); // history entry id -> scrollY

let onPageReady = () => {};
let entryId = 0; // last history entry id handed out
let currentId = 0; // id of the entry we are on
let currentPath = ''; // clean path + search of the page we are on
let navSeq = 0; // bumps on every navigation; superseded ones bail out
let navStarted = 0; // performance.now() when the current navigation began
let progressEl = null;

const reducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

// '/about-us.html' -> '/about-us', '/index.html' -> '/'. The 404 page keeps its
// extension (GitHub Pages serves it for any unknown path).
export function cleanPath(pathname) {
  if (pathname.endsWith('/index.html'))
    return pathname.slice(0, -'index.html'.length);
  if (pathname.endsWith('.html') && !pathname.endsWith('/404.html'))
    return pathname.slice(0, -'.html'.length);
  return pathname;
}

const pathKey = url => cleanPath(url.pathname) + url.search;

// One of our HTML pages? (not an image, PDF, sitemap, …)
function isPageUrl(url) {
  if (url.origin !== location.origin) return false;
  if (url.protocol !== 'http:' && url.protocol !== 'https:') return false;
  const last = url.pathname.split('/').pop();
  return !/\.[a-z0-9]+$/i.test(last) || /\.html?$/i.test(last);
}

// The page URL a click / hover on `target` points at, or null if the browser
// should handle it natively.
function pageLink(target) {
  const a = target instanceof Element ? target.closest('a[href]') : null;
  if (!a) return null;
  if (a.hasAttribute('download') || a.hasAttribute('data-no-swap')) return null;
  if (a.target && a.target !== '_self') return null;
  const url = new URL(a.href, location.href);
  return isPageUrl(url) ? url : null;
}

function dataSaver() {
  const c = navigator.connection;
  if (!c) return false;
  return !!c.saveData || c.effectiveType === '2g' || c.effectiveType === 'slow-2g';
}

/* ---------- fetching & prefetching ---------- */

function fetchPage(url) {
  const key = pathKey(url);
  if (pages.has(key)) return pages.get(key);
  const request = fetch(url.href, { headers: { Accept: 'text/html' } }).then(
    res => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const type = res.headers.get('content-type') || '';
      if (!type.includes('text/html')) throw new Error('not an HTML page');
      if (new URL(res.url).origin !== location.origin)
        throw new Error('redirected off-site');
      return res.text();
    }
  );
  // Failures are not kept: the next attempt (or the fallback) refetches.
  request.catch(() => pages.delete(key));
  pages.set(key, request);
  if (pages.size > PAGE_CACHE_MAX) pages.delete(pages.keys().next().value);
  return request;
}

// Warm the HTTP cache with the next page's hero image (whatever its <head>
// preloads), so it is already there when that page fades in.
function warmImages(key, html) {
  if (warmed.has(key)) return;
  warmed.add(key);
  const doc = new DOMParser().parseFromString(html, 'text/html');
  doc
    .querySelectorAll('link[rel="preload"][as="image"][href]')
    .forEach(link => {
      const href = new URL(link.getAttribute('href'), location.href).href;
      fetch(href, { priority: 'low' })
        .then(res => res.blob())
        .catch(() => {});
    });
}

function prefetch(url) {
  if (dataSaver()) return;
  const key = pathKey(url);
  if (key === currentPath) return;
  fetchPage(url)
    .then(html => warmImages(key, html))
    .catch(() => {});
}

// After the first load settles, quietly fetch the other navbar pages so every
// later click is instant. Skipped on data-saver / 2G connections.
function idlePrefetch() {
  if (dataSaver()) return;
  const run = () =>
    document.querySelectorAll('.navbar__link[href]').forEach(a => {
      const url = pageLink(a);
      if (url) prefetch(url);
    });
  if ('requestIdleCallback' in window)
    window.requestIdleCallback(run, { timeout: 4000 });
  else setTimeout(run, 2500);
}

/* ---------- scrolling ---------- */

// The site scrolls smoothly (CSS scroll-behavior); these jumps must be instant
// so they happen under the fade, not as a visible scroll.
function instantly(fn) {
  const style = document.documentElement.style;
  style.scrollBehavior = 'auto';
  fn();
  style.scrollBehavior = '';
}

function jumpTo(top) {
  instantly(() => window.scrollTo({ top, left: 0, behavior: 'instant' }));
}

function jumpToHash(hash) {
  if (!hash) return false;
  let target = null;
  try {
    target = document.getElementById(decodeURIComponent(hash.slice(1)));
  } catch {
    /* malformed hash */
  }
  if (!target) return false;
  instantly(() => target.scrollIntoView({ block: 'start', behavior: 'instant' }));
  return true;
}

// history.scrollRestoration is "manual" (Back/Forward are ours), which would
// also drop the scroll position on a reload or a hard Back/Forward (bfcache
// miss). Keep that behaviour by hand: the position is saved on pagehide under
// the history entry's id + path, and restored when a document loads with that
// same entry state (history.state survives reloads; a fresh visit has none).
const storageKey = () => `${SCROLL_KEY}${currentId}:${currentPath}`;

function saveScrollForReload() {
  try {
    sessionStorage.setItem(storageKey(), String(window.scrollY));
  } catch {
    /* storage unavailable */
  }
}

function restoreSavedScroll() {
  try {
    const y = Number(sessionStorage.getItem(storageKey()));
    if (y > 0) jumpTo(y);
  } catch {
    /* storage unavailable */
  }
}

/* ---------- progress bar (slow navigations only) ---------- */

function progressStart() {
  navStarted = performance.now();
  document.documentElement.classList.add('is-navigating');
}

function progressEnd() {
  document.documentElement.classList.remove('is-navigating');
  // The bar only became visible if the fetch outlived its delay; then let it
  // complete and fade instead of vanishing mid-way.
  if (progressEl && performance.now() - navStarted > PROGRESS_DELAY_MS) {
    progressEl.classList.add('is-done');
    setTimeout(() => progressEl.classList.remove('is-done'), 400);
  }
}

/* ---------- the swap ---------- */

function syncHead(doc) {
  document.title = doc.title;
  const copy = (selector, attr) => {
    const from = doc.querySelector(selector);
    const to = document.querySelector(selector);
    if (from && to) to.setAttribute(attr, from.getAttribute(attr) || '');
  };
  copy('meta[name="description"]', 'content');
  copy('link[rel="canonical"]', 'href');
  copy('meta[property="og:url"]', 'content');
  copy('meta[property="og:title"]', 'content');
  const ldFrom = doc.querySelector('#ld-localbusiness');
  const ldTo = document.querySelector('#ld-localbusiness');
  if (ldFrom && ldTo) ldTo.textContent = ldFrom.textContent;
}

// Give the new page's eager hero image (fetchpriority="high") a moment to
// decode so it doesn't pop in mid-fade — but never hold the swap for long.
function settleImages(main) {
  const pending = Array.from(
    main.querySelectorAll('img[fetchpriority="high"]')
  ).filter(img => !img.complete);
  if (!pending.length) return Promise.resolve();
  return Promise.race([
    Promise.all(pending.map(img => img.decode().catch(() => {}))),
    wait(IMAGE_WAIT_MS),
  ]);
}

// Replace <main>, sync the head/URL/nav state, position the viewport and
// re-run the page modules. Synchronous on purpose: everything lands in one
// frame, so nothing can flash in half-done (View Transitions capture the new
// state right after this returns).
function commit(doc, url, { push, entry }) {
  const next = document.adoptNode(doc.querySelector('main'));
  document.querySelector('main').replaceWith(next);
  syncHead(doc);
  setActiveNav(slugFromPath(url.pathname));

  let savedScroll = null;
  if (push) {
    const href = cleanPath(url.pathname) + url.search + url.hash;
    history.pushState({ id: ++entryId }, '', href);
    currentId = entryId;
  } else {
    currentId = entry;
    savedScroll = scrollPositions.get(entry);
  }
  currentPath = pathKey(url);

  // Back/Forward restore where the visitor was; a #hash scrolls to its
  // target; everything else starts at the top.
  if (typeof savedScroll === 'number') jumpTo(savedScroll);
  else if (!jumpToHash(url.hash)) jumpTo(0);
  syncNavScroll();

  try {
    onPageReady(next);
  } catch (err) {
    console.error('[navigation] page init failed', err);
  }

  // Focus the new content so keyboard / screen-reader users continue from
  // the page, not from the navbar.
  next.setAttribute('tabindex', '-1');
  next.focus({ preventScroll: true });
  return next;
}

function fadeOut(el) {
  return el.animate([{ opacity: 1 }, { opacity: 0 }], {
    duration: FADE_OUT_MS,
    easing: 'ease-in',
    fill: 'forwards',
  });
}

async function fadeIn(el) {
  const anim = el.animate([{ opacity: 0 }, { opacity: 1 }], {
    duration: FADE_IN_MS,
    easing: 'ease-out',
    fill: 'forwards',
  });
  await anim.finished.catch(() => {});
  el.style.opacity = '';
  anim.cancel();
}

async function navigate(url, { push = true, entry = 0 } = {}) {
  const seq = ++navSeq;
  scrollPositions.set(currentId, window.scrollY); // remember for Back
  progressStart();

  const motion = !reducedMotion();
  const useTransitions =
    motion && typeof document.startViewTransition === 'function';
  // Without View Transitions, start fading out right away (perceived speed)
  // while the fetch runs.
  const leaving =
    motion && !useTransitions ? fadeOut(document.querySelector('main')) : null;

  let doc;
  try {
    const html = await fetchPage(url);
    doc = new DOMParser().parseFromString(html, 'text/html');
    if (!doc.querySelector('main')) throw new Error('no <main> in response');
  } catch (err) {
    if (seq !== navSeq) return;
    // Let the browser do a full navigation: it shows the real page / error.
    if (push) location.href = url.href;
    else location.reload();
    return;
  }
  if (seq !== navSeq) return; // a newer click took over
  progressEnd();

  if (useTransitions) {
    const transition = document.startViewTransition(() =>
      settleImages(commit(doc, url, { push, entry }))
    );
    await transition.finished.catch(() => {});
    return;
  }

  if (leaving) await leaving.finished.catch(() => {});
  const next = commit(doc, url, { push, entry });
  if (motion) {
    next.style.opacity = '0';
    await settleImages(next);
    await fadeIn(next);
  }
}

/* ---------- events ---------- */

function onClick(e) {
  if (e.defaultPrevented || e.button !== 0) return;
  if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
  const url = pageLink(e.target);
  if (!url) return;
  if (pathKey(url) === currentPath) {
    if (url.hash) return; // in-page anchor: native (smooth) scroll
    // Same page again (e.g. the logo on Home): back to top, no reload.
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: reducedMotion() ? 'instant' : 'smooth' });
    return;
  }
  e.preventDefault();
  navigate(url, { push: true });
}

function onPopState(e) {
  const url = new URL(location.href);
  const id = e.state && typeof e.state.id === 'number' ? e.state.id : null;
  if (pathKey(url) === currentPath) {
    // Only the #hash changed (skip link etc.): nothing to swap.
    if (id !== null) currentId = id;
    return;
  }
  navigate(url, { push: false, entry: id === null ? ++entryId : id });
}

function onIntent(e) {
  const url = pageLink(e.target);
  if (url) prefetch(url);
}

export function initNavigation(onReady) {
  onPageReady = onReady;
  if (!window.fetch || !window.DOMParser || !history.pushState) return;

  history.scrollRestoration = 'manual';
  // Keep the address bar on the clean, extension-less URL even when someone
  // opens a .html path directly (typed, old bookmark, external link), and tag
  // this entry so Back can find its way home. An entry that already carries
  // our state is a reload / hard Back-Forward of a page from this session.
  const prior = history.state;
  const revisit = !!prior && typeof prior.id === 'number';
  entryId = currentId = revisit ? prior.id : 0;
  const { pathname, search, hash } = location;
  const clean = cleanPath(pathname);
  history.replaceState({ id: currentId }, '', clean + search + hash);
  currentPath = clean + search;
  if (revisit) restoreSavedScroll();

  progressEl = document.createElement('div');
  progressEl.className = 'page-progress';
  progressEl.setAttribute('aria-hidden', 'true');
  document.body.appendChild(progressEl);

  document.addEventListener('click', onClick);
  window.addEventListener('popstate', onPopState);
  window.addEventListener('pagehide', saveScrollForReload);
  // Prefetch on intent: hover, touch and keyboard focus.
  document.addEventListener('mouseover', onIntent);
  document.addEventListener('touchstart', onIntent, { passive: true });
  document.addEventListener('focusin', onIntent);
  idlePrefetch();
}
