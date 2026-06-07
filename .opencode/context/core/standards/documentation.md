<!-- Context: standards/docs | Priority: critical | Version: 3.0 | Updated: 2026-05-26 -->

# Documentation Standards — ChildLab WordPress Theme

> Standards for documenting the WordPress + React codebase. Applies to PHP, TypeScript, SCSS, and context files.

## Quick Reference

**Golden Rule**: If you or another developer asks the same question twice, document it

**Document** (✅ DO):
- WHY decisions were made (architecture, patterns)
- Complex algorithms/logic (TOC generation, SVG pattern, force graph)
- Public PHP functions and their parameters
- ACF field groups and their purpose
- React Context providers and consumed data shapes
- Setup, build commands, local dev configuration

**Don't Document** (❌ DON'T):
- Obvious code — `$i++` doesn't need a comment
- What code does (make it self-explanatory with good naming)
- Outdated/incorrect information

**Principles**: Audience-focused · Show don't tell · Keep current

---

## Part 1: PHP Documentation

### Function DocBlocks

Document all public PHP functions. Follow WordPress PHP documentation standards:

```php
<?php
/**
 * Get the display name for an article author.
 *
 * Combines first_name and last_name ACF fields if both exist,
 * otherwise falls back to the taxonomy term name.
 *
 * @since 1.0.0
 *
 * @param WP_Term $author_term The author taxonomy term object.
 * @return string              Escaped author display name.
 *
 * @example
 * // If ACF fields exist:
 * get_article_author_name($term) // "Иван Петров"
 * // Fallback to term name:
 * get_article_author_name($term) // "author-slug"
 */
function get_article_author_name($author_term) {
    $author_id  = $author_term->term_id;
    $first_name = get_field('first_name', 'article_author_' . $author_id);
    $last_name  = get_field('last_name', 'article_author_' . $author_id);

    if ($first_name && $last_name) {
        return esc_html($first_name . ' ' . $last_name);
    }
    return esc_html($author_term->name);
}
```

### Inline Comments

```php
// ✅ Useful: Explains WHY, not WHAT
// HACK: API returns null instead of [], normalize it
$items = $response['items'] ?? [];

// ✅ Useful: Section heading for complex logic
// Generate TOC HTML from matched headings
$toc = '<nav class="table-of-contents">';

// ❌ Useless: States the obvious
// Call the function
$result = get_articles();

// ❌ Redundant: Repeats the function name
// Function to get article content
function display_article_content() { }
```

### ACF Field Documentation

Document field groups with their purpose and which post types/taxonomies they apply to:

```php
// Field Group: Article Fields
// Location: Post Type = article
// Purpose: Multi-mode content for parent/scientist reading levels
acf_add_local_field_group([
    'key'    => 'group_6951f1ee5ebf0',
    'title'  => 'Article fields',
    'fields' => [
        // Подзаголовок — subtitle shown in article card and header
        [
            'name' => 'subtitle',
            'type' => 'text',
        ],
        // for_scientist_long — Full scientific version
        // for_scientist_short — Condensed scientific version
        // for_parent_long — Full parent-friendly version
        // for_parent_short — Condensed parent-friendly version
    ],
]);
```

---

## Part 2: React / TypeScript Documentation

### Component Documentation

Document each widget component with its purpose and data dependencies:

```tsx
/**
 * FrontListComponent
 *
 * Renders the methodology tags menu on the front page.
 * Displays tags grouped by color with SVG pattern backgrounds.
 *
 * Data dependencies:
 * - MethodologyTagsContext: provides methodologyTags[], tagsLoading
 *
 * Props: none (reads from context)
 *
 * States:
 * - Loading: shows Loader component
 * - Empty: shows placeholder message
 * - Data: renders MethodologyTagsList with tag distribution
 */
export const FrontListComponent: React.FC = () => {
    // ...
};
```

### Context Provider Documentation

```tsx
/**
 * ArticlesContextProvider
 *
 * Fetches all articles on mount and provides filtered subsets.
 *
 * Data fetched:
 * - GET /wp/v2/articles?per_page=100&_embed
 *
 * Provides:
 * - articles: All fetched articles
 * - articlesLoading: Boolean loading state
 * - filteredArticles: Articles filtered by currentTaxonomy + currentTag
 * - currentTaxonomy: From URL params (useCurrentSearch)
 * - currentTag: From URL params
 *
 * Filtering logic:
 * - If currentTaxonomy === "methodology" and currentTag > 0:
 *   filters articles where methodology-tags array includes currentTag
 * - Otherwise: returns all articles
 */
```

### TypeScript Interface Documentation

```tsx
/** Methodology tag as returned from /wp/v2/methodology-tags with ACF fields */
export interface MethodologyTag {
    id: number;
    count: number;
    description: string;
    link: string;
    name: string;
    slug: string;
    taxonomy: string;
    acf: MethodologyTagACF;
    _links: MethodologyTagLinks;
}

/** ACF custom fields attached to each methodology tag */
export interface MethodologyTagACF {
    color: string;        // HEX color string, e.g. "#FF6B6B"
    svg_pattern: string;  // URL to SVG pattern image
    order: string;        // Numeric sort order (stored as string by ACF)
}
```

---

## Part 3: Context File Documentation

Context files (`.opencode/context/`) should follow the existing format. When updating:

```markdown
<!-- Context: category/file-name | Priority: critical|high|medium | Version: 1.0 | Updated: 2026-05-26 -->

# Title — Brief Subtitle

> One-line description of what this file contains and why it matters.

## Section

- Bullet points for scannability
- Code blocks for examples

**Bold** for emphasis on key items
`code` for file names, functions, commands
```

### When to Update Context Files

- **New feature added**: Update `business-tech-bridge.md` feature mapping
- **Tech stack change**: Update `technical-domain.md` stack table
- **Decision made**: Add entry to `decisions-log.md`
- **Technical debt discovered**: Add to `living-notes.md`
- **New pattern established**: Add to `living-notes.md` patterns section

---

## Part 4: Code Comment Practices

### PHP Comments

```php
// ✅ TODO: Refactor to use REST API instead of admin-ajax.php
// ✅ FIXME: This does not handle the case where $term is empty
// ✅ HACK: session_start() must be called before any output
// ✅ NOTE: Taxonomy slug must match the REST base for proper routing
```

### React/TypeScript Comments

```tsx
// ✅ Explain non-obvious patterns
// Context wraps both providers so components can use either or both
container.render(
    <MethodologyTagsContextProvider>
        <ArticlesContextProvider>
            {render}
        </ArticlesContextProvider>
    </MethodologyTagsContextProvider>
);

// ✅ Explain workarounds
// HACK: window.location check for local dev vs production URL
const BASE_URL = window.location.host === "localhost"
    ? "http://localhost/childlab.local"
    : window.location.origin;
```

### What to Comment (PHP)

✅ **WordPress hooks** — which hook and why
✅ **ACF field keys** — what group they belong to
✅ **Non-obvious fallback logic** — why fallback exists
✅ **Internationalization** — note that strings are in Russian
✅ **Performance considerations** — e.g., `per_page=100` fetch

### What to Comment (React/TS)

✅ **Context providers** — what data they fetch and provide
✅ **useMemo dependencies** — why they trigger recomputation
✅ **State management decisions** — why Context vs props
✅ **API endpoint details** — what params and embedded data
✅ **Loading/empty/error states** — what the component shows

---

## Best Practices

✅ Explain WHY, not just WHAT
✅ Include working examples with expected output
✅ Document the non-obvious and the clever
✅ Note fallback behavior and why it exists
✅ Localize documentation strings when related to user-facing features
✅ Keep context files up to date with architecture changes
✅ Use PHPdoc/TSDoc for all public functions and exported types

**Golden Rule**: If you or another developer asks the same question twice, document it.
