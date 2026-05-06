# ADR-002 — Use @dnd-kit/core for Drag-and-Drop Interactions

**Date:** 2026-05-05  
**Status:** `Partially Implemented`  
**Deciders:** Engineering team

> **Snapshot note — 2026-05-05:**
> Captured mid-implementation. STORY-002.01 (install library, basic draggable cards) and
> STORY-002.02 (move tasks between columns) are complete. STORY-002.03 (drop-zone
> highlighting), STORY-002.04 (snap-back on invalid drop), STORY-002.05 (intra-column
> reordering via `useSortable`), and STORY-002.06 (touch device support) are still
> pending. The `KeyboardSensor` / custom keyboard-shortcut conflict noted in Consequences
> has not yet been resolved — deferred to EPIC-003 work.

---

## Context

The Task Board requires drag-and-drop functionality so that users can move task cards between columns and reorder tasks within a column using both mouse and touch input (FR-04, FR-10). The implementation must integrate cleanly with React 18, support touch devices, deliver smooth frame rendering at ≥ 30 fps with 200 tasks on screen, and keep the production bundle small to meet the Lighthouse Performance score ≥ 90 target. A DnD approach must be chosen before EPIC-002 work begins.

---

## Decision

We will use `@dnd-kit/core` and `@dnd-kit/sortable` as the drag-and-drop library, configured with both `PointerSensor` and `TouchSensor` to support mouse, trackpad, and touch interactions.

---

## Consequences

### Positive
- `@dnd-kit` is built specifically for React 18 and uses a hook-based API (`useDraggable`, `useDroppable`, `useSortable`) that composes cleanly with existing functional components.
- Supports `PointerSensor` and `TouchSensor` natively; touch activation delay is configurable to avoid conflicts with native scroll gestures.
- Accessibility-first design: provides `KeyboardSensor` and ARIA announcements out of the box, which supports EPIC-003's keyboard navigation requirements.
- Actively maintained with strong TypeScript support and no jQuery or legacy DOM dependencies.
- Tree-shakable; the production bundle only includes the sensors and strategies actually imported.

### Negative
- Adds two production dependencies (`@dnd-kit/core`, `@dnd-kit/sortable`) to the bundle; combined gzipped weight is approximately 10–12 kB, which must be accounted for in the Lighthouse budget.
- More complex API surface than native HTML5 DnD for simple use cases; requires wrapping the board in a `DndContext` provider and every draggable in a `useDraggable`/`useSortable` hook.
- `@dnd-kit`'s `KeyboardSensor` default keybindings (Space/Enter to lift, arrow keys to move) may conflict with the custom `←`/`→` column-move shortcuts defined in EPIC-003; the two implementations must be coordinated or the `KeyboardSensor` must be omitted in favour of the custom handlers.

### Neutral / Trade-offs
- The switch from `useDraggable` (inter-column moves) to `useSortable` (intra-column reordering) requires refactoring `TaskCard.tsx` when US-002.05 is picked up; this is a planned, minor refactor with no data-model impact.
- The chosen library abstracts pointer/touch normalisation; if the library is ever removed, the custom sensor abstraction means the replacement surface is limited to `DndContext`, `useDraggable`/`useSortable` call sites.

---

## Alternatives Considered

| Option | Pros | Cons | Reason Rejected |
|--------|------|------|-----------------|
| **Native HTML5 Drag and Drop API** | Zero dependencies; no bundle weight added | No touch support (touch devices require separate `touchstart`/`touchmove`/`touchend` handlers); poor cross-browser consistency for drag images; no accessible keyboard support; significantly more imperative code | Fails the touch-device requirement (FR-04, US-002.06) and would require duplicating ~the same complexity as a library |
| **react-beautiful-dnd (Atlassian)** | Mature, well-known library; opinionated API keeps implementation minimal | Officially in maintenance mode as of 2022 — no new features; known performance issues with large lists; React 18 Strict Mode compatibility problems; no pointer event support (uses legacy mouse/touch events) | Maintenance-mode status is a risk; React 18 compatibility issues make it unsuitable |
| **react-dnd** | Very flexible; powers many large-scale apps | Low-level API requires significant boilerplate; does not include touch support by default (needs `react-dnd-touch-backend`); two separate packages to maintain | Higher implementation cost than `@dnd-kit` for equivalent functionality; touch backend is separate |
| **Framer Motion drag** | Already in many React projects; good animation primitives | Not designed as a Kanban DnD solution; no concept of droppable zones or sortable lists; would require a large amount of custom logic on top | Not a DnD solution — it is an animation library that supports dragging, not column-based drop targeting |

---

## References

- [specs/prds/PRD-task-board-mvp.md](../prds/PRD-task-board-mvp.md) — FR-04, FR-10, NFR 5.4 (30 fps at 200 tasks)
- [specs/epics/EPIC-002-drag-and-drop-task-movement.md](../epics/EPIC-002-drag-and-drop-task-movement.md)
- [specs/epics/EPIC-003-keyboard-accessibility-and-navigation.md](../epics/EPIC-003-keyboard-accessibility-and-navigation.md)
- [specs/stories/STORY-002.01-install-dnd-library-draggable-cards.md](../stories/STORY-002.01-install-dnd-library-draggable-cards.md)
- [specs/stories/STORY-002.05-reorder-tasks-within-column.md](../stories/STORY-002.05-reorder-tasks-within-column.md)
- [specs/stories/STORY-002.06-touch-device-drag-and-drop.md](../stories/STORY-002.06-touch-device-drag-and-drop.md)
- [specs/stories/STORY-004.05-profile-and-fix-drag-frame-rate.md](../stories/STORY-004.05-profile-and-fix-drag-frame-rate.md)
