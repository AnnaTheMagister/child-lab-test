<!-- Context: development/navigation | Priority: critical | Version: 2.0 | Updated: 2026-05-26 -->

# Development Navigation — ChildLab WordPress Theme

**Purpose**: Development patterns for the WordPress + React codebase.

---

## Structure

```
development/
├── navigation.md
│
├── wordpress/                 # WordPress theme development (ACTIVE)
│   ├── navigation.md
│   ├── theme-patterns.md      # Asset loading, template hierarchy, bootstrap flow
│   ├── cpt-taxonomy.md        # CPT & taxonomy registration
│   ├── acf-registration.md    # ACF field group registration
│   └── rest-api-patterns.md   # REST API consumption from React
│
├── frontend/                  # Client-side React
│   ├── navigation.md
│   ├── when-to-delegate.md
│   └── react/
│       ├── navigation.md
│       └── react-patterns.md
│
├── principles/                # Universal (language-agnostic)
│   ├── navigation.md
│   ├── clean-code.md
│   └── api-design.md
│
├── frameworks/                # (future)
├── ai/                        # (future)
├── backend/                   # (future)
├── data/                      # (future)
├── integration/               # (future)
└── infrastructure/            # (future)
```

---

## Quick Routes

| Task | Path |
|------|------|
| **WordPress theme setup** | `wordpress/navigation.md` |
| **Add ACF fields** | `wordpress/acf-registration.md` |
| **Register a CPT/taxonomy** | `wordpress/cpt-taxonomy.md` |
| **Connect React to WP data** | `wordpress/rest-api-patterns.md` |
| **React widget patterns** | `frontend/react/react-patterns.md` |

---

## By Concern

**WordPress** → Theme bootstrap, CPTs, ACF, REST API — **active for this project**
**Frontend/React** → Component patterns, Context Providers, hooks
**Principles** → Clean code, API design patterns (universal)

---

## Related Context

- **Core Standards** → `../core/standards/navigation.md` (PHP + React coding conventions)
- **Project Intelligence (Tech)** → `../project-intelligence/technical-domain.md`
- **Project Intelligence (Features)** → `../project-intelligence/business-tech-bridge.md`
- **UI Patterns** → `../ui/navigation.md`
