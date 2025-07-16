const spollerTitles = document.querySelectorAll('.main-home__title');

if (spollerTitles) {
    spollerTitles.forEach(title => {
        title.addEventListener("click", function (e) {
            let parent = e.target.parentNode;
            parent.classList.toggle('_spoller-active')
        });
    });
}

//========================================================================================================================================================

// Контейнер со всеми видео
const videosWrap = document.querySelector('.videos');

// Обработчик клика
if (videosWrap) {
    const videoEventHandler = (e) => {
        // Если у e.target нет класа video, значит данный элемент не является видео
        if (!e.target.classList.contains('video')) return false;
        const video = e.target,
            allVideos = document.querySelectorAll('.video');

        const overlay = document.querySelectorAll('.play');

        // Останавливаем все видео
        allVideos.forEach((source, index) => {
            if (source === video) return;
            source.classList.remove('isPlaying');
            source.pause();
        })
        // Если у видео есть класс isPlaying - тогда остановить его, если нет - запустить
        if (video.classList.contains('isPlaying')) {
            if (overlay) {
                video.closest('div').querySelector('.play').classList.remove('_active');
            }
            video.pause()
        } else {
            if (overlay) {
                video.closest('div').querySelector('.play').classList.add('_active');
            }
            video.play()
        }
        video.classList.toggle('isPlaying')
    }
    // Event listener на контейнер со всеми видео
    videosWrap.addEventListener('click', (e) => videoEventHandler(e))
}

document.addEventListener("DOMContentLoaded", function () {
    var lazyVideos = [].slice.call(document.querySelectorAll("video.lazy"));

    if ("IntersectionObserver" in window) {
        var lazyVideoObserver = new IntersectionObserver(function (entries, observer) {
            entries.forEach(function (video) {
                if (video.isIntersecting) {
                    for (var source in video.target.children) {
                        var videoSource = video.target.children[source];
                        if (typeof videoSource.tagName === "string" && videoSource.tagName === "SOURCE") {
                            videoSource.src = videoSource.dataset.src;
                        }
                    }

                    video.target.load();
                    video.target.classList.remove("lazy");
                    lazyVideoObserver.unobserve(video.target);
                }
            });
        });

        lazyVideos.forEach(function (lazyVideo) {
            lazyVideoObserver.observe(lazyVideo);
        });
    }
});

//========================================================================================================================================================

//Фильтр

const filterContainers = document.querySelectorAll(".filter");

if (filterContainers) {
    filterContainers.forEach((filterContainer) => {
        initFilters(filterContainer);
    });

    function initFilters(container) {
        const buttonsSelector = ".filter__navigation [data-filter]";
        const checkboxSelector = ".filter__checkboxes";
        const itemSelector = ".filter-content .filter-column";
        const itemHiddenClass = "_hide";
        const itemCheckboxHiddenClass = "_hidden-checkbox";
        const itemFilterClassPrefix = "filter__column_";
        const selectFilterClassPrefix = "filter-select_";
        const buttonActiveClass = "_active";
        const filterReset = container.querySelector(".filter-reset span");

        // Получаем ID врача из URL
        function getDoctorFromURL() {
            const params = new URLSearchParams(window.location.search || window.location.hash.split('?')[1]);
            return params.get('doctor');
        }

        // Удаляем параметр doctor из URL
        function removeDoctorParamFromURL() {
            const url = new URL(window.location);
            url.searchParams.delete('doctor');
            window.history.replaceState(null, '', url.toString());
        }

        // Сброс активных состояний кнопок
        function resetNavigationButtons() {
            container.querySelectorAll(buttonsSelector).forEach((button) => {
                button.classList.remove(buttonActiveClass);
            });
        }

        // Сброс чекбоксов
        function resetCheckboxes() {
            container.querySelectorAll(`${checkboxSelector} input[type="checkbox"]`).forEach((checkbox) => {
                checkbox.checked = false;
            });
        }

        // Сброс селектов
        function resetSelects() {
            const selectOptions = container.querySelectorAll(".filter__select .select__option");
            const selectInput = container.querySelector(".filter__select .select__input");

            selectOptions.forEach((option) => {
                option.classList.remove("_active");
            });

            const allOption = container.querySelector('.filter__select .select__option[href="/results/"]');
            if (allOption) {
                allOption.classList.add("_active");
                if (selectInput) {
                    selectInput.value = allOption.querySelector(".select__option-text").textContent;
                }
            }
        }

        // Инициализация активной кнопки
        function initializeActiveButton() {
            const allButton = container.querySelector(`${buttonsSelector}[data-filter="all"]`);
            if (allButton) {
                resetNavigationButtons();
                allButton.classList.add(buttonActiveClass);
            }
        }

        // Сброс всех фильтров
        function resetAllFilters() {
            container.querySelectorAll(itemSelector).forEach((item) => {
                item.classList.remove(itemHiddenClass, itemCheckboxHiddenClass);
            });
            resetNavigationButtons();
            resetCheckboxes();
            resetSelects();
            initializeActiveButton();
            localStorage.removeItem("selectedFilterText");
            localStorage.removeItem("selectedFilterValue");
            removeDoctorParamFromURL();
        }

        // Обновление состояния селекта
        function updateSelectState(optionElement, text, value) {
            container.querySelectorAll(".filter__select .select__option").forEach((opt) => {
                opt.classList.remove("_active");
            });

            if (optionElement) optionElement.classList.add("_active");

            const selectInput = container.querySelector(".filter__select .select__input");
            if (selectInput) {
                selectInput.value = text || "Все специалисты";
            }

            localStorage.setItem("selectedFilterText", text || "Все специалисты");
            localStorage.setItem("selectedFilterValue", value || "all");
        }

        // Применение фильтра по ID врача
        function applySelectFilter(filterValue) {
            container.querySelectorAll(itemSelector).forEach((item) => {
                const isMatchBySelect =
                    filterValue === "all" ||
                    item.classList.contains(selectFilterClassPrefix + filterValue);

                // Удаляем оба класса скрытия
                item.classList.remove(itemHiddenClass, itemCheckboxHiddenClass);
                // Добавляем класс скрытия, если элемент не соответствует фильтру
                item.classList.toggle(itemCheckboxHiddenClass, !isMatchBySelect);
            });
        }

        // Обработчик выбора врача из селекта
        const selectOptions = container.querySelectorAll(".filter__select .select__option");
        if (selectOptions.length > 0) {
            selectOptions.forEach((option) => {
                option.addEventListener("click", (e) => {

                    resetCheckboxes();
                    resetNavigationButtons();

                    // Извлекаем ID из href
                    const href = option.getAttribute("href") || "";
                    const match = href.match(/[?&]doctor=([^&]+)/);
                    const filterValue = match ? match[1] : "all";
                    const selectedText = option.querySelector(".select__option-text").textContent;

                    updateSelectState(option, selectedText, filterValue);

                    // Обновляем URL
                    const newUrl = filterValue === "all"
                        ? "/results/"
                        : `?doctor=${filterValue}`;
                    window.history.pushState(null, '', newUrl);

                    applySelectFilter(filterValue);
                });
            });
        }

        // Обработчик чекбоксов
        container.querySelectorAll(`${checkboxSelector} input[type="checkbox"]`).forEach((checkbox) => {
            checkbox.addEventListener("change", onCheckboxChange);
        });

        function onCheckboxChange(event) {
            if (event.isTrusted) {
                resetNavigationButtons();
                resetSelects();
            }

            const selectedDoctors = Array.from(
                container.querySelectorAll(`${checkboxSelector} input[type="checkbox"]:checked`),
                (checkbox) => checkbox.dataset.filter
            );

            container.querySelectorAll(itemSelector).forEach((item) => {
                const doctorTypes = (item.dataset.doctor || "").split("-");
                const isMatchByDoctor =
                    selectedDoctors.length === 0 ||
                    selectedDoctors.some((selectedDoctor) => doctorTypes.includes(selectedDoctor));

                // Удаляем `_hide`, но оставляем `_hidden-checkbox`
                item.classList.remove(itemHiddenClass);
                // Добавляем `_hidden-checkbox` только при фильтрации через чекбоксы
                item.classList.toggle(itemCheckboxHiddenClass, !isMatchByDoctor);
            });
        }

        // Сброс фильтров
        if (filterReset) {
            filterReset.addEventListener("click", (e) => {
                e.preventDefault();
                resetAllFilters();
            });
        }

        // Инициализация чекбоксов
        setTimeout(() => {
            container.querySelectorAll(`${checkboxSelector} input[type="checkbox"]`).forEach((checkbox) => {
                const event = new Event("change", { bubbles: true });
                checkbox.dispatchEvent(event);
            });
        }, 0);

        // Обработчики кнопок фильтрации
        container.querySelectorAll(".filter__title").forEach((titleButton) => {
            if (titleButton === filterReset) return;

            titleButton.addEventListener("click", (e) => {
                const filterValue = titleButton.dataset.filter;

                resetCheckboxes();
                resetSelects();

                resetNavigationButtons();
                titleButton.classList.add(buttonActiveClass);

                container.querySelectorAll(itemSelector).forEach((item) => {
                    const isMatchByFilter =
                        filterValue === "all" ||
                        item.classList.contains(itemFilterClassPrefix + filterValue);

                    item.classList.remove(itemHiddenClass, itemCheckboxHiddenClass);
                    item.classList.toggle(itemHiddenClass, !isMatchByFilter);
                });
            });
        });

        // Инициализация селекта
        function initializeSelect() {
            const urlDoctor = getDoctorFromURL();
            const savedFilterText = localStorage.getItem("selectedFilterText");
            const savedFilterValue = localStorage.getItem("selectedFilterValue");

            // Приоритет: URL > localStorage > default
            if (urlDoctor) {
                // Ищем опцию с href*="doctor=${urlDoctor}"
                const savedOption = container.querySelector(
                    `.filter__select .select__option[href*="doctor=${urlDoctor}"]`
                );
                if (savedOption) {
                    const text = savedOption.querySelector(".select__option-text").textContent;
                    updateSelectState(savedOption, text, urlDoctor);
                    applySelectFilter(urlDoctor);
                }
            } else if (savedFilterValue && savedFilterText) {
                const savedOption = container.querySelector(
                    `.filter__select .select__option[href*="doctor=${savedFilterValue}"]`
                );
                if (savedOption) {
                    const text = savedOption.querySelector(".select__option-text").textContent;
                    updateSelectState(savedOption, text, savedFilterValue);
                    applySelectFilter(savedFilterValue);
                }
            } else {
                const allOption = container.querySelector('.filter__select .select__option[href="/results/"]');
                if (allOption) {
                    const text = allOption.querySelector(".select__option-text").textContent;
                    updateSelectState(allOption, text, "all");
                }
            }
        }

        // Инициализация при загрузке
        initializeActiveButton();
        initializeSelect();
    }
}

//========================================================================================================================================================

const schemeIcons = document.querySelectorAll('.image-scheme-tabs__icon');
let schemeCloses = document.querySelectorAll('.image-scheme-tabs__icon-close');

if (schemeIcons) {
    schemeIcons.forEach(icon => {
        icon.addEventListener("click", function (e) {
            let parent = e.target.parentNode;
            let activeIcon = document.querySelector('.image-scheme-tabs__icons._active');
            if (activeIcon) {
                activeIcon.classList.remove('_active');
            }
            parent.classList.add('_active')
        });
        schemeCloses.forEach(close => {
            close.addEventListener("click", function (e) {
                let activeIcon = document.querySelector('.image-scheme-tabs__icons._active');
                if (activeIcon) {
                    activeIcon.classList.remove('_active');
                }
            });
        });
    });
}

//========================================================================================================================================================

const showmoreButtons = document.querySelectorAll('.result-popup__showmore-button');

if (showmoreButtons) {
    showmoreButtons.forEach(button => {
        button.addEventListener("click", function (e) {
            this.parentNode.classList.toggle('_showmore-active')
        });
    });
}

//========================================================================================================================================================

// Селекторы
const searchInput = document.querySelector('.list-tabs__search input');
const containerSelector = '.spollers__item';
const columnSelector = '.list-tabs__column';
const buttonSelector = `${containerSelector} .spollers__title`;
const activeClass = '_spoller-active';

if (containerSelector) {
    // Функция для проверки соответствия элемента поисковому запросу
    function isMatch(element, query) {
        // Извлекаем только буквы из текста элемента
        const textContent = element.textContent.toLowerCase().replace(/[^а-яёa-z]/gi, '');
        // Извлекаем только буквы из запроса
        const queryText = query.toLowerCase().replace(/[^а-яёa-z]/gi, '');

        return textContent.includes(queryText);
    }

    // Функция для сохранения состояния в localStorage
    function saveState(container) {
        const id = container.getAttribute('data-id'); // Добавим data-id к каждому спойлеру
        if (id) {
            if (container.classList.contains(activeClass)) {
                localStorage.setItem(`spoller-state-${id}`, 'open');
            } else {
                localStorage.removeItem(`spoller-state-${id}`);
            }
        }
    }

    // Функция для восстановления состояния из localStorage
    function restoreState() {
        document.querySelectorAll(containerSelector).forEach(container => {
            const id = container.getAttribute('data-id');
            if (id && localStorage.getItem(`spoller-state-${id}`) === 'open') {
                container.classList.add(activeClass);
                const body = container.querySelector('.spollers__body');
                if (body) {
                    body.hidden = false;
                }
            }
        });
    }

    // Функция для проверки видимости всех элементов внутри колонки
    function checkColumnVisibility(column) {
        const items = column.querySelectorAll(containerSelector);
        const allHidden = Array.from(items).every(item => item.style.display === 'none');
        column.style.display = allHidden ? 'none' : '';
    }

    // Закрываем все спойлеры при загрузке страницы
    document.querySelectorAll(containerSelector).forEach(container => {
        container.classList.remove(activeClass); // Удаляем активный класс
        const body = container.querySelector('.spollers__body');
        if (body) {
            body.hidden = true; // Скрываем содержимое
        }
    });

    // Восстанавливаем состояние из localStorage
    restoreState();

    // Проверяем видимость колонок после загрузки
    document.querySelectorAll(columnSelector).forEach(column => {
        checkColumnVisibility(column);
    });

    // Обработчик события ввода в поле поиска
    if (searchInput) {
        searchInput.addEventListener('input', function () {
            const query = this.value.trim(); // Получаем текущий поисковый запрос
            const containers = document.querySelectorAll(containerSelector);

            containers.forEach(container => {
                const title = container.querySelector(buttonSelector);
                const body = container.querySelector('.spollers__body');

                if (query) {
                    // Если есть запрос - проверяем совпадение
                    if (isMatch(container, query)) {
                        container.style.display = ''; // Показываем элемент
                        if (!container.classList.contains(activeClass)) {
                            container.classList.add(activeClass); // Открываем спойлер
                            if (body) {
                                body.hidden = false; // Показываем содержимое
                            }
                        }
                    } else {
                        container.style.display = 'none'; // Скрываем элемент
                        if (container.classList.contains(activeClass)) {
                            container.classList.remove(activeClass); // Закрываем спойлер
                            if (body) {
                                body.hidden = true; // Скрываем содержимое
                            }
                        }
                    }
                } else {
                    // Если запрос пустой - закрываем все спойлеры
                    container.style.display = ''; // Показываем элемент
                    if (container.classList.contains(activeClass)) {
                        container.classList.remove(activeClass); // Убираем активный класс
                        if (body) {
                            body.hidden = true; // Скрываем содержимое
                        }
                    }
                }
                saveState(container); // Сохраняем состояние
            });

            // Проверяем видимость колонок
            document.querySelectorAll(columnSelector).forEach(column => {
                checkColumnVisibility(column);
            });
        });
    }

    // Обработчик клика для открытия/закрытия спойлеров
    document.addEventListener('click', e => {
        const button = e.target.closest(buttonSelector);
        if (button) {
            const container = button.closest(containerSelector);
            const body = container.querySelector('.spollers__body');

            // Переключаем класс активности
            container.classList.toggle(activeClass);
            if (body) {
                body.hidden = !container.classList.contains(activeClass);
            }
            saveState(container); // Сохраняем состояние
        }
    });
}


const containerMenuSelector = '.spollers-menu__item';
const buttonMenuSelector = `${containerMenuSelector} .spollers-menu__title > span`;
const activeMenuClass = '_spoller-active';

if (containerMenuSelector) {
    document.addEventListener('click', e => {
        const button = e.target.closest(buttonMenuSelector);
        if (button) {
            document.querySelectorAll(containerMenuSelector).forEach(function (n) {
                n.classList[n === this ? 'toggle' : 'remove'](activeMenuClass);
            }, button.closest(containerMenuSelector));
        }
    });
}

//========================================================================================================================================================

//Оплата онлайн
const paymentOnline = document.querySelector('.payment-online__body');
if (paymentOnline) {
    const buttonPrevStep = document.querySelector('.payment-button-prev');
    const buttonNextStep = document.querySelector('.payment-button-next');
    const buttonSubmit = document.querySelector('.button-submit');
    const steps = document.querySelectorAll(".payment-online__step");
    const stepsLine = document.querySelectorAll(".top-payment-online__step");

    const formsOptions = document.querySelector('.forms__options');
    const consultationOptions = document.querySelector('.consultation-options');

    // Инициализация состояния
    let currentStep = 0;
    let selectedPrice = 0;
    let isPrepayment = false;

    // Инициализация выбранных значений
    document.querySelectorAll('.teams__slide').forEach(slide => {
        if (slide.querySelector('input:checked')) {
            selectedPrice = parseInt(slide.dataset.price) || 0;
            slide.classList.add('_active');
        }
    });

    // Форматирование суммы
    function formatPrice(value) {
        return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' ₽';
    }

    // Обновление отображения сумм
    function updateTotalDisplay() {
        const consultationTotal = document.querySelector('.total-consultation span');
        const prepaymentInput = document.querySelector('.prepayment-input');

        if (isPrepayment) {
            // Если выбрана предоплата, очищаем инпут и делаем его доступным для ручного ввода
            prepaymentInput.value = '';
            document.querySelector('.total-prepayment').classList.remove("_hidden");
            document.querySelector('.total-consultation').classList.add("_hidden");
        } else {
            // Если выбрана консультация, подставляем цену в оба места
            consultationTotal.textContent = formatPrice(selectedPrice);
            prepaymentInput.value = selectedPrice; // Подставляем цену в инпут без форматирования
            document.querySelector('.total-consultation').classList.remove("_hidden");
            document.querySelector('.total-prepayment').classList.add("_hidden");
        }
    }

    // Выбор типа оплаты
    document.querySelectorAll('.consultation-options, .prepayment-option').forEach(input => {
        input.addEventListener('change', () => {
            isPrepayment = input.classList.contains('prepayment-option');
            // Обновляем отображение сумм
            updateTotalDisplay();
        });
    });

    // Установка значения prepayment-input при инициализации
    const prepaymentInput = document.querySelector('.prepayment-input');
    if (prepaymentInput) {
        prepaymentInput.value = selectedPrice;
    }

    // Выбор врача
    document.querySelectorAll('.teams__slide').forEach(slide => {
        slide.addEventListener('click', () => {
            // Обновляем selectedPrice на основе data-price выбранного врача
            selectedPrice = parseInt(slide.dataset.price) || 0;

            // Удаляем активный класс у всех слайдов и добавляем его к текущему
            document.querySelectorAll('.teams__slide').forEach(s => s.classList.remove('_active'));
            slide.classList.add('_active');

            // Обновляем отображение сумм
            if (currentStep === 2) updateTotalDisplay();
        });
    });

    // Инициализация отображения сумм при загрузке страницы
    updateTotalDisplay();

    // Логика шагов
    buttonNextStep.addEventListener('click', () => {
        hideStep(currentStep);
        currentStep++;
        showStep(currentStep);
        updateProgressLine();
    });

    buttonPrevStep.addEventListener('click', () => {
        hideStep(currentStep);
        currentStep--;
        showStep(currentStep);
        updateProgressLine();
    });

    // Обработка кликов на шаги прогресс-бара
    stepsLine.forEach((step, index) => {
        step.addEventListener('click', () => {
            // Разрешаем переход только на предыдущие или текущий + 1 шаг
            if (index <= currentStep || index === currentStep + 1) {
                hideStep(currentStep);
                currentStep = index;
                showStep(currentStep);
                updateProgressLine();
            }
        });
    });

    function showStep(index) {
        steps[index].classList.add('_active');
        updateNavigation();

        // При переходе на третий шаг
        if (index === 2) {
            updateTotalDisplay();
            // Показываем/скрываем опции в зависимости от выбора
            formsOptions.style.display = consultationOptions.checked ? 'block' : 'none';
        }

        // Обновляем прогресс-бар
        updateProgressLine();
    }

    function hideStep(index) {
        steps[index].classList.remove('_active');
    }

    function updateNavigation() {
        buttonPrevStep.style.display = currentStep === 0 ? 'none' : 'flex';
        buttonNextStep.style.display = currentStep === steps.length - 1 ? 'none' : 'flex';
        buttonSubmit.style.display = currentStep === steps.length - 1 ? 'flex' : 'none';

        if (currentStep === steps.length - 1) {
            buttonPrevStep.classList.add('_active-last');
        } else {
            buttonPrevStep.classList.remove('_active-last');
        }

        // Обновляем активность шагов в прогресс-баре
        updateProgressLine();
    }

    function updateProgressLine() {
        stepsLine.forEach((step, index) => {
            step.classList.toggle('_active', index === currentStep);
            step.classList.toggle('_completed', index < currentStep);

            // Если это последний шаг, отмечаем его как завершенный
            if (index === stepsLine.length - 1 && currentStep === steps.length - 1) {
                step.classList.add('_active');
            }
        });
    }

    // Валидация формы перед отправкой
    document.querySelector('.payment-online__body').addEventListener('submit', function (e) {
        const prepaymentInput = document.querySelector('.prepayment-input');

        if (isPrepayment) {
            // Для предоплаты проверяем, что значение введено
            if (!prepaymentInput.value || parseFloat(prepaymentInput.value) <= 0) {
                e.preventDefault();
                alert('Введите сумму предоплаты');
            }
        } else {
            // Для консультации проверяем, что значение установлено
            if (!prepaymentInput.value) {
                e.preventDefault();
                alert('Ошибка: не установлена стоимость консультации');
            }
        }
    });

    // Инициализация слайдера
    const teamsSlider = document.querySelector('.payment-online__teams');
    if (teamsSlider) {
        teamsSlider.addEventListener('change', function () {
            document.querySelectorAll('.forms-options__items').forEach(item => {
                item.classList.toggle('_active',
                    Array.from(this.querySelectorAll(':checked'), n => n.dataset.filter)
                        .includes(item.dataset.doctor)
                );
            });
        });
        teamsSlider.dispatchEvent(new Event('change'));
    }
}

//========================================================================================================================================================

//Заполненный input
const inputs = document.querySelectorAll("input");

if (inputs) {
    inputs.forEach(input => {
        input.addEventListener("input", function (e) {
            if (input.value !== '') {
                input.classList.add("filled");
            } else {
                input.classList.remove("filled");
            }
        });
    });
}

//========================================================================================================================================================

import { formValidate } from "../files/forms/forms.js";
// Блоки
const patientDetails = document.querySelector(".forms-patients-details");
const paidMyselfBlock = document.querySelector(".forms-paid-myself");
const personDetails = document.querySelector(".forms-person-details");
const additionalInfo = document.querySelector(".forms-additional-information");
const taxCheckboxBlock = document.querySelector(".forms-tax-checkbox");

// Кнопки
const nextButton = document.querySelector(".tax__button-next");
const submitButton = document.querySelector(".tax__button-submit");
const prevButton = document.querySelector(".tax__button-prev");
const cancelButton = document.querySelector(".tax__button.button");

// Чекбокс "Платил за себя"
const paidMyselfCheckbox = document.querySelector(".paid-myself");

// === Обработчик кнопки "Далее" ===
if (nextButton) {
    nextButton.addEventListener("click", function (e) {
        e.preventDefault();

        const form = document.querySelector('form'); // или уточните форму по ID, если их несколько
        const errorCount = formValidate.getErrors(form);

        if (errorCount === 0) {
            // Скрываем кнопки "Отмена" и "Далее"
            if (cancelButton) cancelButton.classList.add("hidden");
            nextButton.classList.add("hidden");

            // Показываем кнопки "Назад" и "Отправить"
            if (prevButton) prevButton.classList.remove("hidden");
            if (submitButton) submitButton.classList.remove("hidden");

            // Скрываем блок с чекбоксом "платил за себя"
            if (paidMyselfBlock) paidMyselfBlock.classList.add("hidden");

            // Убираем hidden у блока согласия
            if (taxCheckboxBlock && taxCheckboxBlock.classList.contains("hidden")) {
                taxCheckboxBlock.classList.remove("hidden");
            }

            // Логика отображения других блоков
            if (paidMyselfCheckbox && paidMyselfCheckbox.checked) {
                hide([patientDetails, personDetails]);
                show([additionalInfo]);
            } else {
                hide([patientDetails]);
                show([personDetails]);
            }
        }
    });
};

// === Обработчик кнопки "Назад" ===
if (prevButton) {
    prevButton.addEventListener("click", function (e) {
        e.preventDefault();

        // Восстанавливаем кнопки
        if (cancelButton) cancelButton.classList.remove("hidden");
        if (nextButton) nextButton.classList.remove("hidden");
        if (prevButton) prevButton.classList.add("hidden");
        if (submitButton) submitButton.classList.add("hidden");

        // Восстанавливаем блоки к начальному состоянию
        hide([additionalInfo, taxCheckboxBlock, personDetails]);
        show([patientDetails, paidMyselfBlock]);
    });
}

// === Функции показа / скрытия ===
function hide(elements) {
    elements.forEach(el => {
        if (el && !el.classList.contains("hidden")) {
            el.classList.add("hidden");
        }
    });
}

function show(elements) {
    elements.forEach(el => {
        if (el && el.classList.contains("hidden")) {
            el.classList.remove("hidden");
        }
    });
}

//========================================================================================================================================================

function indents() {
    const header = document.querySelector('.header');
    const page = document.querySelector('.main-home');

    //Оступ от шапки
    let hHeader = window.getComputedStyle(header, false).height;
    hHeader = Number(hHeader.slice(0, hHeader.length - 2));
    if (page) {
        page.style.paddingTop = hHeader + 'px';
    }

    //выпадающее меню
    const menuBody = document.querySelector('.menu__body');
    if (menuBody) {
        if (document.documentElement.clientWidth < 991.98) {
            menuBody.style.top = hHeader + 'px';
            menuBody.style.minHeight = `calc(100vh - ${hHeader}px)`;
            menuBody.style.height = `calc(100vh - ${hHeader}px)`;
        } else {
            menuBody.style.top = '0px';
            menuBody.style.minHeight = 'auto';
            menuBody.style.height = 'auto';
        }
    }

    const aboutImage = document.querySelector('.top-main-about__image');
    const aboutLine = document.querySelector('.main-about-line');
    if (aboutLine) {
        let haboutImage = window.getComputedStyle(aboutImage, false).width;
        haboutImage = Number(haboutImage.slice(0, haboutImage.length - 2));

        const aboutSum = haboutImage + 56;

        aboutLine.style.left = aboutSum + 'px';

    }

}

window.addEventListener('scroll', () => {
    indents();
});

window.addEventListener('resize', () => {
    indents();
});

indents();

// Функция анимации чисел с настраиваемой длительностью
function animateNumber(element) {
    const number = parseInt(element.getAttribute('data-number'), 10);
    const duration = 3500; // длительность анимации в миллисекундах
    const start = performance.now();

    function update(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1); // от 0 до 1
        const current = Math.floor(progress * number);

        element.textContent = current;

        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            element.textContent = number; // точное значение в конце
        }
    }

    requestAnimationFrame(update);
}
// Наблюдатель за изменениями классов у элементов
const observer = new MutationObserver(function (mutationsList) {
    for (const mutation of mutationsList) {
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
            const target = mutation.target;
            const span = target.querySelector('[data-number]');

            if (target.classList.contains('_watcher-view')) {
                // Проверяем, не была ли уже анимация запущена
                if (span && !span.dataset.animated) {
                    animateNumber(span);
                    span.dataset.animated = 'true'; // защита от повторной анимации
                }
            }
        }
    }
});
// Подписываемся на наблюдение за каждым блоком .top-main-about__number
document.querySelectorAll('.top-main-about__number').forEach(el => {
    observer.observe(el, {
        attributes: true // следим за изменениями атрибутов
    });
});