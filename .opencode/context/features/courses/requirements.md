<!-- Context: features/courses/requirements | Priority: high | Version: 1.0 | Updated: 2026-06-07 -->

# Courses — Requirements

> Feature requirements for the ChildLab courses system.
> Status: **Partially implemented** — items marked [x] exist but may have bugs.

## Must Have

### Data Model
- [x] Custom post type `courses` with `show_in_rest: true`
- [x] Taxonomy `course_audience` (parents/teachers) for audience filtering
- [x] Taxonomy `course_type` (online/offline) for format filtering
- [x] ACF field group "Поля курса": subtitle, description (list), short description (banner), access link, audience (checkbox), type
- [x] ACF field group "Палитра курса": main color, background color, title color, button gradient

### List Page (Course Catalog)
- [x] Page template "Страница курсов" loading courses list
- [x] Grid layout of course cards with background image and gradient overlay
- [x] Each card shows: title, subtitle, description, "Подробнее" link
- [x] Course color as CSS custom property on each card
- [ ] Filtering by audience (parents/teachers) — not implemented
- [ ] Filtering by type (online/offline) — not implemented
- [ ] Sorting (by date, alphabetically, by level) — not implemented
- [ ] Pagination or load more — currently loads ALL courses
- [ ] Meta display (duration, level) on cards — CSS exists, template missing
- [ ] Empty state when no courses available
- [ ] Loading state

### Single Course Page
- [x] Hero banner with featured image, gradient overlay, and color palette
- [x] Course type tags displayed in banner
- [x] Title, subtitle, short description with configurable colors
- [x] Access button with gradient (if access link is set)
- [x] Main editor content below banner
- [ ] Course meta bar (duration, level, audience, format) below banner
- [ ] Related courses section

### Admin Experience
- [x] Course post type in admin menu
- [x] Course fields appear on post edit screen
- [x] Course palette fields appear (menu_order 1)
- [x] Audience and type taxonomies in admin
- [ ] Course list table columns (audience, type, date)

## Should Have

- [ ] REST API support for courses (CPT has `show_in_rest`, but no custom endpoints)
- [ ] React widget for course filtering on the frontend
- [ ] Gutenberg block for inserting course cards into content
- [ ] Translation support for all course UI strings

## Known Bugs

| Bug | Location | Impact | Fix |
|-----|----------|--------|-----|
| `wp_reset_postdata()` inside loop | `template-parts/courses/courses-list.php:45` | Resets post data after first post; subsequent `the_field()` calls may return wrong data | Move `wp_reset_postdata()` outside the `foreach` |
| `courses.css` not enqueued | `functions.php` | Courses list page has no styles | Add conditional enqueue in `functions.php` |
| `numberposts => -1` | `courses-list.php` | Loads ALL courses — no pagination, potential memory issues | Add pagination or sensible limit |

## Open Questions

1. Should filtering be server-side (PHP/WP_Query) or client-side (React)?
2. Should the courses list show ALL courses or only published ones with a specific status?
3. Is the `course_access_link` meant for external enrollment only, or could it link to internal content too?
4. Should duration and level be displayed on the list cards or only on the single page?
