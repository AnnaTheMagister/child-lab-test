<!-- Context: project-intelligence/decisions | Priority: high | Version: 1.0 | Updated: 2026-05-26 -->

# Decisions Log

> Major architectural and business decisions for the ChildLab WordPress theme. Prevents "why was this done?" debates.

## Quick Reference

- **Purpose**: Document decisions so future team members understand context
- **Format**: Each decision as a separate entry
- **Status**: Decided | Pending | Under Review | Deprecated

---

## Decision: React via @wordpress/scripts Instead of Block Editor First

**Date**: Project inception
**Status**: Decided
**Owner**: AnnaTheMagister

### Context
The theme needed interactive UI components (article filtering, methodology tree visualization, tag navigation). WordPress's block editor (Gutenberg) offers React-based block development, but the primary requirement was interactive frontend widgets, not rich editor blocks.

### Decision
Use `@wordpress/scripts` (wp-scripts) as the build toolchain for React/TypeScript/SCSS. Mount React components on specific DOM containers in PHP templates. Standard WordPress template hierarchy for page rendering.

### Rationale
- wp-scripts provides a zero-config Webpack pipeline aligned with WordPress core standards
- React "islands" (mounted on specific DOM elements) require minimal PHP integration
- Full Gutenberg-first approach would require registering custom blocks for every interactive element, adding complexity without benefit for non-editor components
- wp-scripts handles JSX, TypeScript, SCSS, asset hashing, and dependency management out of the box

### Alternatives Considered
| Alternative | Pros | Cons | Why Rejected? |
|-------------|------|------|---------------|
| Gutenberg blocks for everything | Native WP integration, editor preview | Over-engineered for frontend widgets; more boilerplate | Interactive components don't need editor blocks |
| Vanilla JavaScript | No build step, simple | No JSX/TypeScript, harder to maintain complex state | React already in WordPress core; TypeScript catches bugs |
| Separate SPA (Next.js, CRA) | Full React power, modern tooling | Need headless WP setup, separate hosting, auth | Would lose WordPress native rendering and SEO simplicity |

### Impact
**Positive**: Standardized build pipeline, React and TypeScript support, automatic dependency management
**Negative**: Build step required (no PHP-only edits); must keep wp-scripts version updated
**Risk**: Breaking changes in @wordpress/scripts (managed by semver)

### Related
- Package.json: `"build": "wp-scripts build"`, `"start": "wp-scripts start"`
- `src/index.js` — entry point mounting React components
- `build/` — compiled output

---

## Decision: ACF Pro for All Custom Field Management

**Date**: Project inception
**Status**: Decided
**Owner**: AnnaTheMagister

### Context
The site requires complex content modeling: 4 reading mode fields per article, structured course data, author profiles with photos/bios, taxonomy metadata (color, SVG pattern, order). WordPress native custom fields (post_meta) lack UI and validation.

### Decision
Use Advanced Custom Fields (ACF) Pro to manage all custom field groups. Register fields via `acf_add_local_field_group()` in PHP files within `inc/acf/`. Expose fields in REST API via `show_in_rest: true` and `register_rest_field()`.

### Rationale
- ACF provides admin UI for content editors without custom development
- PHP field registration is version-controllable (unless DB-based ACF UI)
- `show_in_rest` allows React components to access ACF data directly via WP REST API
- Field types (WYSIWYG, text, image, color, repeater) cover all content modeling needs
- No custom database tables — ACF stores data in WP postmeta/termmeta

### Alternatives Considered
| Alternative | Pros | Cons | Why Rejected? |
|-------------|------|------|---------------|
| Native WP blocks (Gutenberg) | Core feature, no plugin | Limited complex field support; less editor-friendly for custom data | ACF provides better field-level UI |
| Custom post_meta with custom admin UI | No plugin dependency | Massive development effort; no admin UX improvements | ACF is battle-tested and feature-rich |
| Carbon Fields / CMB2 | Free alternatives | Smaller ecosystem, fewer field types | ACF Pro already available and familiar |

### Impact
**Positive**: Rapid content modeling, admin UI, REST API exposure, version-controlled field definitions
**Negative**: ACF Pro plugin dependency; must be installed on any WordPress instance using the theme
**Risk**: ACF Pro licensing changes; field registration order must be correct

### Related
- `inc/acf/register-article-fields.php` — Article, Projects, and taxonomy registrations
- `inc/acf/register-course-fields.php` — Course registration
- `inc/acf/field-groups/` — Individual field group definitions
- `inc/acf/helpers.php` — AJAX handlers, REST field exposure

---

## Decision: Dual-Taxonomy Content Architecture

**Date**: Project inception
**Status**: Decided
**Owner**: AnnaTheMagister

### Context
Articles need to be classified in two independent ways: by methodological topic (for content navigation) and by author (for credibility/team display). These are orthogonal — an article can have multiple methodology tags and one or more authors.

### Decision
Implement two separate custom taxonomies:
1. `methodology_tag` — Topic classification with ACF metadata (color, SVG pattern, order)
2. `article_author` — Author attribution with ACF profile fields (photo, bio, names)

Both registered via `register_taxonomy()` in `inc/acf/register-article-fields.php` within an `init` hook.

### Rationale
- Independent taxonomies allow orthogonal classification (topic ≠ author)
- `show_in_rest: true` enables React components to fetch taxonomy data via REST API
- ACF on taxonomies enables visual metadata (color, pattern) on methodology tags
- Author taxonomy doubles as data source for the team page

### Alternatives Considered
| Alternative | Pros | Cons | Why Rejected? |
|-------------|------|------|---------------|
| Single taxonomy with term groups | Simpler admin | Over-complicated querying; mixing semantics | Taxonomies are intentionally separate concerns |
| Custom post_meta for authors | Flexible | No native taxonomy querying; harder to manage | Need WP_Query tax_query for related articles |
| Built-in WP author system | No custom taxonomy needed | WP users are for login, not content profiling | Need rich profiles (photo, bio, specialty) beyond WP user meta |

### Impact
**Positive**: Clean separation of concerns, powerful querying via tax_query, REST API exposure, reusable for team page
**Negative**: More taxonomy management in admin; need to ensure both are registered for Article CPT
**Risk**: Term slug conflicts between taxonomies (managed by unique taxonomy slugs)

### Related
- `inc/acf/register-article-fields.php` (lines 462-529) — Taxonomy registration
- `inc/acf/helpers.php` — REST field exposure for taxonomy terms
- `src/scripts/entities/MethodologyTags.tsx` — React types and Context for tags

---

## Decision: Session-Based Reading Mode with URL-Initiated Switching

**Date**: Project inception
**Status**: Decided
**Owner**: AnnaTheMagister

### Context
Articles have 4 content variants (scientist_long, scientist_short, parent_long, parent_short). Users need to switch between modes and have their preference persist across page views without logging in.

### Decision
Use PHP sessions (`$_SESSION['reading_mode']`) to persist the reading mode preference. Switching is initiated via `?reading_mode=` URL parameter, which sets the session value and redirects to a clean URL (without the param).

### Rationale
- Sessions persist preference across pages without login/cookies
- URL parameter for switching allows deep-linking to specific modes
- Clean URL after redirect avoids parameter clutter for analytics
- `session_start()` called early in `reading-mode-support.php`

### Alternatives Considered
| Alternative | Pros | Cons | Why Rejected? |
|-------------|------|------|---------------|
| Cookie-based | No session overhead | GDPR implications; cleared by users | Sessions are simpler for this use case |
| LocalStorage + JS | No server state | Requires JavaScript for every page; SEO concern | Reading modes affect initial HTML — must be server-side |
| URL-param only | Stateless, shareable | Doesn't persist navigation; ugly URLs | Session provides persistence; URL param enables initial set |
| User meta (logged-in) | Persistent across devices | Requires login | Want guest access |

### Impact
**Positive**: Zero-friction UX — works without login, persists during visit, clean URLs after switch
**Negative**: PHP sessions required; not ideal for load-balanced environments
**Risk**: session_start() can conflict with output buffering (managed by early call in the request lifecycle)

### Related
- `inc/reading-mode-support.php` — Session init, set/get functions, URL handler
- `inc/article-data.php` — `display_article_content()` switches output by mode
- `template-parts/article/mode-toggler.php` — UI switcher

---

## Decision: ACF Field Registration Refactoring — Direct + Hook-Based

**Date**: 2026-05 (recent)
**Status**: Decided
**Owner**: AnnaTheMagister

### Context
ACF fields were organized in a single large file (`register-article-fields.php`) containing CPT registrations, taxonomy registrations, and ACF field groups mixed together. ACF field timing issues caused fields to not appear reliably.

### Decision
Refactor into a cleaner structure:
- `field-groups/article-fields.php` and `field-groups/course-fields.php` — Pure ACF field group definitions
- `register-article-fields.php` — Combined CPT + taxonomy + field group registration (legacy compatibility)
- `register-course-fields.php` — Combined course CPT + taxonomy + field registration
- `register-acf-fields.php` — Loader that calls both direct `acf_add_local_field_group()` and hooks into `acf/include_fields`

### Rationale
- Dual approach ensures fields load regardless of ACF initialization order
- Separating field groups into `field-groups/` makes them easier to find and edit
- Loader file (`register-acf-fields.php`) provides clear entry point

### Alternatives Considered
| Alternative | Pros | Cons | Why Accepted? |
|-------------|------|------|---------------|
| Single file per field group | Clean, modular | Many includes to manage | Implemented in `field-groups/` directory |
| ACF JSON sync (acf-json) | Auto-sync from DB | Harder to version-control; sync conflicts | PHP registration preferred for version control |

### Impact
**Positive**: Fields load more reliably; structure is clearer
**Negative**: Some code duplication between legacy combined files and new field-group files
**Risk**: Need to keep both paths in sync during field changes

### Related
- `inc/acf/register-acf-fields.php` — Loader with dual registration
- `inc/acf/field-groups/article-fields.php` — Article fields
- `inc/acf/field-groups/course-fields.php` — Course fields
- `functions.php` — require_once chain

---

## Deprecated Decisions

| Decision | Date | Replaced By | Why |
|----------|------|-------------|-----|
| Single monolithic ACF field file | 2026-05 | Field-groups directory + loader | Better organization, reliability |

## Onboarding Checklist

- [ ] Understand why React via wp-scripts rather than full Gutenberg or SPA
- [ ] Know why ACF Pro was chosen for field management
- [ ] Understand the dual-taxonomy approach for topics vs authors
- [ ] Know how reading modes work (session + URL param)
- [ ] Understand the ACF field registration refactoring history
- [ ] Be aware of ACF Pro as a dependency

## Related Files

- `technical-domain.md` — Technical implementation affected by these decisions
- `business-tech-bridge.md` — How decisions connect business and technical
- `living-notes.md` — Current open questions that may become decisions
