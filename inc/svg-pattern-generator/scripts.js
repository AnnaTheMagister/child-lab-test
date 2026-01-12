// SVG Pattern Generator Module
class SVGPatternGenerator {
  constructor(container, svgUrl, options = {}) {

    this.container =
      typeof container === "string"
        ? document.querySelector(container)
        : container;

    this.svgUrl = svgUrl;
    this.options = {
      count: options.count || 5,
      minScale: options.minScale || 0.5,
      maxScale: options.maxScale || 1.5,
      minRotate: options.minRotate || -15,
      maxRotate: options.maxRotate || 15,
      spacing: options.spacing || 50,
      opacity: options.opacity || 0.8,
      avoidOverlap: options.avoidOverlap !== false,
      ...options,
    };

    this.patternItems = [];
    this.occupiedPositions = [];
    this.itemSize = 100; // примерный размер, будет рассчитан из SVG

    this.init();
  }

  init() {
    if (!this.container) {
      console.error("Container not found");
      return;
    }

    // Создаем контейнер для паттернов
    this.patternContainer = document.createElement("div");
    this.patternContainer.className = "svg-pattern-background";
    this.container.classList.add("svg-pattern-container");
    this.container.appendChild(this.patternContainer);

    // Определяем примерный размер SVG
    this.calculateSVGSize();

    // Генерируем паттерны
    this.generatePatterns();

    // Ресайз обработчик
    window.addEventListener("resize", () => this.handleResize());
  }

  calculateSVGSize() {
    // Для упрощения используем фиксированный размер
    // В реальном проекте можно парсить SVG или задавать в опциях
    this.itemSize = this.options.itemSize || 100;
  }

  generatePatterns() {
    // Очищаем предыдущие элементы
    this.patternContainer.innerHTML = "";
    this.patternItems = [];
    this.occupiedPositions = [];

    const containerWidth = this.container.clientWidth;
    const containerHeight = this.container.clientHeight;

    for (let i = 0; i < this.options.count; i++) {
      this.createPatternItem(containerWidth, containerHeight, i);
    }
  }

  createPatternItem(containerWidth, containerHeight, index) {
    const item = document.createElement("div");
    item.className = "svg-pattern-item";

    // Устанавливаем SVG как background-image
    item.style.backgroundImage = `url(${this.svgUrl})`;

    // Генерируем случайные параметры
    const scale = this.getRandomScale();
    const rotation = this.getRandomRotation();
    const position = this.getNonOverlappingPosition(
      containerWidth,
      containerHeight,
      this.itemSize * scale
    );

    // Если не удалось найти позицию без пересечений, пропускаем элемент
    if (!position) return;

    // Применяем стили
    item.style.width = `${this.itemSize * scale}px`;
    item.style.height = `${this.itemSize * scale}px`;
    item.style.left = `${position.x}px`;
    item.style.top = `${position.y}px`;
    item.style.transform = `rotate(${rotation}deg)`;
    item.style.opacity = this.options.opacity;

    // Сохраняем позицию как занятую
    this.occupiedPositions.push({
      x: position.x,
      y: position.y,
      width: this.itemSize * scale,
      height: this.itemSize * scale,
    });

    this.patternContainer.appendChild(item);
    this.patternItems.push(item);
  }

  getRandomScale() {
    return (
      this.options.minScale +
      Math.random() * (this.options.maxScale - this.options.minScale)
    );
  }

  getRandomRotation() {
    return (
      this.options.minRotate +
      Math.random() * (this.options.maxRotate - this.options.minRotate)
    );
  }

  getNonOverlappingPosition(containerWidth, containerHeight, itemSize) {
    const maxAttempts = 100;
    let attempts = 0;

    while (attempts < maxAttempts) {
      const x = Math.random() * (containerWidth - itemSize);
      const y = Math.random() * (containerHeight - itemSize);

      // Проверяем пересечение с другими элементами
      let hasOverlap = false;

      for (const occupied of this.occupiedPositions) {
        if (this.checkOverlap(x, y, itemSize, itemSize, occupied)) {
          hasOverlap = true;
          break;
        }
      }

      if (!hasOverlap) {
        return { x, y };
      }

      attempts++;
    }

    // Если не удалось найти позицию без пересечений,
    // возвращаем случайную позицию
    return {
      x: Math.random() * (containerWidth - itemSize),
      y: Math.random() * (containerHeight - itemSize),
    };
  }

  checkOverlap(x1, y1, w1, h1, occupied) {
    const buffer = this.options.spacing;

    return !(
      x1 + w1 + buffer < occupied.x ||
      x1 > occupied.x + occupied.width + buffer ||
      y1 + h1 + buffer < occupied.y ||
      y1 > occupied.y + occupied.height + buffer
    );
  }

  handleResize() {
    // Дебаунс ресайза для производительности
    clearTimeout(this.resizeTimeout);
    this.resizeTimeout = setTimeout(() => {
      this.generatePatterns();
    }, 250);
  }

  updateOptions(newOptions) {
    this.options = { ...this.options, ...newOptions };
    this.generatePatterns();
  }

  destroy() {
    if (this.patternContainer && this.patternContainer.parentNode) {
      this.patternContainer.parentNode.removeChild(this.patternContainer);
    }
    window.removeEventListener("resize", () => this.handleResize());
  }
}

// Функция для быстрой инициализации
function createSVGPattern(selector, svgUrl, options = {}) {
  return new SVGPatternGenerator(selector, svgUrl, options);
}

// Инициализация при загрузке страницы
document.addEventListener("DOMContentLoaded", () => {
    console.log('!!!!DOM')
  window.createSVGPattern = createSVGPattern;
});
