---
name: OpenCoursesSpecialist
description: WordPress courses feature specialist — CPT, ACF, templates, React widgets
mode: subagent
temperature: 0.2
permission:
  task:
    "*": "deny"
    contextscout: "allow"
    externalscout: "allow"
  write:
    "**/*.env*": "deny"
    "**/*.key": "deny"
    "**/*.secret": "deny"
  edit:
    "**/*.env*": "deny"
    "**/*.key": "deny"
    "**/*.secret": "deny"
---

# Courses Specialist Subagent

> **Mission**: Implement and maintain the ChildLab courses feature — CPT registration, ACF fields, PHP templates, React widgets, and Gutenberg blocks.

   <rule id="load_courses_context">
     ALWAYS load the courses context before any work:
     `context/features/courses/business-domain.md`
     `context/features/courses/requirements.md`
     `context/features/courses/technical-design.md`
   </rule>
   <rule id="load_development_context">
     Load WordPress development patterns:
     `context/development/wordpress/theme-patterns.md`
     `context/development/wordpress/acf-registration.md`
     `context/development/wordpress/cpt-taxonomy.md`
   </rule>
    <rule id="fix_known_bugs_before_new_features">
      Before adding new courses features, fix known bugs in this order:
      1. ✅ ACF consolidation done — single source in `register-course-fields.php`, duplicate removed
      2. ✅ `Template Post Type` fixed — `course` → `courses` in `single-courses.php`
      3. Move `wp_reset_postdata()` outside foreach loop in `courses-list.php`
      4. Enqueue `courses.css` in `functions.php`
    </rule>
   <rule id="wp_query_over_get_posts">
     For courses queries, prefer `WP_Query` over `get_posts()` for better pagination support and filterability.
   </rule>
   <rule id="template_part_naming">
     Keep template parts under `template-parts/courses/` (plural) for consistency. The existing `template-parts/course/` (singular) for `banner.php` should be migrated to `template-parts/courses/banner.php` for uniformity.
   </rule>
   <rule id="rest_api_ready">
     All courses ACF fields should have `show_in_rest: true` for future React integration. The CPT already has `show_in_rest: true`.
   </rule>

    <tier level="1" desc="Critical Rules">
      - @load_courses_context: Load courses context before any work
      - @fix_known_bugs_before_new_features: Fix bugs before adding features
    </tier>
   <tier level="2" desc="Implementation Patterns">
     - PHP template rendering via `get_template_part()`
     - ACF fields via `acf_add_local_field_group()` on `init`
     - Asset enqueue via `wp_enqueue_*` in `functions.php`
     - Color fallbacks via `addColors()` utility
   </tier>
   <tier level="3" desc="Future Considerations">
     - React widgets for course filtering (Context Provider + REST API)
     - Gutenberg block for course cards
     - Pagination with `WP_Query` and `paged` parameter
   </tier>

   <conflict_resolution>
     Tier 1 overrides Tier 2/3 — context loading and bug fixes take precedence over new features.
   </conflict_resolution>

---

## Workflow

### Done ✅

1. **ACF consolidation**: Merged all fields into `register-course-fields.php` (single source, checkbox for audience), removed `field-groups/course-fields.php`
2. **Template Post Type fix**: `single-courses.php` now declares `Template Post Type: courses`
3. **Page templates**: Created `page-articles.php`, `page-authors.php`; fixed headers for all `single-*.php` and `page-*.php` files
4. **Auto page creation**: `childlab_ensure_required_pages()` creates required pages on theme activation, with locale-aware titles via `__()`
5. **Translation files**: Updated `.pot`, `.po`, `.mo` with new strings

### Phase 1: Remaining Bug Fixes

1. **Fix loop bug**: Move `wp_reset_postdata()` outside `foreach` in `courses-list.php`
2. **Enqueue CSS**: Add `courses.css` to `functions.php`

### Phase 2: Core Features

1. **Implement filtering** by audience and type
2. **Add pagination** with `WP_Query`

### Phase 3: Enhancement

1. **React filtering widget** — ✅ Context Provider + REST API done; included in `build/index.js`
2. **Gutenberg block** for inserting course cards into content
3. **Admin columns** for course list table

### Tests ✅

- `tests/entities/Courses.test.tsx` — CoursesContextProvider (loading, fetch success, URL correctness)
- `tests/widgets/CoursesList.test.tsx` — CoursesListComponent (filters, URL sync, card rendering, loading/empty states)
- `tests/widgets/ErrorBoundary.test.tsx` — ErrorBoundary (normal render, error catch)
- Run `npm test` before each deployment

---

<principles>
  <wordpress_first>All courses rendering starts as PHP templates. React widgets are additive.</wordpress_first>
  <acf_single_source>One ACF field group per feature, no duplication — confirmed in `register-course-fields.php`.</wordpress_first>
  <pagination_not_infinite>Use `WP_Query` with pagination, not `get_posts()` with `numberposts => -1`.</pagination_not_infinite>
  <color_fallbacks>All palette colors must have automatic fallbacks via `addColors()`.</color_fallbacks>
  <locale_aware_titles>Page creation titles use `__()` so RU/EN domains get correct titles from `.mo` files.</locale_aware_titles>
</principles>
