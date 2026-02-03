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
const DEFAULT_IMAGE_URL = BASE_URL + "/wp-content/themes/childlab-react/assets/images/post-bg.jpg";

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
/* harmony import */ var _shared_useCurrentSearch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../shared/useCurrentSearch */ "./src/scripts/shared/useCurrentSearch.ts");
/* harmony import */ var _entities_MethodologyTags__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../entities/MethodologyTags */ "./src/scripts/entities/MethodologyTags.tsx");
/* harmony import */ var _Loader_Loader__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../Loader/Loader */ "./src/scripts/widgets/Loader/Loader.tsx");
/* harmony import */ var _FrontListComponent_FrontListComponent__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../FrontListComponent/FrontListComponent */ "./src/scripts/widgets/FrontListComponent/FrontListComponent.tsx");







const ArticlesListComponent = () => {
  const [articlesData, setArticlesData] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)([]);
  const {
    currentTaxonomy,
    currentTag
  } = (0,_shared_useCurrentSearch__WEBPACK_IMPORTED_MODULE_2__.useCurrentSearch)();
  const [screenSize, setScreenSize] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)((0,_FrontListComponent_FrontListComponent__WEBPACK_IMPORTED_MODULE_5__.getScreenSize)(window.innerWidth));
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    fetch(_shared_consts__WEBPACK_IMPORTED_MODULE_1__.BASE_URL + "/wp-json/wp/v2/articles?_embed").then(response => response.json()).then(data => setArticlesData(data));
  }, []);
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    window.addEventListener("resize", () => {
      setScreenSize((0,_FrontListComponent_FrontListComponent__WEBPACK_IMPORTED_MODULE_5__.getScreenSize)(window.innerWidth));
    });
  }, []);
  const filteredArticles = (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => {
    if (!articlesData) return [];
    if (currentTaxonomy === "methodology") {
      if (parseInt(currentTag) > 0) {
        return articlesData.filter(art => art["methodology-tags"]?.some(tag => tag === parseInt(currentTag)));
      } else {
        return articlesData;
      }
    }
    return articlesData;
  }, [articlesData, currentTaxonomy, currentTag]);
  const title = currentTaxonomy === "methodology" && parseInt(currentTag) !== -1 ? window.wp.i18n.__("Статьи по теме", "childlab") : window.wp.i18n.__("Все статьи", "childlab");
  let content = (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(react__WEBPACK_IMPORTED_MODULE_0__.Fragment, null);
  if (!articlesData.length) {
    content = (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_Loader_Loader__WEBPACK_IMPORTED_MODULE_4__["default"], {
      fullScreen: false
    });
  } else if (!filteredArticles.length) {
    content = (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      class: "empty-wrapper"
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      class: "empty-placeholder"
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
      class: "col-lg-6 col-md-12"
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
  } = (0,_entities_MethodologyTags__WEBPACK_IMPORTED_MODULE_3__.useMethodologyTags)();
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
/* harmony import */ var _shared_consts__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../shared/consts */ "./src/scripts/shared/consts.ts");
/* harmony import */ var _shared_useCurrentSearch__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../shared/useCurrentSearch */ "./src/scripts/shared/useCurrentSearch.ts");







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
const DEFAULT_SVG_PATTERN = _shared_consts__WEBPACK_IMPORTED_MODULE_4__.BASE_URL + "/wp-content/themes/child-lab-test/assets/images/svg-patterns/all.svg";
const MethodologyTagComponent = tag => {
  var _tag$acf$color, _tag$width;
  const {
    currentTaxonomy,
    currentTag
  } = (0,_shared_useCurrentSearch__WEBPACK_IMPORTED_MODULE_5__.useCurrentSearch)();
  const backgroundColor = (_tag$acf$color = tag.acf.color) !== null && _tag$acf$color !== void 0 ? _tag$acf$color : "#f00";
  const svg_pattern = tag.acf.svg_pattern ? tag.acf.svg_pattern : DEFAULT_SVG_PATTERN;
  const handleClick = e => {
    e.preventDefault();
    history.pushState({}, "", `?methodology=${tag.id}`);
    window.dispatchEvent(new Event("pushstate"));
  };
  const handleCreateSvg = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(ref => {
    createSVGPattern(ref, svg_pattern, {
      count: 10,
      minScale: 1,
      maxScale: 1,
      minRotate: -180,
      maxRotate: 180,
      spacing: 0
    });
  }, []);
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("a", {
    href: `?methodology=${tag.id}`,
    onClick: handleClick,
    className: `childlab-widget childlab-card-link methodology-tags-menu__tag methodology-tag-width-${(_tag$width = tag.width) !== null && _tag$width !== void 0 ? _tag$width : 4} ${currentTag == tag.id || !currentTag && tag.id == -1 ? "methodology-tag__active" : ""}`,
    style: {
      backgroundColor
    }
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "methodology-tags-menu__svg-background",
    ref: handleCreateSvg
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
/* harmony export */   ArticlesListComponent: () => (/* reexport safe */ _ArticlesList_ArticlesList__WEBPACK_IMPORTED_MODULE_1__.ArticlesListComponent),
/* harmony export */   FrontListComponent: () => (/* reexport safe */ _FrontListComponent_FrontListComponent__WEBPACK_IMPORTED_MODULE_0__.FrontListComponent)
/* harmony export */ });
/* harmony import */ var _FrontListComponent_FrontListComponent__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./FrontListComponent/FrontListComponent */ "./src/scripts/widgets/FrontListComponent/FrontListComponent.tsx");
/* harmony import */ var _ArticlesList_ArticlesList__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ArticlesList/ArticlesList */ "./src/scripts/widgets/ArticlesList/ArticlesList.tsx");



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










const methodologyTagsMenu = react_dom_client__WEBPACK_IMPORTED_MODULE_7__.createRoot(document.querySelector("#methodology-tags-menu"));
methodologyTagsMenu.render((0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_scripts_entities_MethodologyTags__WEBPACK_IMPORTED_MODULE_8__.MethodologyTagsContextProvider, null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_scripts_widgets__WEBPACK_IMPORTED_MODULE_6__.FrontListComponent, null)));
const articlesList = react_dom_client__WEBPACK_IMPORTED_MODULE_7__.createRoot(document.querySelector("#articles-list-component"));
articlesList.render((0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_scripts_entities_MethodologyTags__WEBPACK_IMPORTED_MODULE_8__.MethodologyTagsContextProvider, null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_scripts_widgets__WEBPACK_IMPORTED_MODULE_6__.ArticlesListComponent, null)));
})();

/******/ })()
;
//# sourceMappingURL=index.js.map