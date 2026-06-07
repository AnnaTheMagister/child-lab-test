<!-- Context: development/wordpress/nav | Priority: critical | Version: 1.0 | Updated: 2026-05-26 -->

# WordPress Development — ChildLab Theme

> Patterns and guides for the WordPress theme backend.

## Structure

```
wordpress/
├── navigation.md               # This file
├── theme-patterns.md           # Theme setup, asset loading, template hierarchy
├── cpt-taxonomy.md             # Custom post type & taxonomy registration
├── acf-registration.md         # ACF field group registration patterns
└── rest-api-patterns.md        # REST API exposure & React integration
```

## Quick Routes

| Task | File |
|------|------|
| **Theme setup & asset loading** | `theme-patterns.md` |
| **Register a new CPT or taxonomy** | `cpt-taxonomy.md` |
| **Add ACF fields to a post type** | `acf-registration.md` |
| **Expose data to React via REST** | `rest-api-patterns.md` |
| **Frontend React patterns** | `../frontend/navigation.md` |

## Reading Order

1. **`theme-patterns.md`** — Understand how the theme is structured and assets loaded
2. **`cpt-taxonomy.md`** — Learn the CPT/taxonomy pattern used for articles, courses, projects
3. **`acf-registration.md`** — Learn how ACF fields are registered and exposed
4. **`rest-api-patterns.md`** — See how React components consume WP data

## Related Context

- **Core Standards** → `../../core/standards/code-quality.md` (PHP coding conventions)
- **Technical Domain** → `../../project-intelligence/technical-domain.md` (full project architecture)
- **Business-Tech Bridge** → `../../project-intelligence/business-tech-bridge.md` (feature mapping)
- **Frontend Patterns** → `../frontend/navigation.md`
