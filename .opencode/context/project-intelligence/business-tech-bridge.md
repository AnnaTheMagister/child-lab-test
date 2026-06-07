<!-- Context: project-intelligence/bridge | Priority: high | Version: 1.0 | Updated: 2026-05-26 -->

# Business ↔ Tech Bridge

> How the ChildLab website's business needs translate to technical solutions.

## Quick Reference

- **Purpose**: Show stakeholders technical choices serve business goals
- **Purpose**: Show developers business constraints drive architecture
- **Update When**: New features, refactoring, business pivot

## Core Mapping

| Business Need | Technical Solution | Why This Mapping | Business Value |
|---------------|-------------------|------------------|----------------|
| Same article for parents AND scientists | ACF fields: `for_scientist_long`, `for_scientist_short`, `for_parent_long`, `for_parent_short` per article | Content authors enter 4 variants per article; `display_article_content()` switches by session mode | One article URL serves both audiences |
| Visual navigation of methodology topics | `methodology_tag` taxonomy + React d3-force graph (`TagsGraph.ts`) | Taxonomy provides structured data; force graph makes relationships intuitive | Users explore interconnected topics naturally |
| Filter articles by methodology topic | URL params (`?methodology=X`) + React Context (`Articles.tsx`) + REST API | URL-based filtering is shareable; Context provides real-time filtering | Users can deep-link to filtered article lists |
| Online course listings | Custom post type `courses` + custom taxonomies (`course_audience`, `course_type`) + ACF course fields | CPT handles structured course data; taxonomies enable filtering | Users find relevant courses by audience and type |
| Show team/professional credibility | `article_author` taxonomy with ACF (photo, bio, first/last name, info) | Taxonomy used beyond articles — also powers team page via `page-team.php` | Builds trust through transparent authorship |
| Visual differentiation of topics per tag | ACF fields on `methodology_tag`: `color` (HEX), `svg_pattern` (file), `order` (int) | Color + pattern = instant visual recognition; order controls display priority | Users recognize topics by visual cues |
| Reading preference persistence | PHP sessions (`$_SESSION['reading_mode']`) set via `?reading_mode=` param, stored during session | No login required; persists across pages within session | Fluid experience without forcing account creation |
| i18n for international audiences | WordPress text domain `childlab` + PO/MO files + JS translation files (`wp_set_script_translations`) | Standard WordPress i18n pipeline; JS translations for React | Foundation for multi-language support |
| Rich article content with minimal DB overhead | ACF fields with `show_in_rest: true` exposed via WP REST API | ACF handles field UI + storage; REST API delivers to React without custom endpoints | Content editors use familiar ACF interface; developers get structured API data |

## Feature Mapping

### Feature: Reading Modes

**Business Context**:
- User need: Parents want simple explanations; professionals want scientific detail
- Business goal: One article serves two audiences without duplication
- Priority: Core differentiator — this is the site's primary innovation

**Technical Implementation**:
- Solution: 4 ACF WYSIWYG/text fields per article (`for_scientist_long`, `for_scientist_short`, `for_parent_long`, `for_parent_short`)
- Display: `inc/article-data.php` — `display_article_content()` switches output based on `$_SESSION['reading_mode']`
- Switching: `template-parts/article/mode-toggler.php` — UI toggler calls `?reading_mode=`
- Fallback: If a field is empty, shows `the_content()` (standard WP editor)

**Connection**:
Without this system, the site would need separate articles for each audience, doubling content management and confusing navigation. The session-based approach means a single page URL serves both — the user's preference is remembered during their visit.

### Feature: Methodology Tree

**Business Context**:
- User need: Visual, intuitive exploration of how neuropsychology topics relate
- Business goal: Differentiate from text-only competitors; showcase content breadth
- Priority: High — signature feature

**Technical Implementation**:
- Solution: `methodology_tag` taxonomy + `TagsGraph.ts` (d3-force directed graph)
- Data: Tags fetched via REST API (`/wp/v2/methodology-tags`) with ACF fields (color, pattern, order)
- Rendering: `MethodologyTreeComponent.tsx` mounts on `#methodology-tree-component`
- ACF: Color per tag, SVG pattern per tag (for visual variety), order (for display priority)

**Connection**:
Taxonomies alone would give a standard tag cloud. The force-directed graph makes relationships visually apparent, helping users discover connected topics they might not have searched for textually.

### Feature: Article Filtering & Discovery

**Business Context**:
- User need: Find articles relevant to a specific methodology topic
- Business goal: Increase article discoverability and time-on-site
- Priority: High — main navigation mechanism

**Technical Implementation**:
- Solution: URL-based filtering (`?methodology={tag_id}`) + React Context + REST API
- Frontend: [`Articles.tsx`](Articles.tsx) Context Provider fetches all articles on mount, filters by `useCurrentSearch()` params
- API: `fetch(BASE_URL + "/wp-json/wp/v2/articles?per_page=100&_embed")`
- Filtering: `useMemo`-based client-side filtering by `methodology-tags` array intersection

**Connection**:
URL params mean filtered views are shareable. Client-side filtering after initial fetch means instant filter switching once loaded. The Context Provider makes filtered article lists available to any mounted React widget.

### Feature: Course System

**Business Context**:
- User need: Structured educational content beyond articles
- Business goal: Expand from reference content to formal learning paths
- Priority: Current active development (CHI-93)

**Technical Implementation**:
- Solution: Custom post type `courses` (register in `register-course-fields.php`)
- Taxonomies: `course_audience`, `course_type` for filtering
- ACF fields: course_description, course_short_description, course_link, course_audience, course_duration, etc.
- Templates: `single-courses.php` (single course), course banner template part, courses list template parts
- REST: `show_in_rest: true` for future React integration

**Connection**:
CPT provides structured course data beyond what posts/pages offer. Custom taxonomies enable course catalog browsing by audience (parents vs professionals) and type (workshops vs full courses).

### Feature: Team & Project Profiles

**Business Context**:
- User need: Know who writes the content, what qualifications they have
- Business goal: Establish authority and trust through transparent authorship
- Priority: Medium

**Technical Implementation**:
- Solution: `article_author` taxonomy with ACF fields (photo, bio, first_name, last_name, info)
- Team page: `page-team.php` renders from author taxonomy
- Author display: `author-data.php` — `get_article_author_name()`, `get_article_author_image()`
- REST: Custom field exposure via `register_rest_field()` in `acf/helpers.php`

**Connection**:
Using a taxonomy (instead of a CPT) for authors means they're natively linked to articles and queryable via WP_Query/tax_query. The team page reuses this data, showcasing both article authorship and team credentials in one system.

## Trade-off Decisions

| Situation | Business Priority | Technical Priority | Decision Made | Rationale |
|-----------|-------------------|-------------------|---------------|-----------|
| Content duplication vs architecture purity | Serve dual audience from one page | Avoid content duplication in DB | 4 ACF fields per article | Business value of "one URL, two depths" outweighs field complexity |
| Session vs JWT for reading mode | Zero-friction UX | Stateless architecture | PHP sessions (+$_GET for initial set) | Sessions enable preference without login; acceptable for content site |
| ACF vs native WP blocks | Rich content modeling | Performance & standards compliance | ACF for complex fields; wp-scripts for React | ACF productivity gain outweighs vendor lock-in risk |

## Common Misalignments

| Misalignment | Warning Signs | Resolution Approach |
|--------------|---------------|---------------------|
| Field registration timing | ACF fields not appearing because registered too early/late | Use both direct `acf_add_local_field_group()` and `acf/include_fields` hook |
| REST field exposure | React components not getting ACF data | Check `show_in_rest: true` on each field AND `register_rest_field()` for taxonomy terms |
| Session vs URL state | Reading mode reset or not persisting | Session handles persistence; URL param handles initial set and switching |

## Stakeholder Communication

**For Business Stakeholders**:
- Multi-mode reading: one article URL serves parents AND scientists — no content duplication
- Methodology tree: visual topic map makes content discoverable beyond search
- Taxonomy-driven architecture: authors, topics, audiences all structured for growth

**For Technical Stakeholders**:
- WordPress provides CMS, routing, auth, i18n — no need to reinvent
- React handles complex UI islands without a full SPA migration
- ACF enables rapid content modeling without custom DB schemas
- Session-based reading mode is pragmatic for a content site (no login required)

## Onboarding Checklist

- [ ] Understand the core business need: dual-audience scientific content
- [ ] See how reading modes serve both parents and scientists from one article
- [ ] Know how the methodology tree makes topics visually explorable
- [ ] Understand URL-based article filtering + Context Provider pattern
- [ ] Know the course system is the current active feature (CHI-93)
- [ ] See how author taxonomy powers both article attribution and team page

## Related Files

- `business-domain.md` — Business needs in detail
- `technical-domain.md` — Technical implementation in detail
- `decisions-log.md` — Decisions made with full context
- `living-notes.md` — Current open questions and issues
