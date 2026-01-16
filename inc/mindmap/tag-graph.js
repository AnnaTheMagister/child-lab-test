// tag-graph.js
class TagGraph {
  constructor(config) {
    this.config = {
      spacing: 100,
      padding: 40,
      curveIntensity: 0.5,
      lineWidth: 3,
      interactive: true,
      textOrientation: "horizontal", // 'horizontal' или 'vertical'
      ...config,
    };

    this.tags = [...config.tags];
    this.connections = config.connections;
    this.isDragging = false;
    this.dragTarget = null;
    this.animationFrameId = null;
    this.mousePos = { x: 0, y: 0 };
    this.hoveredTag = null;

    this.canvas = document.createElement("canvas");
    this.ctx = this.canvas.getContext("2d");

    // Добавляем направление по умолчанию если не задано
    this.tags.forEach((tag) => {
      if (!tag.direction) {
        tag.direction = this.config.layout === "vertical" ? "v" : "h";
      }
      if (!tag.textOrientation) {
        tag.textOrientation = this.config.textOrientation;
      }
    });

    this.initCanvas();
    this.calculateLayout();

    if (this.config.interactive) {
      this.setupInteractivity();
    }

    this.render();
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
  }

  calculateLayout() {
    const { layout, spacing = 100, padding = 40 } = this.config;
    const width = this.canvas.width / window.devicePixelRatio;
    const height = this.canvas.height / window.devicePixelRatio;

    // Если теги уже имеют координаты (например, после загрузки JSON), не пересчитываем
    const hasManualCoords = this.tags.every(
      (tag) => tag.x !== undefined && tag.y !== undefined
    );
    if (hasManualCoords && layout === "manual") {
      return;
    }

    // Группируем теги по направлению
    const horizontalTags = this.tags.filter((tag) => tag.direction === "h");
    const verticalTags = this.tags.filter((tag) => tag.direction === "v");
    const autoTags = this.tags.filter(
      (tag) => !tag.direction || tag.direction === "auto"
    );

    // Располагаем горизонтальные теги
    if (horizontalTags.length > 0) {
      const horizontalSpacing = Math.min(
        spacing,
        (width - padding * 2) / horizontalTags.length
      );
      horizontalTags.forEach((tag, index) => {
        tag.x = padding + index * horizontalSpacing;
        tag.y = height / 2;
        if (tag.x > width - padding) {
          tag.x = width - padding;
        }
      });
    }

    // Располагаем вертикальные теги
    if (verticalTags.length > 0) {
      const verticalSpacing = Math.min(
        spacing,
        (height - padding * 2) / verticalTags.length
      );
      verticalTags.forEach((tag, index) => {
        tag.x = width / 2;
        tag.y = padding + index * verticalSpacing;
        if (tag.y > height - padding) {
          tag.y = height - padding;
        }
      });
    }

    // Автоматическое расположение для тегов без направления
    if (autoTags.length > 0) {
      switch (layout) {
        case "horizontal":
          autoTags.forEach((tag, index) => {
            const offset = horizontalTags.length + index;
            tag.x = padding + offset * spacing;
            tag.y = height / 2;
            tag.direction = "h";
          });
          break;

        case "vertical":
          autoTags.forEach((tag, index) => {
            const offset = verticalTags.length + index;
            tag.x = width / 2;
            tag.y = padding + offset * spacing;
            tag.direction = "v";
          });
          break;

        case "circular":
          const centerX = width / 2;
          const centerY = height / 2;
          const radius = Math.min(width, height) * 0.4 - padding;
          const angleStep = (2 * Math.PI) / this.tags.length;

          this.tags.forEach((tag, index) => {
            const angle = index * angleStep;
            tag.x = centerX + radius * Math.cos(angle);
            tag.y = centerY + radius * Math.sin(angle);
            tag.direction = "auto";
          });
          break;

        case "manual":
          // Для manual оставляем как есть или задаем случайные позиции
          autoTags.forEach((tag) => {
            if (tag.x === undefined || tag.y === undefined) {
              tag.x = padding + Math.random() * (width - padding * 2);
              tag.y = padding + Math.random() * (height - padding * 2);
              tag.direction = "auto";
            }
          });
          break;

        case "grid":
          // Распределяем в сетке
          const cols = Math.ceil(Math.sqrt(autoTags.length));
          const cellWidth = (width - padding * 2) / cols;
          const cellHeight =
            (height - padding * 2) / Math.ceil(autoTags.length / cols);

          autoTags.forEach((tag, index) => {
            const col = index % cols;
            const row = Math.floor(index / cols);
            tag.x = padding + col * cellWidth + cellWidth / 2;
            tag.y = padding + row * cellHeight + cellHeight / 2;
            tag.direction = "auto";
          });
          break;

        default:
          console.warn(`Неизвестный layout: ${layout}, используется manual`);
          this.config.layout = "manual";
      }
    }
  }

  drawTag(tag) {
    const ctx = this.ctx;
    const {
      x = 0,
      y = 0,
      name,
      color,
      direction = "h",
      textOrientation = "horizontal",
    } = tag;

    // Сохраняем состояние контекста
    ctx.save();

    // Рисуем тень
    ctx.shadowColor = "rgba(0, 0, 0, 0.2)";
    ctx.shadowBlur = 10;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;

    // Определяем размеры кнопки в зависимости от ориентации текста
    const padding = 20;
    const lineHeight = 20;
    const charWidth = 10; // Примерная ширина символа
    const lines = name.split(" ").reduce((acc, word) => {
      if (!acc.length) return [word];
      const lastLine = acc[acc.length - 1];
      if (this.measureTextWidth(lastLine + " " + word) <= 150) {
        acc[acc.length - 1] = lastLine + " " + word;
      } else {
        acc.push(word);
      }
      return acc;
    }, []);

    let width, height;

    if (textOrientation === "vertical") {
      // Для вертикального текста рассчитываем размеры по-другому
      const maxLineLength = Math.max(...lines.map((line) => line.length));
      width = lineHeight * lines.length + padding;
      height = charWidth * maxLineLength + padding * 2;
    } else {
      // Горизонтальный текст
      width =
        Math.max(...lines.map((line) => this.measureTextWidth(line))) +
        padding * 2;
      height = lineHeight * lines.length + padding;
    }

    const radius = 15;

    // Фон кнопки
    ctx.fillStyle = color;
    this.roundRect(ctx, x - width / 2, y - height / 2, width, height, radius);
    ctx.fill();

    // Индикатор направления тега
    if (direction === "h") {
      // Горизонтальная стрелка слева/справа
      ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
      ctx.beginPath();
      ctx.moveTo(x + width / 2 - 10, y);
      ctx.lineTo(x + width / 2, y - 5);
      ctx.lineTo(x + width / 2, y + 5);
      ctx.closePath();
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(x - width / 2 + 10, y);
      ctx.lineTo(x - width / 2, y - 5);
      ctx.lineTo(x - width / 2, y + 5);
      ctx.closePath();
      ctx.fill();
    } else if (direction === "v") {
      // Вертикальная стрелка сверху/снизу
      ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
      ctx.beginPath();
      ctx.moveTo(x, y + height / 2 - 10);
      ctx.lineTo(x - 5, y + height / 2);
      ctx.lineTo(x + 5, y + height / 2);
      ctx.closePath();
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(x, y - height / 2 + 10);
      ctx.lineTo(x - 5, y - height / 2);
      ctx.lineTo(x + 5, y - height / 2);
      ctx.closePath();
      ctx.fill();
    }

    // Граница при наведении или выделении
    if (this.hoveredTag === tag || tag.selected) {
      ctx.shadowColor = tag.selected
        ? "rgba(255, 255, 0, 0.5)"
        : "rgba(255, 255, 255, 0.5)";
      ctx.shadowBlur = tag.selected ? 20 : 15;
      ctx.strokeStyle = tag.selected ? "#FFD700" : "rgba(255, 255, 255, 0.8)";
      ctx.lineWidth = tag.selected ? 3 : 2;
      ctx.stroke();
    }

    // Рисуем текст в зависимости от ориентации
    ctx.shadowColor = "transparent";
    ctx.fillStyle = this.getContrastColor(color);
    ctx.font = "12px Lora, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    if (textOrientation === "vertical") {
      // Вертикальный текст
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(-Math.PI / 2); // Поворачиваем на 90 градусов против часовой

      lines.forEach((line, index) => {
        const lineY = -padding / 2 + index * lineHeight + lineHeight / 2;
        ctx.fillText(line, 0, lineY);
      });

      ctx.restore();
    } else {
      // Горизонтальный текст
      lines.forEach((line, index) => {
        const lineY =
          y - height / 2 + padding / 2 + lineHeight / 2 + index * lineHeight;
        ctx.fillText(line, x, lineY);
      });
    }

    // Индикатор ориентации текста в углу
    ctx.font = "10px 'Lora', sans-serif";
    ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
    const dirLabel = direction === "h" ? "→" : direction === "v" ? "↓" : "↻";
    const textOrientationLabel = textOrientation === "vertical" ? "↕" : "↔";

    // Рисуем оба индикатора
    ctx.fillText(dirLabel, x + width / 2 - 15, y - height / 2 + 12);
    ctx.fillText(textOrientationLabel, x + width / 2 - 15, y - height / 2 + 25);

    // Восстанавливаем состояние контекста
    ctx.restore();
  }

  drawConnection(conn) {
    const source = this.tags.find((t) => t.id === conn.source);
    const target = this.tags.find((t) => t.id === conn.target);

    if (
      !source ||
      !target ||
      !source.x ||
      !source.y ||
      !target.x ||
      !target.y
    ) {
      return;
    }

    const ctx = this.ctx;
    const { curveIntensity = 0.5, lineWidth = 3 } = this.config;

    // Учитываем направление тегов для кривизны
    let actualCurveIntensity = curveIntensity;

    // Если оба тега имеют одинаковое направление, уменьшаем кривизну
    if (
      source.direction === target.direction &&
      (source.direction === "h" || source.direction === "v")
    ) {
      actualCurveIntensity = curveIntensity * 0.3;
    }

    // Расчёт контрольных точек для кривой
    const dx = target.x - source.x;
    const dy = target.y - source.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // Если теги слишком близко, рисуем прямую линию
    if (distance < 50) {
      actualCurveIntensity = 0;
    }

    // Перпендикулярный вектор для изгиба
    const perpX = -dy * actualCurveIntensity * 0.5;
    const perpY = dx * actualCurveIntensity * 0.5;

    const cp1x = source.x + dx * 0.25 + perpX;
    const cp1y = source.y + dy * 0.25 + perpY;
    const cp2x = source.x + dx * 0.75 + perpX;
    const cp2y = source.y + dy * 0.75 + perpY;

    // Сохраняем состояние
    ctx.save();

    // Создаём градиент
    const gradient = ctx.createLinearGradient(
      source.x,
      source.y,
      target.x,
      target.y
    );
    gradient.addColorStop(0, source.color);
    gradient.addColorStop(
      0.5,
      this.blendColors(source.color, target.color, 0.5)
    );
    gradient.addColorStop(1, target.color);

    // Рисуем линию
    ctx.strokeStyle = gradient;
    ctx.lineWidth = lineWidth * (conn.strength || 1);
    ctx.lineCap = "round";

    // Тень для линии
    ctx.shadowColor = "rgba(0, 0, 0, 0.3)";
    ctx.shadowBlur = 5;

    ctx.beginPath();
    ctx.moveTo(source.x, source.y);

    if (actualCurveIntensity === 0) {
      // Прямая линия
      ctx.lineTo(target.x, target.y);
    } else {
      // Кривая Безье
      ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, target.x, target.y);
    }

    ctx.stroke();

    // Рисуем стрелку
    this.drawArrowHead(
      target.x,
      target.y,
      dx,
      dy,
      gradient,
      lineWidth * (conn.strength || 1)
    );

    // Восстанавливаем состояние
    ctx.restore();
  }

  drawArrowHead(x, y, dx, dy, color, lineWidth) {
    const ctx = this.ctx;
    const angle = Math.atan2(dy, dx);
    const arrowLength = 12 + lineWidth * 2;
    const arrowWidth = 6 + lineWidth;

    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.fillStyle = color;

    // Стрелка
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(-arrowLength, arrowWidth);
    ctx.lineTo(-arrowLength, -arrowWidth);
    ctx.closePath();
    ctx.fill();

    // Контур стрелки
    ctx.strokeStyle = "rgba(0, 0, 0, 0.2)";
    ctx.lineWidth = 0.5;
    ctx.stroke();

    ctx.restore();
  }

  setupInteractivity() {
    this.canvas.addEventListener("mousedown", this.handleMouseDown.bind(this));
    this.canvas.addEventListener("mousemove", this.handleMouseMove.bind(this));
    this.canvas.addEventListener("mouseup", this.handleMouseUp.bind(this));
    this.canvas.addEventListener("click", this.handleClick.bind(this));
    this.canvas.addEventListener(
      "mouseleave",
      this.handleMouseLeave.bind(this)
    );
    this.canvas.addEventListener("dblclick", this.handleDoubleClick.bind(this));
    this.canvas.addEventListener(
      "contextmenu",
      this.handleContextMenu.bind(this)
    );

    // Поддержка сенсорных устройств
    this.canvas.addEventListener(
      "touchstart",
      this.handleTouchStart.bind(this),
      { passive: false }
    );
    this.canvas.addEventListener("touchmove", this.handleTouchMove.bind(this), {
      passive: false,
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

    this.dragTarget = this.getTagAt(this.mousePos.x, this.mousePos.y);
    this.isDragging = !!this.dragTarget;

    if (this.dragTarget) {
      this.canvas.style.cursor = "grabbing";
      this.startAnimation();
    }
  }

  handleMouseMove(e) {
    const rect = this.canvas.getBoundingClientRect();
    const scaleX = this.canvas.width / window.devicePixelRatio / rect.width;
    const scaleY = this.canvas.height / window.devicePixelRatio / rect.height;

    this.mousePos.x = (e.clientX - rect.left) * scaleX;
    this.mousePos.y = (e.clientY - rect.top) * scaleY;

    // Проверяем hover
    const prevHovered = this.hoveredTag;
    this.hoveredTag = this.getTagAt(this.mousePos.x, this.mousePos.y);

    if (prevHovered !== this.hoveredTag) {
      this.render();
    }

    if (this.isDragging && this.dragTarget) {
      this.dragTarget.x = this.mousePos.x;
      this.dragTarget.y = this.mousePos.y;
      this.dragTarget.direction = "auto"; // При перетаскивании меняем на auto

      if (this.config.onTagDrag) {
        this.config.onTagDrag(
          this.dragTarget,
          this.mousePos.x,
          this.mousePos.y
        );
      }
    } else {
      this.canvas.style.cursor = this.hoveredTag ? "grab" : "default";
    }
  }

  handleMouseUp() {
    this.isDragging = false;
    this.dragTarget = null;
    this.canvas.style.cursor = this.hoveredTag ? "grab" : "default";
    this.stopAnimation();
  }

  handleMouseLeave() {
    this.hoveredTag = null;
    this.render();
  }

  handleClick(e) {
    if (this.isDragging) {
      // Если было перетаскивание, не срабатывает клик
      this.isDragging = false;
      return;
    }

    const rect = this.canvas.getBoundingClientRect();
    const scaleX = this.canvas.width / window.devicePixelRatio / rect.width;
    const scaleY = this.canvas.height / window.devicePixelRatio / rect.height;

    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    const tag = this.getTagAt(x, y);
    if (tag && this.config.onTagClick) {
      this.config.onTagClick(tag);
    }
  }

  handleDoubleClick(e) {
    const rect = this.canvas.getBoundingClientRect();
    const scaleX = this.canvas.width / window.devicePixelRatio / rect.width;
    const scaleY = this.canvas.height / window.devicePixelRatio / rect.height;

    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    const tag = this.getTagAt(x, y);
    if (tag) {
      // Смена направления тега при двойном клике
      if (tag.direction === "h") {
        tag.direction = "v";
      } else if (tag.direction === "v") {
        tag.direction = "auto";
      } else {
        tag.direction = "h";
      }

      this.calculateLayout();
      this.render();

      if (this.config.onTagDirectionChange) {
        this.config.onTagDirectionChange(tag);
      }
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
      // Смена ориентации текста при правом клике
      tag.textOrientation =
        tag.textOrientation === "horizontal" ? "vertical" : "horizontal";
      this.render();

      if (this.config.onTagTextOrientationChange) {
        this.config.onTagTextOrientationChange(tag);
      }
    }
  }

  // Обработчики для touch событий
  handleTouchStart(e) {
    e.preventDefault();
    const touch = e.touches[0];
    const rect = this.canvas.getBoundingClientRect();
    const scaleX = this.canvas.width / window.devicePixelRatio / rect.width;
    const scaleY = this.canvas.height / window.devicePixelRatio / rect.height;

    this.mousePos.x = (touch.clientX - rect.left) * scaleX;
    this.mousePos.y = (touch.clientY - rect.top) * scaleY;

    this.dragTarget = this.getTagAt(this.mousePos.x, this.mousePos.y);
    this.isDragging = !!this.dragTarget;

    if (this.dragTarget) {
      this.startAnimation();
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
      this.dragTarget.x = this.mousePos.x;
      this.dragTarget.y = this.mousePos.y;
      this.dragTarget.direction = "auto";

      if (this.config.onTagDrag) {
        this.config.onTagDrag(
          this.dragTarget,
          this.mousePos.x,
          this.mousePos.y
        );
      }
    }
  }

  handleTouchEnd(e) {
    if (!this.isDragging && e.changedTouches.length === 1) {
      // Одинарное касание - обрабатываем как клик
      const touch = e.changedTouches[0];
      const rect = this.canvas.getBoundingClientRect();
      const scaleX = this.canvas.width / window.devicePixelRatio / rect.width;
      const scaleY = this.canvas.height / window.devicePixelRatio / rect.height;

      const x = (touch.clientX - rect.left) * scaleX;
      const y = (touch.clientY - rect.top) * scaleY;

      const tag = this.getTagAt(x, y);
      if (tag && this.config.onTagClick) {
        this.config.onTagClick(tag);
      }
    } else if (e.changedTouches.length === 2) {
      // Двойное касание - меняем направление тега
      const touch = e.changedTouches[0];
      const rect = this.canvas.getBoundingClientRect();
      const scaleX = this.canvas.width / window.devicePixelRatio / rect.width;
      const scaleY = this.canvas.height / window.devicePixelRatio / rect.height;

      const x = (touch.clientX - rect.left) * scaleX;
      const y = (touch.clientY - rect.top) * scaleY;

      const tag = this.getTagAt(x, y);
      if (tag) {
        if (tag.direction === "h") {
          tag.direction = "v";
        } else if (tag.direction === "v") {
          tag.direction = "auto";
        } else {
          tag.direction = "h";
        }

        this.calculateLayout();
        this.render();

        if (this.config.onTagDirectionChange) {
          this.config.onTagDirectionChange(tag);
        }
      }
    } else if (e.changedTouches.length === 3) {
      // Тройное касание - меняем ориентацию текста
      const touch = e.changedTouches[0];
      const rect = this.canvas.getBoundingClientRect();
      const scaleX = this.canvas.width / window.devicePixelRatio / rect.width;
      const scaleY = this.canvas.height / window.devicePixelRatio / rect.height;

      const x = (touch.clientX - rect.left) * scaleX;
      const y = (touch.clientY - rect.top) * scaleY;

      const tag = this.getTagAt(x, y);
      if (tag) {
        tag.textOrientation =
          tag.textOrientation === "horizontal" ? "vertical" : "horizontal";
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

      // Рассчитываем размеры кнопки в зависимости от ориентации текста
      const padding = 10;
      let width, height;

      if (tag.textOrientation === "vertical") {
        // Для вертикального текста
        const lines = tag.name.split(" ").reduce((acc, word) => {
          if (!acc.length) return [word];
          const lastLine = acc[acc.length - 1];
          if (this.measureTextWidth(lastLine + " " + word) <= 150) {
            acc[acc.length - 1] = lastLine + " " + word;
          } else {
            acc.push(word);
          }
          return acc;
        }, []);

        width = 20 * lines.length + 60;
        height = 10 * Math.max(...lines.map((line) => line.length)) + 50;
      } else {
        // Для горизонтального текста
        width = this.measureTextWidth(tag.name) + 60;
        height = 50;
      }

      if (
        x > tag.x - width / 2 - padding &&
        x < tag.x + width / 2 + padding &&
        y > tag.y - height / 2 - padding &&
        y < tag.y + height / 2 + padding
      ) {
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

  measureTextWidth(text) {
    this.ctx.font = "12px 'Lora', sans-serif";
    return this.ctx.measureText(text).width;
  }

  getContrastColor(hexColor) {
    return "#ffffff";
    hexColor = hexColor.replace("#", "");

    if (hexColor.length === 3) {
      hexColor = hexColor
        .split("")
        .map((c) => c + c)
        .join("");
    }

    const r = parseInt(hexColor.slice(0, 2), 16);
    const g = parseInt(hexColor.slice(2, 4), 16);
    const b = parseInt(hexColor.slice(4, 6), 16);

    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 128 ? "#000000" : "#FFFFFF";
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

    return `#${r.toString(16).padStart(2, "0")}${g
      .toString(16)
      .padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
  }

  roundRect(ctx, x, y, width, height, radius) {
    if (typeof radius === "number") {
      radius = { tl: radius, tr: radius, br: radius, bl: radius };
    } else {
      radius = { ...{ tl: 0, tr: 0, br: 0, bl: 0 }, ...radius };
    }

    ctx.beginPath();
    ctx.moveTo(x + radius.tl, y);
    ctx.lineTo(x + width - radius.tr, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
    ctx.lineTo(x + width, y + height - radius.br);
    ctx.quadraticCurveTo(
      x + width,
      y + height,
      x + width - radius.br,
      y + height
    );
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

    // Очищаем canvas
    ctx.clearRect(0, 0, width, height);

    // Фон (опционально)
    if (this.config.backgroundColor) {
      ctx.fillStyle = this.config.backgroundColor;
      ctx.fillRect(0, 0, width, height);
    }

    // Сначала рисуем соединения (чтобы были под кнопками)
    this.connections.forEach((conn) => {
      this.drawConnection(conn);
    });

    // Затем рисуем теги поверх
    this.tags.forEach((tag) => {
      this.drawTag(tag);
    });
  }

  // Публичные методы для управления графом
  updateTag(id, updates) {
    const tag = this.tags.find((t) => t.id === id);
    if (tag) {
      Object.assign(tag, updates);
      this.calculateLayout();
      this.render();
    }
  }

  setTagDirection(id, direction) {
    const tag = this.tags.find((t) => t.id === id);
    if (tag) {
      tag.direction = direction;
      this.calculateLayout();
      this.render();
    }
  }

  setTagTextOrientation(id, orientation) {
    const tag = this.tags.find((t) => t.id === id);
    if (tag && (orientation === "horizontal" || orientation === "vertical")) {
      tag.textOrientation = orientation;
      this.render();
    }
  }

  addTag(tag) {
    if (!tag.direction) {
      tag.direction = this.config.layout === "vertical" ? "v" : "h";
    }
    if (!tag.textOrientation) {
      tag.textOrientation = this.config.textOrientation;
    }
    this.tags.push(tag);
    this.calculateLayout();
    this.render();
  }

  removeTag(id) {
    this.tags = this.tags.filter((t) => t.id !== id);
    this.connections = this.connections.filter(
      (c) => c.source !== id && c.target !== id
    );
    this.calculateLayout();
    this.render();
  }

  addConnection(conn) {
    this.connections.push(conn);
    this.render();
  }

  removeConnection(sourceId, targetId) {
    this.connections = this.connections.filter(
      (c) => !(c.source === sourceId && c.target === targetId)
    );
    this.render();
  }

  setLayout(layout) {
    this.config.layout = layout;
    // Обновляем направление для тегов без явного направления
    this.tags.forEach((tag) => {
      if (!tag.direction || tag.direction === "auto") {
        tag.direction = layout === "vertical" ? "v" : "h";
      }
    });
    this.calculateLayout();
    this.render();
  }

  setConfig(newConfig) {
    this.config = { ...this.config, ...newConfig };
    this.calculateLayout();
    this.render();
  }

  getTags() {
    return this.tags.map((tag) => ({ ...tag }));
  }

  getConnections() {
    return [...this.connections];
  }

  getTagStats() {
    const stats = {
      total: this.tags.length,
      byDirection: {
        h: this.tags.filter((t) => t.direction === "h").length,
        v: this.tags.filter((t) => t.direction === "v").length,
        auto: this.tags.filter((t) => !t.direction || t.direction === "auto")
          .length,
      },
      byTextOrientation: {
        horizontal: this.tags.filter((t) => t.textOrientation === "horizontal")
          .length,
        vertical: this.tags.filter((t) => t.textOrientation === "vertical")
          .length,
      },
    };
    return stats;
  }

  exportAsJSON() {
    return {
      tags: this.tags.map((tag) => ({
        id: tag.id,
        name: tag.name,
        color: tag.color,
        direction: tag.direction,
        textOrientation: tag.textOrientation,
        x: tag.x,
        y: tag.y,
      })),
      connections: this.connections.map((conn) => ({
        source: conn.source,
        target: conn.target,
        strength: conn.strength,
      })),
      config: {
        layout: this.config.layout,
        spacing: this.config.spacing,
        padding: this.config.padding,
        curveIntensity: this.config.curveIntensity,
        lineWidth: this.config.lineWidth,
        textOrientation: this.config.textOrientation,
      },
    };
  }

  importFromJSON(json) {
    this.tags = json.tags || [];
    this.connections = json.connections || [];
    this.config = { ...this.config, ...json.config };
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

// Экспорт для использования в браузере
if (typeof window !== "undefined") {
  window.TagGraph = TagGraph;
}
