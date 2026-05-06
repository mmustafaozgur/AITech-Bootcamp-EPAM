# User Story: Move a Focused Task via ← / → Keyboard Shortcut

**Story ID:** US-003.02  
**Epic:** EPIC-003 — Keyboard Accessibility & Navigation  
**Status:** Draft  
**Assignee:** TBD  
**Sprint / Iteration:** TBD  
**Created:** 2026-05-05  
**Last Updated:** 2026-05-05

---

## 1. User Story

> **As a** Alex (Senior Freelance Developer),  
> **I want to** press the left or right arrow key on a focused task card to move it to the adjacent column,  
> **so that** I can update task status at the speed of thought without touching the mouse.

---

## 2. Acceptance Criteria

- **AC-01:**  
  Given a task card in the "To Do" column has focus,  
  When I press the right arrow key (→),  
  Then the card moves to the "In Progress" column and its `status` in `taskboard:tasks` is updated to `'in-progress'`.

- **AC-02:**  
  Given a task card in the "Done" column has focus,  
  When I press the right arrow key (→),  
  Then nothing happens — the card stays in "Done" and no `localStorage` write occurs.

- **AC-03:**  
  Given a task card in the "To Do" column has focus,  
  When I press the left arrow key (←),  
  Then nothing happens — the card stays in "To Do" and no `localStorage` write occurs.

- **AC-04:**  
  Given a task has been moved via keyboard shortcut and the page is reloaded,  
  When the app mounts,  
  Then the task appears in its new column.

- **AC-05:**  
  Given a task card is moved to a new column via ← / →,  
  When the move completes,  
  Then focus follows the card to its new column position.

---

## 3. Technical Notes

- Attach a `keydown` handler on `TaskCard.tsx`; listen for `ArrowLeft` and `ArrowRight`.
- Guard: do not fire the handler when `event.target` is an `INPUT` or `TEXTAREA`.
- Column order: `todo` → `in-progress` → `done`.
- Call `useTaskStore`'s `moveTask(id, newStatus)` which also calls `saveToStorage`.
- After the state update, use `useEffect` to call `focus()` on the card's new DOM node via `useRef`.
- localStorage key: `taskboard:tasks`.

---

## 4. Estimation

| Field            | Value                                                                            |
|------------------|----------------------------------------------------------------------------------|
| **Story Points** | 2                                                                                |
| **Alt. (Days)**  | 1 day                                                                            |
| **Confidence**   | High                                                                             |
| **Sizing Notes** | `keydown` handler + `moveTask` reuse from EPIC-001 + focus management; no new logic needed. |

---

## 5. Dependencies & Blockers

| ID / Reference | Description                                                           | Status  |
|----------------|-----------------------------------------------------------------------|---------|
| US-003.01      | Task cards must have `tabIndex={0}` and be keyboard-focusable first   | Pending |

---

## 6. INVEST Checklist

- [x] **I — Independent:** Depends on US-003.01 for focusability; reuses `moveTask` from EPIC-001.
- [x] **N — Negotiable:** Key binding choice is flexible; outcome (adjacent column move) is fixed.
- [x] **V — Valuable:** Core keyboard workflow — directly addresses the keyboard shortcut adoption metric.
- [x] **E — Estimable:** Reuses existing store action; no unknowns.
- [x] **S — Small:** Completable in 1 day.
- [x] **T — Testable:** AC-01 to AC-05 verifiable via `userEvent.keyboard('{ArrowRight}')` + DOM position + `localStorage` assertions.

---

## 7. Notes & Discussion

| # | Note / Question                                                                   | Author              | Date       |
|---|-----------------------------------------------------------------------------------|---------------------|------------|
| 1 | Confirm: ← / → on cards should not conflict with `@dnd-kit`'s `KeyboardSensor` if enabled in EPIC-002 — coordinate with the DnD team. | GitHub Copilot (AI) | 2026-05-05 |
