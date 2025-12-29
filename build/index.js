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
  window.articleReader = new ArticleReader();
});

/***/ },

/***/ "./src/scripts/ExampleReactComponent.js"
/*!**********************************************!*\
  !*** ./src/scripts/ExampleReactComponent.js ***!
  \**********************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _styles_article_scss__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../styles/article.scss */ "./src/styles/article.scss");



function ExampleReactComponent() {
  const [clickCount, setClickCount] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(0);
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "example-react-component",
    onClick: () => setClickCount(prev => prev + 1)
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("h1", null, "Hello from React!"), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", null, "You have clicked on this component ", clickCount, " times."));
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ExampleReactComponent);

/***/ },

/***/ "./src/styles/article.scss"
/*!*********************************!*\
  !*** ./src/styles/article.scss ***!
  \*********************************/
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
/* harmony import */ var _scripts_ArticleReader__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./scripts/ArticleReader */ "./src/scripts/ArticleReader.js");
/* harmony import */ var _scripts_ArticleReader__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_scripts_ArticleReader__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _scripts_ExampleReactComponent__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./scripts/ExampleReactComponent */ "./src/scripts/ExampleReactComponent.js");
/* harmony import */ var react_dom_client__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react-dom/client */ "./node_modules/react-dom/client.js");






const root = react_dom_client__WEBPACK_IMPORTED_MODULE_4__.createRoot(document.querySelector("#render-react-example-here"));
root.render((0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_scripts_ExampleReactComponent__WEBPACK_IMPORTED_MODULE_3__["default"], null));
})();

/******/ })()
;
//# sourceMappingURL=index.js.map