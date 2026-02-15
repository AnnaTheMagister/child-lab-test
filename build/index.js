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

/***/ "./src/scripts/entities/Articles.tsx"
/*!*******************************************!*\
  !*** ./src/scripts/entities/Articles.tsx ***!
  \*******************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ArticlesContext: () => (/* binding */ ArticlesContext),
/* harmony export */   ArticlesContextProvider: () => (/* binding */ ArticlesContextProvider),
/* harmony export */   useArticles: () => (/* binding */ useArticles)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _shared_consts__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../shared/consts */ "./src/scripts/shared/consts.ts");
/* harmony import */ var _shared_useCurrentSearch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../shared/useCurrentSearch */ "./src/scripts/shared/useCurrentSearch.ts");




const ArticlesContext = (0,react__WEBPACK_IMPORTED_MODULE_0__.createContext)({
  articles: [],
  articlesLoading: true,
  currentTaxonomy: 'methodology',
  filteredArticles: [],
  currentTag: -1
});
const ArticlesContextProvider = ({
  children
}) => {
  const [articles, setArticles] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)([]);
  const [articlesLoading, setArticlesLoading] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(true);
  const {
    currentTaxonomy,
    currentTag
  } = (0,_shared_useCurrentSearch__WEBPACK_IMPORTED_MODULE_2__.useCurrentSearch)();
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    fetch(_shared_consts__WEBPACK_IMPORTED_MODULE_1__.BASE_URL + "/wp-json/wp/v2/articles?per_page=100&_embed").then(response => response.json()).then(data => {
      setArticles(data);
      setArticlesLoading(false);
    });
  }, []);
  const filteredArticles = (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => {
    if (!articles) return [];
    if (currentTaxonomy === "methodology") {
      if (parseInt(currentTag) > 0) {
        return articles.filter(art => art["methodology-tags"]?.some(tag => tag === parseInt(currentTag)));
      } else {
        return articles;
      }
    }
    return articles;
  }, [articles, currentTaxonomy, currentTag]);
  const context = {
    articles,
    articlesLoading,
    currentTaxonomy,
    filteredArticles,
    currentTag
  };
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(ArticlesContext.Provider, {
    value: context
  }, children);
};
const useArticles = () => (0,react__WEBPACK_IMPORTED_MODULE_0__.useContext)(ArticlesContext);

/***/ },

/***/ "./src/scripts/entities/MethodologyTags.tsx"
/*!**************************************************!*\
  !*** ./src/scripts/entities/MethodologyTags.tsx ***!
  \**************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   MethodologyTagsContext: () => (/* binding */ MethodologyTagsContext),
/* harmony export */   MethodologyTagsContextProvider: () => (/* binding */ MethodologyTagsContextProvider),
/* harmony export */   filterTagsBySearch: () => (/* binding */ filterTagsBySearch),
/* harmony export */   getSortedTags: () => (/* binding */ getSortedTags),
/* harmony export */   getTagsByColor: () => (/* binding */ getTagsByColor),
/* harmony export */   useMethodologyTags: () => (/* binding */ useMethodologyTags)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _shared_consts__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../shared/consts */ "./src/scripts/shared/consts.ts");




// Тип для массива тегов

// Тип для ответа API (если используется WordPress REST API)

// Тип для фильтрации тегов

// Тип для создания/обновления тега

// Тип для группировки тегов (например, по цветам или порядку)

// Тип для сортировки тегов

// Хелперы для работы с тегами
const getSortedTags = (tags, sortBy = "order") => {
  return [...tags].sort((a, b) => {
    switch (sortBy) {
      case "order":
        return parseInt(a.acf.order) - parseInt(b.acf.order);
      case "name":
        return a.name.localeCompare(b.name);
      case "count":
        return b.count - a.count;
      case "id":
        return a.id - b.id;
      default:
        return 0;
    }
  });
};
const getTagsByColor = tags => {
  return tags.reduce((acc, tag) => {
    const color = tag.acf.color;
    if (!acc[color]) {
      acc[color] = [];
    }
    acc[color].push(tag);
    return acc;
  }, {});
};
const filterTagsBySearch = (tags, searchTerm) => {
  if (!searchTerm.trim()) return tags;
  const term = searchTerm.toLowerCase();
  return tags.filter(tag => tag.name.toLowerCase().includes(term) || tag.description.toLowerCase().includes(term) || tag.slug.toLowerCase().includes(term));
};

// Тип для пропсов компонента тега

// Тип для пропсов компонента списка тегов

// Тип для состояния тегов в Redux/Context/Zustand

// Тип для хука useMethodologyTags

// Тип для API запросов

// Тип для компонента предварительного просмотра тега

// Тип для статистики тегов

const MethodologyTagsContext = (0,react__WEBPACK_IMPORTED_MODULE_0__.createContext)({
  methodologyTags: [],
  tagsLoading: true
});
const MethodologyTagsContextProvider = ({
  children
}) => {
  const [methodologyTags, setMethodologyTags] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)([]);
  const [tagsLoading, setTagsLoading] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(true);
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    fetch(_shared_consts__WEBPACK_IMPORTED_MODULE_1__.BASE_URL + "/wp-json/wp/v2/methodology-tags?per_page=100").then(response => response.json()).then(data => {
      setMethodologyTags(data);
      setTagsLoading(false);
    });
  }, []);
  const context = {
    methodologyTags,
    tagsLoading
  };
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(MethodologyTagsContext.Provider, {
    value: context
  }, children);
};
const useMethodologyTags = () => (0,react__WEBPACK_IMPORTED_MODULE_0__.useContext)(MethodologyTagsContext);

/***/ },

/***/ "./src/scripts/shared/consts.ts"
/*!**************************************!*\
  !*** ./src/scripts/shared/consts.ts ***!
  \**************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   BASE_URL: () => (/* binding */ BASE_URL),
/* harmony export */   DEFAULT_IMAGE_URL: () => (/* binding */ DEFAULT_IMAGE_URL),
/* harmony export */   MEDIA_URL: () => (/* binding */ MEDIA_URL)
/* harmony export */ });
const BASE_URL = window.location.host === "localhost" ? "http://localhost/childlab.local" : window.location.origin;
const MEDIA_URL = BASE_URL + "/wp-json/wp/v2/media/";
const DEFAULT_IMAGE_URL = themeData.templateUrl + "/assets/images/post-bg.jpg";

/***/ },

/***/ "./src/scripts/shared/switcher.js"
/*!****************************************!*\
  !*** ./src/scripts/shared/switcher.js ***!
  \****************************************/
() {

document.addEventListener("DOMContentLoaded", function () {
  // Элементы
  const switcher = document.getElementById("readingModeSwitcher");
  const toggleBtn = document.getElementById("mobileSwitcherToggle");
  const closeBtn = document.getElementById("switcherClose");

  // Проверяем, мобильное ли устройство
  function isMobile() {
    return window.innerWidth <= 768;
  }

  // Открытие виджета
  function openSwitcher() {
    switcher.classList.add("active");
    // Создаем оверлей если его нет
    let overlay = document.querySelector(".switchers-overlay");
    if (!overlay) {
      overlay = document.createElement("div");
      overlay.className = "switchers-overlay";
      document.body.appendChild(overlay);
    }
    overlay.classList.add("active");
    overlay.addEventListener("click", closeSwitcher);
    document.body.style.overflow = "hidden";
  }

  // Закрытие виджета
  function closeSwitcher() {
    switcher.classList.remove("active");
    const overlay = document.querySelector(".switchers-overlay");
    if (overlay) {
      overlay.classList.remove("active");
      overlay.removeEventListener("click", closeSwitcher);
    }
    document.body.style.overflow = "";
  }

  // Обработчики событий
  if (toggleBtn) {
    toggleBtn.addEventListener("click", openSwitcher);
  }
  if (closeBtn) {
    closeBtn.addEventListener("click", closeSwitcher);
  }

  // Закрытие при нажатии Escape
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && switcher.classList.contains("active")) {
      closeSwitcher();
    }
  });

  // Адаптация при изменении размера окна
  window.addEventListener("resize", function () {
    if (!isMobile() && switcher.classList.contains("active")) {
      closeSwitcher();
    }
  });

  // Закрытие при клике на ссылки внутри виджета (если нужно)
  const switcherLinks = switcher.querySelectorAll("a");
  switcherLinks.forEach(link => {
    link.addEventListener("click", function () {
      if (isMobile()) {
        // Закрываем виджет только на мобильных
        setTimeout(closeSwitcher, 300); // Небольшая задержка для плавности
      }
    });
  });
});

/***/ },

/***/ "./src/scripts/shared/useCurrentSearch.ts"
/*!************************************************!*\
  !*** ./src/scripts/shared/useCurrentSearch.ts ***!
  \************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getSearchParams: () => (/* binding */ getSearchParams),
/* harmony export */   useCurrentSearch: () => (/* binding */ useCurrentSearch)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);

const getSearchParams = () => {
  let searchParams = new URLSearchParams(window.location.search);
  return [...searchParams.entries()];
};
const useCurrentSearch = () => {
  const [currentSearch, setCurrentSearch] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(getSearchParams());
  const currentTaxonomy = (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => currentSearch?.[0]?.[0] === "methodology" ? "methodology" : null, [currentSearch]);
  const currentTag = (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => {
    var _currentSearch$0$;
    return (_currentSearch$0$ = currentSearch?.[0]?.[1]) !== null && _currentSearch$0$ !== void 0 ? _currentSearch$0$ : null;
  }, [currentSearch]);
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    window.addEventListener("pushstate", () => {
      setCurrentSearch(getSearchParams);
    });
  }, []);
  return {
    currentTaxonomy,
    currentTag
  };
};

/***/ },

/***/ "./src/scripts/widgets/ArticlesList/ArticlesList.tsx"
/*!***********************************************************!*\
  !*** ./src/scripts/widgets/ArticlesList/ArticlesList.tsx ***!
  \***********************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ArticleCardComponent: () => (/* binding */ ArticleCardComponent),
/* harmony export */   ArticleMetaInfoComponent: () => (/* binding */ ArticleMetaInfoComponent),
/* harmony export */   ArticleTagsComponent: () => (/* binding */ ArticleTagsComponent),
/* harmony export */   ArticlesListComponent: () => (/* binding */ ArticlesListComponent)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _shared_consts__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../shared/consts */ "./src/scripts/shared/consts.ts");
/* harmony import */ var _entities_MethodologyTags__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../entities/MethodologyTags */ "./src/scripts/entities/MethodologyTags.tsx");
/* harmony import */ var _Loader_Loader__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../Loader/Loader */ "./src/scripts/widgets/Loader/Loader.tsx");
/* harmony import */ var _FrontListComponent_FrontListComponent__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../FrontListComponent/FrontListComponent */ "./src/scripts/widgets/FrontListComponent/FrontListComponent.tsx");
/* harmony import */ var _entities_Articles__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../entities/Articles */ "./src/scripts/entities/Articles.tsx");







const ArticlesListComponent = () => {
  const {
    articles,
    filteredArticles,
    currentTaxonomy,
    currentTag
  } = (0,_entities_Articles__WEBPACK_IMPORTED_MODULE_5__.useArticles)();
  const [screenSize, setScreenSize] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)((0,_FrontListComponent_FrontListComponent__WEBPACK_IMPORTED_MODULE_4__.getScreenSize)(window.innerWidth));
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    window.addEventListener("resize", () => {
      setScreenSize((0,_FrontListComponent_FrontListComponent__WEBPACK_IMPORTED_MODULE_4__.getScreenSize)(window.innerWidth));
    });
  }, []);
  const title = currentTaxonomy === "methodology" && parseInt(currentTag) !== -1 ? window.wp.i18n.__("Статьи по теме", "childlab") : window.wp.i18n.__("Все статьи", "childlab");
  let content = (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(react__WEBPACK_IMPORTED_MODULE_0__.Fragment, null);
  if (!articles.length) {
    content = (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_Loader_Loader__WEBPACK_IMPORTED_MODULE_3__["default"], {
      fullScreen: false
    });
  } else if (!filteredArticles.length) {
    content = (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: "empty-wrapper"
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: "empty-placeholder"
    }, window.wp.i18n.__("Нет статей по этой теме", "childlab")));
  } else if (filteredArticles.length < 3 || screenSize == "sm" || screenSize == "xs") {
    content = (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(react__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, filteredArticles.map(art => (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: "col-lg-3 col-md-6 col-sm-12 col-xs-12"
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(ArticleCardComponent, {
      key: art.id,
      ...art,
      size: "default"
    }))));
  } else {
    content = (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(react__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: "col-lg-6 col-md-12"
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(ArticleCardComponent, {
      key: filteredArticles[0].id,
      ...filteredArticles[0],
      size: "large"
    })), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      class: "col-lg-6 col-md-12"
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      class: "row"
    }, filteredArticles.slice(1, 5).map(art => (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      class: "col-lg-6 col-md-6 col-sm-6 col-xs-12"
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(ArticleCardComponent, {
      key: art.id,
      ...art,
      size: "small"
    }))))), filteredArticles.slice(5).map(art => (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      class: "col-lg-3 col-md-6 col-sm-12 col-xs-12"
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(ArticleCardComponent, {
      key: art.id,
      ...art,
      size: "small"
    }))));
  }
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "container"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "childlab-widget articles-list"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("header", {
    className: "articles-list__header"
  }, title), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "row"
  }, content)));
};
const ArticleCardComponent = article => {
  var _article$size;
  const size = (_article$size = article.size) !== null && _article$size !== void 0 ? _article$size : "small";
  const imgSrc = article?._embedded?.["wp:featuredmedia"]?.[0]?.source_url;
  const imageUrl = imgSrc ? imgSrc : _shared_consts__WEBPACK_IMPORTED_MODULE_1__.DEFAULT_IMAGE_URL;
  const excerptText = article.excerpt.rendered.replace(/<[^>]+>/g, "");
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("a", {
    className: "article-card",
    href: article.link
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: `article-img article-img__${size}`,
    style: {
      backgroundImage: `url(${imageUrl})`
    }
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(ArticleTagsComponent, {
    ...article
  })), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "article-details"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "article-meta childlab-text__meta"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(ArticleMetaInfoComponent, {
    ...article
  })), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "article-details__title truncate-multiline"
  }, article.title.rendered), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "article-details__subtitle truncate"
  }, article.acf.subtitle), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "article-details__excerpt truncate-multiline"
  }, excerptText)));
};
function formatDate(date) {
  if (typeof date == "number") {
    // перевести секунды в миллисекунды и преобразовать к Date
    date = new Date(date * 1000);
  } else if (typeof date == "string") {
    // строка в стандартном формате автоматически будет разобрана в дату
    date = new Date(date);
  } else if (Array.isArray(date)) {
    date = new Date(date[0], date[1], date[2]);
  }
  // преобразования для поддержки полиморфизма завершены,
  // теперь мы работаем с датой (форматируем её)

  return date.toLocaleString("ru", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit"
  });

  /*
  // можно и вручную, если лень добавлять в старый IE поддержку локализации
  var day = date.getDate();
  if (day < 10) day = '0' + day;
   var month = date.getMonth() + 1;
  if (month < 10) month = '0' + month;
   // взять 2 последние цифры года
  var year = date.getFullYear() % 100;
  if (year < 10) year = '0' + year;
   var formattedDate = day + '.' + month + '.' + year;
   return formattedDate;
  */
}
const ArticleMetaInfoComponent = article => {
  const authors = article["article-authors"];
  const date = formatDate(article.date);
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "article-meta"
  }, date);
};
const ArticleTagsComponent = article => {
  const {
    methodologyTags
  } = (0,_entities_MethodologyTags__WEBPACK_IMPORTED_MODULE_2__.useMethodologyTags)();
  const articleTags = (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => methodologyTags.filter(m => article["methodology-tags"].includes(m.id)), [methodologyTags, article]);
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "article-tags"
  }, articleTags.map(m => {
    var _m$acf$color;
    return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      key: m.id,
      className: "article-tags__tag truncate",
      style: {
        backgroundColor: (_m$acf$color = m.acf.color) !== null && _m$acf$color !== void 0 ? _m$acf$color : "rgba(100, 100, 100, 0.5)"
      }
    }, m.name);
  }));
};

/***/ },

/***/ "./src/scripts/widgets/FrontListComponent/FrontListComponent.tsx"
/*!***********************************************************************!*\
  !*** ./src/scripts/widgets/FrontListComponent/FrontListComponent.tsx ***!
  \***********************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   FrontListComponent: () => (/* binding */ FrontListComponent),
/* harmony export */   getScreenSize: () => (/* binding */ getScreenSize)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _Loader_Loader__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Loader/Loader */ "./src/scripts/widgets/Loader/Loader.tsx");
/* harmony import */ var _entities_MethodologyTags__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../entities/MethodologyTags */ "./src/scripts/entities/MethodologyTags.tsx");
/* harmony import */ var _distributeTags__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./distributeTags */ "./src/scripts/widgets/FrontListComponent/distributeTags.ts");
/* harmony import */ var _shared_useCurrentSearch__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../shared/useCurrentSearch */ "./src/scripts/shared/useCurrentSearch.ts");






const DEFAULT_TAG = {
  id: -1,
  name: window.wp.i18n.__("Все", "childlab"),
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
  if (size <= 768 && size > 576) {
    return "sm";
  }
  return "xs";
};
const getMaxTagsInRow = size => size === "lg" || size == "xlg" ? 6 : size === "md" || size === "sm" ? 3 : 2;
const FrontListComponent = () => {
  const {
    methodologyTags,
    tagsLoading
  } = (0,_entities_MethodologyTags__WEBPACK_IMPORTED_MODULE_2__.useMethodologyTags)();
  const [maxTagsInRow, setMaxTagsInRow] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(getMaxTagsInRow(getScreenSize(window.innerWidth)));
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    window.addEventListener("resize", () => {
      setMaxTagsInRow(getMaxTagsInRow(getScreenSize(window.innerWidth)));
    });
  }, []);
  const tagsData = (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => methodologyTags.length ? [DEFAULT_TAG, ...methodologyTags.filter(t => t.acf.order > 0).sort((t1, t2) => t1.acf.order - t2.acf.order)] : [], [methodologyTags]);
  const distributedTags = (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => {
    if (!tagsData.length) {
      return [];
    }
    const distribution = (0,_distributeTags__WEBPACK_IMPORTED_MODULE_3__.distributeTags)(tagsData.length, maxTagsInRow);
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
const DEFAULT_TAG_PATTERN = themeData.templateUrl + "/assets/images/all.png";
const MethodologyTagComponent = tag => {
  var _tag$acf$color, _tag$width;
  const {
    currentTaxonomy,
    currentTag
  } = (0,_shared_useCurrentSearch__WEBPACK_IMPORTED_MODULE_4__.useCurrentSearch)();
  const backgroundColor = (_tag$acf$color = tag.acf.color) !== null && _tag$acf$color !== void 0 ? _tag$acf$color : "#f00";
  const handleClick = e => {
    e.preventDefault();
    history.pushState({}, "", `?methodology=${tag.id}`);
    window.dispatchEvent(new Event("pushstate"));
  };
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("a", {
    href: `?methodology=${tag.id}`,
    onClick: handleClick,
    className: `childlab-card-link methodology-tags-menu__tag methodology-tag-width-${(_tag$width = tag.width) !== null && _tag$width !== void 0 ? _tag$width : 4} ${currentTag == tag.id || !currentTag && tag.id == -1 ? "methodology-tag__active" : ""}`,
    style: {
      backgroundColor
    }
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "methodology-tags-menu__svg-background",
    style: {
      backgroundImage: `url(${tag.acf.tag_image || DEFAULT_TAG_PATTERN})`,
      backgroundColor
    }
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "methodology-tags-menu__title"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    title: tag.name
  }, tag.name)));
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

/***/ "./src/scripts/widgets/MethodologyTree/MethodologyTreeComponent.tsx"
/*!**************************************************************************!*\
  !*** ./src/scripts/widgets/MethodologyTree/MethodologyTreeComponent.tsx ***!
  \**************************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ArticlesList: () => (/* binding */ ArticlesList),
/* harmony export */   MethodologyTree: () => (/* binding */ MethodologyTree),
/* harmony export */   MethodologyTreeComponent: () => (/* binding */ MethodologyTreeComponent)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _graphConfig__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./graphConfig */ "./src/scripts/widgets/MethodologyTree/graphConfig.ts");
/* harmony import */ var _shared_useCurrentSearch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../shared/useCurrentSearch */ "./src/scripts/shared/useCurrentSearch.ts");
/* harmony import */ var _TagsGraph__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./TagsGraph */ "./src/scripts/widgets/MethodologyTree/TagsGraph.ts");
/* harmony import */ var _entities_MethodologyTags__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../entities/MethodologyTags */ "./src/scripts/entities/MethodologyTags.tsx");
/* harmony import */ var _entities_Articles__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../entities/Articles */ "./src/scripts/entities/Articles.tsx");
/* harmony import */ var _FrontListComponent_FrontListComponent__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../FrontListComponent/FrontListComponent */ "./src/scripts/widgets/FrontListComponent/FrontListComponent.tsx");
/* harmony import */ var _ArticlesList_ArticlesList__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../ArticlesList/ArticlesList */ "./src/scripts/widgets/ArticlesList/ArticlesList.tsx");









const TREE_IMAGE = themeData.templateUrl + "/assets/images/tree.png";
const NO_TAG_PLACEHOLDER = (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
  className: "empty-placeholder"
}, window.wp.i18n.__('Выберите элемент на дереве, чтобы прочитать о нём подробнее', 'childlab'));
const MethodologyTreeComponent = () => {
  const {
    articles,
    articlesLoading,
    filteredArticles,
    currentTag,
    currentTaxonomy
  } = (0,_entities_Articles__WEBPACK_IMPORTED_MODULE_5__.useArticles)();
  const [screenSize, setScreenSize] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)((0,_FrontListComponent_FrontListComponent__WEBPACK_IMPORTED_MODULE_6__.getScreenSize)(window.innerWidth));
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    window.addEventListener("resize", () => {
      setScreenSize((0,_FrontListComponent_FrontListComponent__WEBPACK_IMPORTED_MODULE_6__.getScreenSize)(window.innerWidth));
    });
  }, []);
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "container"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "childlab-widget methodology"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "row"
  }, (!currentTag || screenSize === 'lg' || screenSize === 'xlg') && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "col-12 order-md-2 order-lg-1 order-xlg-1 order-sm-2 order-xs-2"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "methodology__header"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("h1", null, window.wp.i18n.__("Методология", "childlab")), !currentTag && (screenSize === 'sm' || screenSize === 'xs' || screenSize === 'md') && NO_TAG_PLACEHOLDER)), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(MethodologyTree, null), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(ArticlesList, null))));
};
const ArticlesList = () => {
  const {
    articles,
    articlesLoading,
    currentTag,
    currentTaxonomy
  } = (0,_entities_Articles__WEBPACK_IMPORTED_MODULE_5__.useArticles)();
  const {
    methodologyTags
  } = (0,_entities_MethodologyTags__WEBPACK_IMPORTED_MODULE_4__.useMethodologyTags)();
  const [screenSize, setScreenSize] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)((0,_FrontListComponent_FrontListComponent__WEBPACK_IMPORTED_MODULE_6__.getScreenSize)(window.innerWidth));
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    window.addEventListener("resize", () => {
      setScreenSize((0,_FrontListComponent_FrontListComponent__WEBPACK_IMPORTED_MODULE_6__.getScreenSize)(window.innerWidth));
    });
  }, []);
  const filteredArticles = (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => {
    if (!articles || !methodologyTags) return [];
    console.log('!!', currentTag, methodologyTags.map(it => it.slug));
    const currentId = methodologyTags.find(it => it.slug?.toLowerCase() === currentTag?.toLowerCase())?.id;
    console.log(currentId, articles);
    if (currentId) {
      const y = articles.filter(art => art["methodology-tags"]?.some(tag => {
        console.log('!t', tag, currentTag, tag === currentTag);
        return tag === currentId;
      }));
      console.log('!y', y);
      return y;
    }
    return [];
  }, [articles, currentTaxonomy, currentTag, methodologyTags]);
  console.log('!!', filteredArticles);
  let content = (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(react__WEBPACK_IMPORTED_MODULE_0__.Fragment, null);
  if (!currentTag && (screenSize === 'lg' || screenSize === 'xlg')) {
    content = (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      class: "childlab-widget methodology__description"
    }, NO_TAG_PLACEHOLDER);
  } else if (!filteredArticles.length && !(!currentTag && (screenSize === 'lg' || screenSize === 'xlg'))) {
    content = (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      class: "childlab-widget methodology__description"
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: "empty-placeholder"
    }, "\u0421\u0442\u0430\u0442\u044C\u044F \u0441\u043A\u043E\u0440\u043E \u043F\u043E\u044F\u0432\u0438\u0442\u0441\u044F"));
  } else {
    content = (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: "container"
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: "childlab-widget articles-list"
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("header", {
      className: "articles-list__header"
    }, "\u0421\u0442\u0430\u0442\u044C\u0438 \u043F\u043E \u0442\u0435\u043C\u0435"), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: "row"
    }, filteredArticles.map(art => (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: "col-12"
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_ArticlesList_ArticlesList__WEBPACK_IMPORTED_MODULE_7__.ArticleCardComponent, {
      key: art.id,
      ...art,
      size: "default"
    }))))));
  }
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "col-lg-5 col-md-12 col-sm-12 col-xs-12 order-xs-3 order-sm-3 order-md-3 order-lg-3"
  }, content);
};
const MethodologyTree = () => {
  const {
    currentTaxonomy,
    currentTag
  } = (0,_shared_useCurrentSearch__WEBPACK_IMPORTED_MODULE_2__.useCurrentSearch)();
  const [graphRef, setGraphRef] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)();
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if (graphRef?.clientWidth) {
      // setTimeout(() => {
      console.log('!!!gra', graphRef.clientWidth);
      const graph = new _TagsGraph__WEBPACK_IMPORTED_MODULE_3__.TagsGraph({
        container: graphRef,
        activeTagSlug: currentTag !== null && currentTag !== void 0 ? currentTag : "Agency",
        tags: JSON.parse(JSON.stringify(_graphConfig__WEBPACK_IMPORTED_MODULE_1__.initialTags)),
        connections: JSON.parse(JSON.stringify(_graphConfig__WEBPACK_IMPORTED_MODULE_1__.initialConnections)),
        curveIntensity: 0.7,
        lineWidth: 2,
        textOrientation: "horizontal",
        backgroundColor: "rgba(255, 255, 255, 0.4)",
        interactive: true,
        onTagClick: tag => {
          history.pushState({}, "", `?methodology=${tag.id}`);
          window.dispatchEvent(new Event("pushstate"));
          selectedTagId = tag.id;
          console.log("Выбран тег:", tag.name);
        },
        onTagDrag: (tag, x, y) => {
          console.log(`Перемещение ${tag.name}`);
        },
        onTagDirectionChange: tag => {
          console.log(`Направление ${tag.name} изменено на: ${tag.direction}`);
        },
        onTagTextOrientationChange: tag => {
          console.log(`Ориентация текста ${tag.name} изменена на: ${tag.textOrientation}`);
        }
      });
      // }, 50)

      // graph.resizeCanvas();
      // graph.calculateLayout();
      // graph.render();
    }
  }, [graphRef?.clientWidth]);
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "col-lg-7 col-md-12 col-sm-12 col-xs-12 order-xs-1 order-sm-1 order-md-1 order-lg-2"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "methodology__tree-wrapper"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "methodology__tree"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("img", {
    className: "methodology__tree-image",
    src: TREE_IMAGE,
    alt: "tree"
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    ref: r => {
      setGraphRef(r);
    },
    className: "methodology__graph-container"
  }))));
};

/***/ },

/***/ "./src/scripts/widgets/MethodologyTree/TagsGraph.ts"
/*!**********************************************************!*\
  !*** ./src/scripts/widgets/MethodologyTree/TagsGraph.ts ***!
  \**********************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   TagsGraph: () => (/* binding */ TagsGraph)
/* harmony export */ });
// tag-graph.js
class TagsGraph {
  constructor(config) {
    this.config = {
      padding: 20,
      scale: 1,
      interactive: true,
      enableDragging: false,
      enableContextMenu: false,
      ...config
    };
    this.tagConfig = {
      fontSize: 14,
      borderRadius: 16,
      ...config.tagConfig
    };
    this.connectionConfig = {
      lineWidth: 3,
      ...config.connectionConfig
    };
    this.tags = [...config.tags];
    this.connections = this.processConnections(config.connections || []);
    this.isDragging = false;
    this.dragTarget = null;
    this.animationFrameId = null;
    this.mousePos = {
      x: 0,
      y: 0
    };
    this.hoveredTag = null;
    this.activeTag = this.tags.find(({
      id
    }) => id === this.config.activeTagSlug) || null;
    this.canvas = document.createElement("canvas");
    this.ctx = this.canvas.getContext("2d");
    this.initCanvas();
    this.calculateLayout();
    if (this.config.interactive) {
      this.setupInteractivity();
    }
    this.render();
  }
  processConnections(connections) {
    const seen = new Set();
    const uniqueConnections = [];
    for (const conn of connections) {
      const key1 = `${conn.source}-${conn.target}`;
      const key2 = `${conn.target}-${conn.source}`;
      if (!seen.has(key1) && !seen.has(key2)) {
        seen.add(key1);
        seen.add(key2);
        uniqueConnections.push({
          source: conn.source,
          target: conn.target,
          curveIntensity: conn.curveIntensity || 0,
          lineWidth: (conn.lineWidth || this.connectionConfig.lineWidth) * this.config.scale,
          connectFrom: conn.connectFrom || "auto",
          connectTo: conn.connectTo || "auto",
          shiftFrom: conn.shiftFrom || 0,
          // новое поле
          shiftTo: conn.shiftTo || 0 // новое поле
        });
      }
    }
    return uniqueConnections;
  }
  initCanvas() {
    const container = this.config.container;
    this.canvas.style.width = "100%";
    this.canvas.style.height = "100%";
    this.canvas.style.display = "block";
    container.appendChild(this.canvas);
    this.resizeCanvas();
    window.addEventListener("resize", () => {
      this.resizeCanvas();
      this.calculateLayout();
      this.render();
    });
  }
  resizeCanvas() {
    const container = this.config.container;
    const dpr = window.devicePixelRatio || 1;
    const rect = container.getBoundingClientRect();
    this.canvas.width = rect.width * dpr;
    this.canvas.height = rect.height * dpr;
    this.ctx.scale(dpr, dpr);
    this.updateScale();
  }
  calculateLayout() {
    const width = this.canvas.width / window.devicePixelRatio;
    const height = this.canvas.height / window.devicePixelRatio;

    // Конвертируем координаты из процентов в пиксели
    this.tags.forEach(tag => {
      if (tag.xPercent !== undefined && tag.yPercent !== undefined) {
        tag.x = width * tag.xPercent / 100;
        tag.y = height * tag.yPercent / 100;
      }
    });
  }
  updateScale() {
    if (window.devicePixelRatio > 1 && window.devicePixelRatio < 2) {
      this.config.scale = 0.9;
    } else if (window.devicePixelRatio >= 2 && window.devicePixelRatio < 3) {
      this.config.scale = 0.8;
    } else if (window.devicePixelRatio >= 3) {
      this.config.scale = 0.7;
    }
  }
  getTagButtonRect(tag) {
    const {
      x = 0,
      y = 0
    } = tag;
    const fontSize = (tag.fontSize || this.tagConfig.fontSize) * this.config.scale;
    const lineHeight = fontSize * 1.2;
    const charWidth = fontSize * 0.6;
    const lines = this.getTextLines(tag.name, tag.textOrientation, tag.fontSize);
    let width, height;
    if (tag.textOrientation === "vertical") {
      const paddingVertical = 16 * this.config.scale;
      const paddingHorizontal = 6 * this.config.scale;
      const maxLineLength = Math.max(...lines.map(line => line.length));
      width = lineHeight * lines.length + paddingHorizontal * 2;
      height = charWidth * maxLineLength + paddingVertical * 2;
    } else {
      const paddingVertical = 6 * this.config.scale;
      const paddingHorizontal = 16 * this.config.scale;
      width = Math.max(...lines.map(line => this.measureTextWidth(line, fontSize))) + paddingHorizontal * 2;
      height = lineHeight * lines.length + paddingVertical * 2;
    }
    return {
      x: x - width / 2,
      y: y - height / 2,
      width,
      height,
      centerX: x,
      centerY: y
    };
  }
  getConnectionPoint(tag, side, shift = 0) {
    const rect = this.getTagButtonRect(tag);
    const borderRadius = (tag.borderRadius !== undefined ? tag.borderRadius : this.tagConfig.borderRadius) * this.config.scale;
    switch (side) {
      case "top":
        // Центр верхней стороны с учетом смещения
        // shift: -1 = крайний левый, 0 = центр, 1 = крайний правый
        const topStartX = rect.x + borderRadius;
        const topEndX = rect.x + rect.width - borderRadius;
        const topCenterX = (topStartX + topEndX) / 2;
        const topShiftRange = (topEndX - topStartX) / 2;
        return {
          x: topCenterX + shift * topShiftRange,
          y: rect.y
        };
      case "bottom":
        // Центр нижней стороны с учетом смещения
        const bottomStartX = rect.x + borderRadius;
        const bottomEndX = rect.x + rect.width - borderRadius;
        const bottomCenterX = (bottomStartX + bottomEndX) / 2;
        const bottomShiftRange = (bottomEndX - bottomStartX) / 2;
        return {
          x: bottomCenterX + shift * bottomShiftRange,
          y: rect.y + rect.height
        };
      case "left":
        // Центр левой стороны с учетом смещения
        const leftStartY = rect.y + borderRadius;
        const leftEndY = rect.y + rect.height - borderRadius;
        const leftCenterY = (leftStartY + leftEndY) / 2;
        const leftShiftRange = (leftEndY - leftStartY) / 2;
        return {
          x: rect.x,
          y: leftCenterY + shift * leftShiftRange
        };
      case "right":
        // Центр правой стороны с учетом смещения
        const rightStartY = rect.y + borderRadius;
        const rightEndY = rect.y + rect.height - borderRadius;
        const rightCenterY = (rightStartY + rightEndY) / 2;
        const rightShiftRange = (rightEndY - rightStartY) / 2;
        return {
          x: rect.x + rect.width,
          y: rightCenterY + shift * rightShiftRange
        };
      case "auto":
      default:
        // Для центра возвращаем центр
        return {
          x: rect.centerX,
          y: rect.centerY
        };
    }
  }
  getAutoConnectionPoint(sourceRect, targetRect) {
    // Автоматически определяем лучшие точки соединения
    const sourceCenter = {
      x: sourceRect.centerX,
      y: sourceRect.centerY
    };
    const targetCenter = {
      x: targetRect.centerX,
      y: targetRect.centerY
    };

    // Определяем относительное положение тегов
    const dx = targetCenter.x - sourceCenter.x;
    const dy = targetCenter.y - sourceCenter.y;

    // Выбираем сторону в зависимости от угла
    const angle = Math.atan2(dy, dx);
    const angleDeg = angle * 180 / Math.PI;

    // Для источника
    let sourceSide;
    if (Math.abs(angleDeg) <= 45) {
      sourceSide = "right";
    } else if (Math.abs(angleDeg) >= 135) {
      sourceSide = "left";
    } else if (angleDeg > 45 && angleDeg < 135) {
      sourceSide = "bottom";
    } else {
      sourceSide = "top";
    }

    // Для цели (противоположная сторона)
    let targetSide;
    if (Math.abs(angleDeg) <= 45) {
      targetSide = "left";
    } else if (Math.abs(angleDeg) >= 135) {
      targetSide = "right";
    } else if (angleDeg > 45 && angleDeg < 135) {
      targetSide = "top";
    } else {
      targetSide = "bottom";
    }
    return {
      sourceSide,
      targetSide
    };
  }
  lightenColor(color, amount = 0.3) {
    color = color.replace("#", "");
    const r = parseInt(color.slice(0, 2), 16);
    const g = parseInt(color.slice(2, 4), 16);
    const b = parseInt(color.slice(4, 6), 16);
    const lightR = Math.round(r + (255 - r) * amount);
    const lightG = Math.round(g + (255 - g) * amount);
    const lightB = Math.round(b + (255 - b) * amount);
    return `#${lightR.toString(16).padStart(2, "0")}${lightG.toString(16).padStart(2, "0")}${lightB.toString(16).padStart(2, "0")}`;
  }
  getTextLines(text, textOrientation = "vertical", fontSize = 13) {
    if (textOrientation === "vertical") {
      return [text];
    }
    return text.split("\n").reduce((acc, word) => {
      if (!acc.length) return [word];
      const lastLine = acc[acc.length - 1];
      if (this.measureTextWidth(lastLine + " " + word, fontSize) <= 100 * this.config.scale) {
        acc[acc.length - 1] = lastLine + " " + word;
      } else {
        acc.push(word);
      }
      return acc;
    }, []);
  }
  drawTag(tag) {
    const ctx = this.ctx;
    const {
      x = 0,
      y = 0,
      name,
      color,
      textOrientation = "horizontal"
    } = tag;
    const fontSize = (tag.fontSize || this.tagConfig.fontSize) * this.config.scale;
    const borderRadius = (tag.borderRadius !== undefined ? tag.borderRadius : this.tagConfig.borderRadius) * this.config.scale;
    ctx.save();
    let bgColor = color;
    if (this.hoveredTag === tag && this.activeTag !== tag) {
      bgColor = this.lightenColor(color, 0.2);
    }
    ctx.shadowColor = "rgba(0, 0, 0, 0.2)";
    ctx.shadowBlur = 10;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    const rect = this.getTagButtonRect(tag);
    ctx.fillStyle = bgColor;
    this.roundRect(ctx, rect.x, rect.y, rect.width, rect.height, borderRadius);
    ctx.fill();
    ctx.font = `${fontSize}px Lora`;
    if (this.activeTag === tag) {
      ctx.shadowColor = tag.color;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
      ctx.shadowBlur = 8;
      ctx.strokeStyle = "#FFFFFF";
      ctx.lineWidth = 2;
      ctx.stroke();
    }
    ctx.shadowColor = "transparent";
    ctx.fillStyle = "#FFFFFF";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    const lineHeight = fontSize * 1.2;
    const lines = this.getTextLines(name, textOrientation, fontSize);
    if (textOrientation === "vertical") {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(-Math.PI / 2);
      const totalTextHeight = lines.length * lineHeight;
      lines.forEach((line, index) => {
        const lineY = -totalTextHeight / 2 + index * lineHeight + lineHeight / 2;
        ctx.fillText(line, 0, lineY);
      });
      ctx.restore();
    } else {
      const totalTextHeight = lines.length * lineHeight;
      const startY = rect.y + (rect.height - totalTextHeight) / 2 + lineHeight / 2;
      lines.forEach((line, index) => {
        const lineY = startY + index * lineHeight;
        ctx.fillText(line, x, lineY);
      });
    }
    ctx.restore();
  }
  drawConnection(conn) {
    const source = this.tags.find(t => t.id === conn.source);
    const target = this.tags.find(t => t.id === conn.target);
    if (!source || !target) {
      return;
    }
    const ctx = this.ctx;
    const curveIntensity = conn.curveIntensity || 0;
    const lineWidth = (conn.lineWidth || this.connectionConfig.lineWidth) * this.config.scale;
    const shiftFrom = conn.shiftFrom || 0; // смещение начала (от -1 до 1)
    const shiftTo = conn.shiftTo || 0; // смещение конца (от -1 до 1)

    const sourceRect = this.getTagButtonRect(source);
    const targetRect = this.getTagButtonRect(target);
    let sourceSide, targetSide;
    if (conn.connectFrom === "auto" || conn.connectTo === "auto") {
      const autoSides = this.getAutoConnectionPoint(sourceRect, targetRect);
      sourceSide = conn.connectFrom === "auto" ? autoSides.sourceSide : conn.connectFrom;
      targetSide = conn.connectTo === "auto" ? autoSides.targetSide : conn.connectTo;
    } else {
      sourceSide = conn.connectFrom;
      targetSide = conn.connectTo;
    }

    // Получаем точки соединения с учетом смещения
    const sourcePoint = this.getConnectionPoint(source, sourceSide, shiftFrom);
    const targetPoint = this.getConnectionPoint(target, targetSide, shiftTo);
    ctx.save();
    const gradient = ctx.createLinearGradient(sourcePoint.x, sourcePoint.y, targetPoint.x, targetPoint.y);
    gradient.addColorStop(0, source.color);
    gradient.addColorStop(0.5, this.blendColors(source.color, target.color, 0.5));
    gradient.addColorStop(1, target.color);
    ctx.strokeStyle = gradient;
    ctx.lineWidth = lineWidth;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(sourcePoint.x, sourcePoint.y);
    if (curveIntensity === 0) {
      ctx.lineTo(targetPoint.x, targetPoint.y);
    } else {
      const dx = targetPoint.x - sourcePoint.x;
      const dy = targetPoint.y - sourcePoint.y;
      const perpX = -dy * curveIntensity * 0.5;
      const perpY = dx * curveIntensity * 0.5;
      const cp1x = sourcePoint.x + dx * 0.25 + perpX;
      const cp1y = sourcePoint.y + dy * 0.25 + perpY;
      const cp2x = sourcePoint.x + dx * 0.75 + perpX;
      const cp2y = sourcePoint.y + dy * 0.75 + perpY;
      ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, targetPoint.x, targetPoint.y);
    }
    ctx.stroke();
    if (this.config.connectionMarkers) {
      ctx.fillStyle = source.color;
      ctx.beginPath();
      ctx.arc(sourcePoint.x, sourcePoint.y, lineWidth * 1.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = target.color;
      ctx.beginPath();
      ctx.arc(targetPoint.x, targetPoint.y, lineWidth * 1.5, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }
  setupInteractivity() {
    this.canvas.addEventListener("mousedown", this.handleMouseDown.bind(this));
    this.canvas.addEventListener("mousemove", this.handleMouseMove.bind(this));
    this.canvas.addEventListener("mouseup", this.handleMouseUp.bind(this));
    this.canvas.addEventListener("click", this.handleClick.bind(this));
    this.canvas.addEventListener("mouseleave", this.handleMouseLeave.bind(this));
    if (this.config.enableContextMenu) {
      this.canvas.addEventListener("contextmenu", this.handleContextMenu.bind(this));
    }
    this.canvas.addEventListener("touchstart", this.handleTouchStart.bind(this), {
      passive: false
    });
    this.canvas.addEventListener("touchmove", this.handleTouchMove.bind(this), {
      passive: false
    });
    this.canvas.addEventListener("touchend", this.handleTouchEnd.bind(this));
    this.canvas.style.cursor = "default";
  }
  handleMouseDown(e) {
    e.preventDefault();
    const rect = this.canvas.getBoundingClientRect();
    const scaleX = this.canvas.width / window.devicePixelRatio / rect.width;
    const scaleY = this.canvas.height / window.devicePixelRatio / rect.height;
    this.mousePos.x = (e.clientX - rect.left) * scaleX;
    this.mousePos.y = (e.clientY - rect.top) * scaleY;
    if (this.config.enableDragging) {
      this.dragTarget = this.getTagAt(this.mousePos.x, this.mousePos.y);
      this.isDragging = !!this.dragTarget;
      if (this.dragTarget) {
        this.canvas.style.cursor = "grabbing";
        this.startAnimation();
      }
    }
  }
  handleMouseMove(e) {
    const rect = this.canvas.getBoundingClientRect();
    const scaleX = this.canvas.width / window.devicePixelRatio / rect.width;
    const scaleY = this.canvas.height / window.devicePixelRatio / rect.height;
    this.mousePos.x = (e.clientX - rect.left) * scaleX;
    this.mousePos.y = (e.clientY - rect.top) * scaleY;
    const prevHovered = this.hoveredTag;
    this.hoveredTag = this.getTagAt(this.mousePos.x, this.mousePos.y);
    if (prevHovered !== this.hoveredTag) {
      this.render();
    }
    if (this.isDragging && this.dragTarget) {
      const width = this.canvas.width / window.devicePixelRatio;
      const height = this.canvas.height / window.devicePixelRatio;
      this.dragTarget.x = this.mousePos.x;
      this.dragTarget.y = this.mousePos.y;
      this.dragTarget.xPercent = this.dragTarget.x / width * 100;
      this.dragTarget.yPercent = this.dragTarget.y / height * 100;
      if (this.config.onTagDrag) {
        this.config.onTagDrag(this.dragTarget, this.dragTarget.xPercent, this.dragTarget.yPercent);
      }
    } else {
      this.canvas.style.cursor = this.hoveredTag ? "pointer" : "default";
    }
  }
  handleMouseUp() {
    this.isDragging = false;
    this.dragTarget = null;
    this.canvas.style.cursor = this.hoveredTag ? "pointer" : "default";
    this.stopAnimation();
  }
  handleMouseLeave() {
    this.hoveredTag = null;
    this.render();
  }
  handleClick(e) {
    if (this.isDragging) {
      this.isDragging = false;
      return;
    }
    const rect = this.canvas.getBoundingClientRect();
    const scaleX = this.canvas.width / window.devicePixelRatio / rect.width;
    const scaleY = this.canvas.height / window.devicePixelRatio / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;
    const tag = this.getTagAt(x, y);
    if (tag) {
      this.activeTag = tag;
      if (this.config.onTagClick) {
        this.config.onTagClick(tag);
      }
      this.render();
    } else {
      this.activeTag = null;
      this.render();
    }
  }
  handleContextMenu(e) {
    e.preventDefault();
    const rect = this.canvas.getBoundingClientRect();
    const scaleX = this.canvas.width / window.devicePixelRatio / rect.width;
    const scaleY = this.canvas.height / window.devicePixelRatio / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;
    const tag = this.getTagAt(x, y);
    if (tag) {
      tag.textOrientation = tag.textOrientation === "horizontal" ? "vertical" : "horizontal";
      this.render();
      if (this.config.onTagTextOrientationChange) {
        this.config.onTagTextOrientationChange(tag);
      }
    }
  }
  handleTouchStart(e) {
    e.preventDefault();
    const touch = e.touches[0];
    const rect = this.canvas.getBoundingClientRect();
    const scaleX = this.canvas.width / window.devicePixelRatio / rect.width;
    const scaleY = this.canvas.height / window.devicePixelRatio / rect.height;
    this.mousePos.x = (touch.clientX - rect.left) * scaleX;
    this.mousePos.y = (touch.clientY - rect.top) * scaleY;
    if (this.config.enableDragging) {
      this.dragTarget = this.getTagAt(this.mousePos.x, this.mousePos.y);
      this.isDragging = !!this.dragTarget;
      if (this.dragTarget) {
        this.startAnimation();
      }
    }
  }
  handleTouchMove(e) {
    e.preventDefault();
    const touch = e.touches[0];
    const rect = this.canvas.getBoundingClientRect();
    const scaleX = this.canvas.width / window.devicePixelRatio / rect.width;
    const scaleY = this.canvas.height / window.devicePixelRatio / rect.height;
    this.mousePos.x = (touch.clientX - rect.left) * scaleX;
    this.mousePos.y = (touch.clientY - rect.top) * scaleY;
    if (this.isDragging && this.dragTarget) {
      const width = this.canvas.width / window.devicePixelRatio;
      const height = this.canvas.height / window.devicePixelRatio;
      this.dragTarget.x = this.mousePos.x;
      this.dragTarget.y = this.mousePos.y;
      this.dragTarget.xPercent = this.dragTarget.x / width * 100;
      this.dragTarget.yPercent = this.dragTarget.y / height * 100;
      if (this.config.onTagDrag) {
        this.config.onTagDrag(this.dragTarget, this.dragTarget.xPercent, this.dragTarget.yPercent);
      }
    }
  }
  handleTouchEnd(e) {
    if (!this.isDragging && e.changedTouches.length === 1) {
      const touch = e.changedTouches[0];
      const rect = this.canvas.getBoundingClientRect();
      const scaleX = this.canvas.width / window.devicePixelRatio / rect.width;
      const scaleY = this.canvas.height / window.devicePixelRatio / rect.height;
      const x = (touch.clientX - rect.left) * scaleX;
      const y = (touch.clientY - rect.top) * scaleY;
      const tag = this.getTagAt(x, y);
      if (tag) {
        this.activeTag = tag;
        if (this.config.onTagClick) {
          this.config.onTagClick(tag);
        }
        this.render();
      } else {
        this.activeTag = null;
        this.render();
      }
    } else if (e.changedTouches.length === 3) {
      const touch = e.changedTouches[0];
      const rect = this.canvas.getBoundingClientRect();
      const scaleX = this.canvas.width / window.devicePixelRatio / rect.width;
      const scaleY = this.canvas.height / window.devicePixelRatio / rect.height;
      const x = (touch.clientX - rect.left) * scaleX;
      const y = (touch.clientY - rect.top) * scaleY;
      const tag = this.getTagAt(x, y);
      if (tag) {
        tag.textOrientation = tag.textOrientation === "horizontal" ? "vertical" : "horizontal";
        this.render();
        if (this.config.onTagTextOrientationChange) {
          this.config.onTagTextOrientationChange(tag);
        }
      }
    }
    this.isDragging = false;
    this.dragTarget = null;
    this.stopAnimation();
  }
  getTagAt(x, y) {
    for (const tag of this.tags) {
      if (!tag.x || !tag.y) continue;
      const rect = this.getTagButtonRect(tag);
      const padding = 10;
      if (x > rect.x - padding && x < rect.x + rect.width + padding && y > rect.y - padding && y < rect.y + rect.height + padding) {
        return tag;
      }
    }
    return null;
  }
  startAnimation() {
    if (this.animationFrameId) return;
    const animate = () => {
      this.render();
      this.animationFrameId = requestAnimationFrame(animate);
    };
    animate();
  }
  stopAnimation() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
    this.render();
  }
  measureTextWidth(text, fontSize) {
    this.ctx.font = `${fontSize}px Lora`;
    return this.ctx.measureText(text).width;
  }
  blendColors(color1, color2, ratio) {
    color1 = color1.replace("#", "");
    color2 = color2.replace("#", "");
    const r1 = parseInt(color1.slice(0, 2), 16);
    const g1 = parseInt(color1.slice(2, 4), 16);
    const b1 = parseInt(color1.slice(4, 6), 16);
    const r2 = parseInt(color2.slice(0, 2), 16);
    const g2 = parseInt(color2.slice(2, 4), 16);
    const b2 = parseInt(color2.slice(4, 6), 16);
    const r = Math.round(r1 * (1 - ratio) + r2 * ratio);
    const g = Math.round(g1 * (1 - ratio) + g2 * ratio);
    const b = Math.round(b1 * (1 - ratio) + b2 * ratio);
    return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
  }
  roundRect(ctx, x, y, width, height, radius) {
    if (typeof radius === "number") {
      radius = {
        tl: radius,
        tr: radius,
        br: radius,
        bl: radius
      };
    } else {
      radius = {
        ...{
          tl: 0,
          tr: 0,
          br: 0,
          bl: 0
        },
        ...radius
      };
    }
    ctx.beginPath();
    ctx.moveTo(x + radius.tl, y);
    ctx.lineTo(x + width - radius.tr, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
    ctx.lineTo(x + width, y + height - radius.br);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
    ctx.lineTo(x + radius.bl, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
    ctx.lineTo(x, y + radius.tl);
    ctx.quadraticCurveTo(x, y, x + radius.tl, y);
    ctx.closePath();
  }
  render() {
    const ctx = this.ctx;
    const width = this.canvas.width / window.devicePixelRatio;
    const height = this.canvas.height / window.devicePixelRatio;
    ctx.clearRect(0, 0, width, height);
    if (this.config.backgroundColor) {
      ctx.fillStyle = "rgba(255,255,255,0)";
      ctx.fillRect(0, 0, width, height);
    }
    this.connections.forEach(conn => {
      this.drawConnection(conn);
    });
    this.tags.forEach(tag => {
      this.drawTag(tag);
    });
  }
  updateTag(id, updates) {
    const tag = this.tags.find(t => t.id === id);
    if (tag) {
      Object.assign(tag, updates);
      const width = this.canvas.width / window.devicePixelRatio;
      const height = this.canvas.height / window.devicePixelRatio;
      if (updates.x !== undefined) {
        tag.xPercent = updates.x / width * 100;
      }
      if (updates.y !== undefined) {
        tag.yPercent = updates.y / height * 100;
      }
      if (updates.xPercent !== undefined) {
        tag.x = width * updates.xPercent / 100;
      }
      if (updates.yPercent !== undefined) {
        tag.y = height * updates.yPercent / 100;
      }
      this.calculateLayout();
      this.render();
    }
  }
  setTagTextOrientation(id, orientation) {
    const tag = this.tags.find(t => t.id === id);
    if (tag && (orientation === "horizontal" || orientation === "vertical")) {
      tag.textOrientation = orientation;
      this.render();
    }
  }
  setActiveTag(id) {
    const tag = this.tags.find(t => t.id === id);
    this.activeTag = tag || null;
    this.render();
  }
  addTag(tag) {
    if (!tag.textOrientation) {
      tag.textOrientation = "horizontal";
    }
    if (!tag.fontSize) {
      tag.fontSize = this.tagConfig.fontSize;
    }
    if (tag.borderRadius === undefined) {
      tag.borderRadius = this.tagConfig.borderRadius;
    }
    const width = this.canvas.width / window.devicePixelRatio;
    const height = this.canvas.height / window.devicePixelRatio;
    if (tag.xPercent !== undefined && tag.yPercent !== undefined) {
      tag.x = width * tag.xPercent / 100;
      tag.y = height * tag.yPercent / 100;
    }
    this.tags.push(tag);
    this.calculateLayout();
    this.render();
  }
  removeTag(id) {
    this.tags = this.tags.filter(t => t.id !== id);
    this.connections = this.connections.filter(c => c.source !== id && c.target !== id);
    if (this.activeTag && this.activeTag.id === id) {
      this.activeTag = null;
    }
    this.calculateLayout();
    this.render();
  }
  addConnection(conn) {
    const existingConnections = this.connections.filter(c => c.source === conn.source && c.target === conn.target || c.source === conn.target && c.target === conn.source);
    if (existingConnections.length === 0) {
      this.connections.push({
        source: conn.source,
        target: conn.target,
        curveIntensity: conn.curveIntensity || 0,
        lineWidth: conn.lineWidth || this.connectionConfig.lineWidth,
        connectFrom: conn.connectFrom || "auto",
        connectTo: conn.connectTo || "auto",
        shiftFrom: conn.shiftFrom || 0,
        shiftTo: conn.shiftTo || 0
      });
      this.render();
    }
  }
  removeConnection(sourceId, targetId) {
    this.connections = this.connections.filter(c => !(c.source === sourceId && c.target === targetId || c.source === targetId && c.target === sourceId));
    this.render();
  }
  setLayout(layout) {
    this.config.layout = layout;
    this.calculateLayout();
    this.render();
  }
  setConfig(newConfig) {
    this.config = {
      ...this.config,
      ...newConfig
    };
    this.calculateLayout();
    this.render();
  }
  setTagConfig(newTagConfig) {
    this.tagConfig = {
      ...this.tagConfig,
      ...newTagConfig
    };
    this.render();
  }
  setConnectionConfig(newConnectionConfig) {
    this.connectionConfig = {
      ...this.connectionConfig,
      ...newConnectionConfig
    };
    this.render();
  }
  getTags() {
    return this.tags.map(tag => ({
      ...tag
    }));
  }
  getConnections() {
    return [...this.connections];
  }
  exportAsJSON() {
    return {
      tags: this.tags.map(tag => ({
        id: tag.id,
        name: tag.name,
        color: tag.color,
        textOrientation: tag.textOrientation,
        fontSize: tag.fontSize,
        borderRadius: tag.borderRadius,
        xPercent: tag.xPercent,
        yPercent: tag.yPercent
      })),
      connections: this.connections.map(conn => ({
        source: conn.source,
        target: conn.target,
        curveIntensity: conn.curveIntensity,
        lineWidth: conn.lineWidth,
        connectFrom: conn.connectFrom,
        connectTo: conn.connectTo,
        shiftFrom: conn.shiftFrom,
        shiftTo: conn.shiftTo
      })),
      config: {
        layout: this.config.layout,
        padding: this.config.padding
      },
      tagConfig: {
        fontSize: this.tagConfig.fontSize,
        borderRadius: this.tagConfig.borderRadius
      },
      connectionConfig: {
        lineWidth: this.connectionConfig.lineWidth
      }
    };
  }
  importFromJSON(json) {
    this.tags = json.tags || [];
    this.connections = this.processConnections(json.connections || []);
    this.config = {
      ...this.config,
      ...json.config
    };
    this.tagConfig = {
      ...this.tagConfig,
      ...json.tagConfig
    };
    this.connectionConfig = {
      ...this.connectionConfig,
      ...json.connectionConfig
    };
    const width = this.canvas.width / window.devicePixelRatio;
    const height = this.canvas.height / window.devicePixelRatio;
    this.tags.forEach(tag => {
      if (tag.xPercent !== undefined && tag.yPercent !== undefined) {
        tag.x = width * tag.xPercent / 100;
        tag.y = height * tag.yPercent / 100;
      }
    });
    this.activeTag = null;
    this.calculateLayout();
    this.render();
  }
  destroy() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
    this.canvas.remove();
  }
}

/***/ },

/***/ "./src/scripts/widgets/MethodologyTree/graphConfig.ts"
/*!************************************************************!*\
  !*** ./src/scripts/widgets/MethodologyTree/graphConfig.ts ***!
  \************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   initialConfig: () => (/* binding */ initialConfig),
/* harmony export */   initialConnections: () => (/* binding */ initialConnections),
/* harmony export */   initialTags: () => (/* binding */ initialTags)
/* harmony export */ });
const initialTags = [{
  id: "Agency",
  name: wp.i18n.__("Субъектность", 'childlab'),
  color: "#90b636",
  textOrientation: "horizontal",
  fontSize: 20,
  xPercent: 50.0,
  yPercent: 4
}, {
  id: "Self_regulatory_abilities",
  name: wp.i18n.__("Регуляторные \n способности", 'childlab'),
  color: "#38d37c",
  textOrientation: "horizontal",
  fontSize: 16,
  xPercent: 25,
  yPercent: 18.0
}, {
  id: "Cognitive_abilities",
  name: wp.i18n.__("Познавательные \n способности", 'childlab'),
  color: "#dcc22d",
  textOrientation: "horizontal",
  fontSize: 16,
  xPercent: 76,
  yPercent: 18.0
}, {
  id: "Communicative_abilities",
  name: wp.i18n.__("Коммуникативные \n способности", 'childlab'),
  color: "#db508f",
  textOrientation: "horizontal",
  fontSize: 16,
  xPercent: 50.0,
  yPercent: 27.0
}, {
  id: "Planning",
  name: wp.i18n.__("Планирование", 'childlab'),
  color: "#64af38",
  textOrientation: "horizontal",
  fontSize: 13,
  xPercent: 12,
  yPercent: 10
}, {
  id: "Imagination",
  name: wp.i18n.__("Воображение", 'childlab'),
  color: "#becc1c",
  textOrientation: "horizontal",
  fontSize: 13,
  xPercent: 88,
  yPercent: 10
}, {
  id: "Dialectical_thinking",
  name: wp.i18n.__("Диалектическое \n мышление", 'childlab'),
  color: "#f3c932",
  textOrientation: "horizontal",
  fontSize: 13,
  xPercent: 87,
  yPercent: 27
}, {
  id: "Anticipation",
  name: wp.i18n.__("Предвосхищение", 'childlab'),
  color: "#e99030",
  textOrientation: "horizontal",
  fontSize: 13,
  xPercent: 85,
  yPercent: 35
}, {
  id: "argumentation",
  name: wp.i18n.__("Аргументация", 'childlab'),
  color: "#ea6695",
  textOrientation: "horizontal",
  fontSize: 13,
  xPercent: 76,
  yPercent: 42
}, {
  id: "Decentration",
  name: wp.i18n.__("Децентрация", 'childlab'),
  color: "#D34FB5",
  textOrientation: "horizontal",
  fontSize: 13,
  xPercent: 50.0,
  yPercent: 35
}, {
  id: "Volitional_control",
  name: wp.i18n.__("Произвольность", 'childlab'),
  color: "#49C64F",
  textOrientation: "horizontal",
  fontSize: 13,
  xPercent: 14,
  yPercent: 25
}, {
  id: "moral_reasoning",
  name: wp.i18n.__("Моральные суждения", 'childlab'),
  color: "#B949D4",
  textOrientation: "horizontal",
  fontSize: 13,
  xPercent: 50.0,
  yPercent: 48
}, {
  id: "reflection",
  name: wp.i18n.__("Рефлексия", 'childlab'),
  color: "#9AD04A",
  textOrientation: "horizontal",
  fontSize: 13,
  xPercent: 25,
  yPercent: 42
}, {
  id: "construction",
  name: wp.i18n.__("Конструирование", 'childlab'),
  color: "#6E41D8",
  textOrientation: "vertical",
  fontSize: 13,
  xPercent: 52,
  yPercent: 67
}, {
  id: "shared_reading",
  name: wp.i18n.__("Совместное чтение", 'childlab'),
  color: "#4164D9",
  textOrientation: "vertical",
  fontSize: 13,
  xPercent: 47,
  yPercent: 71
}, {
  id: "storytelling",
  name: wp.i18n.__("Сочинительство", 'childlab'),
  color: "#50D4CB",
  textOrientation: "vertical",
  fontSize: 13,
  xPercent: 42,
  yPercent: 66
}, {
  id: "experimentation",
  name: wp.i18n.__("Экспериментирование", 'childlab'),
  color: "#42A0CC",
  textOrientation: "vertical",
  fontSize: 13,
  xPercent: 57,
  yPercent: 66
}, {
  id: "game",
  name: wp.i18n.__("Игра", 'childlab'),
  color: "#aA8740",
  textOrientation: "horizontal",
  fontSize: 32,
  xPercent: 50.0,
  yPercent: 87
}, {
  id: "attachment",
  name: wp.i18n.__("Привязанность", 'childlab'),
  color: "#8A6720",
  textOrientation: "horizontal",
  fontSize: 20,
  xPercent: 50.0,
  yPercent: 97
}];
const initialConnections = [{
  source: "Agency",
  target: "Self_regulatory_abilities",
  curveIntensity: 0,
  connectFrom: "bottom",
  connectTo: "right",
  lineWidth: 4
}, {
  source: "Agency",
  target: "Cognitive_abilities",
  curveIntensity: 0,
  connectFrom: "bottom",
  connectTo: "left",
  lineWidth: 4
}, {
  source: "Self_regulatory_abilities",
  target: "Cognitive_abilities",
  curveIntensity: 0,
  connectFrom: "right",
  connectTo: "left",
  lineWidth: 4
}, {
  source: "Self_regulatory_abilities",
  target: "Communicative_abilities",
  curveIntensity: 0,
  connectFrom: "right",
  connectTo: "top",
  lineWidth: 4
}, {
  source: "Cognitive_abilities",
  target: "Communicative_abilities",
  curveIntensity: 0,
  connectFrom: "left",
  connectTo: "top",
  lineWidth: 4
}, {
  source: "Agency",
  target: "Communicative_abilities",
  curveIntensity: 0,
  connectFrom: "bottom",
  connectTo: "top",
  lineWidth: 4
}, {
  source: "Cognitive_abilities",
  target: "Imagination",
  curveIntensity: -0.4,
  connectFrom: "top",
  connectTo: "left",
  lineWidth: 2
}, {
  source: "Planning",
  target: "Self_regulatory_abilities",
  curveIntensity: -0.4,
  connectFrom: "right",
  connectTo: "top",
  lineWidth: 2
}, {
  source: "Dialectical_thinking",
  target: "Cognitive_abilities",
  curveIntensity: -0.3,
  connectFrom: "left",
  connectTo: "bottom",
  shiftTo: -0.05,
  lineWidth: 2
}, {
  source: "Anticipation",
  target: "Cognitive_abilities",
  curveIntensity: -0.2,
  connectFrom: "top",
  shiftFrom: -0.8,
  connectTo: "bottom",
  shiftTo: -0.2,
  lineWidth: 2
}, {
  source: "argumentation",
  target: "Cognitive_abilities",
  curveIntensity: 0.05,
  connectFrom: "top",
  shiftFrom: -0.8,
  connectTo: "bottom",
  shiftTo: -0.3,
  lineWidth: 2
}, {
  source: "Communicative_abilities",
  target: "argumentation",
  curveIntensity: 0.3,
  connectFrom: "bottom",
  shiftFrom: 0.9,
  connectTo: "left",
  lineWidth: 2
}, {
  source: "Communicative_abilities",
  target: "Decentration",
  curveIntensity: 0.2,
  connectFrom: "bottom",
  connectTo: "top",
  lineWidth: 2
}, {
  source: "Self_regulatory_abilities",
  target: "Volitional_control",
  curveIntensity: -0.2,
  connectFrom: "bottom",
  shiftFrom: 0.2,
  connectTo: "right",
  lineWidth: 2
}, {
  source: "moral_reasoning",
  target: "Cognitive_abilities",
  curveIntensity: 0.2,
  connectFrom: "top",
  shiftFrom: 0.6,
  connectTo: "bottom",
  shiftTo: -0.5,
  lineWidth: 2
}, {
  source: "reflection",
  target: "Cognitive_abilities",
  curveIntensity: 0.6,
  connectFrom: "right",
  connectTo: "bottom",
  shiftTo: -0.7,
  lineWidth: 2
}, {
  source: "reflection",
  target: "Self_regulatory_abilities",
  curveIntensity: 0.2,
  connectFrom: "top",
  connectTo: "bottom",
  shiftTo: 0.5,
  lineWidth: 2
}, {
  source: "construction",
  target: "moral_reasoning",
  curveIntensity: -0.2,
  connectFrom: "top",
  shiftFrom: 2,
  connectTo: "bottom",
  shiftTo: 0.45,
  lineWidth: 2
}, {
  source: "experimentation",
  target: "moral_reasoning",
  curveIntensity: -0.1,
  connectFrom: "top",
  connectTo: "bottom",
  shiftTo: 1,
  lineWidth: 2
}, {
  source: "moral_reasoning",
  target: "storytelling",
  curveIntensity: 0.3,
  connectFrom: "bottom",
  shiftFrom: -1,
  connectTo: "top",
  lineWidth: 2
}, {
  source: "moral_reasoning",
  target: "shared_reading",
  curveIntensity: 0.1,
  connectFrom: "bottom",
  shiftFrom: -0.4,
  connectTo: "top",
  shiftTo: -2,
  lineWidth: 2
}, {
  source: "construction",
  target: "attachment",
  curveIntensity: 0.05,
  connectFrom: "bottom",
  shiftFrom: 2,
  connectTo: "top",
  shiftTo: 0.2,
  lineWidth: 2
}, {
  source: "experimentation",
  target: "attachment",
  curveIntensity: 0.05,
  connectFrom: "bottom",
  shiftFrom: 3,
  connectTo: "top",
  shiftTo: 0.7,
  lineWidth: 2
}, {
  source: "storytelling",
  target: "attachment",
  curveIntensity: -0.1,
  connectFrom: "bottom",
  shiftFrom: -6,
  connectTo: "top",
  shiftTo: -0.7,
  lineWidth: 2
}, {
  source: "shared_reading",
  target: "attachment",
  curveIntensity: -0.05,
  connectFrom: "bottom",
  shiftFrom: -3,
  connectTo: "top",
  shiftTo: -0.2,
  lineWidth: 2
}, {
  source: "shared_reading",
  target: "storytelling",
  curveIntensity: 0.3,
  connectFrom: "top",
  shiftFrom: 2,
  connectTo: "left",
  shiftTo: -1.2,
  lineWidth: 2
}, {
  source: "experimentation",
  target: "construction",
  curveIntensity: 0.4,
  connectFrom: "right",
  shiftFrom: -1.4,
  connectTo: "right",
  shiftTo: 1,
  lineWidth: 2
}];
const initialConfig = {
  curveIntensity: 0.5,
  lineWidth: 3,
  textOrientation: "horizontal"
};

/***/ },

/***/ "./src/scripts/widgets/index.ts"
/*!**************************************!*\
  !*** ./src/scripts/widgets/index.ts ***!
  \**************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ArticlesListComponent: () => (/* reexport safe */ _ArticlesList_ArticlesList__WEBPACK_IMPORTED_MODULE_1__.ArticlesListComponent),
/* harmony export */   FrontListComponent: () => (/* reexport safe */ _FrontListComponent_FrontListComponent__WEBPACK_IMPORTED_MODULE_0__.FrontListComponent),
/* harmony export */   MethodologyTreeComponent: () => (/* reexport safe */ _MethodologyTree_MethodologyTreeComponent__WEBPACK_IMPORTED_MODULE_2__.MethodologyTreeComponent)
/* harmony export */ });
/* harmony import */ var _FrontListComponent_FrontListComponent__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./FrontListComponent/FrontListComponent */ "./src/scripts/widgets/FrontListComponent/FrontListComponent.tsx");
/* harmony import */ var _ArticlesList_ArticlesList__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ArticlesList/ArticlesList */ "./src/scripts/widgets/ArticlesList/ArticlesList.tsx");
/* harmony import */ var _MethodologyTree_MethodologyTreeComponent__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./MethodologyTree/MethodologyTreeComponent */ "./src/scripts/widgets/MethodologyTree/MethodologyTreeComponent.tsx");




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
/* harmony import */ var _scripts_shared_switcher__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./scripts/shared/switcher */ "./src/scripts/shared/switcher.js");
/* harmony import */ var _scripts_shared_switcher__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_scripts_shared_switcher__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _scripts_widgets__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./scripts/widgets */ "./src/scripts/widgets/index.ts");
/* harmony import */ var react_dom_client__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! react-dom/client */ "./node_modules/react-dom/client.js");
/* harmony import */ var _scripts_entities_MethodologyTags__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./scripts/entities/MethodologyTags */ "./src/scripts/entities/MethodologyTags.tsx");
/* harmony import */ var _scripts_entities_Articles__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./scripts/entities/Articles */ "./src/scripts/entities/Articles.tsx");











const renderComponent = (selector, render) => {
  try {
    const container = react_dom_client__WEBPACK_IMPORTED_MODULE_7__.createRoot(document.querySelector(selector));
    container.render((0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_scripts_entities_MethodologyTags__WEBPACK_IMPORTED_MODULE_8__.MethodologyTagsContextProvider, null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_scripts_entities_Articles__WEBPACK_IMPORTED_MODULE_9__.ArticlesContextProvider, null, render)));
  } catch (e) {
    console.error('ErrorRenderingReactComponent :: methodologyTagsMenu ', e);
  }
};
renderComponent("#methodology-tags-menu", (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_scripts_widgets__WEBPACK_IMPORTED_MODULE_6__.FrontListComponent, null));
renderComponent("#articles-list-component", (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_scripts_widgets__WEBPACK_IMPORTED_MODULE_6__.ArticlesListComponent, null));
renderComponent("#methodology-tree-component", (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_scripts_widgets__WEBPACK_IMPORTED_MODULE_6__.MethodologyTreeComponent, null));
})();

/******/ })()
;
//# sourceMappingURL=index.js.map