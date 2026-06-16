// Image slider used on the Gallery page. Exposed as initSlider() and only
// started when a .slider element is present on the page.
class Slider {
  constructor(root) {
    this.root = root;
    this.viewport = root.querySelector('.slider__viewport') || root;
    this.slides = root.querySelectorAll('.slide');
    this.btnLeft = root.querySelector('.slider__btn--left');
    this.btnRight = root.querySelector('.slider__btn--right');
    this.dotContainer = root.querySelector('.dots');

    this.curSlide = 0;
    this.maxSlide = this.slides.length;

    this.createDots();
    this.createLiveRegion();
    this.init();
    this.addEventListeners();
    this.addSwipe();
    this.startAutoplay();
  }

  createDots() {
    if (!this.dotContainer) return;
    this.slides.forEach((_, i) => {
      this.dotContainer.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot" type="button" data-slide="${i}" aria-label="Slika ${i + 1}"></button>`
      );
    });
  }

  // A visually-hidden live region announces the current slide to screen readers.
  createLiveRegion() {
    this.live = document.createElement('div');
    this.live.className = 'sr-only';
    this.live.setAttribute('role', 'status');
    this.live.setAttribute('aria-live', 'polite');
    this.root.appendChild(this.live);
  }

  goToSlide(slide, silent) {
    this.slides.forEach((s, i) => {
      s.style.transform = `translateX(${100 * (i - slide)}%)`;
      // Hide off-screen slides from assistive tech so only the current one reads.
      s.setAttribute('aria-hidden', i === slide ? 'false' : 'true');
    });
    // Announce only on user navigation, not on every autoplay tick.
    if (this.live && !silent) this.live.textContent = `Slika ${slide + 1} / ${this.maxSlide}`;
  }

  activateDot(slide) {
    if (!this.dotContainer) return;
    this.dotContainer.querySelectorAll('.dots__dot').forEach((dot) => {
      const isActive = dot.dataset.slide === String(slide);
      dot.classList.toggle('dots__dot--active', isActive);
      if (isActive) dot.setAttribute('aria-current', 'true');
      else dot.removeAttribute('aria-current');
    });
  }

  nextSlide(silent) {
    this.curSlide = this.curSlide === this.maxSlide - 1 ? 0 : this.curSlide + 1;
    this.goToSlide(this.curSlide, silent);
    this.activateDot(this.curSlide);
  }

  prevSlide(silent) {
    this.curSlide = this.curSlide === 0 ? this.maxSlide - 1 : this.curSlide - 1;
    this.goToSlide(this.curSlide, silent);
    this.activateDot(this.curSlide);
  }

  init() {
    this.goToSlide(0);
    this.activateDot(0);
  }

  addEventListeners() {
    this.btnRight?.addEventListener('click', () => {
      this.nextSlide();
      this.resetAutoplay?.();
    });
    this.btnLeft?.addEventListener('click', () => {
      this.prevSlide();
      this.resetAutoplay?.();
    });

    // Scope arrow keys to the slider (it is focusable via tabindex="0") so they
    // don't hijack page scrolling or form-field caret movement elsewhere.
    this.root.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        this.prevSlide();
        this.resetAutoplay?.();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        this.nextSlide();
        this.resetAutoplay?.();
      }
    });

    this.dotContainer?.addEventListener('click', (e) => {
      const dot = e.target.closest('.dots__dot');
      if (!dot) return;
      const slide = Number(dot.dataset.slide);
      this.curSlide = slide;
      this.goToSlide(slide);
      this.activateDot(slide);
      this.resetAutoplay?.();
    });
  }

  // Touch / mouse / pen swipe via Pointer Events. A horizontal drag past the
  // threshold changes slide; vertical gestures fall through to page scroll.
  addSwipe() {
    const THRESHOLD = 50; // px the pointer must travel to count as a swipe
    let startX = 0;
    let startY = 0;
    let dragging = false;

    this.viewport.addEventListener('pointerdown', (e) => {
      // Let the arrows and dots handle their own clicks.
      if (e.target.closest('.slider__btn') || e.target.closest('.dots')) return;
      dragging = true;
      startX = e.clientX;
      startY = e.clientY;
      // Keep receiving move/up even if the pointer leaves the viewport.
      if (this.viewport.setPointerCapture) {
        this.viewport.setPointerCapture(e.pointerId);
      }
    });

    this.viewport.addEventListener('pointerup', (e) => {
      if (!dragging) return;
      dragging = false;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      // Only act on a mostly-horizontal drag so vertical scrolling still works.
      if (Math.abs(dx) > THRESHOLD && Math.abs(dx) > Math.abs(dy)) {
        if (dx < 0) this.nextSlide();
        else this.prevSlide();
        this.resetAutoplay?.();
      }
    });

    this.viewport.addEventListener('pointercancel', () => (dragging = false));
  }

  // Auto-advance the carousel. Pauses on hover and while focused, resets after
  // any manual navigation, and is fully disabled under prefers-reduced-motion.
  startAutoplay() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const INTERVAL = 4500;
    const stop = () => window.clearInterval(this.timer);
    const start = () => {
      stop(); // never run two intervals at once
      this.timer = window.setInterval(() => this.nextSlide(true), INTERVAL);
    };
    this.resetAutoplay = start;
    start();
    this.root.addEventListener('mouseenter', stop);
    this.root.addEventListener('mouseleave', start);
    this.root.addEventListener('focusin', stop);
    this.root.addEventListener('focusout', start);
  }
}

export function initSlider() {
  const root = document.querySelector('.slider');
  if (root && root.querySelectorAll('.slide').length) new Slider(root);
}
