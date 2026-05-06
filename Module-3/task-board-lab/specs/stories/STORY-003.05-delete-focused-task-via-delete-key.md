# User Story: Delete a Focused Task via the Delete Key

**Story ID:** US-003.05  
**Epic:** EPIC-003 — Keyboard Accessibility & Navigation  
**Status:** Draft  
**Assignee:** TBD  
**Sprint / Iteration:** TBD  
**Created:** 2026-05-05  
**Last Updated:** 2026-05-05

---

## 1. User Story

> **As a** Alex (Senior Freelance Developer),  
> **I want to** press the Delete key on a focused task card to trigger the deletion confirmation,  
> **so that** I can remove tasks without ever reaching for the mouse.

---

## 2. Acceptance Criteria

- **AC-01:**  
  Given a task card has focus,  
  When I press the Delete key,  
  Then the confirmation dialog opens with the message "Delete this task? This cannot be undone."

- **AC-02:**  
  Given the confirmation dialog is open after pressing Delete,  
  When I press Enter (or click Confirm),  
  Then the task is deleted from the board and from `taskboard:tasks` in `localStorage`, and focus moves to the next available card in the same column.

- **AC-03:**  
  Given the confirmation dialog is open,  
  When I press Escape (or click Cancel),  
  Then the dialog closes, the task remains on the board, and focus is returned to the task card.

- **AC-04:**  
  Given a task card is in edit mode (Title field is focused),  
  When I press the Delete key,  
  Then the Delete shortcut has no effect — the key behaves as a normal text-editing key.

---

## 3. Technical Notes

- Add a `keydown` handler for `Delete` on `TaskCard.tsx`; guard against firing when `event.target` is an `INPUT` or `TEXTAREA`.
- Reuse `ConfirmDialog.tsx` from US-001.05 — pass `onConfirm` and `onCancel` callbacks.
- Trap focus inside `ConfirmDialog` while it is open (use `aria-modal="true"` and focus the Confirm button on open).
- After confirmed deletion, call `useTaskStore`'s `deleteTask(id)`.
- After deletion, use `useRef` to focus the next sibling card in the column; if no next sibling, focus the previous sibling; if the column is now empty, focus the column header.

---

## 4. Estimation

| Field            | Value                                                                           |
|------------------|---------------------------------------------------------------------------------|
| **Story Points** | 1                                                                               |
| **Alt. (Days)**  | 0.5 days                                                                        |
| **Confidence**   | High                                                                            |
| **Sizing Notes** | `keydown` handler + reuse of existing `ConfirmDialog`; main work is post-deletion focus management. |

---

## 5. Dependencies & Blockers

| ID / Reference | Description                                              | Status  |
|----------------|----------------------------------------------------------|---------|
| US-003.01      | Task cards must be keyboard-focusable                   | Pending |
| US-001.05      | `ConfirmDialog.tsx` must exist                          | Pending |

---

## 6. INVEST Checklist

- [x] **I — Independent:** Depends on US-003.01 and US-001.05, both sequenced earlier.
- [x] **N — Negotiable:** Post-deletion focus target (next/previous/column header) is flexible.
- [x] **V — Valuable:** Completes the fully keyboard-operable delete workflow.
- [x] **E — Estimable:** Reuses existing dialog; no unknowns.
- [x] **S — Small:** Completable in half a day.
- [x] **T — Testable:** AC-01 to AC-04 verifiable via `userEvent.keyboard('{Delete}')` + dialog DOM assertions + `localStorage` check.

---

## 7. Notes & Discussion

| # | Note / Question                                                                      | Author              | Date       |
|---|--------------------------------------------------------------------------------------|---------------------|------------|
| 1 | On Mac, the `Delete` key is `Backspace` from the browser's perspective. Confirm whether `Backspace` should also trigger the delete shortcut, or only `Delete`. | GitHub Copilot (AI) | 2026-05-05 |
