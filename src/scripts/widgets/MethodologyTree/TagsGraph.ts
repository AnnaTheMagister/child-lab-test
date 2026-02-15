// tag-graph.js
export class TagsGraph {
    constructor(config) {
        this.config = {
            padding: 20,
            scale: 1,
            interactive: true,
            enableDragging: false,
            enableContextMenu: false,
            ...config,
        };

        this.tagConfig = {
            fontSize: 14,
            borderRadius: 16,
            ...config.tagConfig,
        };

        this.connectionConfig = {
            lineWidth: 3,
            ...config.connectionConfig,
        };

        this.tags = [...config.tags];
        this.connections = this.processConnections(config.connections || []);
        this.isDragging = false;
        this.dragTarget = null;
        this.animationFrameId = null;
        this.mousePos = { x: 0, y: 0 };
        this.hoveredTag = null;
        this.activeTag =
            this.tags.find(({ id }) => id === this.config.activeTagSlug) || null;

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
                    lineWidth:
                        (conn.lineWidth || this.connectionConfig.lineWidth) *
                        this.config.scale,
                    connectFrom: conn.connectFrom || "auto",
                    connectTo: conn.connectTo || "auto",
                    shiftFrom: conn.shiftFrom || 0, // новое поле
                    shiftTo: conn.shiftTo || 0, // новое поле
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
        this.tags.forEach((tag) => {
            if (tag.xPercent !== undefined && tag.yPercent !== undefined) {
                tag.x = (width * tag.xPercent) / 100;
                tag.y = (height * tag.yPercent) / 100;
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
        const { x = 0, y = 0 } = tag;
        const fontSize =
            (tag.fontSize || this.tagConfig.fontSize) * this.config.scale;
        const lineHeight = fontSize * 1.2;
        const charWidth = fontSize * 0.6;

        const lines = this.getTextLines(
            tag.name,
            tag.textOrientation,
            tag.fontSize,
        );

        let width, height;

        if (tag.textOrientation === "vertical") {
            const paddingVertical = 16 * this.config.scale;
            const paddingHorizontal = 6 * this.config.scale;
            const maxLineLength = Math.max(...lines.map((line) => line.length));
            width = lineHeight * lines.length + paddingHorizontal * 2;
            height = charWidth * maxLineLength + paddingVertical * 2;
        } else {
            const paddingVertical = 6 * this.config.scale;
            const paddingHorizontal = 16 * this.config.scale;
            width =
                Math.max(
                    ...lines.map((line) => this.measureTextWidth(line, fontSize)),
                ) +
                paddingHorizontal * 2;
            height = lineHeight * lines.length + paddingVertical * 2;
        }

        return {
            x: x - width / 2,
            y: y - height / 2,
            width,
            height,
            centerX: x,
            centerY: y,
        };
    }

    getConnectionPoint(tag, side, shift = 0) {
        const rect = this.getTagButtonRect(tag);
        const borderRadius =
            (tag.borderRadius !== undefined
                ? tag.borderRadius
                : this.tagConfig.borderRadius) * this.config.scale;

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
                    y: rect.y,
                };

            case "bottom":
                // Центр нижней стороны с учетом смещения
                const bottomStartX = rect.x + borderRadius;
                const bottomEndX = rect.x + rect.width - borderRadius;
                const bottomCenterX = (bottomStartX + bottomEndX) / 2;
                const bottomShiftRange = (bottomEndX - bottomStartX) / 2;

                return {
                    x: bottomCenterX + shift * bottomShiftRange,
                    y: rect.y + rect.height,
                };

            case "left":
                // Центр левой стороны с учетом смещения
                const leftStartY = rect.y + borderRadius;
                const leftEndY = rect.y + rect.height - borderRadius;
                const leftCenterY = (leftStartY + leftEndY) / 2;
                const leftShiftRange = (leftEndY - leftStartY) / 2;

                return {
                    x: rect.x,
                    y: leftCenterY + shift * leftShiftRange,
                };

            case "right":
                // Центр правой стороны с учетом смещения
                const rightStartY = rect.y + borderRadius;
                const rightEndY = rect.y + rect.height - borderRadius;
                const rightCenterY = (rightStartY + rightEndY) / 2;
                const rightShiftRange = (rightEndY - rightStartY) / 2;

                return {
                    x: rect.x + rect.width,
                    y: rightCenterY + shift * rightShiftRange,
                };

            case "auto":
            default:
                // Для центра возвращаем центр
                return { x: rect.centerX, y: rect.centerY };
        }
    }

    getAutoConnectionPoint(sourceRect, targetRect) {
        // Автоматически определяем лучшие точки соединения
        const sourceCenter = { x: sourceRect.centerX, y: sourceRect.centerY };
        const targetCenter = { x: targetRect.centerX, y: targetRect.centerY };

        // Определяем относительное положение тегов
        const dx = targetCenter.x - sourceCenter.x;
        const dy = targetCenter.y - sourceCenter.y;

        // Выбираем сторону в зависимости от угла
        const angle = Math.atan2(dy, dx);
        const angleDeg = (angle * 180) / Math.PI;

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
            targetSide,
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

        return `#${lightR.toString(16).padStart(2, "0")}${lightG
            .toString(16)
            .padStart(2, "0")}${lightB.toString(16).padStart(2, "0")}`;
    }

    getTextLines(text, textOrientation = "vertical", fontSize = 13) {
        if (textOrientation === "vertical") {
            return [text];
        }
        return text.split("\n").reduce((acc, word) => {
            if (!acc.length) return [word];
            const lastLine = acc[acc.length - 1];
            if (
                this.measureTextWidth(lastLine + " " + word, fontSize) <=
                100 * this.config.scale
            ) {
                acc[acc.length - 1] = lastLine + " " + word;
            } else {
                acc.push(word);
            }
            return acc;
        }, []);
    }

    drawTag(tag) {
        const ctx = this.ctx;
        const { x = 0, y = 0, name, color, textOrientation = "horizontal" } = tag;
        const fontSize =
            (tag.fontSize || this.tagConfig.fontSize) * this.config.scale;
        const borderRadius =
            (tag.borderRadius !== undefined
                ? tag.borderRadius
                : this.tagConfig.borderRadius) * this.config.scale;

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
                const lineY =
                    -totalTextHeight / 2 + index * lineHeight + lineHeight / 2;
                ctx.fillText(line, 0, lineY);
            });

            ctx.restore();
        } else {
            const totalTextHeight = lines.length * lineHeight;
            const startY =
                rect.y + (rect.height - totalTextHeight) / 2 + lineHeight / 2;

            lines.forEach((line, index) => {
                const lineY = startY + index * lineHeight;
                ctx.fillText(line, x, lineY);
            });
        }

        ctx.restore();
    }

    drawConnection(conn) {
        const source = this.tags.find((t) => t.id === conn.source);
        const target = this.tags.find((t) => t.id === conn.target);

        if (!source || !target) {
            return;
        }

        const ctx = this.ctx;
        const curveIntensity = conn.curveIntensity || 0;
        const lineWidth =
            (conn.lineWidth || this.connectionConfig.lineWidth) * this.config.scale;
        const shiftFrom = conn.shiftFrom || 0; // смещение начала (от -1 до 1)
        const shiftTo = conn.shiftTo || 0; // смещение конца (от -1 до 1)

        const sourceRect = this.getTagButtonRect(source);
        const targetRect = this.getTagButtonRect(target);

        let sourceSide, targetSide;

        if (conn.connectFrom === "auto" || conn.connectTo === "auto") {
            const autoSides = this.getAutoConnectionPoint(sourceRect, targetRect);
            sourceSide =
                conn.connectFrom === "auto" ? autoSides.sourceSide : conn.connectFrom;
            targetSide =
                conn.connectTo === "auto" ? autoSides.targetSide : conn.connectTo;
        } else {
            sourceSide = conn.connectFrom;
            targetSide = conn.connectTo;
        }

        // Получаем точки соединения с учетом смещения
        const sourcePoint = this.getConnectionPoint(source, sourceSide, shiftFrom);
        const targetPoint = this.getConnectionPoint(target, targetSide, shiftTo);

        ctx.save();

        const gradient = ctx.createLinearGradient(
            sourcePoint.x,
            sourcePoint.y,
            targetPoint.x,
            targetPoint.y,
        );
        gradient.addColorStop(0, source.color);
        gradient.addColorStop(
            0.5,
            this.blendColors(source.color, target.color, 0.5),
        );
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
        this.canvas.addEventListener(
            "mouseleave",
            this.handleMouseLeave.bind(this),
        );
        if (this.config.enableContextMenu) {
            this.canvas.addEventListener(
                "contextmenu",
                this.handleContextMenu.bind(this),
            );
        }

        this.canvas.addEventListener(
            "touchstart",
            this.handleTouchStart.bind(this),
            { passive: false },
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
            this.dragTarget.xPercent = (this.dragTarget.x / width) * 100;
            this.dragTarget.yPercent = (this.dragTarget.y / height) * 100;

            if (this.config.onTagDrag) {
                this.config.onTagDrag(
                    this.dragTarget,
                    this.dragTarget.xPercent,
                    this.dragTarget.yPercent,
                );
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
            tag.textOrientation =
                tag.textOrientation === "horizontal" ? "vertical" : "horizontal";
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
            this.dragTarget.xPercent = (this.dragTarget.x / width) * 100;
            this.dragTarget.yPercent = (this.dragTarget.y / height) * 100;

            if (this.config.onTagDrag) {
                this.config.onTagDrag(
                    this.dragTarget,
                    this.dragTarget.xPercent,
                    this.dragTarget.yPercent,
                );
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

            const rect = this.getTagButtonRect(tag);
            const padding = 10;

            if (
                x > rect.x - padding &&
                x < rect.x + rect.width + padding &&
                y > rect.y - padding &&
                y < rect.y + rect.height + padding
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
            y + height,
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

        ctx.clearRect(0, 0, width, height);

        if (this.config.backgroundColor) {
            ctx.fillStyle = "rgba(255,255,255,0)";
            ctx.fillRect(0, 0, width, height);
        }

        this.connections.forEach((conn) => {
            this.drawConnection(conn);
        });

        this.tags.forEach((tag) => {
            this.drawTag(tag);
        });
    }

    updateTag(id, updates) {
        const tag = this.tags.find((t) => t.id === id);
        if (tag) {
            Object.assign(tag, updates);

            const width = this.canvas.width / window.devicePixelRatio;
            const height = this.canvas.height / window.devicePixelRatio;

            if (updates.x !== undefined) {
                tag.xPercent = (updates.x / width) * 100;
            }
            if (updates.y !== undefined) {
                tag.yPercent = (updates.y / height) * 100;
            }
            if (updates.xPercent !== undefined) {
                tag.x = (width * updates.xPercent) / 100;
            }
            if (updates.yPercent !== undefined) {
                tag.y = (height * updates.yPercent) / 100;
            }

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

    setActiveTag(id) {
        const tag = this.tags.find((t) => t.id === id);
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
            tag.x = (width * tag.xPercent) / 100;
            tag.y = (height * tag.yPercent) / 100;
        }

        this.tags.push(tag);
        this.calculateLayout();
        this.render();
    }

    removeTag(id) {
        this.tags = this.tags.filter((t) => t.id !== id);
        this.connections = this.connections.filter(
            (c) => c.source !== id && c.target !== id,
        );
        if (this.activeTag && this.activeTag.id === id) {
            this.activeTag = null;
        }
        this.calculateLayout();
        this.render();
    }

    addConnection(conn) {
        const existingConnections = this.connections.filter(
            (c) =>
                (c.source === conn.source && c.target === conn.target) ||
                (c.source === conn.target && c.target === conn.source),
        );

        if (existingConnections.length === 0) {
            this.connections.push({
                source: conn.source,
                target: conn.target,
                curveIntensity: conn.curveIntensity || 0,
                lineWidth: conn.lineWidth || this.connectionConfig.lineWidth,
                connectFrom: conn.connectFrom || "auto",
                connectTo: conn.connectTo || "auto",
                shiftFrom: conn.shiftFrom || 0,
                shiftTo: conn.shiftTo || 0,
            });
            this.render();
        }
    }

    removeConnection(sourceId, targetId) {
        this.connections = this.connections.filter(
            (c) =>
                !(
                    (c.source === sourceId && c.target === targetId) ||
                    (c.source === targetId && c.target === sourceId)
                ),
        );
        this.render();
    }

    setLayout(layout) {
        this.config.layout = layout;
        this.calculateLayout();
        this.render();
    }

    setConfig(newConfig) {
        this.config = { ...this.config, ...newConfig };
        this.calculateLayout();
        this.render();
    }

    setTagConfig(newTagConfig) {
        this.tagConfig = { ...this.tagConfig, ...newTagConfig };
        this.render();
    }

    setConnectionConfig(newConnectionConfig) {
        this.connectionConfig = {
            ...this.connectionConfig,
            ...newConnectionConfig,
        };
        this.render();
    }

    getTags() {
        return this.tags.map((tag) => ({ ...tag }));
    }

    getConnections() {
        return [...this.connections];
    }

    exportAsJSON() {
        return {
            tags: this.tags.map((tag) => ({
                id: tag.id,
                name: tag.name,
                color: tag.color,
                textOrientation: tag.textOrientation,
                fontSize: tag.fontSize,
                borderRadius: tag.borderRadius,
                xPercent: tag.xPercent,
                yPercent: tag.yPercent,
            })),
            connections: this.connections.map((conn) => ({
                source: conn.source,
                target: conn.target,
                curveIntensity: conn.curveIntensity,
                lineWidth: conn.lineWidth,
                connectFrom: conn.connectFrom,
                connectTo: conn.connectTo,
                shiftFrom: conn.shiftFrom,
                shiftTo: conn.shiftTo,
            })),
            config: {
                layout: this.config.layout,
                padding: this.config.padding,
            },
            tagConfig: {
                fontSize: this.tagConfig.fontSize,
                borderRadius: this.tagConfig.borderRadius,
            },
            connectionConfig: {
                lineWidth: this.connectionConfig.lineWidth,
            },
        };
    }

    importFromJSON(json) {
        this.tags = json.tags || [];
        this.connections = this.processConnections(json.connections || []);
        this.config = { ...this.config, ...json.config };
        this.tagConfig = { ...this.tagConfig, ...json.tagConfig };
        this.connectionConfig = {
            ...this.connectionConfig,
            ...json.connectionConfig,
        };

        const width = this.canvas.width / window.devicePixelRatio;
        const height = this.canvas.height / window.devicePixelRatio;

        this.tags.forEach((tag) => {
            if (tag.xPercent !== undefined && tag.yPercent !== undefined) {
                tag.x = (width * tag.xPercent) / 100;
                tag.y = (height * tag.yPercent) / 100;
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
