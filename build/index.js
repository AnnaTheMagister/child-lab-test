/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/react-dom/client.js"
/*!******************************************!*\
  !*** ./node_modules/react-dom/client.js ***!
  \******************************************/
(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


var m = __webpack_require__(/*! react-dom */ "react-dom");
if (false) // removed by dead control flow
{} else {
  var i = m.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
  exports.createRoot = function(c, o) {
    i.usingClientEntryPoint = true;
    try {
      return m.createRoot(c, o);
    } finally {
      i.usingClientEntryPoint = false;
    }
  };
  exports.hydrateRoot = function(c, h, o) {
    i.usingClientEntryPoint = true;
    try {
      return m.hydrateRoot(c, h, o);
    } finally {
      i.usingClientEntryPoint = false;
    }
  };
}


/***/ },

/***/ "./src/scripts/ArticleReader.js"
/*!**************************************!*\
  !*** ./src/scripts/ArticleReader.js ***!
  \**************************************/
() {

class ArticleReader {
  constructor() {
    this.sections = [];
    this.currentSectionIndex = 0;
    this.readingMode = this.getStoredMode();
    this.init();
  }
  init() {
    // Собираем все разделы статьи
    this.collectSections();

    // Инициализируем компоненты
    this.initTableOfContents();
    this.initReadingProgress();
    this.initSectionNavigation();
    this.initModeSwitcher();

    // Начинаем отслеживать скролл
    this.startScrollTracking();
  }
  collectSections() {
    // Находим все заголовки h2 и h3 с ID
    const headings = document.querySelectorAll('h2[id], h3[id]');
    headings.forEach((heading, index) => {
      this.sections.push({
        id: heading.id,
        element: heading,
        title: heading.textContent.trim(),
        level: heading.tagName,
        top: heading.offsetTop,
        index: index
      });
    });
  }
  initTableOfContents() {
    const tocLinks = document.querySelectorAll('.toc-link');
    const self = this;
    tocLinks.forEach(link => {
      link.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href').substring(1);
        self.scrollToSection(targetId);
      });
    });

    // Отслеживаем активный раздел
    window.addEventListener('scroll', () => {
      this.updateActiveTocItem();
    });
  }
  initReadingProgress() {
    const article = document.querySelector('.article-content-wrapper');
    if (!article) return;
    const progressFill = document.querySelector('.progress-fill');
    const progressPercentage = document.querySelector('.progress-percentage');
    const currentPage = document.querySelector('.current-page');
    const updateProgress = () => {
      const articleTop = article.offsetTop;
      const articleHeight = article.offsetHeight;
      const windowHeight = window.innerHeight;
      const scrollTop = window.scrollY;

      // Сколько прокручено статьи
      let scrolled = scrollTop - articleTop;
      scrolled = Math.max(0, scrolled);
      scrolled = Math.min(scrolled, articleHeight - windowHeight);

      // Процент прочитанного
      const percentage = scrolled / (articleHeight - windowHeight) * 100;
      const rounded = Math.round(percentage);
      if (progressFill) {
        progressFill.style.width = percentage + '%';
      }
      if (progressPercentage) {
        progressPercentage.textContent = rounded + '%';
      }

      // Текущая страница (раздел)
      if (currentPage && this.sections.length > 0) {
        const currentSection = this.getCurrentSection();
        if (currentSection) {
          currentPage.textContent = `Раздел: ${currentSection.title}`;
        }
      }
    };
    window.addEventListener('scroll', updateProgress);
    updateProgress(); // Инициализация
  }
  initSectionNavigation() {
    const prevBtn = document.querySelector('.prev-section');
    const nextBtn = document.querySelector('.next-section');
    const topBtn = document.querySelector('.nav-to-top');
    if (prevBtn) {
      prevBtn.addEventListener('click', () => this.navigateToPreviousSection());
    }
    if (nextBtn) {
      nextBtn.addEventListener('click', () => this.navigateToNextSection());
    }
    if (topBtn) {
      topBtn.addEventListener('click', () => window.scrollTo({
        top: 0,
        behavior: 'smooth'
      }));
    }

    // Обновляем состояние кнопок
    this.updateNavigationButtons();
  }
  initModeSwitcher() {
    const modeOptions = document.querySelectorAll('.mode-option[data-mode]');
    const applyBtn = document.querySelector('.apply-mode-btn');
    const closeBtn = document.querySelector('.close-switcher');
    const switcher = document.querySelector('.reading-mode-switcher');
    modeOptions.forEach(option => {
      option.addEventListener('click', e => {
        e.preventDefault();
        const mode = option.dataset.mode;

        // Обновляем активный класс
        modeOptions.forEach(opt => opt.classList.remove('active'));
        option.classList.add('active');

        // Сохраняем выбранный режим
        if (document.getElementById('remember-mode').checked) {
          localStorage.setItem('reading_mode', mode);
        }

        // Применяем режим
        if (applyBtn) {
          applyBtn.dataset.mode = mode;
        }
      });
    });
    if (applyBtn) {
      applyBtn.addEventListener('click', () => {
        const mode = applyBtn.dataset.mode || this.getStoredMode();
        this.changeReadingMode(mode);
      });
    }
    if (closeBtn && switcher) {
      closeBtn.addEventListener('click', () => {
        switcher.style.display = 'none';
      });
    }
  }
  changeReadingMode(mode) {
    const postId = document.querySelector('.article-content-wrapper').dataset.postId;

    // Показываем индикатор загрузки
    this.showLoadingIndicator();

    // AJAX запрос для получения контента в новом режиме
    fetch(ajax_object.ajax_url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        action: 'get_article_content',
        nonce: ajax_object.nonce,
        post_id: postId,
        mode: mode
      })
    }).then(response => response.json()).then(data => {
      if (data.success) {
        // Обновляем контент
        const contentWrapper = document.querySelector('.article-content .content-wrapper');
        if (contentWrapper) {
          contentWrapper.innerHTML = data.data.content;
        }

        // Обновляем индикатор режима
        const indicator = document.querySelector('.current-mode-indicator .mode-label');
        if (indicator) {
          const modeLabels = {
            'scientist_long': '🔬 Режим для ученых (полная версия)',
            'scientist_short': '🔬 Режим для ученых (кратко)',
            'parent_long': '👨‍👩‍👧 Режим для родителей (полная версия)',
            'parent_short': '👨‍👩‍👧 Режим для родителей (кратко)'
          };
          indicator.textContent = modeLabels[mode] || modeLabels['scientist_long'];
        }

        // Обновляем классы
        const articleContent = document.querySelector('.article-content');
        if (articleContent) {
          articleContent.className = articleContent.className.replace(/mode-\S+/g, '');
          articleContent.classList.add(`mode-${mode}`);
        }

        // Перестраиваем навигацию
        this.collectSections();
        this.initTableOfContents();

        // Прокручиваем наверх
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      }
    }).catch(error => {
      console.error('Error changing reading mode:', error);
    }).finally(() => {
      this.hideLoadingIndicator();
    });
  }

  // Вспомогательные методы
  getStoredMode() {
    return localStorage.getItem('reading_mode') || 'scientist_long';
  }
  getCurrentSection() {
    const scrollPosition = window.scrollY + 100;
    for (let i = this.sections.length - 1; i >= 0; i--) {
      if (this.sections[i].top <= scrollPosition) {
        this.currentSectionIndex = i;
        return this.sections[i];
      }
    }
    return null;
  }
  updateActiveTocItem() {
    const currentSection = this.getCurrentSection();
    const tocLinks = document.querySelectorAll('.toc-link');
    tocLinks.forEach(link => {
      link.parentElement.classList.remove('active');
    });
    if (currentSection) {
      const activeLink = document.querySelector(`.toc-link[href="#${currentSection.id}"]`);
      if (activeLink) {
        activeLink.parentElement.classList.add('active');
      }
    }
  }
  updateNavigationButtons() {
    const prevBtn = document.querySelector('.prev-section');
    const nextBtn = document.querySelector('.next-section');
    if (prevBtn) {
      prevBtn.disabled = this.currentSectionIndex <= 0;
    }
    if (nextBtn) {
      nextBtn.disabled = this.currentSectionIndex >= this.sections.length - 1;
    }
  }
  navigateToPreviousSection() {
    if (this.currentSectionIndex > 0) {
      const prevSection = this.sections[this.currentSectionIndex - 1];
      this.scrollToSection(prevSection.id);
    }
  }
  navigateToNextSection() {
    if (this.currentSectionIndex < this.sections.length - 1) {
      const nextSection = this.sections[this.currentSectionIndex + 1];
      this.scrollToSection(nextSection.id);
    }
  }
  scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
      window.scrollTo({
        top: section.offsetTop - 80,
        behavior: 'smooth'
      });
    }
  }
  startScrollTracking() {
    window.addEventListener('scroll', () => {
      this.updateActiveTocItem();
      this.updateNavigationButtons();
    });
  }
  showLoadingIndicator() {
    // Показать индикатор загрузки
    const loader = document.createElement('div');
    loader.className = 'article-loading';
    loader.innerHTML = '<div class="spinner"></div><p>Загружаем контент...</p>';
    document.querySelector('.article-content-wrapper').appendChild(loader);
  }
  hideLoadingIndicator() {
    const loader = document.querySelector('.article-loading');
    if (loader) {
      loader.remove();
    }
  }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
  // window.articleReader = new ArticleReader();
});

/***/ },

/***/ "./src/scripts/widgets/FrontListComponent/FrontListComponent.tsx"
/*!***********************************************************************!*\
  !*** ./src/scripts/widgets/FrontListComponent/FrontListComponent.tsx ***!
  \***********************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   FrontListComponent: () => (/* binding */ FrontListComponent)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _Loader_Loader__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Loader/Loader */ "./src/scripts/widgets/Loader/Loader.tsx");
/* harmony import */ var _distributeTags__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./distributeTags */ "./src/scripts/widgets/FrontListComponent/distributeTags.ts");




const BASE_URL = window.location.host === 'localhost' ? 'http://localhost/childlab.local/' : window.location.origin;
const DEFAULT_TAG = {
  id: -1,
  name: "Все",
  acf: {
    color: "rgba(138, 214, 80, 1)"
  }
};
const getScreenSize = size => {
  if (size > 1200) {
    return "xlg";
  }
  if (size <= 1200 && size > 992) {
    return "lg";
  }
  if (size <= 992 && size > 768) {
    return "md";
  }
  if (size <= 768) {
    return "sm";
  }
  return "sm";
};
const getMaxTagsInRow = size => size === "lg" || size == "xlg" ? 6 : size === "md" || size === "sm" ? 3 : 2;
const FrontListComponent = () => {
  const [tagsData, setTagsData] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)([]);
  const [tagsLoading, setTagsLoading] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(true);
  const [maxTagsInRow, setMaxTagsInRow] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(getMaxTagsInRow(getScreenSize(window.innerWidth)));
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    window.addEventListener("resize", () => {
      setMaxTagsInRow(getMaxTagsInRow(getScreenSize(window.innerWidth)));
    });
  }, []);
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    fetch(BASE_URL + "/wp-json/wp/v2/methodology-tags").then(response => response.json()).then(data => {
      setTagsData([DEFAULT_TAG, ...data.filter(t => t.acf.order > 0).sort((t1, t2) => t1.acf.order - t2.acf.order)]);
      setTagsLoading(false);
    });
  }, []);
  const distributedTags = (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => {
    if (!tagsData.length) {
      return [];
    }
    const distribution = (0,_distributeTags__WEBPACK_IMPORTED_MODULE_2__.distributeTags)(tagsData.length, maxTagsInRow);
    let currentRow = 0;
    let acc = 0;
    return tagsData.map((tag, id) => {
      if (id >= acc + distribution[currentRow]) {
        acc += distribution[currentRow];
        currentRow++;
      }
      return {
        ...tag,
        width: distribution[currentRow]
      };
    });
  }, [tagsData, maxTagsInRow]);
  console.log("!!!", distributedTags);
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "container"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "methodology-tags-menu"
  }, tagsLoading && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_Loader_Loader__WEBPACK_IMPORTED_MODULE_1__["default"], {
    fullScreen: false
  }), distributedTags.map(tag => {
    return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(MethodologyTagComponent, {
      key: tag.id,
      ...tag
    });
  })));
};
const DEFAULT_SVG_PATTERN = "./wp-content/themes/childlab-react/assets/images/svg-patterns/all.svg";
const MethodologyTagComponent = tag => {
  var _tag$acf$color, _tag$width;
  const backgroundColor = (_tag$acf$color = tag.acf.color) !== null && _tag$acf$color !== void 0 ? _tag$acf$color : "#f00";
  const svg_pattern = tag.acf.svg_pattern ? tag.acf.svg_pattern : DEFAULT_SVG_PATTERN;
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("a", {
    href: `?methodology=${tag.id}`,
    className: `childlab-widget childlab-card-link methodology-tags-menu__tag methodology-tag-width-${(_tag$width = tag.width) !== null && _tag$width !== void 0 ? _tag$width : 4}`,
    style: {
      backgroundColor
    }
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "methodology-tags-menu__svg-background",
    ref: ref => {
      createSVGPattern(ref, svg_pattern, {
        count: 10,
        minScale: 0.6,
        maxScale: 0.4,
        minRotate: -180,
        maxRotate: 180,
        spacing: 5,
        opacity: 0.5
      });
    }
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    title: tag.name,
    class: "truncate"
  }, tag.name));
};

/***/ },

/***/ "./src/scripts/widgets/FrontListComponent/distributeTags.ts"
/*!******************************************************************!*\
  !*** ./src/scripts/widgets/FrontListComponent/distributeTags.ts ***!
  \******************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   distributeTags: () => (/* binding */ distributeTags)
/* harmony export */ });
const distributeTags = (tagsLength, maxTagsInRow) => {
  // Вычисляем минимальное количество элементов в ряду
  const minTagsInRow = Math.ceil(maxTagsInRow / 2);

  // Если всего элементов меньше или равно максимуму, возвращаем один ряд
  if (tagsLength <= maxTagsInRow) {
    return [tagsLength];
  }

  // Вычисляем минимальное количество рядов
  const minRows = Math.ceil(tagsLength / maxTagsInRow);

  // Пробуем распределить элементы по рядам
  for (let rows = minRows; rows <= Math.ceil(tagsLength / minTagsInRow); rows++) {
    // Пытаемся распределить элементы поровну
    const baseCount = Math.floor(tagsLength / rows);
    const remainder = tagsLength % rows;
    const distribution = [];

    // Создаем распределение
    for (let i = 0; i < rows; i++) {
      // Первые remainder рядов получают на 1 элемент больше
      distribution.push(i < remainder ? baseCount + 1 : baseCount);
    }

    // Проверяем, удовлетворяет ли распределение ограничениям
    const isValid = distribution.every(count => count >= minTagsInRow && count <= maxTagsInRow);
    if (isValid) {
      return distribution;
    }
  }

  // Если не удалось найти распределение, используем жадный алгоритм
  const result = [];
  let remaining = tagsLength;
  while (remaining > 0) {
    // Пытаемся взять максимальное количество
    let count = Math.min(maxTagsInRow, remaining);

    // Если оставшихся меньше минимального, корректируем предыдущий ряд
    if (remaining - count < minTagsInRow && remaining - count > 0) {
      // Вычисляем, сколько нужно оставить для следующего ряда
      const nextRowMin = minTagsInRow;
      count = remaining - nextRowMin;
    }

    // Убедимся, что count не меньше минимального
    count = Math.max(count, Math.min(minTagsInRow, remaining));
    result.push(count);
    remaining -= count;
  }
  return result;
};

/***/ },

/***/ "./src/scripts/widgets/Loader/Loader.css"
/*!***********************************************!*\
  !*** ./src/scripts/widgets/Loader/Loader.css ***!
  \***********************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ },

/***/ "./src/scripts/widgets/Loader/Loader.tsx"
/*!***********************************************!*\
  !*** ./src/scripts/widgets/Loader/Loader.tsx ***!
  \***********************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _Loader_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Loader.css */ "./src/scripts/widgets/Loader/Loader.css");



const Loader = ({
  size = "medium",
  fullScreen = false,
  className = ""
}) => {
  const loaderClass = `loader-container ${fullScreen ? "full-screen" : ""} ${className}`;
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: loaderClass,
    "data-testid": "loader"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: `loader-spinner loader-${size}`
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "loader-dot"
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "loader-dot"
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "loader-dot"
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "loader-dot"
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "loader-dot"
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "loader-dot"
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "loader-dot"
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "loader-dot"
  })));
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Loader);

/***/ },

/***/ "./src/scripts/widgets/index.ts"
/*!**************************************!*\
  !*** ./src/scripts/widgets/index.ts ***!
  \**************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   FrontListComponent: () => (/* reexport safe */ _FrontListComponent_FrontListComponent__WEBPACK_IMPORTED_MODULE_0__.FrontListComponent)
/* harmony export */ });
/* harmony import */ var _FrontListComponent_FrontListComponent__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./FrontListComponent/FrontListComponent */ "./src/scripts/widgets/FrontListComponent/FrontListComponent.tsx");


/***/ },

/***/ "./src/styles/grid-system.scss"
/*!*************************************!*\
  !*** ./src/styles/grid-system.scss ***!
  \*************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ },

/***/ "./src/styles/header.scss"
/*!********************************!*\
  !*** ./src/styles/header.scss ***!
  \********************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ },

/***/ "./src/styles/main.scss"
/*!******************************!*\
  !*** ./src/styles/main.scss ***!
  \******************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ },

/***/ "react"
/*!************************!*\
  !*** external "React" ***!
  \************************/
(module) {

"use strict";
module.exports = window["React"];

/***/ },

/***/ "react-dom"
/*!***************************!*\
  !*** external "ReactDOM" ***!
  \***************************/
(module) {

"use strict";
module.exports = window["ReactDOM"];

/***/ }

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Check if module exists (development only)
/******/ 		if (__webpack_modules__[moduleId] === undefined) {
/******/ 			var e = new Error("Cannot find module '" + moduleId + "'");
/******/ 			e.code = 'MODULE_NOT_FOUND';
/******/ 			throw e;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be in strict mode.
(() => {
"use strict";
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _styles_main_scss__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./styles/main.scss */ "./src/styles/main.scss");
/* harmony import */ var _styles_grid_system_scss__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./styles/grid-system.scss */ "./src/styles/grid-system.scss");
/* harmony import */ var _styles_header_scss__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./styles/header.scss */ "./src/styles/header.scss");
/* harmony import */ var _scripts_ArticleReader__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./scripts/ArticleReader */ "./src/scripts/ArticleReader.js");
/* harmony import */ var _scripts_ArticleReader__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_scripts_ArticleReader__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _scripts_widgets__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./scripts/widgets */ "./src/scripts/widgets/index.ts");
/* harmony import */ var react_dom_client__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! react-dom/client */ "./node_modules/react-dom/client.js");








const root = react_dom_client__WEBPACK_IMPORTED_MODULE_6__.createRoot(document.querySelector("#render-react-example-here"));
root.render((0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_scripts_widgets__WEBPACK_IMPORTED_MODULE_5__.FrontListComponent, null));
})();

/******/ })()
;
//# sourceMappingURL=index.js.map