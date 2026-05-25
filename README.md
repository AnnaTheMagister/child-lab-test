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
| `src/scripts/` | React-компоненты и виджеты |
| `src/styles/` | SCSS-стили |
| `template-parts/` | PHP-шаблоны |
| `tests/` | Jest-тесты (зеркалируют `src/scripts/`) |
| `.github/workflows/` | CI/CD (тесты + FTP-деплой) |
| `language/` | `.pot`/`.po`/`.mo` файлы перевода |

## Тестирование

Фреймворк: Jest + React Testing Library.

```bash
npm test              # однократный прогон
npm run test:watch    # watch-режим
npm run test:coverage # с отчётом покрытия
```

Тесты лежат в `tests/`, зеркалируя путь исходника: `src/scripts/widgets/Foo.tsx` → `tests/widgets/Foo.test.tsx`.

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
