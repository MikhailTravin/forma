
const flsModules = {};
function isWebp() {
    function testWebP(callback) {
        let webP = new Image;
        webP.onload = webP.onerror = function () {
            callback(2 == webP.height);
        };
        webP.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
    }
    testWebP((function (support) {
        let className = true === support ? "webp" : "no-webp";
        document.documentElement.classList.add(className);
    }));
}
function getHash() {
    if (location.hash) return location.hash.replace("#", "");
}
function setHash(hash) {
    hash = hash ? `#${hash}` : window.location.href.split("#")[0];
    history.pushState("", "", hash);
}
let _slideUp = (target, duration = 500, showmore = 0) => {
    if (!target.classList.contains("_slide")) {
        target.classList.add("_slide");
        target.style.transitionProperty = "height, margin, padding";
        target.style.transitionDuration = duration + "ms";
        target.style.height = `${target.offsetHeight}px`;
        target.offsetHeight;
        target.style.overflow = "hidden";
        target.style.height = showmore ? `${showmore}px` : `0px`;
        target.style.paddingTop = 0;
        target.style.paddingBottom = 0;
        target.style.marginTop = 0;
        target.style.marginBottom = 0;
        window.setTimeout((() => {
            target.hidden = !showmore ? true : false;
            !showmore ? target.style.removeProperty("height") : null;
            target.style.removeProperty("padding-top");
            target.style.removeProperty("padding-bottom");
            target.style.removeProperty("margin-top");
            target.style.removeProperty("margin-bottom");
            !showmore ? target.style.removeProperty("overflow") : null;
            target.style.removeProperty("transition-duration");
            target.style.removeProperty("transition-property");
            target.classList.remove("_slide");
            document.dispatchEvent(new CustomEvent("slideUpDone", {
                detail: {
                    target
                }
            }));
        }), duration);
    }
};
let _slideDown = (target, duration = 500, showmore = 0) => {
    if (!target.classList.contains("_slide")) {
        target.classList.add("_slide");
        target.hidden = target.hidden ? false : null;
        showmore ? target.style.removeProperty("height") : null;
        let height = target.offsetHeight;
        target.style.overflow = "hidden";
        target.style.height = showmore ? `${showmore}px` : `0px`;
        target.style.paddingTop = 0;
        target.style.paddingBottom = 0;
        target.style.marginTop = 0;
        target.style.marginBottom = 0;
        target.offsetHeight;
        target.style.transitionProperty = "height, margin, padding";
        target.style.transitionDuration = duration + "ms";
        target.style.height = height + "px";
        target.style.removeProperty("padding-top");
        target.style.removeProperty("padding-bottom");
        target.style.removeProperty("margin-top");
        target.style.removeProperty("margin-bottom");
        window.setTimeout((() => {
            target.style.removeProperty("height");
            target.style.removeProperty("overflow");
            target.style.removeProperty("transition-duration");
            target.style.removeProperty("transition-property");
            target.classList.remove("_slide");
            document.dispatchEvent(new CustomEvent("slideDownDone", {
                detail: {
                    target
                }
            }));
        }), duration);
    }
};
let _slideToggle = (target, duration = 500) => {
    if (target.hidden) return _slideDown(target, duration); else return _slideUp(target, duration);
};
let bodyLockStatus = true;
let bodyLockToggle = (delay = 500) => {
    if (document.documentElement.classList.contains("lock")) bodyUnlock(delay); else bodyLock(delay);
};
let bodyUnlock = (delay = 500) => {
    let body = document.querySelector("body");
    if (bodyLockStatus) {
        let lock_padding = document.querySelectorAll("[data-lp]");
        setTimeout((() => {
            for (let index = 0; index < lock_padding.length; index++) {
                const el = lock_padding[index];
                el.style.paddingRight = "0px";
            }
            body.style.paddingRight = "0px";
            document.documentElement.classList.remove("lock");
        }), delay);
        bodyLockStatus = false;
        setTimeout((function () {
            bodyLockStatus = true;
        }), delay);
    }
};
let bodyLock = (delay = 500) => {
    let body = document.querySelector("body");
    if (bodyLockStatus) {
        let lock_padding = document.querySelectorAll("[data-lp]");
        for (let index = 0; index < lock_padding.length; index++) {
            const el = lock_padding[index];
            el.style.paddingRight = window.innerWidth - document.querySelector(".wrapper").offsetWidth + "px";
        }
        body.style.paddingRight = window.innerWidth - document.querySelector(".wrapper").offsetWidth + "px";
        document.documentElement.classList.add("lock");
        bodyLockStatus = false;
        setTimeout((function () {
            bodyLockStatus = true;
        }), delay);
    }
};
function spollers() {
    const spollersArray = document.querySelectorAll("[data-spollers]");
    if (spollersArray.length > 0) {
        const spollersRegular = Array.from(spollersArray).filter((function (item, index, self) {
            return !item.dataset.spollers.split(",")[0];
        }));
        if (spollersRegular.length) initSpollers(spollersRegular);
        let mdQueriesArray = dataMediaQueries(spollersArray, "spollers");
        if (mdQueriesArray && mdQueriesArray.length) mdQueriesArray.forEach((mdQueriesItem => {
            mdQueriesItem.matchMedia.addEventListener("change", (function () {
                initSpollers(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
            }));
            initSpollers(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
        }));
        function initSpollers(spollersArray, matchMedia = false) {
            spollersArray.forEach((spollersBlock => {
                spollersBlock = matchMedia ? spollersBlock.item : spollersBlock;
                if (matchMedia.matches || !matchMedia) {
                    spollersBlock.classList.add("_spoller-init");
                    initSpollerBody(spollersBlock);
                    spollersBlock.addEventListener("click", setSpollerAction);
                } else {
                    spollersBlock.classList.remove("_spoller-init");
                    initSpollerBody(spollersBlock, false);
                    spollersBlock.removeEventListener("click", setSpollerAction);
                }
            }));
        }
        function initSpollerBody(spollersBlock, hideSpollerBody = true) {
            let spollerTitles = spollersBlock.querySelectorAll("[data-spoller]");
            if (spollerTitles.length) {
                spollerTitles = Array.from(spollerTitles).filter((item => item.closest("[data-spollers]") === spollersBlock));
                spollerTitles.forEach((spollerTitle => {
                    if (hideSpollerBody) {
                        spollerTitle.removeAttribute("tabindex");
                        if (!spollerTitle.classList.contains("_spoller-active")) spollerTitle.nextElementSibling.hidden = true;
                    } else {
                        spollerTitle.setAttribute("tabindex", "-1");
                        spollerTitle.nextElementSibling.hidden = false;
                    }
                }));
            }
        }
        function setSpollerAction(e) {
            const el = e.target;
            if (el.closest("[data-spoller]")) {
                const spollerTitle = el.closest("[data-spoller]");
                const spollersBlock = spollerTitle.closest("[data-spollers]");
                const oneSpoller = spollersBlock.hasAttribute("data-one-spoller");
                const spollerSpeed = spollersBlock.dataset.spollersSpeed ? parseInt(spollersBlock.dataset.spollersSpeed) : 500;
                if (!spollersBlock.querySelectorAll("._slide").length) {
                    if (oneSpoller && !spollerTitle.classList.contains("_spoller-active")) hideSpollersBody(spollersBlock);
                    spollerTitle.classList.toggle("_spoller-active");
                    _slideToggle(spollerTitle.nextElementSibling, spollerSpeed);
                }
                e.preventDefault();
            }
        }
        function hideSpollersBody(spollersBlock) {
            const spollerActiveTitle = spollersBlock.querySelector("[data-spoller]._spoller-active");
            const spollerSpeed = spollersBlock.dataset.spollersSpeed ? parseInt(spollersBlock.dataset.spollersSpeed) : 500;
            if (spollerActiveTitle && !spollersBlock.querySelectorAll("._slide").length) {
                spollerActiveTitle.classList.remove("_spoller-active");
                _slideUp(spollerActiveTitle.nextElementSibling, spollerSpeed);
            }
        }
        const spollersClose = document.querySelectorAll("[data-spoller-close]");
        if (spollersClose.length) document.addEventListener("click", (function (e) {
            const el = e.target;
            if (!el.closest("[data-spollers]")) spollersClose.forEach((spollerClose => {
                const spollersBlock = spollerClose.closest("[data-spollers]");
                const spollerSpeed = spollersBlock.dataset.spollersSpeed ? parseInt(spollersBlock.dataset.spollersSpeed) : 500;
                spollerClose.classList.remove("_spoller-active");
                _slideUp(spollerClose.nextElementSibling, spollerSpeed);
            }));
        }));
    }
}
function tabs() {
    const tabs = document.querySelectorAll("[data-tabs]");
    let tabsActiveHash = [];
    if (tabs.length > 0) {
        const hash = getHash();
        if (hash && hash.startsWith("tab-")) tabsActiveHash = hash.replace("tab-", "").split("-");
        tabs.forEach(((tabsBlock, index) => {
            tabsBlock.classList.add("_tab-init");
            tabsBlock.setAttribute("data-tabs-index", index);
            tabsBlock.addEventListener("click", setTabsAction);
            initTabs(tabsBlock);
        }));
        let mdQueriesArray = dataMediaQueries(tabs, "tabs");
        if (mdQueriesArray && mdQueriesArray.length) mdQueriesArray.forEach((mdQueriesItem => {
            mdQueriesItem.matchMedia.addEventListener("change", (function () {
                setTitlePosition(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
            }));
            setTitlePosition(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
        }));
    }
    function setTitlePosition(tabsMediaArray, matchMedia) {
        tabsMediaArray.forEach((tabsMediaItem => {
            tabsMediaItem = tabsMediaItem.item;
            let tabsTitles = tabsMediaItem.querySelector("[data-tabs-titles]");
            let tabsTitleItems = tabsMediaItem.querySelectorAll("[data-tabs-title]");
            let tabsContent = tabsMediaItem.querySelector("[data-tabs-body]");
            let tabsContentItems = tabsMediaItem.querySelectorAll("[data-tabs-item]");
            tabsTitleItems = Array.from(tabsTitleItems).filter((item => item.closest("[data-tabs]") === tabsMediaItem));
            tabsContentItems = Array.from(tabsContentItems).filter((item => item.closest("[data-tabs]") === tabsMediaItem));
            tabsContentItems.forEach(((tabsContentItem, index) => {
                if (matchMedia.matches) {
                    tabsContent.append(tabsTitleItems[index]);
                    tabsContent.append(tabsContentItem);
                    tabsMediaItem.classList.add("_tab-spoller");
                } else {
                    tabsTitles.append(tabsTitleItems[index]);
                    tabsMediaItem.classList.remove("_tab-spoller");
                }
            }));
        }));
    }
    function initTabs(tabsBlock) {
        let tabsTitles = tabsBlock.querySelectorAll("[data-tabs-titles]>*");
        let tabsContent = tabsBlock.querySelectorAll("[data-tabs-body]>*");
        const tabsBlockIndex = tabsBlock.dataset.tabsIndex;
        const tabsActiveHashBlock = tabsActiveHash[0] == tabsBlockIndex;
        if (tabsActiveHashBlock) {
            const tabsActiveTitle = tabsBlock.querySelector("[data-tabs-titles]>._tab-active");
            tabsActiveTitle ? tabsActiveTitle.classList.remove("_tab-active") : null;
        }
        if (tabsContent.length) {
            tabsContent = Array.from(tabsContent).filter((item => item.closest("[data-tabs]") === tabsBlock));
            tabsTitles = Array.from(tabsTitles).filter((item => item.closest("[data-tabs]") === tabsBlock));
            tabsContent.forEach(((tabsContentItem, index) => {
                tabsTitles[index].setAttribute("data-tabs-title", "");
                tabsContentItem.setAttribute("data-tabs-item", "");
                if (tabsActiveHashBlock && index == tabsActiveHash[1]) tabsTitles[index].classList.add("_tab-active");
                tabsContentItem.hidden = !tabsTitles[index].classList.contains("_tab-active");
            }));
        }
    }
    function setTabsStatus(tabsBlock) {
        let tabsTitles = tabsBlock.querySelectorAll("[data-tabs-title]");
        let tabsContent = tabsBlock.querySelectorAll("[data-tabs-item]");
        const tabsBlockIndex = tabsBlock.dataset.tabsIndex;
        function isTabsAnamate(tabsBlock) {
            if (tabsBlock.hasAttribute("data-tabs-animate")) return tabsBlock.dataset.tabsAnimate > 0 ? Number(tabsBlock.dataset.tabsAnimate) : 500;
        }
        const tabsBlockAnimate = isTabsAnamate(tabsBlock);
        if (tabsContent.length > 0) {
            const isHash = tabsBlock.hasAttribute("data-tabs-hash");
            tabsContent = Array.from(tabsContent).filter((item => item.closest("[data-tabs]") === tabsBlock));
            tabsTitles = Array.from(tabsTitles).filter((item => item.closest("[data-tabs]") === tabsBlock));
            tabsContent.forEach(((tabsContentItem, index) => {
                if (tabsTitles[index].classList.contains("_tab-active")) {
                    if (tabsBlockAnimate) _slideDown(tabsContentItem, tabsBlockAnimate); else tabsContentItem.hidden = false;
                    if (isHash && !tabsContentItem.closest(".popup")) setHash(`tab-${tabsBlockIndex}-${index}`);
                } else if (tabsBlockAnimate) _slideUp(tabsContentItem, tabsBlockAnimate); else tabsContentItem.hidden = true;
            }));
        }
    }
    function setTabsAction(e) {
        const el = e.target;
        if (el.closest("[data-tabs-title]")) {
            const tabTitle = el.closest("[data-tabs-title]");
            const tabsBlock = tabTitle.closest("[data-tabs]");
            if (!tabTitle.classList.contains("_tab-active") && !tabsBlock.querySelector("._slide")) {
                let tabActiveTitle = tabsBlock.querySelectorAll("[data-tabs-title]._tab-active");
                tabActiveTitle.length ? tabActiveTitle = Array.from(tabActiveTitle).filter((item => item.closest("[data-tabs]") === tabsBlock)) : null;
                tabActiveTitle.length ? tabActiveTitle[0].classList.remove("_tab-active") : null;
                tabTitle.classList.add("_tab-active");
                setTabsStatus(tabsBlock);
            }
            e.preventDefault();
        }
    }
}
function menuInit() {
    if (document.querySelector(".icon-menu")) document.addEventListener("click", (function (e) {
        if (bodyLockStatus && e.target.closest(".icon-menu")) {
            bodyLockToggle();
            document.documentElement.classList.toggle("menu-open");
        }
    }));
}
function menuClose() {
    bodyUnlock();
    document.documentElement.classList.remove("menu-open");
}
function FLS(message) {
    setTimeout((() => {
        if (window.FLS) console.log(message);
    }), 0);
}
function uniqArray(array) {
    return array.filter((function (item, index, self) {
        return self.indexOf(item) === index;
    }));
}
function dataMediaQueries(array, dataSetValue) {
    const media = Array.from(array).filter((function (item, index, self) {
        if (item.dataset[dataSetValue]) return item.dataset[dataSetValue].split(",")[0];
    }));
    if (media.length) {
        const breakpointsArray = [];
        media.forEach((item => {
            const params = item.dataset[dataSetValue];
            const breakpoint = {};
            const paramsArray = params.split(",");
            breakpoint.value = paramsArray[0];
            breakpoint.type = paramsArray[1] ? paramsArray[1].trim() : "max";
            breakpoint.item = item;
            breakpointsArray.push(breakpoint);
        }));
        let mdQueries = breakpointsArray.map((function (item) {
            return "(" + item.type + "-width: " + item.value + "px)," + item.value + "," + item.type;
        }));
        mdQueries = uniqArray(mdQueries);
        const mdQueriesArray = [];
        if (mdQueries.length) {
            mdQueries.forEach((breakpoint => {
                const paramsArray = breakpoint.split(",");
                const mediaBreakpoint = paramsArray[1];
                const mediaType = paramsArray[2];
                const matchMedia = window.matchMedia(paramsArray[0]);
                const itemsArray = breakpointsArray.filter((function (item) {
                    if (item.value === mediaBreakpoint && item.type === mediaType) return true;
                }));
                mdQueriesArray.push({
                    itemsArray,
                    matchMedia
                });
            }));
            return mdQueriesArray;
        }
    }
}
class Popup {
    constructor(options) {
        let config = {
            logging: true,
            init: true,
            attributeOpenButton: "data-popup",
            attributeCloseButton: "data-close",
            fixElementSelector: "[data-lp]",
            youtubeAttribute: "data-popup-youtube",
            youtubePlaceAttribute: "data-popup-youtube-place",
            setAutoplayYoutube: true,
            classes: {
                popup: "popup",
                popupContent: "popup__content",
                popupActive: "popup_show",
                bodyActive: "popup-show"
            },
            focusCatch: true,
            closeEsc: true,
            bodyLock: true,
            hashSettings: {
                location: true,
                goHash: true
            },
            on: {
                beforeOpen: function () { },
                afterOpen: function () { },
                beforeClose: function () { },
                afterClose: function () { }
            }
        };
        this.youTubeCode;
        this.isOpen = false;
        this.targetOpen = {
            selector: false,
            element: false
        };
        this.previousOpen = {
            selector: false,
            element: false
        };
        this.lastClosed = {
            selector: false,
            element: false
        };
        this._dataValue = false;
        this.hash = false;
        this._reopen = false;
        this._selectorOpen = false;
        this.lastFocusEl = false;
        this._focusEl = ["a[href]", 'input:not([disabled]):not([type="hidden"]):not([aria-hidden])', "button:not([disabled]):not([aria-hidden])", "select:not([disabled]):not([aria-hidden])", "textarea:not([disabled]):not([aria-hidden])", "area[href]", "iframe", "object", "embed", "[contenteditable]", '[tabindex]:not([tabindex^="-"])'];
        this.options = {
            ...config,
            ...options,
            classes: {
                ...config.classes,
                ...options?.classes
            },
            hashSettings: {
                ...config.hashSettings,
                ...options?.hashSettings
            },
            on: {
                ...config.on,
                ...options?.on
            }
        };
        this.bodyLock = false;
        this.options.init ? this.initPopups() : null;
    }
    initPopups() {
        this.popupLogging(`Проснулся`);
        this.eventsPopup();
    }
    eventsPopup() {
        document.addEventListener("click", function (e) {
            const buttonOpen = e.target.closest(`[${this.options.attributeOpenButton}]`);
            if (buttonOpen) {
                e.preventDefault();
                this._dataValue = buttonOpen.getAttribute(this.options.attributeOpenButton) ? buttonOpen.getAttribute(this.options.attributeOpenButton) : "error";
                this.youTubeCode = buttonOpen.getAttribute(this.options.youtubeAttribute) ? buttonOpen.getAttribute(this.options.youtubeAttribute) : null;
                if ("error" !== this._dataValue) {
                    if (!this.isOpen) this.lastFocusEl = buttonOpen;
                    this.targetOpen.selector = `${this._dataValue}`;
                    this._selectorOpen = true;
                    this.open();
                    return;
                } else this.popupLogging(`Ой ой, не заполнен атрибут у ${buttonOpen.classList}`);
                return;
            }
            const buttonClose = e.target.closest(`[${this.options.attributeCloseButton}]`);
            if (buttonClose || !e.target.closest(`.${this.options.classes.popupContent}`) && this.isOpen) {
                e.preventDefault();
                this.close();
                return;
            }
        }.bind(this));
        document.addEventListener("keydown", function (e) {
            if (this.options.closeEsc && 27 == e.which && "Escape" === e.code && this.isOpen) {
                e.preventDefault();
                this.close();
                return;
            }
            if (this.options.focusCatch && 9 == e.which && this.isOpen) {
                this._focusCatch(e);
                return;
            }
        }.bind(this));
        if (this.options.hashSettings.goHash) {
            window.addEventListener("hashchange", function () {
                if (window.location.hash) this._openToHash(); else this.close(this.targetOpen.selector);
            }.bind(this));
            window.addEventListener("load", function () {
                if (window.location.hash) this._openToHash();
            }.bind(this));
        }
    }
    open(selectorValue) {
        if (bodyLockStatus) {
            this.bodyLock = document.documentElement.classList.contains("lock") && !this.isOpen ? true : false;
            if (selectorValue && "string" === typeof selectorValue && "" !== selectorValue.trim()) {
                this.targetOpen.selector = selectorValue;
                this._selectorOpen = true;
            }
            if (this.isOpen) {
                this._reopen = true;
                this.close();
            }
            if (!this._selectorOpen) this.targetOpen.selector = this.lastClosed.selector;
            if (!this._reopen) this.previousActiveElement = document.activeElement;
            this.targetOpen.element = document.querySelector(this.targetOpen.selector);
            if (this.targetOpen.element) {
                if (this.youTubeCode) {
                    const codeVideo = this.youTubeCode;
                    const urlVideo = `https://www.youtube.com/embed/${codeVideo}?rel=0&showinfo=0&autoplay=1`;
                    const iframe = document.createElement("iframe");
                    iframe.setAttribute("allowfullscreen", "");
                    const autoplay = this.options.setAutoplayYoutube ? "autoplay;" : "";
                    iframe.setAttribute("allow", `${autoplay}; encrypted-media`);
                    iframe.setAttribute("src", urlVideo);
                    if (!this.targetOpen.element.querySelector(`[${this.options.youtubePlaceAttribute}]`)) {
                        this.targetOpen.element.querySelector(".popup__text").setAttribute(`${this.options.youtubePlaceAttribute}`, "");
                    }
                    this.targetOpen.element.querySelector(`[${this.options.youtubePlaceAttribute}]`).appendChild(iframe);
                }
                if (this.options.hashSettings.location) {
                    this._getHash();
                    this._setHash();
                }
                this.options.on.beforeOpen(this);
                document.dispatchEvent(new CustomEvent("beforePopupOpen", {
                    detail: {
                        popup: this
                    }
                }));
                this.targetOpen.element.classList.add(this.options.classes.popupActive);
                document.documentElement.classList.add(this.options.classes.bodyActive);
                if (!this._reopen) !this.bodyLock ? bodyLock() : null; else this._reopen = false;
                this.targetOpen.element.setAttribute("aria-hidden", "false");
                this.previousOpen.selector = this.targetOpen.selector;
                this.previousOpen.element = this.targetOpen.element;
                this._selectorOpen = false;
                this.isOpen = true;
                setTimeout((() => {
                    this._focusTrap();
                }), 50);
                this.options.on.afterOpen(this);
                document.dispatchEvent(new CustomEvent("afterPopupOpen", {
                    detail: {
                        popup: this
                    }
                }));
                this.popupLogging(`Открыл попап`);
            } else this.popupLogging(`Ой ой, такого попапа нет.Проверьте корректность ввода. `);
        }
    }
    close(selectorValue) {
        if (selectorValue && "string" === typeof selectorValue && "" !== selectorValue.trim()) this.previousOpen.selector = selectorValue;
        if (!this.isOpen || !bodyLockStatus) return;
        this.options.on.beforeClose(this);
        document.dispatchEvent(new CustomEvent("beforePopupClose", {
            detail: {
                popup: this
            }
        }));
        if (this.youTubeCode) if (this.targetOpen.element.querySelector(`[${this.options.youtubePlaceAttribute}]`)) this.targetOpen.element.querySelector(`[${this.options.youtubePlaceAttribute}]`).innerHTML = "";
        this.previousOpen.element.classList.remove(this.options.classes.popupActive);
        this.previousOpen.element.setAttribute("aria-hidden", "true");
        if (!this._reopen) {
            document.documentElement.classList.remove(this.options.classes.bodyActive);
            !this.bodyLock ? bodyUnlock() : null;
            this.isOpen = false;
        }
        this._removeHash();
        if (this._selectorOpen) {
            this.lastClosed.selector = this.previousOpen.selector;
            this.lastClosed.element = this.previousOpen.element;
        }
        this.options.on.afterClose(this);
        document.dispatchEvent(new CustomEvent("afterPopupClose", {
            detail: {
                popup: this
            }
        }));
        setTimeout((() => {
            this._focusTrap();
        }), 50);
        this.popupLogging(`Закрыл попап`);
    }
    _getHash() {
        if (this.options.hashSettings.location) this.hash = this.targetOpen.selector.includes("#") ? this.targetOpen.selector : this.targetOpen.selector.replace(".", "#");
    }
    _openToHash() {
        let classInHash = document.querySelector(`.${window.location.hash.replace("#", "")}`) ? `.${window.location.hash.replace("#", "")}` : document.querySelector(`${window.location.hash}`) ? `${window.location.hash}` : null;
        const buttons = document.querySelector(`[${this.options.attributeOpenButton} = "${classInHash}"]`) ? document.querySelector(`[${this.options.attributeOpenButton} = "${classInHash}"]`) : document.querySelector(`[${this.options.attributeOpenButton} = "${classInHash.replace(".", "#")}"]`);
        if (buttons && classInHash) this.open(classInHash);
    }
    _setHash() {
        history.pushState("", "", this.hash);
    }
    _removeHash() {
        history.pushState("", "", window.location.href.split("#")[0]);
    }
    _focusCatch(e) {
        const focusable = this.targetOpen.element.querySelectorAll(this._focusEl);
        const focusArray = Array.prototype.slice.call(focusable);
        const focusedIndex = focusArray.indexOf(document.activeElement);
        if (e.shiftKey && 0 === focusedIndex) {
            focusArray[focusArray.length - 1].focus();
            e.preventDefault();
        }
        if (!e.shiftKey && focusedIndex === focusArray.length - 1) {
            focusArray[0].focus();
            e.preventDefault();
        }
    }
    _focusTrap() {
        const focusable = this.previousOpen.element.querySelectorAll(this._focusEl);
        if (!this.isOpen && this.lastFocusEl) this.lastFocusEl.focus(); else focusable[0].focus();
    }
    popupLogging(message) {
        this.options.logging ? FLS(`[Попапос]: ${message}`) : null;
    }
}
flsModules.popup = new Popup({});
let gotoBlock = (targetBlock, noHeader = false, speed = 500, offsetTop = 0) => {
    const targetBlockElement = document.querySelector(targetBlock);
    if (targetBlockElement) {
        let headerItem = "";
        let headerItemHeight = 0;
        if (noHeader) {
            headerItem = "header.header";
            headerItemHeight = document.querySelector(headerItem).offsetHeight;
        }
        let options = {
            speedAsDuration: true,
            speed,
            header: headerItem,
            offset: offsetTop,
            easing: "easeOutQuad"
        };
        document.documentElement.classList.contains("menu-open") ? menuClose() : null;
        if ("undefined" !== typeof SmoothScroll) (new SmoothScroll).animateScroll(targetBlockElement, "", options); else {
            let targetBlockElementPosition = targetBlockElement.getBoundingClientRect().top + scrollY;
            targetBlockElementPosition = headerItemHeight ? targetBlockElementPosition - headerItemHeight : targetBlockElementPosition;
            targetBlockElementPosition = offsetTop ? targetBlockElementPosition - offsetTop : targetBlockElementPosition;
            window.scrollTo({
                top: targetBlockElementPosition,
                behavior: "smooth"
            });
        }
        FLS(`[gotoBlock]: Юхуу...едем к ${targetBlock}`);
    } else FLS(`[gotoBlock]: Ой ой..Такого блока нет на странице: ${targetBlock}`);
};
function formFieldsInit(options = {
    viewPass: false
}) {
    const formFields = document.querySelectorAll("input[placeholder],textarea[placeholder]");
    if (formFields.length) formFields.forEach((formField => {
        if (!formField.hasAttribute("data-placeholder-nohide")) formField.dataset.placeholder = formField.placeholder;
    }));
    document.body.addEventListener("focusin", (function (e) {
        const targetElement = e.target;
        if ("INPUT" === targetElement.tagName || "TEXTAREA" === targetElement.tagName) {
            if (targetElement.dataset.placeholder) targetElement.placeholder = "";
            if (!targetElement.hasAttribute("data-no-focus-classes")) {
                targetElement.classList.add("_form-focus");
                targetElement.parentElement.classList.add("_form-focus");
            }
            formValidate.removeError(targetElement);
        }
    }));
    document.body.addEventListener("focusout", (function (e) {
        const targetElement = e.target;
        if ("INPUT" === targetElement.tagName || "TEXTAREA" === targetElement.tagName) {
            if (targetElement.dataset.placeholder) targetElement.placeholder = targetElement.dataset.placeholder;
            if (!targetElement.hasAttribute("data-no-focus-classes")) {
                targetElement.classList.remove("_form-focus");
                targetElement.parentElement.classList.remove("_form-focus");
            }
            if (targetElement.hasAttribute("data-validate")) formValidate.validateInput(targetElement);
        }
    }));
    if (options.viewPass) document.addEventListener("click", (function (e) {
        let targetElement = e.target;
        const viewPassButton = targetElement.closest('[class*="__viewpass"]');
        if (viewPassButton) {
            const passwordInput = viewPassButton.parentElement.querySelector('input[type="password"], input[type="text"]');
            if (passwordInput) {
                let inputType = viewPassButton.classList.contains("_viewpass-active") ? "password" : "text";
                passwordInput.setAttribute("type", inputType);
                viewPassButton.classList.toggle("_viewpass-active");
            }
        }
    }));
}
let formValidate = {
    getErrors(form) {
        let error = 0;
        let formRequiredItems = form.querySelectorAll("*[data-required]");
        if (formRequiredItems.length) formRequiredItems.forEach((formRequiredItem => {
            if ((null !== formRequiredItem.offsetParent || "SELECT" === formRequiredItem.tagName) && !formRequiredItem.disabled) error += this.validateInput(formRequiredItem);
        }));
        error += this.validatePasswords(form);
        return error;
    },
    validateInput(formRequiredItem) {
        let error = 0;
        if ("email" === formRequiredItem.dataset.required) {
            formRequiredItem.value = formRequiredItem.value.replace(" ", "");
            if (this.emailTest(formRequiredItem)) {
                this.addError(formRequiredItem);
                error++;
            } else this.removeError(formRequiredItem);
        } else if ("checkbox" === formRequiredItem.type && !formRequiredItem.checked) {
            this.addError(formRequiredItem);
            error++;
        } else if (!formRequiredItem.value.trim()) {
            this.addError(formRequiredItem);
            error++;
        } else this.removeError(formRequiredItem);
        return error;
    },
    validatePasswords(form) {
        let error = 0;
        const password1 = form.querySelector("#password1");
        const password2 = form.querySelector("#password2");
        if (password1 && password2) {
            this.removePasswordError();
            if (password1.value.trim() && password2.value.trim()) {
                if (password1.value !== password2.value) {
                    this.addPasswordError(password1, password2, "Пароли не совпадают");
                    error++;
                }
            } else if (password1.value.trim() && !password2.value.trim() || !password1.value.trim() && password2.value.trim()) {
                this.addPasswordError(password1, password2, "Оба поля пароля должны быть заполнены");
                error++;
            }
        }
        return error;
    },
    addPasswordError(password1, password2, message) {
        password1.classList.add("_form-error");
        password2.classList.add("_form-error");
        password1.parentElement.classList.add("_form-error");
        password2.parentElement.classList.add("_form-error");
        const errorElement = document.createElement("div");
        errorElement.className = "form__error password-match-error";
        errorElement.textContent = message;
        password2.parentElement.appendChild(errorElement);
    },
    removePasswordError() {
        const passwordError = document.querySelector(".password-match-error");
        if (passwordError) passwordError.remove();
        const password1 = document.getElementById("password1");
        const password2 = document.getElementById("password2");
        if (password1) {
            password1.classList.remove("_form-error");
            password1.parentElement.classList.remove("_form-error");
        }
        if (password2) {
            password2.classList.remove("_form-error");
            password2.parentElement.classList.remove("_form-error");
        }
    },
    addError(formRequiredItem) {
        formRequiredItem.classList.add("_form-error");
        document.documentElement.classList.add("_form-error");
        formRequiredItem.parentElement.classList.add("_form-error");
        let inputError = formRequiredItem.parentElement.querySelector(".form__error");
        if (inputError) formRequiredItem.parentElement.removeChild(inputError);
        if (formRequiredItem.dataset.error) formRequiredItem.parentElement.insertAdjacentHTML("beforeend", `<div class="form__error">${formRequiredItem.dataset.error}</div>`);
    },
    removeError(formRequiredItem) {
        document.documentElement.classList.remove("_form-error");
        formRequiredItem.classList.remove("_form-error");
        formRequiredItem.parentElement.classList.remove("_form-error");
        if (formRequiredItem.parentElement.querySelector(".form__error")) formRequiredItem.parentElement.removeChild(formRequiredItem.parentElement.querySelector(".form__error"));
    },
    formClean(form) {
        form.reset();
        setTimeout((() => {
            let inputs = form.querySelectorAll("input,textarea");
            for (let index = 0; index < inputs.length; index++) {
                const el = inputs[index];
                el.parentElement.classList.remove("_form-focus");
                el.classList.remove("_form-focus");
                formValidate.removeError(el);
            }
            this.removePasswordError();
            let checkboxes = form.querySelectorAll(".checkbox__input");
            if (checkboxes.length > 0) for (let index = 0; index < checkboxes.length; index++) {
                const checkbox = checkboxes[index];
                checkbox.checked = false;
            }
            if (flsModules.select) {
                let selects = form.querySelectorAll(".select");
                if (selects.length) for (let index = 0; index < selects.length; index++) {
                    const select = selects[index].querySelector("select");
                    flsModules.select.selectBuild(select);
                }
            }
        }), 0);
    },
    emailTest(formRequiredItem) {
        return !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,8})+$/.test(formRequiredItem.value);
    }
};
function formSubmit(options = {
    validate: true
}) {
    const forms = document.forms;
    if (forms.length) for (const form of forms) {
        form.addEventListener("submit", (function (e) {
            const form = e.target;
            formSubmitAction(form, e);
        }));
        form.addEventListener("reset", (function (e) {
            const form = e.target;
            formValidate.formClean(form);
        }));
    }
    async function formSubmitAction(form, e) {
        const error = !form.hasAttribute("data-no-validate") ? formValidate.getErrors(form) : 0;
        if (0 === error) {
            const ajax = form.hasAttribute("data-ajax");
            if (ajax) {
                e.preventDefault();
                form.classList.add("_sending");
                try {
                    const response = await fetch(form.action || "#", {
                        method: form.method || "POST",
                        body: new FormData(form),
                        headers: {
                            "X-Requested-With": "XMLHttpRequest"
                        }
                    });
                    if (!response.ok) throw new Error("Network response error");
                    const contentType = response.headers.get("content-type");
                    let result;
                    if (contentType && contentType.includes("application/json")) result = await response.json(); else {
                        const text = await response.text();
                        try {
                            result = JSON.parse(text);
                        } catch {
                            result = {
                                success: false,
                                message: "Неверный формат ответа"
                            };
                        }
                    }
                    form.classList.remove("_sending");
                    if (result.success) formSent(form, result); else throw new Error(result.message || "Ошибка сервера");
                } catch (err) {
                    console.error("Form submit error:", err);
                    form.classList.remove("_sending");
                    alert(`Ошибка отправки: ${err.message}`);
                }
            }
        } else {
            e.preventDefault();
            const firstError = form.querySelector("._form-error");
            if (firstError) firstError.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });
        }
    }
    function formSent(form, responseResult = ``) {
        document.dispatchEvent(new CustomEvent("formSent", {
            detail: {
                form
            }
        }));
        setTimeout((() => {
            if (flsModules.popup) {
                const popup = form.dataset.popupMessage;
                popup ? flsModules.popup.open(popup) : null;
            }
        }), 0);
        formValidate.formClean(form);
        formLogging(`Форма отправлена!`);
    }
    function formLogging(message) {
        FLS(`[Формы]: ${message}`);
    }
}
function initPasswordValidation() {
    const password1 = document.getElementById("password1");
    const password2 = document.getElementById("password2");
    if (password1 && password2) {
        let timeout;
        const validateWithDelay = () => {
            clearTimeout(timeout);
            timeout = setTimeout((() => {
                formValidate.validatePasswords(document.querySelector("form"));
            }), 500);
        };
        password1.addEventListener("input", validateWithDelay);
        password2.addEventListener("input", validateWithDelay);
    }
}
initPasswordValidation();
function formRating() {
    const ratings = document.querySelectorAll(".rating");
    if (ratings.length > 0) initRatings();
    function initRatings() {
        let ratingActive, ratingValue;
        for (let index = 0; index < ratings.length; index++) {
            const rating = ratings[index];
            initRating(rating);
        }
        function initRating(rating) {
            initRatingVars(rating);
            setRatingActiveWidth();
            if (rating.classList.contains("rating_set")) setRating(rating);
        }
        function initRatingVars(rating) {
            ratingActive = rating.querySelector(".rating__activeline");
            ratingValue = rating.querySelector(".rating-input");
        }
        function setRatingActiveWidth() {
            const ratingActiveWidth = ratingValue.value / .05;
            ratingActive.style.width = `${ratingActiveWidth}%`;
        }
        ratingValue.addEventListener("change", (function () {
            setRatingActiveWidth();
        }));
        function setRating(rating) {
            const ratingItems = rating.querySelectorAll(".rating__star");
            for (let index = 0; index < ratingItems.length; index++) {
                const ratingItem = ratingItems[index];
                ratingItem.addEventListener("mouseenter", (function (e) {
                    initRatingVars(rating);
                    setRatingActiveWidth(ratingItem.value);
                }));
                ratingItem.addEventListener("mouseleave", (function (e) {
                    setRatingActiveWidth();
                }));
                ratingItem.addEventListener("click", (function (e) {
                    initRatingVars(rating);
                    if (rating.dataset.ajax) setRatingValue(ratingItem.value, rating); else {
                        ratingValue.value = index + 1;
                        setRatingActiveWidth();
                    }
                }));
            }
        }
        async function setRatingValue(value, rating) {
            if (!rating.classList.contains("rating_sending")) {
                rating.classList.add("rating_sending");
                let response = await fetch("rating.json", {
                    method: "GET"
                });
                if (response.ok) {
                    const result = await response.json();
                    const newRating = result.newRating;
                    ratingValue.value = newRating;
                    setRatingActiveWidth();
                    rating.classList.remove("rating_sending");
                } else {
                    alert("Ошибка");
                    rating.classList.remove("rating_sending");
                }
            }
        }
    }
}
formRating();
function select_select() {
    const optionMenus = document.querySelectorAll(".select__menu");
    optionMenus.forEach((optionMenu => {
        const selectBtn = optionMenu.querySelector(".select__btn");
        const options = optionMenu.querySelectorAll(".select__option");
        const sBtntext = optionMenu.querySelector(".select__input");
        if (optionMenu) {
            selectBtn.addEventListener("click", (function (e) {
                let elem_active = optionMenu.classList.contains("_active");
                optionMenus.forEach((opt => {
                    opt.classList.remove("_active");
                }));
                optionMenu.classList.toggle("_active", !elem_active);
            }));
            options.forEach((option => {
                option.addEventListener("click", (function (e) {
                    if (null != e.target.classList.contains(".select__option-text")) sBtntext.value = e.target.innerText;
                    options.forEach((el => {
                        el.classList.remove("_active");
                    }));
                    option.classList.add("_active");
                    optionMenu.classList.remove("_active");
                }));
            }));
            window.addEventListener("click", (e => {
                const target = e.target;
                if (!target.closest(".select__options") && !target.closest(".select__menu")) optionMenu.classList.remove("_active");
            }));
        }
    }));
}
select_select();
const telephone = document.querySelectorAll(".telephone");
if (telephone) Inputmask({
    mask: "+7(999)-999-99-99"
}).mask(telephone);
const code = document.querySelectorAll(".code");
if (code) Inputmask({
    mask: "999999"
}).mask(code);

if (document.querySelector(".top-main-about__slider")) new Swiper(".top-main-about__slider", {
    observer: true,
    observeParents: true,
    slidesPerView: 1,
    spaceBetween: 20,
    autoHeight: false,
    speed: 800,
    pagination: {
        el: ".top-main-about__pagination",
        clickable: true
    }
});
if (document.querySelector(".main-home__slider")) new Swiper(".main-home__slider", {
    observer: true,
    observeParents: true,
    slidesPerView: 1,
    spaceBetween: 20,
    autoHeight: false,
    speed: 800,
    loop: true,
    lazy: true,
    autoplay: {
        delay: 3e3,
        disableOnInteraction: false
    },
    pagination: {
        el: ".main-home__pagination",
        clickable: true
    },
    navigation: {
        prevEl: ".main-home__arrow-prev",
        nextEl: ".main-home__arrow-next"
    },
    on: {}
});
document.querySelectorAll(".result-popup__content").forEach((n => {
    const thumbsSwiper = new Swiper(n.querySelector(".result-popup__thumbs"), {
        observer: true,
        observeParents: true,
        slidesPerView: 6,
        spaceBetween: 12,
        speed: 800,
        breakpoints: {
            0: {
                slidesPerView: 2.5
            },
            360: {
                slidesPerView: 3.3
            },
            650: {
                slidesPerView: 4
            },
            767.98: {
                slidesPerView: 6
            },
            991.98: {
                slidesPerView: 3
            },
            1300: {
                slidesPerView: 4
            },
            1600: {
                slidesPerView: 5
            },
            1800: {
                slidesPerView: 6
            }
        }
    });
    new Swiper(n.querySelector(".result-popup__slider"), {
        thumbs: {
            swiper: thumbsSwiper
        },
        observer: true,
        observeParents: true,
        slidesPerView: 1,
        spaceBetween: 20,
        speed: 800,
        preloadImages: true
    });
}));
if (document.querySelector(".teams__slider")) new Swiper(".teams__slider", {
    observer: true,
    observeParents: true,
    speed: 800,
    preloadImages: true,
    navigation: {
        prevEl: ".teams__arrow-prev",
        nextEl: ".teams__arrow-next"
    },
    breakpoints: {
        0: {
            slidesPerView: 1.1,
            spaceBetween: 16
        },
        479.98: {
            slidesPerView: 1.5,
            spaceBetween: 16
        },
        767.98: {
            slidesPerView: 3,
            spaceBetween: 16
        },
        991.98: {
            slidesPerView: 4,
            spaceBetween: 16
        },
        1300: {
            slidesPerView: 4,
            spaceBetween: 24
        }
    }
});
if (document.querySelector(".result__slider")) new Swiper(".result__slider", {
    observer: true,
    observeParents: true,
    speed: 800,
    preloadImages: true,
    navigation: {
        prevEl: ".result__arrow-prev",
        nextEl: ".result__arrow-next"
    },
    breakpoints: {
        0: {
            slidesPerView: 1.1,
            spaceBetween: 16
        },
        479.98: {
            slidesPerView: 1.1,
            spaceBetween: 16
        },
        600: {
            slidesPerView: 1.3,
            spaceBetween: 16
        },
        767.98: {
            slidesPerView: 2,
            spaceBetween: 16
        },
        1300: {
            slidesPerView: 3,
            spaceBetween: 36
        }
    }
});
if (document.querySelector(".doctor-certificates__slider")) new Swiper(".doctor-certificates__slider", {
    observer: true,
    observeParents: true,
    speed: 800,
    preloadImages: true,
    navigation: {
        prevEl: ".doctor-certificates__arrow-prev",
        nextEl: ".doctor-certificates__arrow-next"
    },
    breakpoints: {
        0: {
            slidesPerView: 1,
            spaceBetween: 16,
            autoHeight: true
        },
        991.98: {
            slidesPerView: "auto",
            spaceBetween: 32
        }
    }
});
if (document.querySelector(".doctor-certificates__popup-slider")) new Swiper(".doctor-certificates__popup-slider", {
    observer: true,
    observeParents: true,
    slidesPerView: 1,
    spaceBetween: 16,
    speed: 800,
    preloadImages: true,
    navigation: {
        prevEl: ".doctor-certificates__arrow-prev",
        nextEl: ".doctor-certificates__arrow-next"
    }
});
if (document.querySelector(".result-slider__slider")) new Swiper(".result-slider__slider", {
    observer: true,
    observeParents: true,
    slidesPerView: 1,
    spaceBetween: 16,
    speed: 800,
    preloadImages: true,
    navigation: {
        prevEl: ".result__arrow-prev",
        nextEl: ".result__arrow-next"
    }
});
if (document.querySelector(".teams__slider2")) new Swiper(".teams__slider2", {
    observer: true,
    observeParents: true,
    speed: 800,
    preloadImages: true,
    navigation: {
        prevEl: ".teams__arrow-prev",
        nextEl: ".teams__arrow-next"
    },
    breakpoints: {
        0: {
            slidesPerView: 1.1,
            spaceBetween: 24
        },
        400: {
            slidesPerView: 1.5,
            spaceBetween: 24
        },
        700: {
            slidesPerView: 2.5,
            spaceBetween: 24
        },
        1200: {
            slidesPerView: 2,
            spaceBetween: 16
        },
        1400: {
            slidesPerView: 3,
            spaceBetween: 16
        },
        1600: {
            slidesPerView: 4,
            spaceBetween: 24
        }
    }
});
class ScrollWatcher {
    constructor(props) {
        let defaultConfig = {
            logging: true
        };
        this.config = Object.assign(defaultConfig, props);
        this.observer;
        !document.documentElement.classList.contains("watcher") ? this.scrollWatcherRun() : null;
    }
    scrollWatcherUpdate() {
        this.scrollWatcherRun();
    }
    scrollWatcherRun() {
        document.documentElement.classList.add("watcher");
        this.scrollWatcherConstructor(document.querySelectorAll("[data-watch]"));
    }
    scrollWatcherConstructor(items) {
        if (items.length) {
            this.scrollWatcherLogging(`Проснулся, слежу за объектами (${items.length})...`);
            let uniqParams = uniqArray(Array.from(items).map((function (item) {
                return `${item.dataset.watchRoot ? item.dataset.watchRoot : null}|${item.dataset.watchMargin ? item.dataset.watchMargin : "0px"}|${item.dataset.watchThreshold ? item.dataset.watchThreshold : 0}`;
            })));
            uniqParams.forEach((uniqParam => {
                let uniqParamArray = uniqParam.split("|");
                let paramsWatch = {
                    root: uniqParamArray[0],
                    margin: uniqParamArray[1],
                    threshold: uniqParamArray[2]
                };
                let groupItems = Array.from(items).filter((function (item) {
                    let watchRoot = item.dataset.watchRoot ? item.dataset.watchRoot : null;
                    let watchMargin = item.dataset.watchMargin ? item.dataset.watchMargin : "0px";
                    let watchThreshold = item.dataset.watchThreshold ? item.dataset.watchThreshold : 0;
                    if (String(watchRoot) === paramsWatch.root && String(watchMargin) === paramsWatch.margin && String(watchThreshold) === paramsWatch.threshold) return item;
                }));
                let configWatcher = this.getScrollWatcherConfig(paramsWatch);
                this.scrollWatcherInit(groupItems, configWatcher);
            }));
        } else this.scrollWatcherLogging("Сплю, нет объектов для слежения. ZzzZZzz");
    }
    getScrollWatcherConfig(paramsWatch) {
        let configWatcher = {};
        if (document.querySelector(paramsWatch.root)) configWatcher.root = document.querySelector(paramsWatch.root); else if ("null" !== paramsWatch.root) this.scrollWatcherLogging(`Эмм... родительского объекта ${paramsWatch.root} нет на странице`);
        configWatcher.rootMargin = paramsWatch.margin;
        if (paramsWatch.margin.indexOf("px") < 0 && paramsWatch.margin.indexOf("%") < 0) {
            this.scrollWatcherLogging(`Ой ой, настройку data-watch-margin нужно задавать в PX или %`);
            return;
        }
        if ("prx" === paramsWatch.threshold) {
            paramsWatch.threshold = [];
            for (let i = 0; i <= 1; i += .005) paramsWatch.threshold.push(i);
        } else paramsWatch.threshold = paramsWatch.threshold.split(",");
        configWatcher.threshold = paramsWatch.threshold;
        return configWatcher;
    }
    scrollWatcherCreate(configWatcher) {
        this.observer = new IntersectionObserver(((entries, observer) => {
            entries.forEach((entry => {
                this.scrollWatcherCallback(entry, observer);
            }));
        }), configWatcher);
    }
    scrollWatcherInit(items, configWatcher) {
        this.scrollWatcherCreate(configWatcher);
        items.forEach((item => this.observer.observe(item)));
    }
    scrollWatcherIntersecting(entry, targetElement) {
        if (entry.isIntersecting) {
            !targetElement.classList.contains("_watcher-view") ? targetElement.classList.add("_watcher-view") : null;
            this.scrollWatcherLogging(`Я вижу ${targetElement.classList}, добавил класс _watcher-view`);
        } else {
            targetElement.classList.contains("_watcher-view") ? targetElement.classList.remove("_watcher-view") : null;
            this.scrollWatcherLogging(`Я не вижу ${targetElement.classList}, убрал класс _watcher-view`);
        }
    }
    scrollWatcherOff(targetElement, observer) {
        observer.unobserve(targetElement);
        this.scrollWatcherLogging(`Я перестал следить за ${targetElement.classList}`);
    }
    scrollWatcherLogging(message) {
        this.config.logging ? FLS(`[Наблюдатель]: ${message}`) : null;
    }
    scrollWatcherCallback(entry, observer) {
        const targetElement = entry.target;
        this.scrollWatcherIntersecting(entry, targetElement);
        targetElement.hasAttribute("data-watch-once") && entry.isIntersecting ? this.scrollWatcherOff(targetElement, observer) : null;
        document.dispatchEvent(new CustomEvent("watcherCallback", {
            detail: {
                entry
            }
        }));
    }
}
flsModules.watcher = new ScrollWatcher({});
let addWindowScrollEvent = false;
function pageNavigation() {
    document.addEventListener("click", pageNavigationAction);
    document.addEventListener("watcherCallback", pageNavigationAction);
    function pageNavigationAction(e) {
        if ("click" === e.type) {
            const targetElement = e.target;
            if (targetElement.closest("[data-goto]")) {
                const gotoLink = targetElement.closest("[data-goto]");
                const gotoLinkSelector = gotoLink.dataset.goto ? gotoLink.dataset.goto : "";
                const noHeader = gotoLink.hasAttribute("data-goto-header") ? true : false;
                const gotoSpeed = gotoLink.dataset.gotoSpeed ? gotoLink.dataset.gotoSpeed : 500;
                const offsetTop = gotoLink.dataset.gotoTop ? parseInt(gotoLink.dataset.gotoTop) : 0;
                gotoBlock(gotoLinkSelector, noHeader, gotoSpeed, offsetTop);
                e.preventDefault();
            }
        } else if ("watcherCallback" === e.type && e.detail) {
            const entry = e.detail.entry;
            const targetElement = entry.target;
            if ("navigator" === targetElement.dataset.watch) {
                document.querySelector(`[data-goto]._navigator-active`);
                let navigatorCurrentItem;
                if (targetElement.id && document.querySelector(`[data-goto="#${targetElement.id}"]`)) navigatorCurrentItem = document.querySelector(`[data-goto="#${targetElement.id}"]`); else if (targetElement.classList.length) for (let index = 0; index < targetElement.classList.length; index++) {
                    const element = targetElement.classList[index];
                    if (document.querySelector(`[data-goto=".${element}"]`)) {
                        navigatorCurrentItem = document.querySelector(`[data-goto=".${element}"]`);
                        break;
                    }
                }
                if (entry.isIntersecting) navigatorCurrentItem ? navigatorCurrentItem.classList.add("_navigator-active") : null; else navigatorCurrentItem ? navigatorCurrentItem.classList.remove("_navigator-active") : null;
            }
        }
    }
    if (getHash()) {
        let goToHash;
        if (document.querySelector(`#${getHash()}`)) goToHash = `#${getHash()}`; else if (document.querySelector(`.${getHash()}`)) goToHash = `.${getHash()}`;
        goToHash ? gotoBlock(goToHash, true, 500, 20) : null;
    }
}
setTimeout((() => {
    if (addWindowScrollEvent) {
        let windowScroll = new Event("windowScroll");
        window.addEventListener("scroll", (function (e) {
            document.dispatchEvent(windowScroll);
        }));
    }
}), 0);
const mapApiUrl = "https://api-maps.yandex.ru/2.1/?apikey=211aedb8-7658-4cd6-bcc1-134fbf4daa05&lang=ru_RU&_v=20240623012845";
const map = document.querySelector("#map");
if (map) {
    let mapInitialized = false;
    const initMap = () => {
        if (mapInitialized || "undefined" === typeof ymaps) return;
        mapInitialized = true;
        ymaps.ready(init);
    };
    const loadMapScript = () => {
        if (document.querySelector('script[data-yandex-map-api="true"]')) {
            initMap();
            return;
        }
        const script = document.createElement("script");
        script.src = mapApiUrl;
        script.async = true;
        script.dataset.yandexMapApi = "true";
        script.addEventListener("load", initMap, {
            once: true
        });
        document.head.appendChild(script);
    };
    if ("IntersectionObserver" in window) {
        const mapObserver = new IntersectionObserver((entries => {
            entries.forEach((entry => {
                if (entry.isIntersecting && entry.intersectionRatio >= 0.7) {
                    loadMapScript();
                    mapObserver.disconnect();
                }
            }));
        }), {
            threshold: 0.7
        });
        mapObserver.observe(map);
    } else loadMapScript();
    function init() {
        var myMap = new ymaps.Map("map", {
            center: [55.757642, 37.678442],
            zoom: 16,
            controls: ["zoomControl"],
            behaviors: ["drag"]
        });
        var myPlacemark = new ymaps.Placemark(myMap.getCenter(), {
            latitude: 55.757642,
            longitude: 37.678442
        }, {
            iconLayout: "default#image",
            iconImageHref: "/contacts/img/icons/map.svg",
            iconColor: "#ec6608",
            iconImageSize: [105, 140],
            iconImageOffset: [-57, -137]
        });
        myMap.geoObjects.add(myPlacemark);
    }
}
const spollerTitles = document.querySelectorAll(".main-home__title");
if (spollerTitles) spollerTitles.forEach((title => {
    title.addEventListener("click", (function (e) {
        let parent = e.target.parentNode;
        parent.classList.toggle("_spoller-active");
    }));
}));
const videosWrap = document.querySelector(".videos");
if (videosWrap) {
    const videoEventHandler = e => {
        if (!e.target.classList.contains("video")) return false;
        const video = e.target, allVideos = document.querySelectorAll(".video");
        const overlay = document.querySelectorAll(".play");
        allVideos.forEach(((source, index) => {
            if (source === video) return;
            source.classList.remove("isPlaying");
            source.pause();
        }));
        if (video.classList.contains("isPlaying")) {
            if (overlay) video.closest("div").querySelector(".play").classList.remove("_active");
            video.pause();
        } else {
            if (overlay) video.closest("div").querySelector(".play").classList.add("_active");
            video.play();
        }
        video.classList.toggle("isPlaying");
    };
    videosWrap.addEventListener("click", (e => videoEventHandler(e)));
}
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

        function getDoctorFromURL() {
            const params = new URLSearchParams(window.location.search || window.location.hash.split('?')[1]);
            return params.get('doctor');
        }

        function removeDoctorParamFromURL() {
            const url = new URL(window.location);
            url.searchParams.delete('doctor');
            window.history.replaceState(null, '', url.toString());
        }

        function resetNavigationButtons() {
            container.querySelectorAll(buttonsSelector).forEach((button) => {
                button.classList.remove(buttonActiveClass);
            });
        }

        function resetCheckboxes() {
            container.querySelectorAll(`${checkboxSelector} input[type="checkbox"]`).forEach((checkbox) => {
                checkbox.checked = false;
            });
        }

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

        function initializeActiveButton() {
            const allButton = container.querySelector(`${buttonsSelector}[data-filter="all"]`);
            if (allButton) {
                resetNavigationButtons();
                allButton.classList.add(buttonActiveClass);
            }
        }

        function resetAllFilters() {
            container.querySelectorAll(itemSelector).forEach((item) => {
                item.classList.remove(itemHiddenClass, itemCheckboxHiddenClass);
            });
            resetNavigationButtons();
            resetCheckboxes();
            resetSelects();
            initializeActiveButton();
            removeDoctorParamFromURL();
        }

        function updateSelectState(optionElement, text, value) {
            container.querySelectorAll(".filter__select .select__option").forEach((opt) => {
                opt.classList.remove("_active");
            });

            if (optionElement) optionElement.classList.add("_active");

            const selectInput = container.querySelector(".filter__select .select__input");
            if (selectInput) {
                selectInput.value = text || "Все специалисты";
            }
        }

        function applySelectFilter(filterValue) {
            container.querySelectorAll(itemSelector).forEach((item) => {
                const isMatchBySelect =
                    filterValue === "all" ||
                    item.classList.contains(selectFilterClassPrefix + filterValue);

                item.classList.remove(itemHiddenClass, itemCheckboxHiddenClass);
                item.classList.toggle(itemCheckboxHiddenClass, !isMatchBySelect);
            });
        }

        const selectOptions = container.querySelectorAll(".filter__select .select__option");
        if (selectOptions.length > 0) {
            selectOptions.forEach((option) => {
                option.addEventListener("click", (e) => {

                    resetCheckboxes();
                    resetNavigationButtons();

                    const href = option.getAttribute("href") || "";
                    const match = href.match(/[?&]doctor=([^&]+)/);
                    const filterValue = match ? match[1] : "all";
                    const selectedText = option.querySelector(".select__option-text").textContent;

                    updateSelectState(option, selectedText, filterValue);

                    const newUrl = filterValue === "all"
                        ? "/results/"
                        : `?doctor=${filterValue}`;
                    window.history.pushState(null, '', newUrl);

                    applySelectFilter(filterValue);
                });
            });
        }

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

                item.classList.remove(itemHiddenClass);
                item.classList.toggle(itemCheckboxHiddenClass, !isMatchByDoctor);
            });
        }

        if (filterReset) {
            filterReset.addEventListener("click", (e) => {
                e.preventDefault();
                resetAllFilters();
            });
        }

        setTimeout(() => {
            container.querySelectorAll(`${checkboxSelector} input[type="checkbox"]`).forEach((checkbox) => {
                const event = new Event("change", { bubbles: true });
                checkbox.dispatchEvent(event);
            });
        }, 0);

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

        function initializeSelect() {
            const urlDoctor = getDoctorFromURL();

            if (urlDoctor) {
                const savedOption = container.querySelector(
                    `.filter__select .select__option[href*="doctor=${urlDoctor}"]`
                );
                if (savedOption) {
                    const text = savedOption.querySelector(".select__option-text").textContent;
                    updateSelectState(savedOption, text, urlDoctor);
                    applySelectFilter(urlDoctor);
                }
            } else {
                const allOption = container.querySelector('.filter__select .select__option[href="/results/"]');
                if (allOption) {
                    const text = allOption.querySelector(".select__option-text").textContent;
                    updateSelectState(allOption, text, "all");
                }
            }
        }

        initializeActiveButton();
        initializeSelect();
    }
}
const schemeIcons = document.querySelectorAll(".image-scheme-tabs__icon");
let schemeCloses = document.querySelectorAll(".image-scheme-tabs__icon-close");
if (schemeIcons) schemeIcons.forEach((icon => {
    icon.addEventListener("click", (function (e) {
        let parent = e.target.parentNode;
        let activeIcon = document.querySelector(".image-scheme-tabs__icons._active");
        if (activeIcon) activeIcon.classList.remove("_active");
        parent.classList.add("_active");
    }));
    schemeCloses.forEach((close => {
        close.addEventListener("click", (function (e) {
            let activeIcon = document.querySelector(".image-scheme-tabs__icons._active");
            if (activeIcon) activeIcon.classList.remove("_active");
        }));
    }));
}));
const showmoreButtons = document.querySelectorAll(".result-popup__showmore-button");
if (showmoreButtons) showmoreButtons.forEach((button => {
    button.addEventListener("click", (function (e) {
        this.parentNode.classList.toggle("_showmore-active");
    }));
}));
const searchInput = document.querySelector(".list-tabs__search input");
const containerSelector = ".spollers__item";
const columnSelector = ".list-tabs__column";
const buttonSelector = `${containerSelector} .spollers__title`;
const activeClass = "_spoller-active";
if (containerSelector) {
    function isMatch(element, query) {
        const textContent = element.textContent.toLowerCase().replace(/[^а-яёa-z]/gi, "");
        const queryText = query.toLowerCase().replace(/[^а-яёa-z]/gi, "");
        return textContent.includes(queryText);
    }
    function saveState(container) {
        const id = container.getAttribute("data-id");
        if (id) if (container.classList.contains(activeClass)) localStorage.setItem(`spoller-state-${id}`, "open"); else localStorage.removeItem(`spoller-state-${id}`);
    }
    function restoreState() {
        document.querySelectorAll(containerSelector).forEach((container => {
            const id = container.getAttribute("data-id");
            if (id && "open" === localStorage.getItem(`spoller-state-${id}`)) {
                container.classList.add(activeClass);
                const body = container.querySelector(".spollers__body");
                if (body) body.hidden = false;
            }
        }));
    }
    function checkColumnVisibility(column) {
        const items = column.querySelectorAll(containerSelector);
        const allHidden = Array.from(items).every((item => "none" === item.style.display));
        column.style.display = allHidden ? "none" : "";
    }
    document.querySelectorAll(containerSelector).forEach((container => {
        container.classList.remove(activeClass);
        const body = container.querySelector(".spollers__body");
        if (body) body.hidden = true;
    }));
    restoreState();
    document.querySelectorAll(columnSelector).forEach((column => {
        checkColumnVisibility(column);
    }));
    if (searchInput) searchInput.addEventListener("input", (function () {
        const query = this.value.trim();
        const containers = document.querySelectorAll(containerSelector);
        containers.forEach((container => {
            container.querySelector(buttonSelector);
            const body = container.querySelector(".spollers__body");
            if (query) if (isMatch(container, query)) {
                container.style.display = "";
                if (!container.classList.contains(activeClass)) {
                    container.classList.add(activeClass);
                    if (body) body.hidden = false;
                }
            } else {
                container.style.display = "none";
                if (container.classList.contains(activeClass)) {
                    container.classList.remove(activeClass);
                    if (body) body.hidden = true;
                }
            } else {
                container.style.display = "";
                if (container.classList.contains(activeClass)) {
                    container.classList.remove(activeClass);
                    if (body) body.hidden = true;
                }
            }
            saveState(container);
        }));
        document.querySelectorAll(columnSelector).forEach((column => {
            checkColumnVisibility(column);
        }));
    }));
    document.addEventListener("click", (e => {
        const button = e.target.closest(buttonSelector);
        if (button) {
            const container = button.closest(containerSelector);
            const body = container.querySelector(".spollers__body");
            container.classList.toggle(activeClass);
            if (body) body.hidden = !container.classList.contains(activeClass);
            saveState(container);
        }
    }));
}
const containerMenuSelector = ".spollers-menu__item";
const buttonMenuSelector = `${containerMenuSelector} .spollers-menu__title > span`;
const activeMenuClass = "_spoller-active";
if (containerMenuSelector) document.addEventListener("click", (e => {
    const button = e.target.closest(buttonMenuSelector);
    if (button) document.querySelectorAll(containerMenuSelector).forEach((function (n) {
        n.classList[n === this ? "toggle" : "remove"](activeMenuClass);
    }), button.closest(containerMenuSelector));
}));
const paymentOnline = document.querySelector(".payment-online__body");
if (paymentOnline) {
    const buttonPrevStep = document.querySelector(".payment-button-prev");
    const buttonNextStep = document.querySelector(".payment-button-next");
    const buttonSubmit = document.querySelector(".button-submit");
    const steps = document.querySelectorAll(".payment-online__step");
    const stepsLine = document.querySelectorAll(".top-payment-online__step");
    const formsOptions = document.querySelector(".forms__options");
    const consultationOptions = document.querySelector(".consultation-options");
    let currentStep = 0;
    let selectedPrice = 0;
    let isPrepayment = false;
    document.querySelectorAll(".teams__slide").forEach((slide => {
        if (slide.querySelector("input:checked")) {
            selectedPrice = parseInt(slide.dataset.price) || 0;
            slide.classList.add("_active");
        }
    }));
    function formatPrice(value) {
        return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " ₽";
    }
    function updateTotalDisplay() {
        const consultationTotal = document.querySelector(".total-consultation span");
        const prepaymentInput = document.querySelector(".prepayment-input");
        if (isPrepayment) {
            prepaymentInput.value = "";
            document.querySelector(".total-prepayment").classList.remove("_hidden");
            document.querySelector(".total-consultation").classList.add("_hidden");
        } else {
            consultationTotal.textContent = formatPrice(selectedPrice);
            prepaymentInput.value = selectedPrice;
            document.querySelector(".total-consultation").classList.remove("_hidden");
            document.querySelector(".total-prepayment").classList.add("_hidden");
        }
    }
    document.querySelectorAll(".consultation-options, .prepayment-option").forEach((input => {
        input.addEventListener("change", (() => {
            isPrepayment = input.classList.contains("prepayment-option");
            updateTotalDisplay();
        }));
    }));
    const prepaymentInput = document.querySelector(".prepayment-input");
    if (prepaymentInput) prepaymentInput.value = selectedPrice;
    document.querySelectorAll(".teams__slide").forEach((slide => {
        slide.addEventListener("click", (() => {
            selectedPrice = parseInt(slide.dataset.price) || 0;
            document.querySelectorAll(".teams__slide").forEach((s => s.classList.remove("_active")));
            slide.classList.add("_active");
            if (2 === currentStep) updateTotalDisplay();
        }));
    }));
    updateTotalDisplay();
    buttonNextStep.addEventListener("click", (() => {
        hideStep(currentStep);
        currentStep++;
        showStep(currentStep);
        updateProgressLine();
    }));
    buttonPrevStep.addEventListener("click", (() => {
        hideStep(currentStep);
        currentStep--;
        showStep(currentStep);
        updateProgressLine();
    }));
    stepsLine.forEach(((step, index) => {
        step.addEventListener("click", (() => {
            if (index <= currentStep || index === currentStep + 1) {
                hideStep(currentStep);
                currentStep = index;
                showStep(currentStep);
                updateProgressLine();
            }
        }));
    }));
    function showStep(index) {
        steps[index].classList.add("_active");
        updateNavigation();
        if (2 === index) {
            updateTotalDisplay();
            formsOptions.style.display = consultationOptions.checked ? "block" : "none";
        }
        updateProgressLine();
    }
    function hideStep(index) {
        steps[index].classList.remove("_active");
    }
    function updateNavigation() {
        buttonPrevStep.style.display = 0 === currentStep ? "none" : "flex";
        buttonNextStep.style.display = currentStep === steps.length - 1 ? "none" : "flex";
        buttonSubmit.style.display = currentStep === steps.length - 1 ? "flex" : "none";
        if (currentStep === steps.length - 1) buttonPrevStep.classList.add("_active-last"); else buttonPrevStep.classList.remove("_active-last");
        updateProgressLine();
    }
    function updateProgressLine() {
        stepsLine.forEach(((step, index) => {
            step.classList.toggle("_active", index === currentStep);
            step.classList.toggle("_completed", index < currentStep);
            if (index === stepsLine.length - 1 && currentStep === steps.length - 1) step.classList.add("_active");
        }));
    }
    document.querySelector(".payment-online__body").addEventListener("submit", (function (e) {
        const prepaymentInput = document.querySelector(".prepayment-input");
        if (isPrepayment) {
            if (!prepaymentInput.value || parseFloat(prepaymentInput.value) <= 0) {
                e.preventDefault();
                alert("Введите сумму предоплаты");
            }
        } else if (!prepaymentInput.value) {
            e.preventDefault();
            alert("Ошибка: не установлена стоимость консультации");
        }
    }));
    const teamsSlider = document.querySelector(".payment-online__teams");
    if (teamsSlider) {
        teamsSlider.addEventListener("change", (function () {
            document.querySelectorAll(".forms-options__items").forEach((item => {
                item.classList.toggle("_active", Array.from(this.querySelectorAll(":checked"), (n => n.dataset.filter)).includes(item.dataset.doctor));
            }));
        }));
        teamsSlider.dispatchEvent(new Event("change"));
    }
}
const inputs = document.querySelectorAll("input");
if (inputs) inputs.forEach((input => {
    input.addEventListener("input", (function (e) {
        if ("" !== input.value) input.classList.add("filled"); else input.classList.remove("filled");
    }));
}));
const patientDetails = document.querySelector(".forms-patients-details");
const paidMyselfBlock = document.querySelector(".forms-paid-myself");
const personDetails = document.querySelector(".forms-person-details");
const additionalInfo = document.querySelector(".forms-additional-information");
const taxCheckboxBlock = document.querySelector(".forms-tax-checkbox");
const nextButton = document.querySelector(".tax__button-next");
const submitButton = document.querySelector(".tax__button-submit");
const prevButton = document.querySelector(".tax__button-prev");
const cancelButton = document.querySelector(".tax__button.button");
const paidMyselfCheckbox = document.querySelector(".paid-myself");
let currentStep = 1;
if (nextButton) nextButton.addEventListener("click", (function (e) {
    e.preventDefault();
    const form = document.querySelector("form");
    const errorCount = formValidate.getErrors(form);
    if (0 === errorCount) if (1 === currentStep) if (paidMyselfCheckbox && paidMyselfCheckbox.checked) {
        hide([patientDetails, paidMyselfBlock, personDetails]);
        show([additionalInfo, taxCheckboxBlock]);
        nextButton.classList.add("hidden");
        submitButton.classList.remove("hidden");
        prevButton.classList.remove("hidden");
        cancelButton.classList.add("hidden");
        currentStep = 3;
    } else {
        hide([patientDetails, paidMyselfBlock]);
        show([personDetails]);
        nextButton.classList.remove("hidden");
        submitButton.classList.add("hidden");
        prevButton.classList.remove("hidden");
        cancelButton.classList.add("hidden");
        currentStep = 2;
    } else if (2 === currentStep) {
        hide([personDetails]);
        show([additionalInfo, taxCheckboxBlock]);
        nextButton.classList.add("hidden");
        submitButton.classList.remove("hidden");
        currentStep = 3;
    }
}));
if (prevButton) prevButton.addEventListener("click", (function (e) {
    e.preventDefault();
    if (2 === currentStep) {
        hide([personDetails]);
        show([patientDetails, paidMyselfBlock]);
        nextButton.classList.remove("hidden");
        submitButton.classList.add("hidden");
        prevButton.classList.add("hidden");
        cancelButton.classList.remove("hidden");
        currentStep = 1;
    } else if (3 === currentStep) {
        hide([additionalInfo, taxCheckboxBlock]);
        if (paidMyselfCheckbox && paidMyselfCheckbox.checked) {
            show([patientDetails, paidMyselfBlock]);
            nextButton.classList.remove("hidden");
            submitButton.classList.add("hidden");
            prevButton.classList.add("hidden");
            cancelButton.classList.remove("hidden");
            currentStep = 1;
        } else {
            show([personDetails]);
            nextButton.classList.remove("hidden");
            submitButton.classList.add("hidden");
            prevButton.classList.remove("hidden");
            cancelButton.classList.add("hidden");
            currentStep = 2;
        }
    }
}));
if (paidMyselfCheckbox) paidMyselfCheckbox.addEventListener("change", (function () {
    if (2 === currentStep && this.checked) {
        hide([personDetails]);
        show([additionalInfo, taxCheckboxBlock]);
        nextButton.classList.add("hidden");
        submitButton.classList.remove("hidden");
        currentStep = 3;
    }
}));
function hide(elements) {
    elements.forEach((el => {
        if (el && !el.classList.contains("hidden")) el.classList.add("hidden");
    }));
}
function show(elements) {
    elements.forEach((el => {
        if (el && el.classList.contains("hidden")) el.classList.remove("hidden");
    }));
}
if (cancelButton) cancelButton.addEventListener("click", (function (e) {
    e.preventDefault();
    hide([personDetails, additionalInfo, taxCheckboxBlock]);
    show([patientDetails, paidMyselfBlock]);
    nextButton.classList.remove("hidden");
    submitButton.classList.add("hidden");
    prevButton.classList.add("hidden");
    cancelButton.classList.remove("hidden");
    currentStep = 1;
    if (paidMyselfCheckbox) paidMyselfCheckbox.checked = false;
}));
function indents() {
    const header = document.querySelector(".header");
    const page = document.querySelector(".main-home");
    if (page) {
        let hHeader = window.getComputedStyle(header, false).height;
        hHeader = Number(hHeader.slice(0, hHeader.length - 2));
        page.style.paddingTop = hHeader + "px";
    }
    const menuBody = document.querySelector(".menu__body");
    if (menuBody) {
        let hHeader = window.getComputedStyle(header, false).height;
        hHeader = Number(hHeader.slice(0, hHeader.length - 2));
        if (document.documentElement.clientWidth < 991.98) {
            menuBody.style.top = hHeader + "px";
            menuBody.style.minHeight = `calc(100vh - ${hHeader}px)`;
            menuBody.style.height = `calc(100vh - ${hHeader}px)`;
        } else {
            menuBody.style.top = "0px";
            menuBody.style.minHeight = "auto";
            menuBody.style.height = "auto";
        }
    }
    const aboutImage = document.querySelector(".top-main-about__image");
    const aboutLine = document.querySelector(".main-about-line");
    if (aboutLine) {
        let haboutImage = window.getComputedStyle(aboutImage, false).width;
        haboutImage = Number(haboutImage.slice(0, haboutImage.length - 2));
        const aboutSum = haboutImage + 56;
        aboutLine.style.left = aboutSum + "px";
    }
}
window.addEventListener("scroll", (() => {
    indents();
}));
window.addEventListener("resize", (() => {
    indents();
}));
indents();
function animateNumber(element) {
    const number = parseInt(element.getAttribute("data-number"), 10);
    const duration = 3500;
    const start = performance.now();
    function update(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const current = Math.floor(progress * number);
        element.textContent = current;
        if (progress < 1) requestAnimationFrame(update); else element.textContent = number;
    }
    requestAnimationFrame(update);
}
const observer = new MutationObserver((function (mutationsList) {
    for (const mutation of mutationsList) if ("attributes" === mutation.type && "class" === mutation.attributeName) {
        const target = mutation.target;
        const span = target.querySelector("[data-number]");
        if (target.classList.contains("_watcher-view")) if (span && !span.dataset.animated) {
            animateNumber(span);
            span.dataset.animated = "true";
        }
    }
}));
document.querySelectorAll(".top-main-about__number").forEach((el => {
    observer.observe(el, {
        attributes: true
    });
}));
document.querySelectorAll('.files-forms__button input[type="file"]').forEach((input => {
    let fileList = [];
    const MAX_FILE_SIZE = 5 * 1024 * 1024;
    const filesForms = input.closest(".files-forms");
    const previewContainer = filesForms.querySelector(".files-forms__previews");
    const errorElement = filesForms.querySelector(".files-forms__error");
    if (!previewContainer) return;
    input.addEventListener("change", (function () {
        let hasLargeFile = false;
        for (let i = 0; i < this.files.length; i++) {
            const file = this.files[i];
            if (file.size > MAX_FILE_SIZE) {
                hasLargeFile = true;
                continue;
            }
            if (!fileList.some((f => f.name === file.name && f.size === file.size))) fileList.push(file);
        }
        if (errorElement) if (hasLargeFile) errorElement.classList.add("active"); else errorElement.classList.remove("active");
        updatePreview();
        updateFileInput();
    }));
    function formatFileSize(bytes) {
        if (0 === bytes) return "0 Б";
        const k = 1024;
        const sizes = ["Б", "КБ", "МБ", "ГБ"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
    }
    function updatePreview() {
        previewContainer.innerHTML = "";
        if (0 === fileList.length) {
            previewContainer.style.display = "none";
            return;
        }
        previewContainer.style.display = "flex";
        fileList.forEach(((file, index) => {
            const item = document.createElement("div");
            item.classList.add("files-forms__preview");
            const previewIcon = document.createElement("div");
            previewIcon.classList.add("files-forms__preview-icon");
            const fileName = document.createElement("div");
            fileName.classList.add("files-forms__file-name");
            const fileNameSpan = document.createElement("span");
            fileNameSpan.textContent = file.name;
            const fileSizeSpan = document.createElement("div");
            fileSizeSpan.textContent = formatFileSize(file.size);
            fileName.appendChild(fileNameSpan);
            fileName.appendChild(fileSizeSpan);
            const remove = document.createElement("div");
            remove.classList.add("files-forms__preview-close");
            remove.addEventListener("click", (e => {
                e.stopPropagation();
                fileList.splice(index, 1);
                updateFileInput();
                updatePreview();
                if (errorElement) errorElement.classList.remove("active");
            }));
            item.appendChild(previewIcon);
            item.appendChild(fileName);
            item.appendChild(remove);
            previewContainer.appendChild(item);
        }));
    }
    function updateFileInput() {
        const dataTransfer = new DataTransfer;
        fileList.forEach((file => dataTransfer.items.add(file)));
        input.files = dataTransfer.files;
    }
    previewContainer.style.display = "none";
}));
function adjustStructureLines() {
    const itemsContainers = document.querySelectorAll(".block-structure__items");
    itemsContainers.forEach((container => {
        const items = container.querySelectorAll(".block-structure__item");
        if (items.length > 0) {
            const originalDisplay = container.style.display;
            const originalOpacity = container.style.opacity;
            const originalVisibility = container.style.visibility;
            const originalMaxHeight = container.style.maxHeight;
            const originalTransform = container.style.transform;
            container.style.display = "flex";
            container.style.opacity = "1";
            container.style.visibility = "visible";
            container.style.maxHeight = "none";
            container.style.transform = "none";
            const lastItem = items[items.length - 1];
            const lastItemRect = lastItem.getBoundingClientRect();
            const containerRect = container.getBoundingClientRect();
            const lastItemCenter = lastItemRect.top - containerRect.top + lastItemRect.height / 2;
            const isColumn1 = container.closest(".block-structure__column1") && !container.closest(".block-structure__column2");
            if (isColumn1) {
                const lastColumn2 = container.querySelector(".block-structure__column2:last-child");
                if (lastColumn2) {
                    const lastDropdownTitle = lastColumn2.querySelector(".block-structure__item.item-title");
                    if (lastDropdownTitle) {
                        const lastDropdownTitleRect = lastDropdownTitle.getBoundingClientRect();
                        const lastDropdownTitleCenter = lastDropdownTitleRect.top - containerRect.top + lastDropdownTitleRect.height / 2 - 20;
                        const lineHeight = Math.max(0, lastDropdownTitleCenter);
                        container.style.setProperty("--line-height", `${Math.round(lineHeight)}px`);
                    } else container.style.setProperty("--line-height", `${Math.round(lastItemCenter)}px`);
                } else container.style.setProperty("--line-height", `${Math.round(lastItemCenter)}px`);
            } else container.style.setProperty("--line-height", `${Math.round(lastItemCenter)}px`);
            container.style.display = originalDisplay;
            container.style.opacity = originalOpacity;
            container.style.visibility = originalVisibility;
            container.style.maxHeight = originalMaxHeight;
            container.style.transform = originalTransform;
        }
    }));
}
function adjustCalcColumnsLines() {
    const calcColumns = document.querySelectorAll(".block-structure__column-calc .block-structure__items");
    calcColumns.forEach((container => {
        const items = container.querySelectorAll(".block-structure__item");
        if (items.length > 0) {
            const lastItem = items[items.length - 1];
            const lastItemRect = lastItem.getBoundingClientRect();
            const containerRect = container.getBoundingClientRect();
            const lastItemCenter = lastItemRect.top - containerRect.top + lastItemRect.height / 2 - 20;
            container.style.setProperty("--line-height", `${Math.round(lastItemCenter)}px`);
        }
    }));
}
function adjustAllLines() {
    adjustStructureLines();
    adjustCalcColumnsLines();
}
const dropdownBlocks = document.querySelectorAll(".block-structure-dropdowm");
if (dropdownBlocks) dropdownBlocks.forEach((block => {
    const titleItem = block.querySelector(".block-structure__item.item-title");
    if (titleItem) titleItem.addEventListener("click", (function () {
        block.classList.toggle("active");
        setTimeout(adjustAllLines, 300);
    }));
}));
document.addEventListener("DOMContentLoaded", (function () {
    adjustAllLines();
}));
window.addEventListener("resize", adjustAllLines);
const videoContainers = document.querySelectorAll('.result-popup__video');

videoContainers.forEach(container => {
    const playButton = container.querySelector('.result-popup__play');

    function findVideo() {
        let video = container.querySelector('.result-popup__item-video, video');

        if (!video) {
            const videoMount = container.querySelector('.result-popup__videoMount');
            if (videoMount && videoMount.dataset.videoSrc) {
                video = document.createElement('video');
                video.className = 'result-popup__item-video video';
                video.controls = true;
                video.preload = 'none';
                video.playsInline = true;

                if (videoMount.dataset.poster) {
                    video.poster = videoMount.dataset.poster;
                }

                const source = document.createElement('source');
                source.src = videoMount.dataset.videoSrc;
                source.type = 'video/mp4';

                video.appendChild(source);
                videoMount.appendChild(video);
            }
        }

        return video;
    }

    let video = findVideo();

    if (!playButton || !video) return;

    function updatePlayButtonVisibility() {
        if (video.paused || video.ended) {
            playButton.style.display = 'flex';
        } else {
            playButton.style.display = 'none';
        }
    }

    playButton.addEventListener('click', function (e) {
        e.stopPropagation();
        e.preventDefault();

        if (video.paused) {
            video.play().catch(error => {
                console.log('Ошибка воспроизведения:', error);
            });
        }
        playButton.style.display = 'none';
    });

    video.addEventListener('click', function (e) {
        e.stopPropagation();
        setTimeout(updatePlayButtonVisibility, 100);
    });

    video.addEventListener('play', function () {
        playButton.style.display = 'none';
    });

    video.addEventListener('pause', function () {
        playButton.style.display = 'flex';
    });

    video.addEventListener('ended', function () {
        playButton.style.display = 'flex';
    });

    video.addEventListener('loadedmetadata', function () {
        updatePlayButtonVisibility();
    });

    updatePlayButtonVisibility();
});
const lazyMedia = new LazyLoad({
    elements_selector: '[data-src],[data-srcset]',
    class_loaded: '_lazy-loaded',
    use_native: true
});
isWebp();
menuInit();
spollers();
tabs();
formFieldsInit({
    viewPass: true
});
formSubmit();
pageNavigation();
