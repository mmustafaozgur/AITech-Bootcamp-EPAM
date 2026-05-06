# User Story: Enter and Exit Task Edit Mode via E and Escape

**Story ID:** US-003.04  
**Epic:** EPIC-003 — Keyboard Accessibility & Navigation  
**Status:** Draft  
**Assignee:** TBD  
**Sprint / Iteration:** TBD  
**Created:** 2026-05-05  
**Last Updated:** 2026-05-05

---

## 1. User Story

> **As a** Alex (Senior Freelance Developer),  
> **I want to** press E on a focused task card to start editing it and Escape to cancel,  
> **so that** I can update task details entirely from the keyboard without reaching for the mouse.

---

## 2. Acceptance Criteria

- **AC-01:**  
  Given a task card has focus,  
  When I press the E key,  
  Then the card enters edit mode with the Title field focused and its existing text selected.

- **AC-02:**  
  Given the task card is in edit mode,  
  When I change the title to a non-empty value and press Enter,  
  Then the updated title is saved to `taskboard:tasks` in `localStorage` and the card exits edit mode, retaining keyboard focus.

- **AC-03:**  
  Given the task card is in edit mode,  
  When I press Escape,  
  Then the edit form closes, the title reverts to its original value, no `localStorage` write occurs, and focus is returned to the task card.

- **AC-04:**  
  Given a task card is being edited,  
  When I press E on a different task card,  
  Then the first edit form closes without saving and the second card enters edit mode.

---

## 3. Technical Notes

- Add a `keydown` handler for `e` / `E` on `TaskCard.tsx`; guard against firing inside an `INPUT` or `TEXTAREA`.
- On E keydown, set `isEditing = true` in local card state; on mount of `TaskForm`, call `titleInputRef.current?.select()` to focus and select all text.
- On Escape inside `TaskForm`, call `onCancel()` which resets `isEditing = false` and calls `taskCardRef.current?.focus()` to return focus.
- On save (Enter), call `useTaskStore`'s `updateTask` and then `taskCardRef.current?.focus()`.
- Only one card can be in `isEditing = true` at a time; `KanbanBoard.tsx` should track `editingTaskId` state to enforce this.
- Reuses `TaskForm.tsx` from US-001.06.

---

## 4. Estimation

| Field            | Value                                                                              |
|------------------|------------------------------------------------------------------------------------|
| **Story Points** | 1                                                                                  |
| **Alt. (Days)**  | 0.5 days                                                                           |
| **Confidence**   | High                                                                               |
| **Sizing Notes** | `keydown` handler + focus management; reuses existing `TaskForm`; no new logic needed. |

---

## 5. Dependencies & Blockers

| ID / Reference | Description                                              | Status  |
|----------------|----------------------------------------------------------|---------|
| US-003.01      | Task cards must be keyboard-focusable                   | Pending |
| US-001.06      | `TaskForm.tsx` in edit mode must exist                  | Pending |

---

## 6. INVEST Checklist

- [x] **I — Independent:** Depends on US-003.01 and US-001.06, both sequenced earlier.
- [x] **N — Negotiable:** The trigger key (E) is negotiable; outcome (enter/exit edit mode) is fixed.
- [x] **V — Valuable:** Closes the keyboard loop for editing — essential for mouse-free workflow.
- [x] **E — Estimable:** Reuses existing components; no unknowns.
- [x] **S — Small:** Completable in half a day.
- [x] **T — Testable:** AC-01 to AC-04 verifiable via `userEvent.keyboard('{E}')` + DOM state + `localStorage` assertions.

---

## 7. Notes & Discussion

| # | Note / Question                                                                   | Author              | Date       |
|---|-----------------------------------------------------------------------------------|---------------------|------------|
| 1 | AC-04 (closing an open edit form when E is pressed on a different card) is handled by tracking `editingTaskId` at the board level rather than per-card. | GitHub Copilot (AI) | 2026-05-05 |
