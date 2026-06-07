<!-- Context: project-intelligence/nav | Priority: high | Version: 1.0 | Updated: 2026-05-26 -->

# Project Intelligence — ChildLab WordPress Theme

> Start here for quick project understanding. These files bridge business and technical domains for the ChildLab child neuropsychology website.

## Structure

```
.opencode/context/project-intelligence/
├── navigation.md              # This file — quick overview
├── business-domain.md         # Business context: audience, value, roadmap
├── technical-domain.md        # Stack, architecture, project structure
├── business-tech-bridge.md    # How business needs map to solutions
├── decisions-log.md           # Major decisions with rationale
└── living-notes.md            # Active issues, debt, open questions
```

## Quick Routes

| What You Need | File | Description |
|---------------|------|-------------|
| Understand the "why" | `business-domain.md` | ChildLab project identity, users, value proposition |
| Understand the "how" | `technical-domain.md` | WP + React + ACF stack, architecture, CPTs, project map |
| See the connection | `business-tech-bridge.md` | Business → technical mapping for each feature |
| Know the context | `decisions-log.md` | Why React via wp-scripts, ACF, session modes, etc. |
| Current state | `living-notes.md` | Active projects (CHI-93 courses), tech debt, patterns |
| All of the above | Read all files in order | Full project intelligence |

## Usage

**New Developer / Agent**:
1. Start with `navigation.md` (this file)
2. Read all files in order for complete understanding
3. Follow onboarding checklists in each file

**Quick Reference**:
- Business focus → `business-domain.md`
- Technical focus → `technical-domain.md`
- Decision context → `decisions-log.md`

## Maintenance

Keep this folder current:
- Update when business direction changes
- Document decisions as they're made
- Review `living-notes.md` after significant work
- Archive resolved items from decisions-log.md and living-notes.md
