<!-- Context: development/wordpress/cpt | Priority: critical | Version: 1.0 | Updated: 2026-05-26 -->

# Custom Post Types & Taxonomies — ChildLab

> How CPTs and taxonomies are registered in this project.

## Registration Pattern

All CPTs and taxonomies are registered inside an `init` hook via `register_post_type()` and `register_taxonomy()`. This is the standard WordPress pattern.

```php
add_action('init', function () {
    register_post_type('my_cpt', [
        'labels'       => [...],
        'public'       => true,
        'show_in_rest' => true,        // REQUIRED for React access
        'menu_icon'    => 'dashicons-...',
        'supports'     => ['title', 'editor', 'excerpt', 'thumbnail'],
        'rest_base'    => 'my-items',   // REST route: /wp/v2/my-items
        'description'  => 'Description of this post type',
    ]);

    register_taxonomy('my_taxonomy', ['my_cpt'], [
        'public'       => true,
        'show_in_rest' => true,         // REQUIRED for React access
        'rest_base'    => 'my-taxonomy',
    ]);
});
```

## Existing Post Types

| Slug | REST Base | Supports | Description |
|------|-----------|----------|-------------|
| `article` | `/wp/v2/articles` | title, excerpt, revisions, thumbnail, custom-fields | Multi-mode articles for parent/scientist audiences |
| `courses` | `/wp/v2/courses` | title, editor, excerpt, thumbnail, custom-fields | Online course listings |
| `projects` | `/wp/v2/projects` | title, editor, excerpt, thumbnail, custom-fields, post-formats | Research/educational projects |

## Existing Taxonomies

| Slug | REST Base | Applies To | Purpose |
|------|-----------|------------|---------|
| `methodology_tag` | `/wp/v2/methodology-tags` | `article` | Topic classification with ACF metadata (color, SVG pattern, order) |
| `article_author` | `/wp/v2/article-authors` | `article` | Author attribution with ACF profile fields |
| `course_audience` | — (admin only) | `courses` | Audience targeting (parents vs professionals) |
| `course_type` | — (admin only) | `courses` | Course category (workshop, full course) |

## Registering a New CPT — Step by Step

### 1. Choose your registration location

CPTs are registered in `inc/acf/register-article-fields.php` (for article/projects group) or `inc/acf/register-course-fields.php` (for courses group). For a new standalone CPT, create a new file in `inc/` and require it in `functions.php`.

### 2. Register the post type

```php
add_action('init', function () {
    $labels = [
        'name'          => 'Items',                       // Admin menu name
        'singular_name' => 'Item',                        // Singular label
        'add_new_item'  => 'Add New Item',
        'edit_item'     => 'Edit Item',
        'view_item'     => 'View Item',
        'search_items'  => 'Search Items',
        'not_found'     => 'Not found',
        'item_updated'  => 'Item updated.',
    ];

    register_post_type('item', [
        'labels'       => $labels,
        'public'       => true,
        'show_in_rest' => true,                 // Enable REST API
        'menu_icon'    => 'dashicons-admin-post',  // Dashicon class
        'supports'     => ['title', 'editor', 'excerpt', 'thumbnail', 'custom-fields'],
        'rest_base'    => 'items',              // URL base for REST
        'description'  => 'Description of this post type',
        'has_archive'  => true,
        'rewrite'      => ['slug' => 'items'],
    ]);
});
```

### 3. Register associated taxonomies (if needed)

```php
add_action('init', function () {
    register_taxonomy('item_category', ['item'], [
        'public'       => true,
        'show_in_rest' => true,
        'rest_base'    => 'item-categories',
        'hierarchical' => true,  // true = categories, false = tags
        'labels'       => [
            'name'          => 'Categories',
            'singular_name' => 'Category',
            // ... other labels
        ],
    ]);
});
```

### 4. Require the new file in functions.php

```php
require_once get_template_directory() . '/inc/register-item.php';
```

### 5. Create template files (if needed)

```
single-item.php           # Single item view
archive-item.php          # Item archive
taxonomy-item_category.php # Category archive
```

## REST API Access

**Critical**: Set `show_in_rest: true` on both CPTs and taxonomies, otherwise React components can't fetch them.

```php
// Check REST access
// GET /wp-json/wp/v2/{rest_base}
// GET /wp-json/wp/v2/articles
// GET /wp-json/wp/v2/methodology-tags
```

### Query Parameters for REST

```javascript
// Fetch all articles with embedded data
fetch('/wp-json/wp/v2/articles?per_page=100&_embed')

// Fetch by taxonomy term
fetch('/wp-json/wp/v2/articles?methodology-tags=42')

// Fetch with specific fields
fetch('/wp-json/wp/v2/articles?_fields=id,title,acf')
```

## Best Practices

- ✅ Register CPTs and taxonomies in `init` hook
- ✅ Use Russian labels for admin UI (this project's primary language)
- ✅ Always set `show_in_rest: true` for API-accessible types
- ✅ Choose a unique `rest_base` (plural, kebab-case)
- ✅ Choose a meaningful `menu_icon` from WordPress Dashicons
- ✅ Declare `supports` explicitly (don't rely on defaults)
- ❌ Don't use `register_post_type()` outside of an `init` hook
- ❌ Don't use generic `rest_base` values that could conflict with other plugins
