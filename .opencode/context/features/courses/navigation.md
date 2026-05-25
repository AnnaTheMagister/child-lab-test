<!-- Context: features/courses/nav | Priority: high | Version: 1.0 | Updated: 2026-06-07 -->

# Courses Feature — Navigation

> Structured educational programs (courses) for parents and professionals.
> Current status: **In development** — exists with bugs, planned for refactor.

## Structure

```
.opencode/context/features/courses/
├── navigation.md              # This file — overview
├── business-domain.md         # Business context, users, value
├── requirements.md            # Feature requirements & open gaps
└── technical-design.md        # Data model, architecture, templates
```

## Quick Routes

| What You Need | File |
|---|---|
| Understand courses conceptually | `business-domain.md` |
| See what's required vs missing | `requirements.md` |
| Data model, CPT, ACF fields, templates | `technical-design.md` |

## Current State

- CPT `courses` and taxonomies (`course_audience`, `course_type`) registered
- ACF fields for course info and color palette
- Courses list template and single course banner template
- Known bugs: duplicate ACF group key, `wp_reset_postdata()` inside loop, `courses.css` not enqueued, template post type mismatch
