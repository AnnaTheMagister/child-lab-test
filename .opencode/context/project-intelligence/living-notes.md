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
- **Folder-per-component pattern**: Each component/hook/context in its own folder with co-located test and `index.ts` barrel. See `entities/Courses/`, `shared/hooks/useCurrentSearch/`, `widgets/CoursesList/` for reference.
- **Reading mode system**: Session-based persistence with clean URL switching. Simple, effective, no login required.
- **ACF `show_in_rest` on individual fields**: Granular control over REST API exposure without custom endpoints.

### What Could Be Better
- **ACF field organization**: Currently split between `register-*.php` and `field-groups/`. Standardize to single pattern.
- **No PHP autoloading**: All `inc/` files manually required in `functions.php`. PSR-4 autoloading would simplify.
- **Testing gap (PHP)**: No PHPUnit setup — PHP/WordPress changes require manual verification.
- **Testing done (JS)**: Jest + RTL set up — see `tests/entities/Courses.test.tsx`, `tests/widgets/CoursesList.test.tsx`, `tests/widgets/ErrorBoundary.test.tsx` as patterns.

### Lessons Learned
- ACF field registration timing matters: `acf/include_fields` vs direct `acf_add_local_field_group()` at plugin load. Both needed for reliability in different contexts.
- Taxonomy CPT relationships must be specified as arrays (`register_taxonomy('tag', ['article'], ...)`) not strings for clarity and extensibility.
- `show_in_rest` on ACF fields does NOT automatically expose them for taxonomy terms — need `register_rest_field()` for term meta.

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
