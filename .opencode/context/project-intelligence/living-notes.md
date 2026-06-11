<!-- Context: project-intelligence/notes | Priority: high | Version: 1.0 | Updated: 2026-05-26 -->

# Living Notes

> Active issues, technical debt, open questions, and insights for the ChildLab WordPress theme.

## Quick Reference

- **Purpose**: Capture current state, problems, and open questions
- **Update**: Weekly or when status changes
- **Archive**: Move resolved items to bottom with status

## Active Projects

| Project | Goal | Owner | Timeline |
|---------|------|-------|----------|
| Course System (CHI-93) | Course CPT, taxonomies, fields, templates | AnnaTheMagister | Recently merged — further refinement ongoing |
| Methodology Tags Refinement | Tag display scaling, positioning fixes, translations | AnnaTheMagister | Ongoing iterations |
| OAC Integration | AI agent system for theme development | AnnaTheMagister | Initial installation complete |

## Technical Debt

| Item | Impact | Priority | Mitigation |
|------|--------|----------|------------|
| Dual ACF registration pattern | Code duplication; risk of drift between `field-groups/*.php` and combined files | Medium | Decide on single pattern once refactoring stabilizes |
| Large combined ACF/CPT file | `register-article-fields.php` is 627 lines mixing CPT, taxonomy, and field registrations | Medium | Continue migration to `field-groups/` directory |
| No PHP tests | PHPUnit not configured | Low | Add PHPUnit when PHP feature set stabilizes |
| Hardcoded REST URLs | `BASE_URL` in `consts.ts` points to `localhost/childlab.local` | Low | Environment-aware configuration |
| Legacy folder structure | 5 компонентов не соответствуют новому стандарту (папка + test + index.ts) | Medium | Привести к единому шаблону |
| Legacy button/tag styles | CSS-классы `.article-button`, `.project-link`, `.not-found-page-link`, `.course-access-button`, `.article-tags__tag` не используют ui-kit; `ArticlesList.tsx` рендерит raw `<div>` вместо Tag | Low | Переписать на `ui-kit/Button` / `ui-kit/Tag`
| Custom webpack config | `webpack.config.js` переопределяет entry, чтобы сохранить `index.js` при наличии блоков | Low | Встроить в стандартный конфиг @wordpress/scripts при обновлении
| ButtonGroup с inactive-состоянием | У ButtonGroup нет пропсов для inactive-состояния кнопок внутри группы; пригодится для групп, где одна кнопка должна выделяться | Low | Добавить компонент ButtonGroup с поддержкой `inactive` конфигурации или пропсами для подсветки активной кнопки |
| Дизайн-токены (Design Tokens) | Проект использует CSS-переменные в `variables.css`, но нет единой системы токенов. Цвета, шрифты, отступы встречаются в inline-стилях и CSS разрозненно | Medium | Постепенно выносить повторяющиеся значения в CSS-переменные и документировать в design-system.md |
| ~~Course banner ACF → REST~~ | ~~Single course page использует `CourseContext`…~~ | ~~Low~~ | ✅ RESOLVED: `show_in_rest => 1` добавлен ко всем ACF-полям курса в `register-course-fields.php`. React читает данные через `data.acf.*` (REST), включая `course_access_link`, `course_type`, `course_audience` и поля палитры. |

### Technical Debt Details

**Dual ACF Registration Pattern**
*Priority*: Medium
*Impact*: ACF field changes must be made in two places (field-groups/ + combined files)
*Root Cause*: Refactoring in progress; legacy pattern preserved for compatibility
*Proposed Solution*: Once all field groups are migrated, deprecate the combined files and use only `field-groups/` + `helpers.php`
*Effort*: Medium
*Status*: In Progress

**register-article-fields.php Size**
*Priority*: Medium
*Impact*: Hard to find specific registrations; merge conflicts risk
*Root Cause*: Organic growth; CPT + taxonomy + fields all in one file
*Proposed Solution*: Split into separate files per post type (already started with course separation)
*Effort*: Medium
*Status*: In Progress

**Legacy Folder Structure**
*Priority*: Medium
*Impact*: Inconsistent structure; harder to find tests; risk of importing from the wrong path
*Root Cause*: Gradual adoption of the folder-per-component pattern; not all files migrated yet
*Proposed Solution*: Refactor the remaining components to the standard pattern (папка + test + index.ts):

| Файл | Что нужно сделать |
|------|-------------------|
| `src/scripts/entities/Articles.tsx` | Создать `Articles/` папку, перенести файл, добавить `index.ts` |
| `src/scripts/entities/MethodologyTags.tsx` | Создать `MethodologyTags/` папку, перенести файл, добавить `index.ts` |
| `src/scripts/widgets/ArticlesList/ArticlesList.tsx` | Добавить `index.ts`, добавить тест |
| `src/scripts/widgets/FrontListComponent/` | Добавить `index.ts`, добавить тесты |
| `src/scripts/widgets/MethodologyTree/` | Добавить `index.ts`, добавить тесты |
| `src/scripts/widgets/Loader/` | Добавить `index.ts`, добавить тест |

*Effort*: Low per file, Medium overall
*Status*: Todo

## Design System & Tokens

> **Принципиально важно**: у проекта есть макеты в Figma. Требования к цветам, размерам шрифтов и разметке очень жёсткие. Строим дизайн-систему с дизайн-токенами.

**Правила работы**:
1. При встрече повторяющихся значений (цвета, размеры, отступы, border-radius) — выносить в CSS-переменные в `variables.css`
2. Не использовать inline-значения, если для них уже есть CSS-переменная
3. Новые цвета/размеры сначала добавлять в `variables.css`, потом использовать через `var(--token-name)`
4. Все градиенты и цвета с прозрачностью должны быть явно задокументированы
5. См. `design-system.md` в `.opencode/context/ui/` для полного справочника

## Open Questions

| Question | Stakeholders | Status | Next Action |
|----------|--------------|--------|-------------|
| Should methodology tag ACF fields (color, pattern) become a wp_options page for easier management? | Development | Open | Evaluate admin UX vs developer UX trade-off |
| Should courses have React-based frontend widgets like articles do? | Development, Content | Open | Dependent on course feature completion |
| Build agent configuration for WordPress | Development | Open | Define build/validation commands for AI agents |

## Known Issues

| Issue | Severity | Workaround | Status |
|-------|----------|------------|--------|
| — | — | — | — |

## Insights & Lessons Learned

### What Works Well
- **Context Provider + REST fetch pattern** (`Articles.tsx`, `MethodologyTags.tsx`): Fetch all data on mount, filter client-side. Simple, fast UX, minimal backend load.
- **Folder-per-component pattern**: Each component/hook/context in its own folder with co-located test and `index.ts` barrel. See `entities/Courses/`, `shared/hooks/useCurrentSearch/`, `widgets/CoursesList/CourseCard/`, `ui-kit/Button/` for reference.
- **UI-kit**: `Button`, `ButtonGroup`, `Icon`, `Tag` в `src/scripts/ui-kit/` — единый источник правды для кнопок, иконок и меток.
- **Gutenberg block registration**: `src/blocks/` — блоки автоматически собираются, регистрируются через `inc/blocks/register-blocks.php`. `webpack.config.js` добавляет `src/index.js` обратно.
- **Reading mode system**: Session-based persistence with clean URL switching. Simple, effective, no login required.
- **ACF `show_in_rest` on individual fields**: Granular control over REST API exposure without custom endpoints.

### What Could Be Better
- **ACF field organization**: Currently split between `register-*.php` and `field-groups/`. Standardize to single pattern.
- **No PHP autoloading**: All `inc/` files manually required in `functions.php`. PSR-4 autoloading would simplify.
- **Testing gap (PHP)**: No PHPUnit setup — PHP/WordPress changes require manual verification.
- **Testing done (JS)**: Jest + RTL set up. Тесты co-located: `entities/Courses/CoursesContext.test.tsx`, `widgets/CoursesList/CoursesList.test.tsx`, `widgets/CoursesList/CourseCard/CourseCard.test.tsx`, `widgets/ErrorBoundary/ErrorBoundary.test.tsx`, `ui-kit/Button/Button.test.tsx`, `ui-kit/ButtonGroup/ButtonGroup.test.tsx`, `ui-kit/Tag/Tag.test.tsx`.

### Lessons Learned
- ACF field registration timing matters: `acf/include_fields` vs direct `acf_add_local_field_group()` at plugin load. Both needed for reliability in different contexts.
- Taxonomy CPT relationships must be specified as arrays (`register_taxonomy('tag', ['article'], ...)`) not strings for clarity and extensibility.
- `show_in_rest` on ACF fields does NOT automatically expose them for taxonomy terms — need `register_rest_field()` for term meta.
- **ACF checkbox/select хранят строковые значения, не term_id**: Когда ACF поле типа `checkbox` или `select` (не `taxonomy`) привязано к таксономии через `taxonomy` параметр, `return_format: 'value'` сохраняет выбранные значения (choice keys) в `acf.*` REST-ответа. React должен читать `course.acf.course_audience` (array of strings), а не `course.course_audience` (top-level, пустой массив от WP REST). Фильтрация по slug, а не по term ID. Это критично для мультиязычности: ACF хранит language-agnostic slugs, а display name приходит из taxonomy term REST-запроса.
- **General rule: every ACF field consumed by React MUST have `show_in_rest => 1`**: ACF fields without `show_in_rest => 1` may not appear in the REST API response's `acf` object, especially when the field has no saved value (empty). The `register_rest_field('courses', 'acf', ...)` fallback in `helpers.php` helps but is not a substitute — `get_fields()` may omit empty/null fields. Always set `'show_in_rest' => 1` on the field definition itself. This applies to all post types (`courses`, `article`, `projects`, taxonomy terms) and all field types (text, URL, color_picker, checkbox, select, etc.). To validate: check `curl /wp-json/wp/v2/{post_type}/{id}` — if the field is missing from `acf`, add `show_in_rest => 1`.
- **Resolving `course_type` slug → display name**: Since ACF `select` fields store choice keys (slugs like `"online"`), not taxonomy term IDs, the display name must be resolved client-side. Fetch the taxonomy terms from `/wp-json/wp/v2/{taxonomy}` (e.g., `course-type`) and map slug → name via `getTermNameBySlug()` from `shared/libs/terms/`. The same pattern applies to any ACF field that references a taxonomy but stores the slug value, not the term ID.
- **Gutenberg-блоки и @wordpress/scripts**: Когда в `src/` появляются `block.json`, `@wordpress/scripts` переключается на сборку только блоков (entry points из `block.json`). Главный `src/index.js` перестаёт собираться. Решение: `webpack.config.js` вручную добавляет `index: './src/index.js'` в entry.

## Patterns & Conventions

### Code Patterns Worth Preserving

- **Context Provider pattern**: Create a React Context + Provider + custom hook (see `useArticles`, `useMethodologyTags`). Simple global state without external libraries.
- **Widget folder structure**: Each widget in `src/scripts/widgets/WidgetName/` with its own component file, sub-components, and logic files. Exported via `widgets/index.ts`.
- **PHP require_once chain**: Clear dependency order in `functions.php`. Each `inc/` file adds specific functionality via hooks.
- **ACF field registration array structure**: Consistent associative array format for `acf_add_local_field_group()`. Easy to copy and modify.
- **Template part organization**: `template-parts/{post-type}/{component}.php` mirrors WordPress conventions but with project-specific grouping.

### Gotchas for Maintainers

- **ACF field key uniqueness**: Field keys (`field_695ab01b6404c`) must be globally unique across ALL field groups. Use field key generators or namespace them.
- **session_start() in reading-mode-support.php**: If another plugin calls session_start() first, this will not conflict, but if headers already sent, switching mode may fail.
- **REST API field exposure**: For taxonomy terms, `show_in_rest` on the field alone isn't enough. Must also call `register_rest_field('taxonomy_slug', 'acf', ...)` in `helpers.php`.
- **BrowserSync proxy**: `package.json` sync command assumes `boilerplate-2024.local` — update for different local dev URLs.
- **wp-scripts version**: If upgrading `@wordpress/scripts`, check for breaking changes in webpack config or dependency handling.

### PHP Conventions (from codebase)
- **Function naming**: Lowercase with underscores (`get_article_author_name`, `display_article_content`)
- **Hooks**: WordPress actions/filters consistently used
- **Template rendering**: PHP mixed with HTML; `get_template_part()` for reuse
- **Asset loading**: All via `wp_enqueue_*` in `functions.php` and module support files

### React/TypeScript Conventions (from codebase)
- **Component naming**: PascalCase components (`ArticlesListComponent`, `FrontListComponent`)
- **File naming**: PascalCase for components, camelCase for utilities
- **State management**: React Context (no Redux/Zustand)
- **Data fetching**: `useEffect` with `fetch()` directly (no React Query/SWR)
- **Types**: Defined as interfaces, exported from entity files

## Archive (Resolved Items)

### Resolved: OAC Agent Installation
- **Resolved**: 2026-05-26
- **Resolution**: Raw installation of OpenAgentsControl completed. `.opencode/` structure in place.
- **Learnings**: Generic OAC templates need project-specific customization (in progress).

## Onboarding Checklist

- [ ] Review known technical debt (dual ACF registration, file size)
- [ ] Know active projects (courses CHI-93, methodology refinement)
- [ ] Understand the Context Provider + REST fetch pattern
- [ ] Be aware of the ACF field key uniqueness requirement
- [ ] Know the REST API field exposure gotcha for taxonomy terms
- [ ] Understand the widget folder structure and export pattern
- [ ] Be aware of the BrowserSync URL configuration

## Related Files

- `decisions-log.md` — Past decisions that inform current state
- `business-domain.md` — Business context for current priorities
- `technical-domain.md` — Technical context for current state
- `business-tech-bridge.md` — Context for current trade-offs
