class MobileMenu {
  constructor() {
    this.menu = document.querySelector('#mobile-menu');
    this.menuLinks = document.querySelector('.navbar__menu');
    this.htmlEl = document.querySelector('html');

    this.menu.addEventListener('click', () => {
      this.toggleMenu();
    });
  }

  toggleMenu() {
    this.menu.classList.toggle('is-active');
    this.menuLinks.classList.toggle('active');

    if (this.menu.classList.contains('is-active')) {
      this.htmlEl.style.overflow = 'hidden';
    } else {
      this.htmlEl.style.overflow = 'auto';
    }
  }
}

class Slider {
  constructor() {
    this.slides = document.querySelectorAll('.slide');
    this.btnLeft = document.querySelector('.slider__btn--left');
    this.btnRight = document.querySelector('.slider__btn--right');
    this.dotContainer = document.querySelector('.dots');

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
        `<button class="dots__dot" data-slide="${i}"></button>`
      );
    });
  }

  goToSlide(slide) {
    this.slides.forEach(
      (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
    );
  }

  activateDot(slide) {
    document
      .querySelectorAll('.dots__dot')
      .forEach(dot => dot.classList.remove('dots__dot--active'));

    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add('dots__dot--active');
  }

  nextSlide() {
    if (this.curSlide === this.maxSlide - 1) {
      this.curSlide = 0;
    } else {
      this.curSlide++;
    }

    this.goToSlide(this.curSlide);
    this.activateDot(this.curSlide);
  }

  prevSlide() {
    if (this.curSlide === 0) {
      this.curSlide = this.maxSlide - 1;
    } else {
      this.curSlide--;
    }
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

    document.addEventListener('keydown', e => {
      if (e.key === 'ArrowLeft') this.prevSlide();
      e.key === 'ArrowRight' && this.nextSlide();
    });

    this.dotContainer.addEventListener('click', e => {
      if (e.target.classList.contains('dots__dot')) {
        const { slide } = e.target.dataset;
        this.goToSlide(slide);
        this.activateDot(slide);
      }
    });
  }
}

// Usage
const mobileMenu = new MobileMenu();
if(document.querySelector(".slider")){
const slider = new Slider();
}