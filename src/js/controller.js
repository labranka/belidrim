// Image slider used on the Gallery page. Exposed as initSlider() and only
// started when a .slider element is present on the page.
class Slider {
  constructor(root) {
    this.slides = root.querySelectorAll('.slide');
    this.btnLeft = root.querySelector('.slider__btn--left');
    this.btnRight = root.querySelector('.slider__btn--right');
    this.dotContainer = root.querySelector('.dots');

    this.curSlide = 0;
    this.maxSlide = this.slides.length;

    this.createDots();
    this.init();
    this.addEventListeners();
  }

  createDots() {
    this.slides.forEach((_, i) => {
      this.dotContainer.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot" data-slide="${i}" aria-label="Slide ${i + 1}"></button>`
      );
    });
  }

  goToSlide(slide) {
    this.slides.forEach(
      (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
    );
  }

  activateDot(slide) {
    this.dotContainer
      .querySelectorAll('.dots__dot')
      .forEach((dot) => dot.classList.remove('dots__dot--active'));
    const active = this.dotContainer.querySelector(
      `.dots__dot[data-slide="${slide}"]`
    );
    if (active) active.classList.add('dots__dot--active');
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
    this.btnRight.addEventListener('click', () => this.nextSlide());
    this.btnLeft.addEventListener('click', () => this.prevSlide());

    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') this.prevSlide();
      if (e.key === 'ArrowRight') this.nextSlide();
    });

    this.dotContainer.addEventListener('click', (e) => {
      const dot = e.target.closest('.dots__dot');
      if (!dot) return;
      const { slide } = dot.dataset;
      this.curSlide = Number(slide);
      this.goToSlide(slide);
      this.activateDot(slide);
    });
  }
}

export function initSlider() {
  const root = document.querySelector('.slider');
  if (root) new Slider(root);
}
