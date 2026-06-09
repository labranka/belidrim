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
    this.init();
    this.addEventListeners();
    this.addSwipe();
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

  goToSlide(slide) {
    this.slides.forEach(
      (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
    );
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

  nextSlide() {
    this.curSlide = this.curSlide === this.maxSlide - 1 ? 0 : this.curSlide + 1;
    this.goToSlide(this.curSlide);
    this.activateDot(this.curSlide);
  }

  prevSlide() {
    this.curSlide = this.curSlide === 0 ? this.maxSlide - 1 : this.curSlide - 1;
    this.goToSlide(this.curSlide);
    this.activateDot(this.curSlide);
  }

  init() {
    this.goToSlide(0);
    this.activateDot(0);
  }

  addEventListeners() {
    this.btnRight?.addEventListener('click', () => this.nextSlide());
    this.btnLeft?.addEventListener('click', () => this.prevSlide());

    // Scope arrow keys to the slider (it is focusable via tabindex="0") so they
    // don't hijack page scrolling or form-field caret movement elsewhere.
    this.root.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        this.prevSlide();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        this.nextSlide();
      }
    });

    this.dotContainer?.addEventListener('click', (e) => {
      const dot = e.target.closest('.dots__dot');
      if (!dot) return;
      const slide = Number(dot.dataset.slide);
      this.curSlide = slide;
      this.goToSlide(slide);
      this.activateDot(slide);
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
      }
    });

    this.viewport.addEventListener('pointercancel', () => (dragging = false));
  }
}

export function initSlider() {
  const root = document.querySelector('.slider');
  if (root && root.querySelectorAll('.slide').length) new Slider(root);
}
