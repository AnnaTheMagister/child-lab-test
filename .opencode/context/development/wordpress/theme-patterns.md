<!-- Context: development/wordpress/theme | Priority: critical | Version: 1.0 | Updated: 2026-05-26 -->

# Theme Development Patterns — ChildLab

> How the ChildLab WordPress theme is structured and how assets are loaded.

## Theme Identification

The theme is identified via `style.css` header:

```css
/*
  Theme Name: childlab-react-test
  Author: AnnaTheMagister
  Description: Тема для проекта сайта по психологии и развитию детей
  Text Domain: childlab
  Domain Path: /language
*/
```

The `style.css` file exists only for WordPress theme recognition — no CSS is loaded from it.

## Bootstrap Flow

The entry point is `functions.php`. The require chain follows a clear dependency order:

```php
<?php
// 1. Core utilities (no WP dependencies)
require_once get_template_directory() . '/inc/common.php';

// 2. Data helpers (pure functions)
require_once get_template_directory() . '/inc/article-data.php';
require_once get_template_directory() . '/inc/article-navigation.php';
require_once get_template_directory() . '/inc/articles-list.php';
require_once get_template_directory() . '/inc/author-data.php';

// 3. Feature support modules (hooks + assets)
require_once get_template_directory() . '/inc/reading-mode-support.php';
require_once get_template_directory() . '/inc/toc/toc-support.php';
require_once get_template_directory() . '/inc/svg-pattern-generator/svg-pattern-support.php';
require_once get_template_directory() . '/inc/mindmap/mindmap-support.php';

// 4. ACF registrations (fields + CPTs + taxonomies)
require_once get_template_directory() . '/inc/acf/register-article-fields.php';
require_once get_template_directory() . '/inc/acf/register-course-fields.php';
require_once get_template_directory() . '/inc/acf/helpers.php';
require_once get_template_directory() . '/inc/acf/register-acf-fields.php';

// 5. Utility libraries
require_once get_template_directory() . '/inc/lib/addColors.php';
```

**Rule**: Order dependencies carefully — ACF CPT registrations must load before field groups that reference them.

## Asset Loading Pattern

All assets are enqueued via `wp_enqueue_*` in `functions.php` or module support files:

```php
function boilerplate_load_assets() {
    // Styles — filemtime() for cache busting
    wp_enqueue_style('handle', get_theme_file_uri('/assets/styles/file.css'),
        [], filemtime(get_template_directory() . '/assets/styles/file.css'));

    // Scripts — dependencies as array, true = footer
    wp_enqueue_script('handle', get_theme_file_uri('/build/index.js'),
        ['wp-element', 'wp-i18n'], filemtime(get_template_directory() . '/build/index.js'), true);

    // JS translations for React components
    wp_set_script_translations('handle', 'childlab', get_template_directory() . '/language/js');

    // Data bridge for React — localized JS object
    wp_localize_script('handle', 'themeData', [
        'templateUrl' => get_template_directory_uri(),
    ]);
}
add_action('wp_enqueue_scripts', 'boilerplate_load_assets');
```

### React Build Assets (wp-scripts)

The `src/` directory is compiled to `build/` via `@wordpress/scripts`:

```
src/index.js  ──(wp-scripts build)──►  build/index.js + build/index.css
```

Entry point pattern:

```javascript
// src/index.js
import "./styles/main.scss";
import "./scripts/ArticleReader";
import { ArticlesListComponent, FrontListComponent, MethodologyTreeComponent } from "./scripts/widgets";

// Mount React on specific PHP-rendered DOM containers
const renderComponent = (selector, render) => {
    const container = ReactDOM.createRoot(document.querySelector(selector));
    container.render(
        <MethodologyTagsContextProvider>
            <ArticlesContextProvider>
                {render}
            </ArticlesContextProvider>
        </MethodologyTagsContextProvider>
    );
};

renderComponent("#methodology-tags-menu", <FrontListComponent />);
renderComponent("#articles-list-component", <ArticlesListComponent />);
renderComponent("#methodology-tree-component", <MethodologyTreeComponent />);
```

**Key rule**: Context Providers wrap all widgets. Any new widget that needs articles or methodology tags must be rendered inside the provider tree.

## Template Hierarchy

Standard WordPress hierarchy with project-specific templates:

| Template | Purpose | Key Feature |
|----------|---------|-------------|
| `front-page.php` | Homepage | Mounts `#methodology-tags-menu` + `#articles-list-component` |
| `page-courses.php` | Courses listing | Course archive UI |
| `page-methodology.php` | Methodology overview | Methodology content display |
| `page-projects.php` | Projects listing | Projects archive |
| `page-team.php` | Team members | Renders from `article_author` taxonomy |
| `single-courses.php` | Single course | Course CPT single view |
| `taxonomy-article_author.php` | Author archive | Articles by specific author |
| `taxonomy-methodology_tag.php` | Tags archive | Articles by methodology topic |

### Template Parts Pattern

Template parts are organized by content type:

```
template-parts/
├── article/           # Article-specific: mode-content, mode-toggler, toc, header, footer
├── articles-list/     # Article listing partials
├── course/            # Single course: banner
├── courses/           # Courses listing
├── global/            # Site-wide: header, footer
├── methodology/       # Methodology page parts
├── projects/          # Projects page parts
└── team/              # Team page parts
```

Usage:
```php
<?php get_template_part('template-parts/article/mode-content'); ?>
<?php get_template_part('template-parts/course/banner'); ?>
```

## WordPress Support Declarations

```php
function boilerplate_add_support() {
    add_theme_support('title-tag');
    add_theme_support('post-thumbnails');
    add_theme_support('menus');
    add_theme_support('custom-logo');
}
add_action('after_setup_theme', 'boilerplate_add_support');
```

## i18n / Localization

Text domain: `childlab`

```php
// PHP files
esc_html__('Текст', 'childlab');

// JavaScript files (WP i18n)
wp_set_script_translations('handle', 'childlab', get_template_directory() . '/language/js');

// PO/MO files
language/
├── childlab.pot      # Template
├── en_US.po / .mo    # English translations
└── js/               # JS-specific translation files
```

## React ↔ PHP Data Bridge

PHP provides data to React via `wp_localize_script`:

```php
wp_localize_script('ourmainjs', 'themeData', [
    'templateUrl' => get_template_directory_uri(),
]);
```

React consumes it:

```typescript
// src/scripts/shared/consts.ts
declare const themeData: { templateUrl: string };

export const BASE_URL = window.location.host === "localhost"
    ? "http://localhost/childlab.local"
    : window.location.origin;

export const DEFAULT_IMAGE_URL = themeData.templateUrl + "/assets/images/post-bg.jpg";
```

**When to add new localized data**: When a React widget needs PHP-provided values (paths, settings, nonces, etc.).

## Reading Mode System

A custom feature using PHP sessions:

```php
// inc/reading-mode-support.php
session_start();

function set_reading_mode($mode) {
    if (in_array($mode, ['scientist_long', 'scientist_short', 'parent_long', 'parent_short'])) {
        $_SESSION['reading_mode'] = $mode;
        return true;
    }
    return false;
}

function get_reading_mode() {
    return $_SESSION['reading_mode'] ?? 'scientist_long'; // Default
}

// URL-based switching with clean redirect
add_action('init', function () {
    if (isset($_GET['reading_mode']) && !empty($_GET['reading_mode'])) {
        $mode = sanitize_text_field($_GET['reading_mode']);
        if (set_reading_mode($mode)) {
            wp_redirect(remove_query_arg('reading_mode'));
            exit;
        }
    }
});
```

**Important**: `session_start()` must be called before any output. The reading-mode-support.php file is required early in functions.php for this reason.

## Common Utility Functions

```php
// inc/common.php — Shared helpers
function get_post_by_slug($slug, $post_type = 'post') {
    $posts = get_posts([
        'name'           => $slug,
        'posts_per_page' => 1,
        'post_type'      => $post_type,
        'post_status'    => 'publish',
    ]);
    return $posts ? $posts[0] : false;
}
```

## Best Practices Checklist

- [ ] Asset enqueued via `wp_enqueue_*`, not hardcoded in template
- [ ] `filemtime()` used for cache busting on asset URLs
- [ ] Script dependencies correctly declared (`wp-element`, `wp-i18n`)
- [ ] React-widget mount container exists in the PHP template
- [ ] `show_in_rest: true` for any post type React needs to fetch
- [ ] `get_template_directory_uri()` used instead of hardcoded URLs
- [ ] Text domain `'childlab'` included in all i18n functions
- [ ] Template part organized in correct `template-parts/{type}/` directory
