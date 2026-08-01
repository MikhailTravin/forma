// Подключение списка активных модулей
import { flsModules } from "../modules.js";
// Вспомогательные функции
import { isMobile, _slideUp, _slideDown, _slideToggle, FLS } from "../functions.js";
// Модуль прокрутки к блоку
import { gotoBlock } from "../scroll/gotoblock.js";
//================================================================================================================================================================================================================================================================================================================================

// Работа с полями формы. Добавление классов, работа с placeholder
export function formFieldsInit(options = { viewPass: false }) {
	// Если включено, добавляем функционал "скрыть плейсходлер при фокусе"
	const formFields = document.querySelectorAll('input[placeholder],textarea[placeholder]');
	if (formFields.length) {
		formFields.forEach(formField => {
			if (!formField.hasAttribute('data-placeholder-nohide')) {
				formField.dataset.placeholder = formField.placeholder;
			}
		});
	}
	document.body.addEventListener("focusin", function (e) {
		const targetElement = e.target;
		if ((targetElement.tagName === 'INPUT' || targetElement.tagName === 'TEXTAREA')) {
			if (targetElement.dataset.placeholder) {
				targetElement.placeholder = '';
			}
			if (!targetElement.hasAttribute('data-no-focus-classes')) {
				targetElement.classList.add('_form-focus');
				targetElement.parentElement.classList.add('_form-focus');
			}
			formValidate.removeError(targetElement);
		}
	});
	document.body.addEventListener("focusout", function (e) {
		const targetElement = e.target;
		if ((targetElement.tagName === 'INPUT' || targetElement.tagName === 'TEXTAREA')) {
			if (targetElement.dataset.placeholder) {
				targetElement.placeholder = targetElement.dataset.placeholder;
			}
			if (!targetElement.hasAttribute('data-no-focus-classes')) {
				targetElement.classList.remove('_form-focus');
				targetElement.parentElement.classList.remove('_form-focus');
			}
			// Моментальная валидация
			if (targetElement.hasAttribute('data-validate')) {
				formValidate.validateInput(targetElement);
			}
		}
	});

	// Если включено, добавляем функционал "Показать пароль"
	if (options.viewPass) {
		document.addEventListener("click", function (e) {
			let targetElement = e.target;
			const viewPassButton = targetElement.closest('[class*="__viewpass"]');

			if (viewPassButton) {
				// Находим ближайший input для пароля
				const passwordInput = viewPassButton.parentElement.querySelector('input[type="password"], input[type="text"]');

				if (passwordInput) {
					let inputType = viewPassButton.classList.contains('_viewpass-active') ? "password" : "text";
					passwordInput.setAttribute("type", inputType);
					viewPassButton.classList.toggle('_viewpass-active');
				}
			}
		});
	}
}

// Валидация форм
export let formValidate = {
	getErrors(form) {
		let error = 0;
		let formRequiredItems = form.querySelectorAll('*[data-required]');
		if (formRequiredItems.length) {
			formRequiredItems.forEach(formRequiredItem => {
				if ((formRequiredItem.offsetParent !== null || formRequiredItem.tagName === "SELECT") && !formRequiredItem.disabled) {
					error += this.validateInput(formRequiredItem);
				}
			});
		}

		// Дополнительная проверка паролей
		error += this.validatePasswords(form);

		return error;
	},

	validateInput(formRequiredItem) {
		let error = 0;
		if (formRequiredItem.dataset.required === "email") {
			formRequiredItem.value = formRequiredItem.value.replace(" ", "");
			if (this.emailTest(formRequiredItem)) {
				this.addError(formRequiredItem);
				error++;
			} else {
				this.removeError(formRequiredItem);
			}
		} else if (formRequiredItem.type === "checkbox" && !formRequiredItem.checked) {
			this.addError(formRequiredItem);
			error++;
		} else {
			if (!formRequiredItem.value.trim()) {
				this.addError(formRequiredItem);
				error++;
			} else {
				this.removeError(formRequiredItem);
			}
		}
		return error;
	},

	// Новая функция для проверки паролей
	validatePasswords(form) {
		let error = 0;
		const password1 = form.querySelector('#password1');
		const password2 = form.querySelector('#password2');

		// Если в форме есть поля паролей, проверяем их
		if (password1 && password2) {
			// Убираем предыдущие ошибки паролей
			this.removePasswordError();

			// Проверяем, что оба поля заполнены
			if (password1.value.trim() && password2.value.trim()) {
				// Проверяем совпадение паролей
				if (password1.value !== password2.value) {
					this.addPasswordError(password1, password2, 'Пароли не совпадают');
					error++;
				}
			}
			// Если одно поле заполнено, а другое нет - показываем ошибку
			else if ((password1.value.trim() && !password2.value.trim()) ||
				(!password1.value.trim() && password2.value.trim())) {
				this.addPasswordError(password1, password2, 'Оба поля пароля должны быть заполнены');
				error++;
			}
		}
		return error;
	},

	// Функция для добавления ошибки паролей
	addPasswordError(password1, password2, message) {
		// Добавляем классы ошибки
		password1.classList.add('_form-error');
		password2.classList.add('_form-error');
		password1.parentElement.classList.add('_form-error');
		password2.parentElement.classList.add('_form-error');

		// Создаем элемент с ошибкой
		const errorElement = document.createElement('div');
		errorElement.className = 'form__error password-match-error';
		errorElement.textContent = message;

		// Добавляем ошибку после второго поля пароля
		password2.parentElement.appendChild(errorElement);
	},

	// Функция для удаления ошибки паролей
	removePasswordError() {
		const passwordError = document.querySelector('.password-match-error');
		if (passwordError) {
			passwordError.remove();
		}

		// Убираем классы ошибки с полей паролей (если они есть)
		const password1 = document.getElementById('password1');
		const password2 = document.getElementById('password2');

		if (password1) {
			password1.classList.remove('_form-error');
			password1.parentElement.classList.remove('_form-error');
		}
		if (password2) {
			password2.classList.remove('_form-error');
			password2.parentElement.classList.remove('_form-error');
		}
	},

	addError(formRequiredItem) {
		formRequiredItem.classList.add('_form-error');
		document.documentElement.classList.add('_form-error');
		formRequiredItem.parentElement.classList.add('_form-error');
		let inputError = formRequiredItem.parentElement.querySelector('.form__error');
		if (inputError) formRequiredItem.parentElement.removeChild(inputError);
		if (formRequiredItem.dataset.error) {
			formRequiredItem.parentElement.insertAdjacentHTML('beforeend', `<div class="form__error">${formRequiredItem.dataset.error}</div>`);
		}
	},

	removeError(formRequiredItem) {
		document.documentElement.classList.remove('_form-error');
		formRequiredItem.classList.remove('_form-error');
		formRequiredItem.parentElement.classList.remove('_form-error');
		if (formRequiredItem.parentElement.querySelector('.form__error')) {
			formRequiredItem.parentElement.removeChild(formRequiredItem.parentElement.querySelector('.form__error'));
		}
	},

	formClean(form) {
		form.reset();
		setTimeout(() => {
			let inputs = form.querySelectorAll('input,textarea');
			for (let index = 0; index < inputs.length; index++) {
				const el = inputs[index];
				el.parentElement.classList.remove('_form-focus');
				el.classList.remove('_form-focus');
				formValidate.removeError(el);
			}

			// Очищаем ошибки паролей
			this.removePasswordError();

			let checkboxes = form.querySelectorAll('.checkbox__input');
			if (checkboxes.length > 0) {
				for (let index = 0; index < checkboxes.length; index++) {
					const checkbox = checkboxes[index];
					checkbox.checked = false;
				}
			}
			if (flsModules.select) {
				let selects = form.querySelectorAll('.select');
				if (selects.length) {
					for (let index = 0; index < selects.length; index++) {
						const select = selects[index].querySelector('select');
						flsModules.select.selectBuild(select);
					}
				}
			}
		}, 0);
	},

	emailTest(formRequiredItem) {
		return !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,8})+$/.test(formRequiredItem.value);
	}
}

/* Отправка форм */
export function formSubmit(options = { validate: true }) {
	const forms = document.forms;
	if (forms.length) {
		for (const form of forms) {
			form.addEventListener('submit', function (e) {
				const form = e.target;
				formSubmitAction(form, e);
			});
			form.addEventListener('reset', function (e) {
				const form = e.target;
				formValidate.formClean(form);
			});
		}
	}
	async function formSubmitAction(form, e) {
		const error = !form.hasAttribute('data-no-validate') ? formValidate.getErrors(form) : 0;
		if (error === 0) {
			const ajax = form.hasAttribute('data-ajax');
			if (ajax) {
				e.preventDefault();
				form.classList.add('_sending');

				try {
					const response = await fetch(form.action || '#', {
						method: form.method || 'POST',
						body: new FormData(form),
						headers: {
							'X-Requested-With': 'XMLHttpRequest'
						}
					});

					if (!response.ok) throw new Error('Network response error');

					const contentType = response.headers.get('content-type');
					let result;

					if (contentType && contentType.includes('application/json')) {
						result = await response.json();
					} else {
						// Читаем текст ответа для не-JSON ответов
						const text = await response.text();
						try {
							result = JSON.parse(text); // Попытка распарсить как JSON
						} catch {
							result = { success: false, message: 'Неверный формат ответа' };
						}
					}

					form.classList.remove('_sending');

					if (result.success) {
						formSent(form, result);
					} else {
						throw new Error(result.message || 'Ошибка сервера');
					}

				} catch (err) {
					console.error('Form submit error:', err);
					form.classList.remove('_sending');
					alert(`Ошибка отправки: ${err.message}`);
				}
			}
		} else {
			e.preventDefault();
			const firstError = form.querySelector('._form-error');
			if (firstError) {
				firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
			}
		}
	}
	// Действия после отправки формы
	function formSent(form, responseResult = ``) {
		// Создаем событие отправки формы
		document.dispatchEvent(new CustomEvent("formSent", {
			detail: {
				form: form
			}
		}));
		// Показываем попап, если подключен модуль попапов 
		// и для формы указана настройка
		setTimeout(() => {
			if (flsModules.popup) {
				const popup = form.dataset.popupMessage;
				popup ? flsModules.popup.open(popup) : null;
			}
		}, 0);
		// Очищаем форму
		formValidate.formClean(form);
		// Сообщаем в консоль
		formLogging(`Форма отправлена!`);
	}
	function formLogging(message) {
		FLS(`[Формы]: ${message}`);
	}
}

// Дополнительная функция для проверки паролей при вводе (опционально)
function initPasswordValidation() {
	const password1 = document.getElementById('password1');
	const password2 = document.getElementById('password2');

	if (password1 && password2) {
		// Проверка при вводе (с задержкой для производительности)
		let timeout;
		const validateWithDelay = () => {
			clearTimeout(timeout);
			timeout = setTimeout(() => {
				formValidate.validatePasswords(document.querySelector('form'));
			}, 500);
		};

		password1.addEventListener('input', validateWithDelay);
		password2.addEventListener('input', validateWithDelay);
	}
}

initPasswordValidation();

/* Модуь формы "колличество" */
export function formQuantity() {
	document.addEventListener("click", function (e) {
		let targetElement = e.target;
		if (targetElement.closest('.quantity__button')) {
			let value = parseInt(targetElement.closest('.quantity').querySelector('input').value);
			if (targetElement.classList.contains('quantity__button_plus')) {
				value++;
			} else {
				--value;
				if (value < 1) value = 1;
			}
			targetElement.closest('.quantity').querySelector('input').value = value;
		}
	});
}

//Звездный рейтинг
function formRating() {
	const ratings = document.querySelectorAll('.rating');
	if (ratings.length > 0) {
		initRatings();
	}
	// Основная функция
	function initRatings() {
		// "Бегаем" по всем рейтингам на странице
		for (let index = 0; index < ratings.length; index++) {
			const rating = ratings[index];
			initRating(rating);
		}
	}

	// Инициализируем конкретный рейтинг
	function initRating(rating) {
		const ratingActive = rating.querySelector('.rating__activeline');
		const ratingValue = rating.querySelector('.rating-input');

		// Проверка наличия элементов
		if (!ratingActive || !ratingValue) {
			console.warn('Rating elements not found');
			return;
		}

		setRatingActiveWidth(ratingActive, ratingValue);

		if (rating.classList.contains('rating_set')) {
			setRating(rating, ratingActive, ratingValue);
		}
	}

	// Изменяем ширину активных звезд
	function setRatingActiveWidth(ratingActive, ratingValue) {
		const ratingActiveWidth = ratingValue.value / 0.05;
		ratingActive.style.width = `${ratingActiveWidth}%`;
	}

	// Возможность указать оценку 
	function setRating(rating, ratingActive, ratingValue) {
		const ratingItems = rating.querySelectorAll('.rating__star');

		// Событие изменения инпута
		ratingValue.addEventListener('change', function () {
			setRatingActiveWidth(ratingActive, ratingValue);
		});

		for (let index = 0; index < ratingItems.length; index++) {
			const ratingItem = ratingItems[index];
			ratingItem.addEventListener("mouseenter", function (e) {
				// Обновление активных звезд при наведении
				setRatingActiveWidth(ratingItem.value, ratingValue);
			});
			ratingItem.addEventListener("mouseleave", function (e) {
				// Возврат к сохраненному значению
				setRatingActiveWidth(ratingActive, ratingValue);
			});
			ratingItem.addEventListener("click", function (e) {
				if (rating.dataset.ajax) {
					// "Отправить" на сервер
					setRatingValue(ratingItem.value, rating, ratingActive, ratingValue);
				} else {
					// Отобразить указанную оценку
					ratingValue.value = index + 1;
					setRatingActiveWidth(ratingActive, ratingValue);
				}
			});
		}
	}

	async function setRatingValue(value, rating, ratingActive, ratingValue) {
		if (!rating.classList.contains('rating_sending')) {
			rating.classList.add('rating_sending');

			// Отправка данных (value) на сервер
			let response = await fetch('rating.json', {
				method: 'GET',
				//body: JSON.stringify({
				//	userRating: value
				//}),
				//headers: {
				//	'content-type': 'application/json'
				//}
			});

			if (response.ok) {
				const result = await response.json();
				// Получаем новый рейтинг
				const newRating = result.newRating;
				// Вывод нового среднего результата
				ratingValue.value = newRating;
				// Обновление активных звезд
				setRatingActiveWidth(ratingActive, ratingValue);
				rating.classList.remove('rating_sending');
			} else {
				alert("Ошибка");
				rating.classList.remove('rating_sending');
			}
		}
	}
}

formRating();

//Звездный рейтинг
function formRating2() {
	const ratings2 = document.querySelectorAll('[data-rating]');
	console.log('Найдено элементов с data-rating:', ratings2.length);

	ratings2.forEach((rating, ratingIndex) => {
		const ratingSize = +rating.dataset.ratingSize || 5;
		const ratingValue = +rating.dataset.ratingValue || 0;

		console.log(`Рейтинг ${ratingIndex + 1}:`, {
			size: ratingSize,
			value: ratingValue,
			hasItems: !!rating.querySelector('.rating2__items')
		});

		if (!rating.querySelector('.rating2__items')) {
			console.log(`Создаем звезды для рейтинга ${ratingIndex + 1}`);
			formRatingInit(rating, ratingSize);
		}

		if (ratingValue > 0) {
			console.log(`Устанавливаем начальное значение: ${ratingValue}`);
			formRatingSet(rating, ratingValue);
			rating.dataset.currentRating = ratingValue;
		}

		const items = rating.querySelectorAll('.rating2__item');
		console.log(`Найдено звезд: ${items.length}`);

		// Обработчик наведения
		items.forEach((item, index) => {
			item.addEventListener('mouseenter', function (e) {
				console.log(`🟡 Наведение на звезду ${index + 1}`);
				console.log(`   - Текущий выбранный рейтинг: ${rating.dataset.currentRating || 0}`);

				// Убираем все активные классы
				items.forEach(el => el.classList.remove('rating2__item--active'));

				// Добавляем активные классы всем звездам до текущей включительно
				for (let i = 0; i <= index; i++) {
					items[i].classList.add('rating2__item--active');
					console.log(`   - Звезда ${i + 1} стала активной`);
				}
			});

			// Клик для выбора
			item.addEventListener('click', function (e) {
				const value = index + 1;
				console.log(`🔴 КЛИК на звезду ${value}`);
				console.log(`   - Предыдущий выбранный рейтинг: ${rating.dataset.currentRating || 0}`);

				rating.dataset.currentRating = value;
				formRatingSet(rating, value);

				console.log(`   - Новый выбранный рейтинг: ${value}`);
				console.log(`   - Все звезды:`, getStarsState(rating));
			});
		});

		// Возврат к выбранному значению при уходе мыши
		rating.addEventListener('mouseleave', function () {
			const currentValue = +rating.dataset.currentRating || 0;
			console.log(`⬅️ Уход мыши с рейтинга, возвращаем к ${currentValue}`);
			formRatingSet(rating, currentValue);
			console.log(`   - Состояние звезд:`, getStarsState(rating));
		});
	});

	function formRatingInit(rating, ratingSize) {
		let ratingItems = `<div class="rating2__items">`;
		for (let index = 0; index < ratingSize; index++) {
			ratingItems += `
                <label class="rating2__item">
                    <input class="rating2__input" type="radio" name="rating" value="${index + 1}">
                </label>`;
		}
		ratingItems += `</div>`;
		rating.insertAdjacentHTML("beforeend", ratingItems);
		console.log(`   - Создано ${ratingSize} звезд`);
	}

	function formRatingSet(rating, value) {
		const ratingItems = rating.querySelectorAll('.rating2__item');
		const resultFullItems = parseInt(value);

		console.log(`   - Устанавливаем рейтинг ${value}, активных звезд: ${resultFullItems}`);

		ratingItems.forEach((ratingItem, index) => {
			ratingItem.classList.remove('rating2__item--active');

			if (index < resultFullItems) {
				ratingItem.classList.add('rating2__item--active');
			}

			const input = ratingItem.querySelector('.rating2__input');
			if (input && index + 1 === resultFullItems) {
				input.checked = true;
				console.log(`   - Радиокнопка ${index + 1} отмечена`);
			} else if (input) {
				input.checked = false;
			}
		});

		if (rating.hasAttribute('data-rating-title')) {
			rating.title = `Рейтинг: ${value}`;
		}
	}

	function getStarsState(rating) {
		const items = rating.querySelectorAll('.rating2__item');
		const state = [];
		items.forEach((item, index) => {
			state.push({
				star: index + 1,
				hasActive: item.classList.contains('rating2__item--active')
			});
		});
		return state;
	}
}

// Запускаем
formRating2();

// Добавляем глобальный логгер для отслеживания всех кликов на странице
document.addEventListener('click', function (e) {
	if (e.target.closest('.rating2__item')) {
		console.log('🌐 Глобальный клик на элементе рейтинга');
	}
});
/*
function formRating2() {
	const ratings2 = document.querySelectorAll('[data-rating]');
	if (ratings2) {
		ratings2.forEach(rating => {
			const ratingValue = +rating.dataset.ratingValue;
			const ratingSize = +rating.dataset.ratingSize ? +rating.dataset.ratingSize : 5;
			formRatingInit(rating, ratingSize);
			ratingValue ? formRatingSet(rating, ratingValue) : null;
			document.addEventListener('click', formRatingAction);
		});
	}

	function formRatingAction(e) {
		const targetElement = e.target;
		if (targetElement.closest('.rating2__input')) {
			const currentElement = targetElement.closest('.rating2__input');
			const ratingValue = +currentElement.value;
			const rating = currentElement.closest('.rating2');
			const ratingSet = rating.dataset.rating === 'set';
			ratingSet ? formRatingGet(rating, ratingValue) : null;
		}
	}

	function formRatingInit(rating, ratingSize) {
		let ratingItems = ``;
		for (let index = 0; index < ratingSize; index++) {
			index === 0 ? ratingItems += `<div class="rating2__items">` : null;
			ratingItems += `
				<label class="rating2__item">
					<input class="rating2__input" type="radio" name="rating" value="${index + 1}">
				</label>`;
			index === ratingSize ? ratingItems += `</div">` : null;
		}
		rating.insertAdjacentHTML("beforeend", ratingItems);
	}

	function formRatingGet(rating, ratingValue) {
		const resultRating = ratingValue;
		formRatingSet(rating, resultRating);
	}

	function formRatingSet(rating, value) {
		const ratingItems = rating.querySelectorAll('.rating2__item');
		const resultFullItems = parseInt(value);
		const resultPartItem = value - resultFullItems;

		rating.hasAttribute('data-rating-title') ? rating.title = value : null;

		ratingItems.forEach((ratingItem, index) => {
			ratingItem.classList.remove('rating2__item--active');
			ratingItem.querySelector('span') ? ratingItems[index].querySelector('span').remove() : null;

			if (index <= (resultFullItems - 1)) {
				ratingItem.classList.add('rating2__item--active');
			}
			if (index === resultFullItems && resultPartItem) {
				ratingItem.insertAdjacentHTML("beforeend", `<span style="width:${resultPartItem * 100}%"></span>`);
			}
		});
	}

	function formRatingSend() {
	}
}
formRating2();*/