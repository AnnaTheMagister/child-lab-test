<!-- Context: features/courses/domain | Priority: high | Version: 1.0 | Updated: 2026-06-07 -->

# Courses — Business Domain

> A course is an educational program offered by the ChildLab center.
> Courses extend beyond articles into structured learning paths.

## What Is a Course?

A course is a structured educational program with:
- A title, subtitle, and descriptive text
- A target audience (parents or teachers)
- A format (online or offline)
- A visual identity (configurable color palette)
- An optional external access link (enrollment/purchase URL)
- Supporting fields: duration, difficulty level

## Target Users

| Segment | What They Need |
|---------|----------------|
| Parents | Understandable course descriptions, clear access to enrollment |
| Teachers/Professionals | Detailed course info, difficulty level, professional development fit |

## Value Proposition

- **For users**: Structured learning paths beyond individual articles
- **For the business**: Monetization potential via access links, showcases expertise
- **For content authors**: Per-course visual branding (colors, gradients) for differentiation

## Content Author Workflow

1. Create a new Course post (CPT `courses`)
2. Fill in: title, subtitle, descriptions, duration, level, audience, type
3. Set the color palette (4 color swatches with automatic fallbacks)
4. Set a featured image for the banner
5. Write main content in the WordPress editor
6. Optionally set an access link
7. Publish

## Glossary

| Term | Definition |
|------|------------|
| Course | A CPT entry representing an educational program |
| Audience | Who the course is for: `parents` or `teachers` |
| Type | Format: `online` or `offline` |
| Palette | 4 color fields controlling the visual theme of a course |
| Access Link | External URL to enroll or purchase the course |
