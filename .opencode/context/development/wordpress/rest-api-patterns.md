<!-- Context: development/wordpress/rest-api | Priority: critical | Version: 1.0 | Updated: 2026-05-26 -->

# REST API Patterns — ChildLab

> How React components consume WordPress REST API data in this project.

## Overview

React widgets fetch data from the WordPress REST API on mount. Data is stored in React Context and shared across components via custom hooks.

## Data Flow

```
WordPress REST API (wp-json)
        ↓
useEffect + fetch() on mount
        ↓
React Context Provider (Articles, MethodologyTags)
        ↓
useContext / custom hook (useArticles, useMethodologyTags)
        ↓
Widget components consume state
```

## Base URL Configuration

API URLs are configured in `src/scripts/shared/consts.ts`:

```typescript
export const BASE_URL =
    window.location.host === "localhost"
        ? "http://localhost/childlab.local"
        : window.location.origin;

export const MEDIA_URL = BASE_URL + "/wp-json/wp/v2/media/";
```

**Environment detection**: localhost vs production is determined by `window.location.host`.

## Endpoints Used

| Endpoint | Purpose | Component |
|----------|---------|-----------|
| `GET /wp/v2/articles?per_page=100&_embed` | Fetch all articles with embedded data | `ArticlesContextProvider` |
| `GET /wp/v2/methodology-tags?per_page=100` | Fetch all methodology tags with ACF | `MethodologyTagsContextProvider` |
| `GET /wp/v2/article-authors` | Fetch article authors | (available via REST) |
| `GET /wp/v2/media/{id}` | Fetch media item details | (via MEDIA_URL) |

## Context Provider Fetch Pattern

This is the core data pattern used throughout the project:

```tsx
// src/scripts/entities/Articles.tsx
import React, { useState, useEffect, createContext, useContext, useMemo } from "react";
import { BASE_URL } from "../shared/consts";

interface Article {
    id: string;
    // ... other fields
}

// 1. Create context with defaults
export const ArticlesContext = createContext({
    articles: [],
    articlesLoading: true,
    currentTaxonomy: 'methodology',
    filteredArticles: [],
    currentTag: -1,
});

// 2. Create Provider that fetches + filters data
export const ArticlesContextProvider = ({ children }) => {
    const [articles, setArticles] = useState([]);
    const [articlesLoading, setArticlesLoading] = useState(true);
    const { currentTaxonomy, currentTag } = useCurrentSearch();

    // Fetch ALL data on mount (single load)
    useEffect(() => {
        fetch(BASE_URL + "/wp-json/wp/v2/articles?per_page=100&_embed")
            .then((response) => response.json())
            .then((data: Article[]) => {
                setArticles(data);
                setArticlesLoading(false);
            });
    }, []);

    // Filter client-side with useMemo (instant, no extra requests)
    const filteredArticles = useMemo(() => {
        if (!articles) return [];
        if (currentTaxonomy === "methodology" && parseInt(currentTag) > 0) {
            return articles.filter(
                (art) => art["methodology-tags"]?.some(
                    (tag) => tag === parseInt(currentTag)
                ),
            );
        }
        return articles;
    }, [articles, currentTaxonomy, currentTag]);

    const context = { articles, articlesLoading, currentTaxonomy, filteredArticles, currentTag };

    return (
        <ArticlesContext.Provider value={context}>
            {children}
        </ArticlesContext.Provider>
    );
};

// 3. Custom hook for easy consumption
export const useArticles = () => useContext(ArticlesContext);
```

## Adding a New REST Data Endpoint

### 1. Create a new Context Provider (or add to existing one)

Pattern: one Provider per data domain (articles, methodology tags).

```tsx
const MyDataContext = createContext({
    items: [],
    loading: true,
});

export const MyDataProvider = ({ children }) => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(BASE_URL + "/wp-json/wp/v2/my-endpoint")
            .then((r) => r.json())
            .then((data) => {
                setItems(data);
                setLoading(false);
            });
    }, []);

    return <MyDataContext.Provider value={{ items, loading }}>{children}</MyDataContext.Provider>;
};

export const useMyData = () => useContext(MyDataContext);
```

### 2. Wrap your widget in the new Provider

```tsx
// In src/index.js
renderComponent("#my-container",
    <MethodologyTagsContextProvider>
        <ArticlesContextProvider>
            <MyDataProvider>
                <MyWidget />
            </MyDataProvider>
        </ArticlesContextProvider>
    </MethodologyTagsContextProvider>
);
```

### 3. Ensure the endpoint is available server-side

- For CPTs: `show_in_rest: true` in `register_post_type()`
- For taxonomies: `show_in_rest: true` in `register_taxonomy()`
- For ACF fields: `'show_in_rest' => 1` on each field
- For taxonomy ACF: `register_rest_field()` in `inc/acf/helpers.php`

## URL Parameter Pattern (useCurrentSearch)

The front page filters articles using URL search parameters, enabling shareable filtered views:

```typescript
// src/scripts/shared/useCurrentSearch.ts
export const getSearchParams = () => {
    let searchParams = new URLSearchParams(window.location.search);
    return [...searchParams.entries()];
};

export const useCurrentSearch = () => {
    const [currentSearch, setCurrentSearch] = useState(getSearchParams());

    const currentTaxonomy = useMemo(
        () => (currentSearch?.[0]?.[0] === "methodology" ? "methodology" : null),
        [currentSearch],
    );

    const currentTag = useMemo(
        () => currentSearch?.[0]?.[1] ?? null,
        [currentSearch],
    );

    // Listen for popstate events (browser back/forward)
    useEffect(() => {
        window.addEventListener("pushstate", () => {
            setCurrentSearch(getSearchParams);
        });
    }, []);

    return { currentTaxonomy, currentTag };
};
```

**Pattern**: URL params → React state → useMemo filtering → Context → Widgets.

## Querying by Taxonomy Term via REST

When you need to fetch articles filtered by a taxonomy term server-side (instead of client-side):

```
GET /wp-json/wp/v2/articles?methodology-tags=42
GET /wp-json/wp/v2/articles?article-authors=7
```

The parameter name is the taxonomy's `rest_base` (e.g., `methodology-tags` not `methodology_tag`).

## Adding Custom REST Fields

To expose additional data on existing REST endpoints:

```php
add_action('rest_api_init', function () {
    register_rest_field('article', 'custom_field', [
        'get_callback' => function ($post) {
            return compute_custom_value($post['id']);
        },
        'schema' => [
            'description' => 'Custom computed field',
            'type'        => 'string',
        ],
    ]);
});
```

## Error Handling Pattern

```tsx
const [items, setItems] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);

useEffect(() => {
    fetch(BASE_URL + "/wp-json/wp/v2/items")
        .then((response) => {
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            return response.json();
        })
        .then((data) => {
            setItems(data);
            setLoading(false);
        })
        .catch((err) => {
            setError(err.message);
            setLoading(false);
        });
}, []);
```

**Current project note**: The existing Providers use then/catch without explicit error handling. This is fine for current usage but add error state handling when building new Providers.

## Best Practices

- ✅ Fetch data in Context Provider (not in individual components)
- ✅ Load all data on mount, filter client-side with `useMemo`
- ✅ Use `per_page=100` (or higher) to get all items in one request
- ✅ Use `_embed` to include featured images and other linked data
- ✅ Use URL parameters for shareable filter state
- ✅ Handle loading state (show loader/spinner)
- ✅ Handle empty state (show "no results" message)
- ❌ Don't fetch in every component (duplicate requests)
- ❌ Don't fetch on every render (missing `[]` dep in useEffect)
- ❌ Don't hardcode API URLs (use `BASE_URL` from consts.ts)
- ❌ Don't forget `show_in_rest` on new CPTs/taxonomies/ACF fields
