const header = document.querySelector(".nav-stick");
const navbar = document.querySelector(".header-main")

const navHeight = navbar.getBoundingClientRect().height;


const stickyNav = function (entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) navbar.classList.add('sticky')
  else navbar.classList.remove('sticky');
}

const scrollObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin : `-${navHeight}px`
})

scrollObserver.observe(header);

//using slider for customer caurosel

var swiper = new Swiper(".mySwiper", {
  
  slidesPerView: 3,
  spaceBetween: 40,
  centeredSlides : true,
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
  },
  breakpoints: {
    "@0.00": {
      slidesPerView: 1,
      spaceBetween: 10,
    },
    "@0.75": {
      slidesPerView: 2,
      spaceBetween: 20,
    },
    "@1.00": {
      slidesPerView: 3,
      spaceBetween: 40,
    },
    "@1.50": {
      slidesPerView: 3,
      spaceBetween: 70,
    },
  },
});

swiper.slideTo(1);