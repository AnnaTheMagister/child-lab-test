<!-- Context: development/wordpress/acf | Priority: critical | Version: 1.0 | Updated: 2026-05-26 -->

# ACF Registration Patterns — ChildLab

> How Advanced Custom Fields are registered, organized, and exposed in this project.

## File Organization

ACF fields are organized in two complementary patterns (legacy + refactored):

```
inc/acf/
├── helpers.php                       # AJAX handlers, REST field exposure
├── register-acf-fields.php           # Loader: direct + hook-based registration
├── register-article-fields.php       # Article + Projects CPTs, taxonomies, AND fields (legacy combined)
├── register-course-fields.php        # Courses CPT, taxonomies, AND fields (combined)
└── field-groups/                     # Pure field group definitions (refactored)
    ├── article-fields.php            # Article field group only
    └── course-fields.php             # Course field group only
```

## Registration Pattern

### Method 1: Direct + Hook (Recommended for new fields)

```php
<?php
// inc/acf/field-groups/my-field-group.php

// Direct call (loads immediately when ACF is active)
if (function_exists('acf_add_local_field_group')) {
    acf_add_local_field_group(get_my_field_group());
}

// Hook-based (loads when ACF is ready)
add_action('acf/include_fields', function () {
    acf_add_local_field_group(get_my_field_group());
});

function get_my_field_group() {
    return [
        'key'    => 'group_my_unique_prefix',    // MUST be globally unique
        'title'  => 'My Field Group',
        'fields' => [ /* ... */ ],
        'location' => [
            [
                ['param' => 'post_type', 'operator' => '==', 'value' => 'article'],
            ],
        ],
    ];
}
```

### Method 2: Direct only (Simpler, used in legacy files)

```php
acf_add_local_field_group([
    'key'    => 'group_6951f1ee5ebf0',
    'title'  => 'Article fields',
    'fields' => [
        // ...field definitions...
    ],
    'location' => [
        [
            ['param' => 'post_type', 'operator' => '==', 'value' => 'article'],
        ],
    ],
]);
```

## Field Definition Structure

Each field follows this structure (from the codebase):

```php
[
    'key'               => 'field_my_unique_key',      // Globally unique
    'label'             => 'Подзаголовок',             // Admin UI label (Russian)
    'name'              => 'subtitle',                  // Used in get_field('subtitle')
    'aria-label'        => '',
    'type'              => 'text',                      // text, wysiwyg, image, textarea, etc.
    'instructions'      => '',
    'required'          => 0,
    'conditional_logic' => 0,
    'wrapper'           => [
        'width' => '',
        'class' => '',
        'id'    => '',
    ],
    'default_value'     => '',
    'placeholder'       => '',
    'show_in_graphql'   => 1,      // ✅ For AJAX/REST API
    'show_in_rest'      => 1,      // ✅ For REST API (React access)
]
```

**⚠️ Critical**: Always set `'show_in_rest' => 1` on fields that React components need. Without this, the field data won't appear in REST API responses.

## Field Types Used in This Project

| Type | Example | Usage |
|------|---------|-------|
| `text` | `subtitle` | Short text fields |
| `wysiwyg` | `for_scientist_long` | Rich content (the 4 reading mode fields) |
| `textarea` | `course_description` | Multi-line text |
| `image` | `photo` (author) | Image with URL/ID output |
| `color_picker` | (future use) | Color selection for tags |
| `select` | (future use) | Dropdown selections |

## REST API Exposure for Post Types

ACF fields with `show_in_rest: 1` are automatically available in REST responses for post types:

```
GET /wp-json/wp/v2/articles/123
→ Response includes: { acf: { subtitle: "...", for_scientist_long: "...", ... } }
```

## REST API Exposure for Taxonomy Terms

**⚠️ Gotcha**: `show_in_rest` on ACF fields does NOT automatically expose them for taxonomy terms. You must also call `register_rest_field()`:

```php
// inc/acf/helpers.php
add_action('rest_api_init', function () {
    register_rest_field('methodology_tag', 'acf', [
        'get_callback' => function ($term) {
            return get_fields('methodology_tag_' . $term['id']);
        },
        'schema' => null,
    ]);

    register_rest_field('article_author', 'acf', [
        'get_callback' => function ($term) {
            return get_fields('article_author_' . $term['id']);
        },
        'schema' => null,
    ]);
});
```

## ACF Field Keys — Uniqueness Rules

**Every ACF field key must be globally unique.** This is the most common ACF mistake.

```
Group key:  group_6951f1ee5ebf0    ← Unique per field group
Field key:  field_695ab01b6404c     ← Unique per field
```

**Rules:**
- Never reuse field keys across field groups
- Never copy-paste a field group without changing all keys
- Use a prefix strategy: `group_childlab_articles`, `field_childlab_subtitle`
- The existing hex keys (e.g., `field_695ab01b6404c`) are from the ACF UI export

**Symptoms of duplicate keys**: Fields appear in wrong groups, fields disappear from editor, PHP notices about duplicate keys.

## Adding New ACF Fields — Step by Step

### For a post type field (e.g., a new field on articles):

1. Open `inc/acf/field-groups/article-fields.php`
2. Add a new field array to the `fields` array:

```php
[
    'key'             => 'field_childlab_new_field',
    'label'           => 'Новое поле',
    'name'            => 'new_field',
    'type'            => 'text',
    'show_in_rest'    => 1,
    // ... other settings
],
```

3. If the field group file registers via hook only, also add `acf_add_local_field_group()` in `info` to `register-acf-fields.php` or your loader

### For a taxonomy term field (e.g., a new field on methodology tags):

1. Add the field to the taxonomy's ACF field group
2. In `inc/acf/helpers.php`, ensure the taxonomy is in `register_rest_field()` if React needs it

## AJAX Handlers (Legacy)

Some data is still loaded via WP AJAX (being replaced by REST):

```php
// inc/acf/helpers.php
add_action('wp_ajax_get_methodology_tags', 'ajax_get_methodology_tags');
add_action('wp_ajax_nopriv_get_methodology_tags', 'ajax_get_methodology_tags');

function ajax_get_methodology_tags() {
    $terms = get_terms([
        'taxonomy'   => 'methodology_tag',
        'hide_empty' => false,
        'meta_key'   => 'order',
        'orderby'    => 'meta_value_num',
        'order'      => 'ASC',
    ]);
    // ... format and return
    wp_send_json_success($result);
    wp_die();
}
```

**Prefer using REST API** (`/wp-json/wp/v2/{rest_base}`) for new data endpoints instead of adding new AJAX handlers.

## Best Practices

- ✅ Use `'show_in_rest' => 1` on every field React needs
- ✅ Use `register_rest_field()` for taxonomy term ACF data
- ✅ Use globally unique field keys with consistent naming
- ✅ Register field groups via both direct call AND `acf/include_fields` hook for reliability
- ✅ Place field group definitions in `inc/acf/field-groups/` directory
- ❌ Don't reuse field keys across groups
- ❌ Don't forget `register_rest_field()` for taxonomy fields
- ❌ Don't create new admin-ajax handlers when REST API works
