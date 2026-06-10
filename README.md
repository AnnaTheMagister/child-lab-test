# ChildLab WordPress Theme

WordPress-тема для детского образовательного центра ChildLab. Мультисайт (RU/EN), React-виджеты, ACF Pro.

## Быстрый старт

```bash
npm install
npm run build    # сборка JS/CSS
npm start        # dev-режим с hot reload (wp-scripts start)
npm test         # запуск тестов
```

## Структура

| Директория | Назначение |
|------------|------------|
| `inc/` | PHP-хелперы, ACF-регистрация, шаблонные теги |
| `src/scripts/` | React-компоненты, виджеты, ui-kit |
| `src/scripts/ui-kit/` | UI-кит: `Button`, `ButtonGroup`, `Icon` |
| `src/scripts/shared/libs/` | Переиспользуемые библиотеки: `colors` (HEX/RGB/HSL конвертация) |
| `src/styles/` | SCSS-стили (включая `ui-kit.scss`) |
| `template-parts/` | PHP-шаблоны |
| `tests/` | Глобальные моки (тесты — рядом с компонентами) |
| `.github/workflows/` | CI/CD (тесты + FTP-деплой) |
| `language/` | `.pot`/`.po`/`.mo` файлы перевода |

## UI-Kit

Папка `src/scripts/ui-kit/` — переиспользуемые React-компоненты.

| Компонент | API | Описание |
|-----------|-----|----------|
| `Button` | `isActive`, `active`, `inactive`, `colors`, `icon`, `onClick`, `size`, `disabled`, `className`, `borderRadius` | Кнопка с поддержкой цветовых схем, градиентов/цветов для active/inactive состояний, иконки, размеров, скругления |
| `ButtonGroup` | `children`, `className` | Flex-контейнер для группы кнопок (стиль authors-menu) |
| `Icon` | `name`, `size`, `className` | SVG-иконки: `arrow-right`, `arrow-left`, `adapt`, `chevron` |

### Button defaults

- **Active** (по умолчанию): цветовая схема `grape` — `linear-gradient(90deg, #5823EB → #6D00D2)`, текст `#ffffff`
- **Inactive**: цветовая схема `grape` — `linear-gradient(90deg, #ECEFFF → #F2E8FF)`, текст `#5230D0`
- **Hover (grape)**: фон `#7955F9`, для остальных схем — `filter: brightness(0.92)`
- **Pressed (grape)**: фон `#3D1FAA`, для остальных схем — `filter: brightness(0.85)`
- **Border-radius**: 8px (desktop/tablet), 6px (phone)

### Button API

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `isActive` | `boolean` | `true` | Состояние кнопки |
| `active` | `ButtonStateColors` | — | Цвета активного состояния: `{ background?, color?, borderColor? }` |
| `inactive` | `ButtonStateColors` | — | Цвета неактивного состояния: `{ background?, color?, borderColor? }` |
| `colors` | `'grape' \| 'raspberry' \| 'strawberry' \| 'custom'` | `'grape'` | Цветовая схема. При `custom` используются `active`/`inactive` группы |
| `borderRadius` | `BorderRadiusValue \| { desktop?, tablet?, phone? }` | `{ desktop: '8px', tablet: '8px', phone: '6px' }` | Скругление. Строка — единое значение для всех брейкпоинтов |
| `icon` | `ReactNode` | — | Иконка внутри кнопки |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Размер (padding/fontSize) |
| `href` | `string` | — | Если передан, рендерит `<a>` вместо `<button>` |
| `target` / `rel` | `string` | — | Для anchor mode |
| `onClick` | `() => void` | — | Обработчик клика |
| `disabled` | `boolean` | `false` | Блокировка кнопки |
| `className` | `string` | `''` | Доп. CSS-класс |

### Цветовые схемы

| Схема | Active | Inactive |
|-------|--------|----------|
| **grape** | `linear-gradient(90deg, #5823EB → #6D00D2)` / `#fff` | `linear-gradient(90deg, #ECEFFF → #F2E8FF)` / `#5230D0` |
| **raspberry** | `linear-gradient(90deg, rgb(215, 69, 255) → rgb(245, 47, 162))` / `#fff` | `linear-gradient(90deg, rgb(247, 217, 255) → rgb(255, 200, 232))` / `#BC00AD` |
| **strawberry** | `linear-gradient(90deg, #F74098 → #F64B30)` / `#fff` | `linear-gradient(90deg, #FFD4E9 → #FFCFC8)` / `#BC00AD` |
| **custom** | Из `active` prop | Из `inactive` prop |

### Использование

```tsx
import { ButtonGroup, Button } from '../../ui-kit';

// С цветовой схемой raspberry (заменяет старый inline-градиент)
<ButtonGroup>
  <Button isActive={selected === 'a'} colors="raspberry" onClick={() => setFilter('a')}>Option A</Button>
  <Button isActive={selected === 'b'} colors="raspberry" onClick={() => setFilter('b')}>Option B</Button>
</ButtonGroup>

// Кастомные цвета
<Button colors="custom" active={{ background: '#ff0000', color: '#fff' }}>
  Custom
</Button>

// С кастомным скруглением
<Button borderRadius="16px">Smooth</Button>
<Button borderRadius={{ desktop: '12px', tablet: '10px', phone: '8px' }}>Responsive</Button>
```

### Использование

```tsx
import { ButtonGroup, Button } from '../../ui-kit';

<ButtonGroup>
  <Button active={selected === 'a'} onClick={() => setFilter('a')}>Option A</Button>
  <Button active={selected === 'b'} onClick={() => setFilter('b')}>Option B</Button>
</ButtonGroup>
```

## Тестирование

Фреймворк: Jest + React Testing Library.

```bash
npm test              # однократный прогон
npm run test:watch    # watch-режим
npm run test:coverage # с отчётом покрытия
```

Тесты лежат рядом с компонентами: `Component/Component.test.tsx`.

**CI**: GitHub Actions прогоняет тесты на каждый push и PR. Если тесты падают — деплой блокируется (см. `.github/workflows/`).

## CI/CD Pipeline

| Событие | Что происходит |
|---------|----------------|
| Push в любую ветку | `ci.yml` → install → build → test |
| PR в `main` | `ci.yml` → install → build → test |
| Push в `main` | `deploy.yml` → test → FTP-деплой на боевой сервер |
| Push в `dev` | `deploy.yml` → test → FTP-деплой на dev-сервер |

PHPUnit не настроен — PHP-шаблоны проверяются вручную.

## Требования

- Node.js 20+
- WordPress 6.x
- ACF Pro 6.x
