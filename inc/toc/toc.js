class ArticleToc {
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
    // Находим все заголовки h2 - h6 с ID
    const headings = document.querySelectorAll(
      "h2[id], h3[id], h4[id], h5[id], h6[id]"
    );

    headings.forEach((heading, index) => {
      this.sections.push({
        id: heading.id,
        element: heading,
        title: heading.textContent.trim(),
        level: heading.tagName,
        top: heading.offsetTop,
        index: index,
      });
    });
  }

  initTableOfContents() {
    const tocLinks = document.querySelectorAll(".toc-link");
    const self = this;

    tocLinks.forEach((link) => {
      link.addEventListener("click", function (e) {
        e.preventDefault();
        const targetId = this.getAttribute("href").substring(1);
        self.scrollToSection(targetId);
      });
    });

    // Отслеживаем активный раздел
    window.addEventListener("scroll", () => {
      this.updateActiveTocItem();
    });
  }

  // Вспомогательные методы
  getStoredMode() {
    return localStorage.getItem("reading_mode") || "scientist_long";
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
    const tocLinks = document.querySelectorAll(".toc-link");

    const tocContainer = document.querySelector(".table-of-contents");

    tocLinks.forEach((link) => {
      link.parentElement.classList.remove("active");
    });

    if (currentSection) {
      const activeLink = document.querySelector(
        `.toc-link[href="#${currentSection.id}"]`
      );
      if (activeLink) {
        activeLink.parentElement.classList.add("active");
        tocContainer.scrollTo({
          top: activeLink.offsetTop - 20,
          behavior: "smooth",
        });
      }
    }
  }

  scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
      window.scrollTo({
        top: section.offsetTop - 80,
        behavior: "smooth",
      });
    }
  }

  startScrollTracking() {
    window.addEventListener("scroll", () => {
      this.updateActiveTocItem();
      this.updateNavigationButtons();
    });
  }
}

// Инициализация при загрузке страницы
document.addEventListener("DOMContentLoaded", () => {
  window.articleToc = new ArticleToc();
});
