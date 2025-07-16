/*
Документация по работе в шаблоне: 
Документация слайдера: https://swiperjs.com/
Сниппет(HTML): swiper
*/

// Подключаем слайдер Swiper из node_modules
// При необходимости подключаем дополнительные модули слайдера, указывая их в {} через запятую
// Пример: { Navigation, Autoplay }
import Swiper, { Navigation, Pagination, Thumbs, Autoplay } from 'swiper';
/*
Основниые модули слайдера:
Navigation, Pagination, Autoplay, 
EffectFade, Lazy, Manipulation
Подробнее смотри https://swiperjs.com/
*/

// Стили Swiper
// Базовые стили
import "../../scss/base/swiper.scss";
// Полный набор стилей из scss/libs/swiper.scss
// import "../../scss/libs/swiper.scss";
// Полный набор стилей из node_modules
// import 'swiper/css';

// Перечень слайдеров
// Проверяем, есть ли слайдер на стронице
if (document.querySelector('.top-main-about__slider')) { // Указываем скласс нужного слайдера
	// Создаем слайдер
	new Swiper('.top-main-about__slider', { // Указываем скласс нужного слайдера
		// Подключаем модули слайдера
		// для конкретного случая
		modules: [Pagination],
		observer: true,
		observeParents: true,
		slidesPerView: 1,
		spaceBetween: 20,
		autoHeight: false,
		speed: 800,

		// Пагинация
		pagination: {
			el: '.top-main-about__pagination',
			clickable: true,
		},
	});
}

if (document.querySelector('.main-home__slider')) { // Указываем скласс нужного слайдера
	// Создаем слайдер
	new Swiper('.main-home__slider', { // Указываем скласс нужного слайдера
		// Подключаем модули слайдера
		// для конкретного случая
		modules: [Navigation, Pagination, Autoplay],
		observer: true,
		observeParents: true,
		slidesPerView: 1,
		spaceBetween: 20,
		autoHeight: false,
		speed: 800,

		//touchRatio: 0,
		//simulateTouch: false,
		loop: true,
		//preloadImages: false,
		lazy: true,

		autoplay: {
			delay: 3000,
			disableOnInteraction: false,
		},

		// Пагинация
		pagination: {
			el: '.main-home__pagination',
			clickable: true,
		},

		// Скроллбар
		/*
		scrollbar: {
			el: '.swiper-scrollbar',
			draggable: true,
		},
		*/

		// Кнопки "влево/вправо"
		navigation: {
			prevEl: '.main-home__arrow-prev',
			nextEl: '.main-home__arrow-next',
		},

		// Брейкпоинты
		/*
		breakpoints: {
			320: {
				slidesPerView: 1,
				spaceBetween: 0,
				autoHeight: true,
			},
			768: {
				slidesPerView: 2,
				spaceBetween: 20,
			},
			992: {
				slidesPerView: 3,
				spaceBetween: 20,
			},
			1268: {
				slidesPerView: 4,
				spaceBetween: 30,
			},
		},
		*/
		// События
		on: {

		}
	});
}

document.querySelectorAll('.result-popup__content').forEach(n => {
	// Создаем слайдер
	const thumbsSwiper = new Swiper(n.querySelector('.result-popup__thumbs'), { // Указываем скласс нужного слайдера
		// Подключаем модули слайдера
		// для конкретного случая
		modules: [Thumbs],
		observer: true,
		observeParents: true,
		slidesPerView: 6,
		spaceBetween: 12,
		speed: 800,
		// Брейкпоинты
		breakpoints: {
			0: {
				slidesPerView: 2.5,
			},
			360: {
				slidesPerView: 3.3,
			},
			650: {
				slidesPerView: 4,
			},
			767.98: {
				slidesPerView: 6,
			},
			991.98: {
				slidesPerView: 3,
			},
			1300: {
				slidesPerView: 4,
			},
			1600: {
				slidesPerView: 5,
			},
			1800: {
				slidesPerView: 6,
			},
		},
	});
	const swiper = new Swiper(n.querySelector('.result-popup__slider'), {
		// Подключаем модули слайдера
		// для конкретного случая
		modules: [Thumbs],
		thumbs: {
			swiper: thumbsSwiper
		},
		observer: true,
		observeParents: true,
		slidesPerView: 1,
		spaceBetween: 20,
		speed: 800,
		preloadImages: true,
	});
});

if (document.querySelector('.teams__slider')) { // Указываем скласс нужного слайдера
	// Создаем слайдер
	new Swiper('.teams__slider', {
		// Подключаем модули слайдера
		// для конкретного случая
		modules: [Navigation],
		observer: true,
		observeParents: true,
		speed: 800,
		preloadImages: true,

		// Кнопки "влево/вправо"
		navigation: {
			prevEl: '.teams__arrow-prev',
			nextEl: '.teams__arrow-next',
		},

		// Брейкпоинты
		breakpoints: {
			0: {
				slidesPerView: 1.1,
				spaceBetween: 16,
			},
			479.98: {
				slidesPerView: 1.5,
				spaceBetween: 16,
			},
			767.98: {
				slidesPerView: 3,
				spaceBetween: 16,
			},
			991.98: {
				slidesPerView: 4,
				spaceBetween: 16,
			},
			1300: {
				slidesPerView: 4,
				spaceBetween: 24,
			},
		},
	});
};

if (document.querySelector('.result__slider')) { // Указываем скласс нужного слайдера
	// Создаем слайдер
	new Swiper('.result__slider', {
		// Подключаем модули слайдера
		// для конкретного случая
		modules: [Navigation],
		observer: true,
		observeParents: true,
		speed: 800,
		preloadImages: true,

		// Кнопки "влево/вправо"
		navigation: {
			prevEl: '.result__arrow-prev',
			nextEl: '.result__arrow-next',
		},

		// Брейкпоинты
		breakpoints: {
			0: {
				slidesPerView: 1.1,
				spaceBetween: 16,
			},
			479.98: {
				slidesPerView: 1.1,
				spaceBetween: 16,
			},
			600: {
				slidesPerView: 1.3,
				spaceBetween: 16,
			},
			767.98: {
				slidesPerView: 2,
				spaceBetween: 16,
			},
			1300: {
				slidesPerView: 3,
				spaceBetween: 36,
			},
		},
	});
};

if (document.querySelector('.doctor-certificates__slider')) { // Указываем скласс нужного слайдера
	// Создаем слайдер
	new Swiper('.doctor-certificates__slider', {
		// Подключаем модули слайдера
		// для конкретного случая
		modules: [Navigation],
		observer: true,
		observeParents: true,
		speed: 800,
		preloadImages: true,

		// Кнопки "влево/вправо"
		navigation: {
			prevEl: '.doctor-certificates__arrow-prev',
			nextEl: '.doctor-certificates__arrow-next',
		},

		// Брейкпоинты
		breakpoints: {
			0: {
				slidesPerView: 1,
				spaceBetween: 16,
				autoHeight: true,
			},
			991.98: {
				slidesPerView: 'auto',
				spaceBetween: 32,
			},
		},
	});
};

if (document.querySelector('.doctor-certificates__popup-slider')) { // Указываем скласс нужного слайдера
	// Создаем слайдер
	new Swiper('.doctor-certificates__popup-slider', {
		// Подключаем модули слайдера
		// для конкретного случая
		modules: [Navigation],
		observer: true,
		observeParents: true,
		slidesPerView: 1,
		spaceBetween: 16,
		speed: 800,
		preloadImages: true,

		// Кнопки "влево/вправо"
		navigation: {
			prevEl: '.doctor-certificates__arrow-prev',
			nextEl: '.doctor-certificates__arrow-next',
		},
	});
};

if (document.querySelector('.result-slider__slider')) { // Указываем скласс нужного слайдера
	// Создаем слайдер
	new Swiper('.result-slider__slider', {
		// Подключаем модули слайдера
		// для конкретного случая
		modules: [Navigation],
		observer: true,
		observeParents: true,
		slidesPerView: 1,
		spaceBetween: 16,
		speed: 800,
		preloadImages: true,

		// Кнопки "влево/вправо"
		navigation: {
			prevEl: '.result__arrow-prev',
			nextEl: '.result__arrow-next',
		},
	});
};