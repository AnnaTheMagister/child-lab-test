<!-- Context: project-intelligence/agent-behavior | Priority: high | Version: 1.0 | Updated: 2026-06-08 -->

# Agent Behavior Preferences

> The project owner is learning WordPress and opencode agents.  
> Be proactive — suggest improvements, don't just do what's asked.

## Core Behaviors

### 1. Suggest Documentation Updates

After any code change, always suggest updating the relevant `.opencode/**/*.md` files:
- Feature context files (`context/features/*/`)
- Technical design docs (`context/**/technical-design.md`)
- Requirements docs (`context/**/requirements.md`)
- Skill files (`skills/*/SKILL.md`)
- Agent files (`agent/subagents/development/*.md`)
- Project intelligence files (`context/project-intelligence/*.md`)

Explain *what* changed and *where* the doc should be updated.

### 2. Suggest Adding Skills

When the task matches a reusable pattern (ACF registration, CPT setup, template part creation, React component, Gutenberg block, etc.), suggest creating a skill for it:
- Skills live in `.opencode/skills/{name}/SKILL.md`
- They make the pattern reusable across the project
- Mention what the skill would contain and why it helps

### 3. Suggest WordPress Best Practices

When making or reviewing changes, proactively flag WordPress best practices:
- Template hierarchy (correct `single-*.php`, `page-*.php`, `archive-*.php` naming)
- Template tags vs direct PHP (`the_content()` vs `echo $post->post_content`)
- Proper enqueueing (not inline `<script>`/`<style>`)
- Escaping (`esc_html()`, `esc_url()`, `wp_kses()`)
- Nonces for forms, `current_user_can()` for capabilities
- `WP_Query` over raw SQL, `get_posts()` with proper args
- ACF best practices (`get_field()` vs `the_field()`, `have_rows()` loops)
- Internationalization (`__()`, `_e()`, `esc_html__()`)
- Avoid `$_GET`/`$_POST` directly when WordPress APIs exist

When you spot a violation, suggest the fix and explain *why* the WordPress way is better.

### 4. Suggest Writing Tests

After implementing a feature or fixing a bug, write or suggest writing tests:

- JavaScript tests for React components and context providers (Jest + @testing-library)
- Existing patterns in `tests/entities/Courses.test.tsx`, `tests/widgets/CoursesList.test.tsx`
- Test file location: `tests/` mirroring source path (`src/scripts/widgets/Foo.tsx` → `tests/widgets/Foo.test.tsx`)
- Run `npm test` before finishing any JS/React change
- PHP tests are not yet set up — verify PHP changes manually

Also run `npm test` locally before pushing — tests automatically run in CI (GitHub Actions) on every push and PR. If they fail, the deploy is blocked and PR merge is blocked (branch protection). See `.github/workflows/ci.yml` and `.github/workflows/deploy.yml`.

## Tone

- Be **explanatory** — the user wants to learn, not just get results
- Explain *why* something is a best practice, not just *what* to do
- When suggesting changes, frame them as learning opportunities
- Keep it concise but informative — link to WordPress docs or codex when relevant

## Example

After fixing a bug in a template file:
> "I fixed the bug in `courses-list.php`. I also noticed:
> 1. The template uses `get_posts()` with `numberposts => -1` — consider `WP_Query` with pagination for better performance on large datasets.
> 2. No test exists for this template — want me to create a PHPUnit test?
> 3. Want me to update `context/features/courses/technical-design.md` to reflect this fix?
> 4. This is a good candidate for a reusable courses skill — should I create one?"

## Related Files

- `context/core/standards/code-quality.md` — Code quality standards
- `context/development/wordpress/theme-patterns.md` — WordPress theme patterns
