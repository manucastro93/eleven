// swiper.ts
import Swiper from 'swiper';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';

export function initSwiper(container: HTMLElement): Swiper {
  return new Swiper(container, {
    modules: [Navigation, Pagination, Autoplay],
    slidesPerView: 'auto',
    spaceBetween: 16,
    loop: false,
    speed: 800,
    freeMode: true,
    grabCursor: true,
    autoplay: {
      delay: 3000,
      disableOnInteraction: false,
      pauseOnMouseEnter: true,
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
      bulletClass: 'swiper-bullet',
      bulletActiveClass: 'swiper-bullet-active',
    },
    breakpoints: {
      768: {
        slidesPerView: 2.2,
        spaceBetween: 24,
        freeMode: false,
        loop: true,
      },
      1024: {
        slidesPerView: 3.2,
        spaceBetween: 32,
      },
      1280: {
        slidesPerView: 4.2,
        spaceBetween: 150,
      },
    },
  });
}
