<!-- Context: core/navigation | Priority: critical | Version: 2.0 | Updated: 2026-05-26 -->

# Core Standards Navigation — ChildLab WordPress Theme

**Purpose**: Project-specific code quality, testing, and documentation standards.

---

## Files

| File | Topic | Priority | Load When |
|------|-------|----------|-----------|
| `code-quality.md` | PHP/WordPress + React/TypeScript code standards | ⭐⭐⭐⭐⭐ | Writing/reviewing any code |
| `test-coverage.md` | Testing standards (PHP + JS) | ⭐⭐⭐⭐⭐ | Writing tests, reviewing code |
| `documentation.md` | Documentation rules (PHP, React, context) | ⭐⭐⭐⭐ | Writing docs, adding comments |

---

## Loading Strategy

**For PHP / WordPress code**:
1. Load `code-quality.md` (critical) — has PHP section with WP-specific patterns
2. Then load: `../../project-intelligence/technical-domain.md` — for architecture context

**For React / TypeScript code**:
1. Load `code-quality.md` (critical) — has React/TS section with project patterns
2. Then load: `../../project-intelligence/technical-domain.md` — for component/data context

**For SCSS / styling**:
1. Load `code-quality.md` (high) — has SCSS section with naming conventions

**For testing**:
1. Load `test-coverage.md` (critical) — PHPUnit/Jest patterns, project-specific guidance
2. Then load: `code-quality.md` (high) — understand what you're testing

**For documentation / comments**:
1. Load `documentation.md` (critical) — PHPdoc/TSDoc patterns, context file guidance

**For code review**:
1. Load `code-quality.md` (critical) — check standards compliance
2. Load `test-coverage.md` (high) — check test coverage expectations
3. Then load: `../../project-intelligence/business-tech-bridge.md` (medium) — understand feature context

**For project onboarding/understanding**:
1. Load: `../../project-intelligence/navigation.md` — start with full project context
2. Then `technical-domain.md` — understand architecture
3. Then `business-domain.md` — understand purpose

---

## Related

- **Project Intelligence** → `../../project-intelligence/navigation.md` (start here for full project context)
- **Core Workflows** → `../workflows/navigation.md`
- **Development Context** → `../../development/navigation.md`
