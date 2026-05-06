# User Story: Reorder Tasks Within a Column via Drag-and-Drop

**Story ID:** US-002.05  
**Epic:** EPIC-002 — Drag-and-Drop Task Movement  
**Status:** Draft  
**Assignee:** TBD  
**Sprint / Iteration:** TBD  
**Created:** 2026-05-05  
**Last Updated:** 2026-05-05

---

## 1. User Story

> **As a** Alex (Senior Freelance Developer),  
> **I want to** drag task cards up or down within the same column,  
> **so that** I can prioritise my tasks visually without moving them to a different status.

---

## 2. Acceptance Criteria

- **AC-01:**  
  Given two tasks exist in the "To Do" column with Task A above Task B,  
  When I drag Task B above Task A and drop it,  
  Then Task B appears above Task A in the "To Do" column.

- **AC-02:**  
  Given I have reordered tasks within a column,  
  When I reload the page,  
  Then tasks appear in the same order they were left in — the new order is preserved in `taskboard:tasks`.

- **AC-03:**  
  Given I drag a task card within a column,  
  When I drop it at its current position (no positional change),  
  Then the column order is unchanged and no `localStorage` write occurs.

- **AC-04:**  
  Given I reorder a task within a column,  
  When I check `taskboard:tasks` in `localStorage`,  
  Then each task in that column has an updated `order` value reflecting the new sequence.

---

## 3. Technical Notes

- Use `@dnd-kit/sortable`'s `SortableContext` with `verticalListSortingStrategy` inside each `KanbanColumn.tsx`.
- Replace `useDraggable` on `TaskCard.tsx` with `useSortable` (which subsumes draggable + droppable within a sorted list).
- On `onDragEnd` in `DndContext`: if `event.active.id !== event.over?.id` and both are in the same column, call `arrayMove` from `@dnd-kit/sortable` and update `order` values accordingly.
- Persist updated `order` values by calling `saveToStorage` with the reordered task array.
- localStorage key: `taskboard:tasks`.
- Each task's `order` is an integer; after reorder, reassign sequential integers to all tasks in the affected column.

---

## 4. Estimation

| Field            | Value                                                                                    |
|------------------|------------------------------------------------------------------------------------------|
| **Story Points** | 3                                                                                        |
| **Alt. (Days)**  | 1.5 days                                                                                 |
| **Confidence**   | Medium                                                                                   |
| **Sizing Notes** | Switching from `useDraggable` to `useSortable` touches every `TaskCard`; requires updating `onDragEnd` logic to distinguish inter-column vs intra-column drops. |

---

## 5. Dependencies & Blockers

| ID / Reference | Description                                                          | Status  |
|----------------|----------------------------------------------------------------------|---------|
| US-002.02      | Column-to-column `onDragEnd` logic must exist before intra-column sorting can be layered in | Pending |

---

## 6. INVEST Checklist

- [x] **I — Independent:** Enhances existing DnD setup; no other stories block it.
- [x] **N — Negotiable:** `order` re-assignment strategy (integer sequence vs. fractional/LexoRank) is negotiable.
- [x] **V — Valuable:** Lets developers prioritise tasks within a column — a frequently requested workflow.
- [x] **E — Estimable:** `@dnd-kit/sortable` API is well-documented; moderate complexity.
- [x] **S — Small:** Completable in 1.5 days; sized at 3 points.
- [x] **T — Testable:** AC-01 to AC-04 verifiable via pointer event simulation + DOM order assertion + `localStorage` assertion.

---

## 7. Notes & Discussion

| # | Note / Question                                                                    | Author              | Date       |
|---|------------------------------------------------------------------------------------|---------------------|------------|
| 1 | Confirm column task cap (open question #2 in EPIC-002) before implementing to know if `arrayMove` performance is acceptable. | GitHub Copilot (AI) | 2026-05-05 |
