# User Story: Install DnD Library and Make Task Cards Draggable

**Story ID:** US-002.01  
**Epic:** EPIC-002 — Drag-and-Drop Task Movement  
**Status:** Draft  
**Assignee:** TBD  
**Sprint / Iteration:** TBD  
**Created:** 2026-05-05  
**Last Updated:** 2026-05-05

---

## 1. User Story

> **As a** Alex (Senior Freelance Developer),  
> **I want to** pick up a task card with my mouse,  
> **so that** I can begin moving it to reflect the current status of my work.

---

## 2. Acceptance Criteria

- **AC-01:**  
  Given the board is displayed with at least one task card,  
  When I click and hold a task card,  
  Then the card lifts visually (e.g., shadow increases, slight scale transform) indicating it is being dragged.

- **AC-02:**  
  Given I am actively dragging a task card,  
  When I move the cursor across the board,  
  Then a drag preview of the card follows my cursor position.

- **AC-03:**  
  Given I am dragging a task card,  
  When I release the mouse without reaching a valid drop target (no drop logic yet),  
  Then the card returns to its original position and column unchanged.

- **AC-04:**  
  Given the DnD library is configured,  
  When I inspect the board, Then the `KanbanBoard` is wrapped in a `DndContext` provider and each task card is wrapped with a draggable hook.

---

## 3. Technical Notes

- Install `@dnd-kit/core` and `@dnd-kit/sortable` as production dependencies.
- Wrap `KanbanBoard.tsx` with `<DndContext sensors={sensors}>` using both `PointerSensor` and `TouchSensor`.
- Each `TaskCard.tsx` uses `useDraggable({ id: task.id })` to get `attributes`, `listeners`, and `setNodeRef`.
- Apply drag styles via a CSS class (e.g., `taskCard--dragging`) using `transform: CSS.Translate.toString(transform)` from `@dnd-kit/utilities`.
- No `onDragEnd` handler yet — that is added in US-002.02.
- Drop zone logic (column `useDroppable`) is added in US-002.02; this story only enables lifting the card.

---

## 4. Estimation

| Field            | Value                                                                            |
|------------------|----------------------------------------------------------------------------------|
| **Story Points** | 2                                                                                |
| **Alt. (Days)**  | 1 day                                                                            |
| **Confidence**   | High                                                                             |
| **Sizing Notes** | Library installation + `DndContext` wiring + `useDraggable` on cards; no drop logic needed yet. |

---

## 5. Dependencies & Blockers

| ID / Reference | Description                                          | Status  |
|----------------|------------------------------------------------------|---------|
| US-001.01      | `KanbanBoard` and `TaskCard` components must exist   | Pending |

---

## 6. INVEST Checklist

- [x] **I — Independent:** Depends only on EPIC-001's completed board scaffold; fully separable.
- [x] **N — Negotiable:** Choice of DnD library or native API is negotiable (defaulting to `@dnd-kit`).
- [x] **V — Valuable:** Delivers the first half of the DnD interaction — users can see the card move.
- [x] **E — Estimable:** Well-documented library; clear scope.
- [x] **S — Small:** Completable in 1 day; no drop or persistence logic.
- [x] **T — Testable:** AC-01 and AC-02 are verifiable via Playwright/RTL pointer event simulation; AC-03 by checking card position; AC-04 by component tree inspection.

---

## 7. Notes & Discussion

| # | Note / Question                                                                       | Author              | Date       |
|---|---------------------------------------------------------------------------------------|---------------------|------------|
| 1 | Confirm `@dnd-kit/core` vs. native HTML5 DnD before starting — see EPIC-002 open question #1. | GitHub Copilot (AI) | 2026-05-05 |
