# ADR-003 — Use CSS Modules for Component Styling

**Date:** 2026-05-05  
**Status:** `Accepted`  
**Deciders:** Engineering team

---

## Context

The Task Board is a React 18 + Vite + TypeScript project. Every component requires scoped styles to avoid class-name collisions across the feature-scoped folder structure (`src/features/tasks/`, `src/components/`). The styling approach must work natively with Vite, require no additional runtime overhead, support the WCAG 2.1 AA focus-ring contrast requirements from EPIC-003, and be maintainable by a single developer without a large learning curve. The tech stack note in `agents.md` lists "CSS Modules / Tailwind / etc." as TBD and requires this decision to be made before component development begins.

---

## Decision

We will use CSS Modules (`.module.css` files, co-located with each component) as the styling strategy for all application components.

---

## Consequences

### Positive
- CSS Modules are natively supported by Vite with zero additional configuration; no extra packages are required.
- Class names are locally scoped by default, eliminating all risk of naming collisions across components — critical in a project with multiple feature folders.
- Standard CSS syntax means the full cascade, custom properties (CSS variables), pseudo-classes (`:focus-visible`, `:hover`), and media queries work without any special syntax.
- Zero runtime overhead — styles are extracted to static CSS at build time; no JavaScript is shipped for styling.
- Co-locating `ComponentName.module.css` next to `ComponentName.tsx` follows the project's file-organisation convention in `agents.md` exactly.

### Negative
- No built-in design system or utility classes — spacing, colour, and typography tokens must be defined manually, typically via CSS custom properties in a global `variables.css`.
- Sharing styles between components (e.g., a common focus-ring mixin) requires either CSS custom properties or importing a shared partial; no native `@apply` or composition shorthand as in Tailwind or CSS-in-JS.
- Dynamic styles based on JS state require toggling class names as strings (e.g., `styles.card + (isDragging ? ' ' + styles.cardDragging : '')`), which is less ergonomic than inline styles or CSS-in-JS `cx()` utilities.

### Neutral / Trade-offs
- The `clsx` utility can be added (zero-dependency, < 1 kB) to make conditional class name composition more readable if the string concatenation pattern becomes unwieldy.
- Vite's CSS Modules transform generates deterministic hashed class names in production builds, which is sufficient for this non-library project.
- Global styles (resets, CSS custom properties, font imports) remain in a single `src/index.css` file imported once in `main.tsx`.

---

## Alternatives Considered

| Option | Pros | Cons | Reason Rejected |
|--------|------|------|-----------------|
| **Tailwind CSS** | Utility-first; rapid prototyping; no separate CSS files; built-in design system | Adds ~3 kB of config; class names in JSX become verbose and harder to read for complex components; requires PostCSS configuration; purging setup needed for Vite | Adds tooling complexity for a single-developer project; verbose JSX reduces readability; CSS Modules achieves the same scoping with less setup |
| **Styled Components (CSS-in-JS)** | Co-located styles in JS; full dynamic theming; TypeScript-friendly API | Runtime performance overhead — styles are injected at runtime via a `<style>` tag; increases bundle size by ~15 kB; can negatively impact the Lighthouse Performance score target (≥ 90); React 18 concurrent mode compatibility requires the latest v6 | Runtime overhead is incompatible with the Lighthouse performance target; adds a non-trivial bundle weight |
| **Emotion (CSS-in-JS)** | Similar to Styled Components; slightly smaller; `css` template literal API | Same runtime overhead concerns as Styled Components; adds complexity without providing capabilities beyond CSS Modules for this project's scale | Same performance and bundle-size concerns as Styled Components; no meaningful advantage over CSS Modules |
| **Plain global CSS with BEM naming** | Zero tooling; no build step; maximum compatibility | No automated scoping — relies on developer discipline; BEM naming is verbose; class collisions across components are a real risk in a growing codebase | No automatic scoping is a maintenance liability; CSS Modules provides the same result with compiler-enforced guarantees |

---

## References

- [agents.md](../../agents.md) — File organisation conventions, CSS Module naming convention (`ComponentName.module.css`)
- [specs/prds/PRD-task-board-mvp.md](../prds/PRD-task-board-mvp.md) — NFR 5.5 (WCAG 2.1 AA focus ring contrast ≥ 3:1), NFR 5.1 (Lighthouse Performance ≥ 90)
- [specs/epics/EPIC-003-keyboard-accessibility-and-navigation.md](../epics/EPIC-003-keyboard-accessibility-and-navigation.md)
- [specs/stories/STORY-003.01-navigate-cards-with-keyboard.md](../stories/STORY-003.01-navigate-cards-with-keyboard.md)
