---
name: courses
description: WordPress courses feature — CPT, ACF fields, templates, and rendering
version: 1.0.0
author: ChildLab
type: skill
category: wordpress
tags:
  - courses
  - wordpress
  - cpt
  - acf
  - templates
---

# Courses Skill

> Everything you need to know about the ChildLab courses feature.
> Load this skill before working on any courses-related code.

## Context Files

When loaded, this skill injects:

| File | Contents |
|------|----------|
| `context/features/courses/navigation.md` | Overview and quick reference |
| `context/features/courses/business-domain.md` | Business context and user stories |
| `context/features/courses/requirements.md` | Feature requirements and known gaps |
| `context/features/courses/technical-design.md` | Architecture, data model, templates |

## Completed ✅

- **ACF consolidation**: Single source of truth in `register-course-fields.php`. Removed `field-groups/course-fields.php`.
- **Template Post Type fix**: `single-courses.php` now uses `courses` (matches CPT slug).
- **Page templates**: `page-articles.php` + `page-authors.php` created; all `single-*.php` and `page-*.php` headers fixed.
- **Auto page creation**: `childlab_ensure_required_pages()` in `functions.php` creates pages on theme activation using `__()` for locale-aware titles.
- **Translation files**: `.pot`, `.po`, `.mo` updated with new strings.

## Remaining Bugs

   <rule id="fix_wp_reset_postdata">
     `wp_reset_postdata()` is called INSIDE the `foreach` loop in `courses-list.php`. Move it outside the loop.
   </rule>
   <rule id="enqueue_missing_css">
     `assets/styles/courses.css` is NOT enqueued in `functions.php`. Add conditional enqueue for the courses list page.
   </rule>

## Tests

- `tests/entities/Courses.test.tsx` — context provider loading, fetch success (3 separate calls), URL correctness
- `tests/widgets/CoursesList.test.tsx` — filter buttons, URL sync, card rendering, loading/empty/error states
- `tests/widgets/ErrorBoundary.test.tsx` — error boundary normal render, error catch
- Run `npm test` before any courses-related PR

## Quick Commands

```bash
# Load courses context
opencode --context features/courses

# Run courses tests
npm test
