<!-- Context: features/courses/technical | Priority: high | Version: 1.0 | Updated: 2026-06-07 -->

# Courses — Technical Design

> Architecture, data model, and implementation details.

## Architecture Overview

```
┌────────────────────────────────────────────────────────┐
│                   Functions.php                         │
│  Loads: register-course-fields.php                      │
│  Enqueues: course-single.css                            │
│  Missing: courses.css  ⚠ not enqueued                   │
└────────────────────────────────┬───────────────────────┘
                                 │
         ┌───────────────────────┼───────────────────────┐
         ▼                       ▼                       ▼
┌─────────────────┐   ┌──────────────────┐   ┌──────────────────┐
│ page-courses.php │   │ single-courses.php│   │  WP Admin (CPT)  │
│ (list template)  │   │ (single template) │   │  + ACF Fields    │
└────────┬────────┘   └────────┬─────────┘   └──────────────────┘
         │                     │
         ▼                     ▼
┌─────────────────┐   ┌──────────────────┐
│ courses-list.php │   │   banner.php     │
│ (template part)  │   │ (template part)  │
└─────────────────┘   └──────────────────┘
```

## Data Model

### Custom Post Type: `courses`

| Property | Value |
|----------|-------|
| Post Type Key | `courses` |
| REST Base | `/wp/v2/courses` |
| Supports | title, editor, excerpt, thumbnail, custom-fields, post-formats |
| Menu Icon | `dashicons-welcome-learn-more` |
| Public | true |
| show_in_rest | true |

### Taxonomies

| Taxonomy | Slug | Type | Purpose |
|----------|------|------|---------|
| Course Audience | `course_audience` | non-hierarchical | Filter: parents / teachers |
| Course Type | `course_type` | non-hierarchical | Filter: online / offline |

### ACF Fields — "Поля курса" (group_course_fields)

| Field Key | Name | Type | Purpose |
|-----------|------|------|---------|
| `field_course_subtitle` | `course_subtitle` | text | Subtitle displayed in list + banner |
| `field_course_description` | `course_description` | textarea | Description for list cards |
| `field_course_short_description` | `course_short_description` | textarea | Short text for banner |
| `field_course_access_link` | `course_access_link` | url | External enrollment URL |
| `field_course_audience` | `course_audience` | checkbox | parents / teachers (multi) |
| `field_course_type` | `course_type` | select | online / offline |

### ACF Fields — "Палитра курса" (group_course_palette)

| Field Key | Name | Type | Default | Purpose |
|-----------|------|------|---------|---------|
| `field_course_color` | `course_color` | color_picker | `#EB3F9B` | Main brand color |
| `field_course_background_color` | `course_background_color` | color_picker | fallback | Banner background |
| `field_course_title_color` | `course_title_color` | color_picker | fallback | Title text color |
| `field_course_button_gradient` | `course_button_gradient` | color_picker | fallback | Button gradient end |

## Color Fallback System

When a palette color is not set, the system computes a fallback using `addColors()`:

```
course_title_color:      addColors(course_color, '#000000')  → #96195C (with #EB3F9B)
course_button_gradient:  addColors(course_color, '#3300FF')  → #D745FF (with #EB3F9B)
course_background_color: addColors(course_color, '#AAAAAA')  → #FFC7D8 (with #EB3F9B)
```

The `addColors()` utility in `inc/lib/addColors.php` adds RGB components (capped at 255).

## Template Rendering

### List Page (`page-courses.php`)

1. Renders page title and content (WYSIWYG editor)
2. Includes `template-parts/courses/courses-list.php`
3. `courses-list.php` queries all courses via `get_posts()` and renders a CSS grid

### Single Page (`single-courses.php`)

1. Includes `template-parts/course/banner.php` — hero banner
2. Renders `the_content()` — main editor content in `.course-main-content`

### Banner (`template-parts/course/banner.php`)

Renders:
- Full-width background image (featured image → `$GLOBALS['default_image']`)
- Gradient overlay with mask (left-to-right fade)
- Course type taxonomy tags
- Title + subtitle + short description
- Access button (if link exists)

## File Map

| File | Role |
|------|------|
| `inc/acf/register-course-fields.php` | CPT, taxonomies, and ACF field registration |
| `inc/courses-language.php` | Text domain loading |
| `inc/lib/addColors.php` | Color blending utility |
| `page-courses.php` | Template: course catalog |
| `single-courses.php` | Template: single course page |
| `template-parts/courses/courses-list.php` | Courses list rendering |
| `template-parts/course/banner.php` | Single course banner |
| `assets/styles/courses.css` | List styles (⚠ not enqueued) |
| `assets/styles/course-single.css` | Single course styles |

## REST API

The courses CPT exposes data at:
```
GET /wp-json/wp/v2/courses
GET /wp-json/wp/v2/courses/{id}
```

Taxonomies:
```
GET /wp-json/wp/v2/course-audience
GET /wp-json/wp/v2/course-type
```

ACF fields with `show_in_rest: true` are included in the response.

## Refactoring Targets

1. ~~Consolidate ACF fields~~ — single source of truth in `register-course-fields.php` ✅
2. **Fix `wp_reset_postdata()`** — move outside loop
3. **Enqueue `courses.css`** — add conditional in `functions.php`
4. ~~Fix `Template Post Type`~~ — `course` → `courses` in `single-courses.php` ✅
5. **Add missing features** — filtering, pagination
6. **Clean up template part naming** — `template-parts/courses/` (plural, for list) vs `template-parts/course/` (singular, for single) — consider unifying
