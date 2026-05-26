<!-- Context: project-intelligence/technical | Priority: high | Version: 1.0 | Updated: 2026-05-26 -->

# Technical Domain

> WordPress theme for a child neuropsychology educational website. PHP backend with React-driven frontend widgets.

## Quick Reference

- **Purpose**: Understand how the project works technically
- **Update When**: New features, refactoring, tech stack changes
- **Audience**: Developers, DevOps, technical stakeholders

## Primary Stack

| Layer | Technology | Version | Rationale |
|-------|-----------|---------|-----------|
| CMS | WordPress | 6.x | Content management, REST API, user management, localization |
| Backend Language | PHP | 8.x | WordPress ecosystem, ACF Pro integration |
| Frontend Framework | React | 19.x | Interactive UI widgets, component reusability |
| Frontend Language | TypeScript | ~5.x | Type safety for complex React components |
| Build Tooling | @wordpress/scripts (wp-scripts) | 27.x | Standardized WP React build pipeline (Webpack-based) |
| Custom Fields | Advanced Custom Fields (ACF) | Pro | Flexible content modeling without custom tables |
| Styling | SCSS | — | Pre-processed CSS via wp-scripts build pipeline |
| Data Protocol | WordPress REST API | v2 | Decoupled data fetching for React components |
| Localization | WordPress i18n (text domain) | `childlab` | Russian primary, English secondary |
| Dev Server | BrowserSync | 3.x | Live reload during theme development |

## Architecture Pattern

```
Type: Traditional WordPress Theme with React Islands
Pattern: PHP-rendered shell with React-mounted interactive widgets
```

### Why This Architecture?

The site serves educational content (articles, courses) about child neuropsychology. Static content is rendered via standard WordPress template hierarchy (PHP). Interactive features — article filtering by methodology tags, visual methodology tree/graph, front-page tag menu — are built as React "islands" mounted on specific DOM containers (`#methodology-tags-menu`, `#articles-list-component`, `#methodology-tree-component`).

This hybrid approach was chosen because:
- WordPress handles content management, routing, authentication, i18n, and SEO out of the box
- React handles complex interactive UI (dynamic tag filtering, force-directed graphs) that would be cumbersome in vanilla PHP/JS
- No need for a full headless setup — the site benefits from WordPress's native rendering

## Project Structure

```
child-lab-test/                          # Theme root
├── functions.php                        # Theme bootstrap: asset loading, support declarations
├── style.css                            # WordPress theme identification header
├── front-page.php                       # Homepage with React widget mounting points
├── page-courses.php                     # Courses listing template
├── page-methodology.php                 # Methodology overview template
├── page-projects.php                    # Projects listing template
├── page-team.php                        # Team members template
├── single-courses.php                   # Single course template
├── taxonomy-article_author.php          # Author taxonomy archive template
├── taxonomy-methodology_tag.php         # Methodology tag archive template
├── index.php                            # Fallback template
├── header.php / footer.php              # Global shell
│
├── inc/                                 # PHP includes (modular backend)
│   ├── common.php                       # Shared utility functions
│   ├── article-data.php                 # Reading mode content display logic
│   ├── article-navigation.php           # Related articles by tags
│   ├── articles-list.php                # Article listing by taxonomy
│   ├── author-data.php                  # Author name/image helpers
│   ├── courses-language.php             # Course text domain setup
│   ├── reading-mode-support.php         # Session-based reading mode switching
│   ├── lib/
│   │   └── addColors.php               # HEX color blending utility
│   ├── acf/                             # ACF field registrations
│   │   ├── helpers.php                  # AJAX handlers, REST API field exposure
│   │   ├── register-acf-fields.php      # Field group loader
│   │   ├── register-article-fields.php  # Article + Projects CPT + taxonomies + fields
│   │   ├── register-course-fields.php   # Courses CPT + taxonomies + fields
│   │   └── field-groups/
│   │       ├── article-fields.php       # Article ACF field group definition
│   │       └── course-fields.php        # Course ACF field group definition
│   ├── toc/                             # Table of Contents generator
│   │   ├── toc-support.php             # Heading extraction + TOC generation
│   │   ├── toc.js                      # Client-side TOC interactivity
│   │   └── toc.css                     # TOC styles
│   ├── mindmap/                         # Methodology tag graph visualization
│   │   ├── mindmap-support.php         # Asset enqueue
│   │   ├── tag-graph.js                # d3-force graph of methodology tags
│   │   └── scripts.js                  # Mindmap UI interactivity
│   └── svg-pattern-generator/           # SVG background pattern system
│       ├── svg-pattern-support.php     # Asset enqueue
│       ├── scripts.js                  # SVG generation client-side
│       └── styles.css                  # Pattern container styles
│
├── src/                                 # React / TypeScript source
│   ├── index.js                         # Entry point: imports styles + mounts React widgets
│   ├── styles/
│   │   ├── variables.scss               # Design tokens (colors, spacing, breakpoints)
│   │   ├── mixins.scss                  # Reusable SCSS mixins
│   │   ├── main.scss                    # Global styles
│   │   ├── grid-system.scss             # Layout grid utilities
│   │   └── header.scss                  # Header-specific styles
│   └── scripts/
│       ├── ArticleReader.js             # Reading mode UI component
│       ├── ExampleReactComponent.js     # Reference component
│       ├── shared/
│       │   ├── consts.ts                # API base URLs, media URL helpers
│       │   ├── useCurrentSearch.ts      # URL search param hook
│       │   └── switcher.js              # UI toggle component
│       ├── entities/
│       │   ├── Articles.tsx             # Article Context Provider + useArticles hook
│       │   └── MethodologyTags.tsx      # Methodology Tag types, helpers, Context Provider
│       └── widgets/
│           ├── index.ts                 # Public exports
│           ├── FrontListComponent/
│           │   ├── FrontListComponent.tsx    # Front page tag menu widget
│           │   ├── MethodologyTagsList.tsx   # Tag list sub-component
│           │   └── distributeTags.ts         # Tag distribution logic
│           ├── ArticlesList/
│           │   └── ArticlesList.tsx          # Articles listing widget
│           ├── MethodologyTree/
│           │   ├── MethodologyTreeComponent.tsx  # Tree visualization widget
│           │   ├── TagsGraph.ts                 # d3-force graph logic
│           │   └── graphConfig.ts               # Graph layout config
│           └── Loader/                          # Loading state components
│
├── build/                                # Compiled output (wp-scripts)
│   ├── index.js / index.asset.php
│   └── index.css / index-rtl.css
│
├── assets/                               # Static assets
│   ├── images/                           # Images, SVG patterns
│   ├── styles/                           # Standalone CSS files
│   │   ├── variables.css
│   │   ├── common.css
│   │   ├── header.css
│   │   ├── article-card.css
│   │   ├── single-article.css
│   │   ├── team.css
│   │   ├── projects.css
│   │   ├── course-single.css
│   │   ├── methodology-tags.css
│   │   └── switchers.css
│   └── scripts/
│       └── header.js                     # React-rendered header
│
├── template-parts/                       # Reusable PHP template partials
│   ├── global/header.php                 # Site header template
│   ├── global/footer.php                 # Site footer template
│   ├── article/                          # Article-specific partials
│   │   ├── header.php
│   │   ├── footer.php
│   │   ├── mode-content.php
│   │   ├── mode-toggler.php
│   │   └── toc.php
│   ├── courses/                          # Course partials
│   ├── course/                           # Single course partials
│   ├── articles-list/                    # Article listing partials
│   ├── methodology/                      # Methodology page partials
│   ├── projects/                         # Projects page partials
│   └── team/                             # Team page partials
│
├── blocks/testimonial/                   # Custom WordPress block (testimonial)
├── language/                             # Translation files
│   ├── childlab.pot                      # POT template
│   ├── en_US.po / en_US.mo              # English translations
│   └── js/                               # JavaScript translation files
├── node_modules/                         # npm dependencies
├── package.json                          # npm scripts (build, start, sync, preview)
├── install.sh                            # OpenAgentsControl installer (OAC)
└── README.md
```

## Custom Post Types & Taxonomies

| Name | Slug | REST Base | Purpose |
|------|------|-----------|---------|
| **Articles** | `article` | `/wp/v2/articles` | Educational articles with multi-mode content |
| **Courses** | `courses` | `/wp/v2/courses` | Online course listings |
| **Projects** | `projects` | `/wp/v2/projects` | Research/educational projects |
| **Methodology Tags** | `methodology_tag` | `/wp/v2/methodology-tags` | Topic classification for articles (with ACF: color, SVG pattern, order) |
| **Article Authors** | `article_author` | `/wp/v2/article-authors` | Author profiles (with ACF: names, photo, bio) |
| **Course Audience** | `course_audience` | — | Audience targeting for courses |
| **Course Type** | `course_type` | — | Course category classification |

## Key Technical Decisions

| Decision | Rationale | Impact |
|----------|-----------|--------|
| React via `@wordpress/scripts` | Standardized WP React toolchain, automatic block support, WP coding standards | Build pipeline managed by WP core team |
| ACF for field management | Flexible content schemas without DB migrations, WP admin UI included | ACF Pro dependency, but enables rapid content modeling |
| Session-based reading modes | Persists user preference across page views without URL clutter | Requires PHP sessions; switch triggers redirect to clean URL |
| REST API for React data | Decouples frontend widgets from PHP template logic | Additional HTTP requests on page load |
| Dual field registration (direct + hook) | Ensures fields always load regardless of ACF init order | Code duplication risk |

See `decisions-log.md` for full decision history with alternatives.

## Integration Points

| System | Purpose | Protocol | Direction |
|--------|---------|----------|-----------|
| WordPress REST API | Article/tag/course data for React | REST (JSON) | Inbound (client-side fetch) |
| WordPress REST API (ACF) | Custom field exposure | REST (JSON) | Inbound (`show_in_rest: true` per field) |
| AJAX Admin | Methodology tag & author data | WP AJAX | Inbound (legacy, being replaced by REST) |
| Google Fonts (Lora) | Typography | HTTP | Outbound |

## Technical Constraints

| Constraint | Origin | Impact |
|------------|--------|--------|
| ACF Pro dependency | Business (content modeling) | All custom fields managed through ACF; plugin must be installed |
| WordPress version compatibility | Platform | Must maintain compatibility with WP REST API standards |
| Session-based state | Technical choice (reading mode) | Requires session_start(); potential scaling consideration |
| Russian content primary | Business (target audience) | i18n via text domain `childlab`; English as secondary language |

## Development Environment

```
Setup: npm install
Requirements: Node.js 18+, PHP 8+, WordPress 6+, ACF Pro plugin
Local Dev: npm run start        # wp-scripts start (watch mode)
            npm run build       # wp-scripts build (production)
            npm run sync        # BrowserSync with local WP URL
            npm run preview     # npm-run-all --parallel sync start
Dev URL: boilerplate-2024.local (configurable in package.json)
Testing: Not yet configured
```

## Deployment

```
Environment: Production (WordPress)
Platform: Standard WordPress host with PHP 8+
CI/CD: Not configured (git-based manual/auto-deploy)
Monitoring: Not configured
```

## Onboarding Checklist

- [ ] Know the primary tech stack: WordPress, PHP, React 19, TypeScript, SCSS, ACF
- [ ] Understand the hybrid architecture: PHP-rendered shell + React widget islands
- [ ] Know the custom post types: article, courses, projects and their fields
- [ ] Know the taxonomies: methodology_tag, article_author, course_audience, course_type
- [ ] Understand the reading modes system (parent/scientist × short/long)
- [ ] Know where React widgets mount (DOM containers in PHP templates)
- [ ] Be able to set up local dev environment (npm install + npm run start)
- [ ] Understand the Context Provider pattern for state management
- [ ] Know the ACF field registration approach (acf_add_local_field_group)
- [ ] Understand the i18n setup (text domain `childlab`, language/ directory)

## Related Files

- `business-domain.md` — Why this technical foundation exists
- `business-tech-bridge.md` — How business needs map to technical solutions
- `decisions-log.md` — Full decision history with context
