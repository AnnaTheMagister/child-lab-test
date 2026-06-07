<!-- Context: standards/tests | Priority: critical | Version: 3.0 | Updated: 2026-05-26 -->

# Testing Standards — ChildLab WordPress Theme

> Testing guide for the PHP/WordPress + React/TypeScript codebase.

**Current status**: No test infrastructure is set up yet. These standards define what to add when testing is introduced.

## Quick Reference

**Golden Rule**: If you can't test it easily, refactor it

**AAA Pattern**: Arrange → Act → Assert

**Test** (✅ DO):
- Happy path, edge cases, error cases
- Business logic, pure helper functions, public APIs
- WordPress hooks fire correctly
- ACF field data returns expected shapes
- React Context providers return expected state
- React component renders for loading/empty/error/data states

**Don't Test** (❌ DON'T):
- WordPress core, ACF Pro internals
- Third-party libraries
- Simple getters/setters
- Browser-specific behavior (leave to E2E)

**Coverage Goals**: Critical paths (100%), Helpers (90%+), Components (80%+)

---

## Principles

**Test behavior, not implementation**: Focus on what code does, not how
**Keep tests simple**: One assertion per test, clear names, minimal setup
**Independent tests**: No shared state, run in any order
**Fast and reliable**: Quick execution, no flaky tests, deterministic

---

## Part 1: PHP Testing (Future — PHPUnit + WP_Mock)

### Framework Recommendation

- **PHPUnit** (via `yoast/phpunit-polyfills` for WordPress compatibility)
- **WP_Mock** for mocking WordPress functions in unit tests
- **Brain Monkey** as alternative for function mocking

### Test Structure

```php
<?php

use PHPUnit\Framework\TestCase;

class ArticleDataTest extends TestCase {
    // ✅ Arrange → Act → Assert
    public function test_get_article_author_name_returns_full_name(): void {
        // Arrange
        $author_term = (object) ['term_id' => 1, 'name' => 'author-slug'];
        \WP_Mock::userFunction('get_field', [
            'args'   => ['first_name', 'article_author_1'],
            'return' => 'Иван',
        ]);
        \WP_Mock::userFunction('get_field', [
            'args'   => ['last_name', 'article_author_1'],
            'return' => 'Петров',
        ]);

        // Act
        $result = get_article_author_name($author_term);

        // Assert
        $this->assertEquals('Иван Петров', $result);
    }

    public function test_get_article_author_name_falls_back_to_term_name(): void {
        // Arrange
        $author_term = (object) ['term_id' => 2, 'name' => 'author-slug'];
        \WP_Mock::userFunction('get_field', [
            'args'   => ['first_name', 'article_author_2'],
            'return' => false,
        ]);

        // Act
        $result = get_article_author_name($author_term);

        // Assert
        $this->assertEquals('author-slug', $result);
    }
}
```

### What to Test (PHP)

| Function Type | Example | Test For |
|--------------|---------|----------|
| **Data helpers** | `get_article_author_name()`, `get_headings_match()` | Returns correct values for various inputs |
| **Edge cases** | Empty fields, missing taxonomy terms, null IDs | Returns safe defaults, not errors |
| **WordPress hooks** | `add_action('init', ...)` callbacks | Callback is registered, fires without error |
| **ACF field logic** | Field group arrays, `get_field()` return handling | Correct field structure, correct fallback |
| **Content processing** | `generate_table_of_contents()`, `display_article_content()` | Correct output for various content inputs |

### What NOT to Test (PHP)

- WordPress core functions (`get_posts`, `wp_enqueue_*`, `add_action`) — trust WP core
- ACF Pro internals — trust the plugin
- `register_post_type()` calls — verify visually or with smoke test
- Simple `esc_html__()` wrappers — trust WordPress escaping

---

## Part 2: JavaScript / React Testing (Future — Jest + @testing-library/react)

### Framework Recommendation

- **Jest** (comes with `@wordpress/scripts` — just add `jest` config)
- **@testing-library/react** for component testing
- **@testing-library/jest-dom** for DOM assertions

### Test Structure (AAA Pattern)

```javascript
test('getSortedTags sorts by ACF order field', () => {
    // Arrange
    const tags = [
        { id: 1, acf: { order: '3' }, name: 'C' },
        { id: 2, acf: { order: '1' }, name: 'A' },
        { id: 3, acf: { order: '2' }, name: 'B' },
    ];

    // Act
    const result = getSortedTags(tags, 'order');

    // Assert
    expect(result[0].name).toBe('A');
    expect(result[1].name).toBe('B');
    expect(result[2].name).toBe('C');
});
```

### Testing Pure Functions (easiest, highest value)

```javascript
// ✅ Pure helpers — easiest to test, do it first
import { filterTagsBySearch, getSortedTags } from '../MethodologyTags';

test('filterTagsBySearch returns matching tags by name', () => {
    const tags = [
        { name: 'Внимание', description: '', slug: 'attention' },
        { name: 'Память', description: '', slug: 'memory' },
    ];

    expect(filterTagsBySearch(tags, 'Вним')).toHaveLength(1);
    expect(filterTagsBySearch(tags, 'xyz')).toHaveLength(0);
    expect(filterTagsBySearch(tags, '')).toHaveLength(2);
});
```

### Testing React Components

```jsx
import { render, screen } from '@testing-library/react';
import { ArticlesListComponent } from './ArticlesList';

test('shows loading state', () => {
    render(<ArticlesListComponent />);
    expect(screen.getByText(/загрузка/i)).toBeInTheDocument();
});

test('shows empty state when no articles', () => {
    // Mock the context to return empty articles
    jest.spyOn(React, 'useContext').mockReturnValue({
        articles: [],
        articlesLoading: false,
        filteredArticles: [],
    });

    render(<ArticlesListComponent />);
    expect(screen.getByText(/нет статей/i)).toBeInTheDocument();
});
```

### Testing Context Providers

```jsx
import { render, screen, waitFor } from '@testing-library/react';
import { ArticlesContextProvider } from './Articles';

test('provides articles after fetch', async () => {
    // Mock fetch
    global.fetch = jest.fn().mockResolvedValue({
        json: () => Promise.resolve([{ id: 1, title: 'Test Article' }]),
    });

    render(
        <ArticlesContextProvider>
            <TestConsumer />
        </ArticlesContextProvider>
    );

    await waitFor(() => {
        expect(screen.getByText('Test Article')).toBeInTheDocument();
    });
});
```

### What to Test (JS/React)

| Type | Example | Test For |
|------|---------|----------|
| **Pure helpers** | `getSortedTags`, `filterTagsBySearch`, `distributeTags` | Correct output for various inputs |
| **Hooks** | `useCurrentSearch` | Returns correct params from URL |
| **Context Providers** | `ArticlesContextProvider`, `MethodologyTagsContextProvider` | Provides correct default + fetched state |
| **Components** | `FrontListComponent`, `ArticlesListComponent` | Loading, empty, error, data states |
| **Edge cases** | Empty arrays, null values, missing ACF fields | Graceful handling |

### What NOT to Test (JS/React)

- WordPress REST API responses (test your handling, not the API)
- Third-party libraries (d3-force, React DOM)
- Framework internals (React reconciliation, Context propagation)
- Browser APIs (`window.location`, `fetch`) — mock them

---

## Part 3: Manual Testing Checklist

For changes that don't yet have automated tests, verify manually:

### PHP / WordPress
- [ ] Custom post type appears in admin menu
- [ ] Custom fields render in editor
- [ ] REST API endpoint returns expected data: `/wp-json/wp/v2/{post-type}`
- [ ] Taxonomy terms appear in post editor
- [ ] Reading mode switching works (URL param → session → content change)
- [ ] i18n strings appear in correct language
- [ ] Asset enqueuing doesn't break page load

### React / Frontend
- [ ] Component renders without errors (check browser console)
- [ ] Loading state shows while data fetches
- [ ] Data displays correctly after fetch
- [ ] Empty state shows when no data
- [ ] Filtering/selection works as expected
- [ ] No console errors for missing data or API issues

### Build
- [ ] `npm run build` succeeds without errors
- [ ] No PHP syntax errors (`php -l filename.php` or use lint)

---

## Test Naming

```javascript
// ✅ Good: Descriptive, clear expectation
test('calculateDiscount returns 10% off for premium users', () => {});
test('getRelatedArticles excludes current post from results', () => {});
test('ArticlesContextProvider fetches data on mount', () => {});

// ❌ Bad: Vague, unclear
test('it works', () => {});
test('test articles', () => {});
```

## Best Practices

✅ Test one thing per test
✅ Use descriptive test names
✅ Keep tests independent (no shared state)
✅ Mock external dependencies (fetch, WP functions)
✅ Test loading/empty/error/data states in components
✅ Make tests readable (AAA pattern)
✅ Run tests frequently (`npm test`)
✅ Fix failing tests immediately — never ignore them

## Adding Tests to This Project

When you're ready to add tests:

1. **Install PHPUnit**: `composer require --dev phpunit/phpunit yoast/phpunit-polyfills`
2. **Install JS testing**: Already available via `@wordpress/scripts`, add config in `package.json`
3. **Create directories**: `tests/php/`, `tests/js/` mirroring source structure
4. **Start with pure functions** (highest value, easiest setup)
5. **Add context provider tests** (mock fetch, verify state)
6. **Add component tests** (render with mocked context)

**Golden Rule**: If you can't test it easily, refactor it.
