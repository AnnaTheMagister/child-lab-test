<!-- Context: project-intelligence/business | Priority: high | Version: 1.0 | Updated: 2026-05-26 -->

# Business Domain

> Educational website for a child neuropsychology center. Russian-language content serving parents and professionals.

## Quick Reference

- **Purpose**: Understand why this project exists
- **Update When**: Business direction changes, new features shipped, pivot
- **Audience**: Developers needing context, stakeholders, product team

## Project Identity

```
Project Name: ChildLab — Центр детской нейропсихологии
Tagline: Научно обоснованные материалы по детской нейропсихологии и развитию
Problem Statement: Родителям и специалистам нужны доступные, научно обоснованные
                  материалы по детской нейропсихологии, но существующие ресурсы
                  либо слишком академичны, либо недостаточно достоверны.
Solution: Веб-сайт с многоформатными статьями (для родителей и учёных),
          методологическим деревом, курсами и проектами.
```

## Target Users

| User Segment | Who They Are | What They Need | Pain Points |
|--------------|--------------|----------------|-------------|
| Parents (Родители) | Parents of children with neurodevelopmental needs | Understandable explanations, practical advice, accessible language | Scientific articles are too dense; pop psychology lacks evidence |
| Scientists/Professionals (Специалисты) | Psychologists, educators, researchers | Detailed scientific content, methodology references, professional resources | Too much time filtering through non-scientific content |
| Both | Russian-speaking, located in Russia or abroad | Content in Russian, culturally relevant, professionally translated resources | Need content tailored to different expertise levels |

## Value Proposition

**For Users**:
- Multi-modal reading: same article at different depth levels (parent short/long, scientist short/long)
- Methodology tree: visual navigation of interconnected neuropsychology topics
- Curated courses and projects: structured learning paths
- Russian-language scientific content: rare combination of rigor and accessibility

**For Business**:
- Establishes the center as the authoritative online resource
- Drives engagement through multi-format content (articles, courses, projects)
- Showcases team expertise via structured author profiles

## Success Metrics

| Metric | Definition | Target | Current |
|--------|------------|--------|---------|
| Content Coverage | Articles across methodology tags | Full coverage per tag | Growing |
| Reading Engagement | Time spent, mode switching | — | — |
| Course Completion | Users completing course content | — | — |

## Business Model (if applicable)

```
Revenue Model: Non-profit / educational (center services)
Pricing Strategy: Content is free, courses/services may have associated costs
Market Position: Specialized Russian-language child neuropsychology resource
```

## Key Stakeholders

| Role | Responsibility |
|------|----------------|
| Site Owner / Product Owner | AnnaTheMagister — overall vision, content strategy, feature priorities |
| Content Team | Creating articles in multiple reading modes |
| Development | Theme development, React widgets, integration |

## Roadmap Context

**Current Focus**: Course system (CHI-93) — course CPT, field registration, course page templates, course catalog
**Next Milestone**: Methodology tree enhancements, team/projects pages
**Long-term Vision**: Comprehensive educational platform with interactive methodology tools, course ecosystem, and community features

**Recent Technical Work**:
- ✓ OAC agent system installation (raw installation)
- ✓ ACF field organization refactoring
- ✓ Course post type and taxonomy registration
- ✓ Methodology tag visualization (d3-force graph, SVG patterns)
- ✓ Reading modes (parent/scientist × short/long)
- ✓ Multi-language support foundation (POT/PO/MO files)

**Feature history (from git: CHI-* branches)**:
- CHI-93: Courses feature — templates, registration, fields
- CHI-86: Methodology updates — tag scaling, positioning, translations

## Business Constraints

- Russian primary language: all UI labels, admin labels, and content in Russian
- ACF Pro dependency: all content modeling relies on ACF
- Dual audience: every article must exist in 4 reading mode variants (or gracefully degrade)
- Scientific accuracy: content must be evidence-based (parent mode simplifies without distorting)

## Onboarding Checklist

- [ ] Understand the problem statement: bridging scientific and parent-friendly content
- [ ] Identify target users: parents and scientists, both Russian-speaking
- [ ] Know the key value proposition: multi-mode articles, methodology tree, courses
- [ ] Understand the dual-audience content strategy
- [ ] Know current focus is courses (CHI-93 feature)
- [ ] Understand content is primarily Russian with English translations

## Related Files

- `technical-domain.md` — How this business need is solved technically
- `business-tech-bridge.md` — Mapping between business and technical
- `decisions-log.md` — Business decisions with context
