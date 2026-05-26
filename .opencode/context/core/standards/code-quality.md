<!-- Context: standards/code | Priority: critical | Version: 3.0 | Updated: 2026-05-26 -->

# Code Quality Standards — ChildLab WordPress Theme

> Standards for the project's mixed PHP/WordPress + React/TypeScript codebase.

## Quick Reference

**Stack**: PHP (WordPress) backend · React 19 + TypeScript frontend · SCSS styling · ACF Pro for fields

**Golden Rules**:
- **PHP**: Match WordPress coding conventions — snake_case functions, action/filter hooks, `get_template_*()` paths
- **React**: Context Provider pattern for state · `useEffect` + `fetch` for data · PascalCase components · camelCase utilities
- **Both**: Small focused functions · Explicit dependencies · Validate at boundaries

**Critical Patterns** (use these):
- ✅ PHP: snake_case functions, WordPress hooks, `wp_enqueue_*` for assets
- ✅ React: Context + Provider + custom hook, `useMemo` for derived state, widget folder structure
- ✅ SCSS: variables.scss tokens, mixins.scss, component partials
- ✅ TypeScript: Interfaces for API data, exported from entity files

**Anti-Patterns** (avoid these):
- ❌ Direct DB queries when WP/WP_Query exists
- ❌ Mixing PHP and JS in the same file
- ❌ ACF field key collisions (always use unique keys)
- ❌ Hardcoded URLs (use `get_template_directory_uri()` or `BASE_URL` const)
- ❌ Mutating state in React (use spread/immutable patterns)

---

## Part 1: PHP / WordPress Standards

### Naming Conventions

| Element | Convention | Example |
|---------|-----------|---------|
| Functions | `snake_case` | `get_article_author_name()`, `display_article_content()` |
| Hooks (actions/filters) | `snake_case` | `add_action('init', 'register_custom_post_types')` |
| Variables | `$snake_case` | `$post_id`, `$author_term`, `$article_content` |
| Files | `kebab-case.php` | `reading-mode-support.php`, `article-data.php` |
| Constants | `UPPER_SNAKE` | WP standard (avoid custom constants unless needed) |
| Global vars | `$GLOBALS['snake_case']` | `$GLOBALS['default_image']` |

### WordPress Hooks Pattern

```php
// ✅ Register via add_action/add_filter in the global scope or init callback
add_action('wp_enqueue_scripts', 'load_my_assets');
function load_my_assets() {
    wp_enqueue_style('my-handle', get_theme_file_uri('/assets/styles/my-file.css'),
        [], filemtime(get_template_directory() . '/assets/styles/my-file.css'));
}

// ❌ Don't call action callbacks directly
load_my_assets(); // Wrong — bypasses hook system

// ✅ Use anonymous functions for simple hooks
add_action('after_setup_theme', function () {
    load_theme_textdomain('childlab', get_template_directory() . '/language');
});
```

### Asset Loading via wp_enqueue_*

```php
// ✅ CSS — always use filemtime for cache busting
wp_enqueue_style('handle', get_theme_file_uri('/assets/styles/file.css'),
    [], filemtime(get_template_directory() . '/assets/styles/file.css'));

// ✅ JavaScript — declare dependencies explicitly
wp_enqueue_script('handle', get_theme_file_uri('/build/index.js'),
    ['wp-element', 'wp-i18n'], filemtime(get_template_directory() . '/build/index.js'), true);

// ✅ Localize for React data bridge
wp_localize_script('ourmainjs', 'themeData', [
    'templateUrl' => get_template_directory_uri(),
]);

// ✅ JS translations for React
wp_set_script_translations('handle', 'childlab', get_template_directory() . '/language/js');
```

### Custom Post Type & Taxonomy Registration

```php
// ✅ Register in an 'init' hook — always show_in_rest for API access
add_action('init', function () {
    register_post_type('my_cpt', [
        'labels'       => [...],     // Russian labels with __() or direct strings
        'public'       => true,
        'show_in_rest' => true,       // Required for React/API access
        'menu_icon'    => 'dashicons-...',
        'supports'     => ['title', 'editor', 'excerpt', 'thumbnail'],
        'rest_base'    => 'my-items',  // REST route: /wp/v2/my-items
    ]);

    register_taxonomy('my_taxonomy', ['my_cpt'], [
        'public'       => true,
        'show_in_rest' => true,
        'rest_base'    => 'my-taxonomies',
    ]);
});
```

### ACF Field Registration

```php
// ✅ Use acf_add_local_field_group() with a globally unique key
acf_add_local_field_group([
    'key'    => 'group_my_unique_key',     // MUST be globally unique
    'title'  => 'My Field Group',
    'fields' => [
        [
            'key'           => 'field_my_unique_field_key',
            'label'         => 'Поле на русском',
            'name'          => 'field_slug',           // Used in get_field()
            'type'          => 'text',                  // text, wysiwyg, image, etc.
            'show_in_rest'  => 1,                       // Expose to REST API
            'show_in_graphql' => 1,                     // If using WPGraphQL
        ],
    ],
    'location' => [
        [
            ['param' => 'post_type', 'operator' => '==', 'value' => 'article'],
        ],
    ],
]);

// ✅ For taxonomy fields, also register REST exposure for terms
register_rest_field('methodology_tag', 'acf', [
    'get_callback' => function ($term) {
        return get_fields('methodology_tag_' . $term['id']);
    },
]);
```

⚠️ **Gotcha**: ACF field keys (`field_xxx`, `group_xxx`) must be globally unique. Never reuse keys across field groups. Prefix with a unique string.

### PHP i18n

```php
// ✅ Use WordPress i18n functions with text domain
esc_html__('Текст на русском', 'childlab');
esc_html_e('Текст на русском', 'childlab');
_n('One item', '%d items', $count, 'childlab');

// ❌ Don't hardcode strings without text domain
__('Text'); // Missing domain — won't be translatable
```

### PHP Code Organization

```php
// ✅ Each inc/ file adds specific hook-based functionality
// ❌ Don't echo/output directly in function files (use template files)

// ✅ Clear require_once chain in functions.php
require_once get_template_directory() . '/inc/article-data.php';
require_once get_template_directory() . '/inc/reading-mode-support.php';
```

---

## Part 2: React / TypeScript Standards

### Component Architecture — Widget Pattern

```
src/scripts/widgets/WidgetName/
├── WidgetName.tsx          # Main component (PascalCase file + component)
├── SubComponent.tsx        # Supporting components
├── helperFunction.ts       # Pure logic functions (camelCase)
└── (tests/)                # Tests when added
```

### Context Provider Pattern

```tsx
// ✅ Create context + provider + custom hook in one file
import React, { useState, useEffect, createContext, useContext, useMemo } from 'react';

interface MyDataType {
    id: number;
    name: string;
}

interface MyContextType {
    data: MyDataType[];
    loading: boolean;
    filteredData: MyDataType[];
}

const MyContext = createContext<MyContextType>({
    data: [],
    loading: true,
    filteredData: [],
});

export const MyContextProvider = ({ children }: { children: React.ReactNode }) => {
    const [data, setData] = useState<MyDataType[]>([]);
    const [loading, setLoading] = useState(true);

    // ✅ Fetch on mount — one-time load for client-side filtering
    useEffect(() => {
        fetch('/wp-json/wp/v2/my-endpoint?per_page=100')
            .then((res) => res.json())
            .then((data: MyDataType[]) => {
                setData(data);
                setLoading(false);
            });
    }, []);

    // ✅ useMemo for derived state (filter, sort, transform)
    const filteredData = useMemo(() => {
        if (!data) return [];
        return data.filter((item) => item.name.includes('search'));
    }, [data, searchTerm]);

    const context = { data, loading, filteredData };

    return (
        <MyContext.Provider value={context}>
            {children}
        </MyContext.Provider>
    );
};

export const useMyData = () => useContext(MyContext);
```

### Data Fetching Pattern

```tsx
// ✅ Fetch in Provider, filter client-side with useMemo
// ✅ URL params from useCurrentSearch() for shareable filters

// ❌ Don't fetch in individual components (duplicate requests)
// ❌ Don't fetch on every render (use useEffect with [])
```

### TypeScript Interfaces — Entity Pattern

```tsx
// ✅ Define interfaces in dedicated entity files
// ✅ Export all types for reuse

export interface MyEntity {
    id: number;
    name: string;
    slug: string;
    acf: {
        color: string;
        order: string;
    };
}

export type MyEntityList = MyEntity[];

// ✅ Helper functions for data manipulation
export const sortByOrder = (items: MyEntity[]): MyEntity[] => {
    return [...items].sort((a, b) => parseInt(a.acf.order) - parseInt(b.acf.order));
};
```

### React Component Patterns

```tsx
// ✅ Functional components only
// ✅ Props interface defined at top of file or imported
// ✅ Custom hooks for shared logic

interface ComponentProps {
    items: MyDataType[];
    onSelect: (item: MyDataType) => void;
    loading?: boolean;
}

export const MyComponent: React.FC<ComponentProps> = ({ items, onSelect, loading = false }) => {
    // ... render
};
```

### Naming Conventions (React/TS)

| Element | Convention | Example |
|---------|-----------|---------|
| Components | `PascalCase` | `FrontListComponent`, `ArticlesListComponent` |
| Files (components) | `PascalCase.tsx` | `MethodologyTagsList.tsx` |
| Files (utilities) | `camelCase.ts` | `distributeTags.ts`, `graphConfig.ts` |
| Functions | `camelCase` | `getSortedTags`, `filterTagsBySearch` |
| Hooks | `useCamelCase` | `useCurrentSearch`, `useArticles` |
| Types/Interfaces | `PascalCase` | `MethodologyTag`, `Article` |
| Constants | `UPPER_SNAKE` | `BASE_URL`, `MEDIA_URL` |

---

## Part 3: SCSS / Styling Standards

### File Organization

```
src/styles/
├── variables.scss     # Design tokens: colors, spacing, breakpoints, fonts
├── mixins.scss        # Reusable mixins and functions
├── main.scss          # Global/base styles
├── grid-system.scss   # Layout grid
└── header.scss        # Header-specific styles

assets/styles/         # Standalone compiled CSS files
├── variables.css
├── common.css
├── header.css
├── article-card.css
├── single-article.css
├── team.css
├── projects.css
└── ...
```

### Naming

- Classes: `kebab-case` (e.g., `.article-card`, `.mode-scientist-long`, `.toc-list`)
- BEM-inspired for components: `.block__element--modifier` where meaningful
- IDs: camelCase for JS hooks (e.g., `#methodology-tags-menu`)
- Variables: `--kebab-case` (CSS custom properties), `$kebab-case` (SCSS variables)

---

## Part 4: General Patterns (all languages)

### Small Functions

```php
// ✅ PHP — one job per function
function get_article_author_name($author_term) {
    $first_name = get_field('first_name', 'article_author_' . $author_term->term_id);
    $last_name  = get_field('last_name', 'article_author_' . $author_term->term_id);
    return $first_name && $last_name
        ? esc_html($first_name . ' ' . $last_name)
        : esc_html($author_term->name);
}
```

### Validation at Boundaries

```php
// ✅ PHP — validate input early
function get_related_articles($post_id = null, $limit = 3) {
    if (!$post_id) $post_id = get_the_ID();
    $tags = wp_get_post_terms($post_id, 'methodology_tag', ['fields' => 'ids']);
    if (empty($tags) || is_wp_error($tags)) return [];
    // ... proceed safely
}
```

### Error Handling

```php
// ✅ PHP — handle WP_Error and empty states
$terms = get_terms($args);
if (is_wp_error($terms) || empty($terms)) {
    return []; // Return safe default
}
```

```tsx
// ✅ React — handle loading, empty, and error states
if (loading) return <Loader />;
if (error) return <div className="error">{error}</div>;
if (items.length === 0) return <EmptyState message="Нет элементов" />;
return <List items={items} />;
```

---

## Anti-Patterns — Project-Specific

❌ **ACF field key collisions** — Every field key must be globally unique
❌ **Missing `show_in_rest`** — React components can't access fields not exposed via REST
❌ **Duplicate taxonomy REST registration** — Terms need `register_rest_field()` in addition to `show_in_rest`
❌ **Hardcoded localhost URLs** — Use `BASE_URL` from `consts.ts` for API calls
❌ **Direct `get_template_directory_uri()` in JS** — Use localized `themeData.templateUrl` instead
❌ **PHP without i18n** — All UI-facing strings should use `__()`, `esc_html__()` with `'childlab'` domain
❌ **session_start() after output** — Reading mode init must happen early in request lifecycle

## Best Practices Checklist

### PHP
- [ ] snake_case function names
- [ ] WordPress hooks for integration points
- [ ] wp_enqueue_* for asset loading
- [ ] filemtime() for cache busting
- [ ] show_in_rest: true for API-accessible fields
- [ ] i18n with 'childlab' text domain
- [ ] Validate at boundaries, return safe defaults
- [ ] Unique ACF field keys

### React/TypeScript
- [ ] Context Provider pattern for shared state
- [ ] useMemo for derived/computed data
- [ ] useEffect + fetch for data loading (empty deps = mount only)
- [ ] TypeScript interfaces for API data shapes
- [ ] Widget folder pattern for components
- [ ] Loading / empty / error state handling
- [ ] PascalCase components, camelCase utilities

### SCSS
- [ ] variables.scss for design tokens
- [ ] BEM-like naming or consistent kebab-case
- [ ] Component-specific files for large components

**Golden Rule**: If you can't easily test it, refactor it.
