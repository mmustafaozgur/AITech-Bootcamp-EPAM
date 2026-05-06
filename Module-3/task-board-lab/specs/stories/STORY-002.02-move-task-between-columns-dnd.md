# User Story: Move a Task to a Different Column via Drag-and-Drop

**Story ID:** US-002.02  
**Epic:** EPIC-002 — Drag-and-Drop Task Movement  
**Status:** Draft  
**Assignee:** TBD  
**Sprint / Iteration:** TBD  
**Created:** 2026-05-05  
**Last Updated:** 2026-05-05

---

## 1. User Story

> **As a** Alex (Senior Freelance Developer),  
> **I want to** drag a task card from one column and drop it into another,  
> **so that** I can update a task's status in a single fluid gesture without opening any form.

---

## 2. Acceptance Criteria

- **AC-01:**  
  Given a task is in the "To Do" column,  
  When I drag it and drop it onto the "In Progress" column,  
  Then the card appears in "In Progress", the task's `status` field is set to `'in-progress'`, and `taskboard:tasks` in `localStorage` reflects the change.

- **AC-02:**  
  Given a task is in the "In Progress" column,  
  When I drag it and drop it back onto the "In Progress" column (same column),  
  Then the card stays in "In Progress" and no unnecessary `localStorage` write occurs.

- **AC-03:**  
  Given a task has been moved to the "Done" column via drag-and-drop,  
  When I reload the page,  
  Then the task appears in the "Done" column.

- **AC-04:**  
  Given I drop a task card outside any valid column drop zone,  
  When the drag ends,  
  Then the card returns to its original column and `localStorage` is not modified.

---

## 3. Technical Notes

- Add `useDroppable({ id: column.status })` to each `KanbanColumn.tsx`.
- Implement `onDragEnd` in `DndContext` inside `KanbanBoard.tsx`:
  - If `event.over` is `null` or `event.over.id === sourceColumnId`, do nothing.
  - Otherwise, call `useTaskStore`'s `moveTask(id: string, newStatus: TaskStatus)` and `saveToStorage`.
- `moveTask` updates the task's `status` in the state array and calls `saveToStorage`.
- localStorage key: `taskboard:tasks`.
- The `order` field of moved tasks should be set to `maxOrderInTargetColumn + 1` to append to the bottom of the target column.

---

## 4. Estimation

| Field            | Value                                                                                   |
|------------------|-----------------------------------------------------------------------------------------|
| **Story Points** | 3                                                                                       |
| **Alt. (Days)**  | 1.5 days                                                                                |
| **Confidence**   | High                                                                                    |
| **Sizing Notes** | Drop zone registration + `onDragEnd` handler + `moveTask` store action + integration test with localStorage assertion. |

---

## 5. Dependencies & Blockers

| ID / Reference | Description                                               | Status  |
|----------------|-----------------------------------------------------------|---------|
| US-002.01      | `DndContext` and `useDraggable` on cards must be in place | Pending |

---

## 6. INVEST Checklist

- [x] **I — Independent:** Depends only on US-002.01 which is the immediately prior story.
- [x] **N — Negotiable:** Drop animation style and `order` assignment strategy are flexible.
- [x] **V — Valuable:** Delivers the primary DnD capability — moving tasks between columns.
- [x] **E — Estimable:** Clear scope; `@dnd-kit` `onDragEnd` pattern is well-documented.
- [x] **S — Small:** Completable in 1.5 days.
- [x] **T — Testable:** All 4 ACs verifiable via pointer event simulation + `localStorage` assertion.

---

## 7. Notes & Discussion

| # | Note / Question                                              | Author              | Date       |
|---|--------------------------------------------------------------|---------------------|------------|
| 1 | AC-04 (snap-back for invalid drop) will be further polished with animation in US-002.04. | GitHub Copilot (AI) | 2026-05-05 |
