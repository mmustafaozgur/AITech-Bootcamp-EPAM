# User Story: Edit a Task's Title and Description In Place

**Story ID:** US-001.06  
**Epic:** EPIC-001 — Core Board & Task Management  
**Status:** Draft  
**Assignee:** TBD  
**Sprint / Iteration:** TBD  
**Created:** 2026-05-05  
**Last Updated:** 2026-05-05

---

## 1. User Story

> **As a** Alex (Senior Freelance Developer),  
> **I want to** edit a task's title and description after it has been created,  
> **so that** I can update work items as requirements change without deleting and recreating them.

---

## 2. Acceptance Criteria

- **AC-01:**  
  Given a task card is visible on the board,  
  When I double-click the card,  
  Then the card enters edit mode with the Title field focused and containing the existing title text.

- **AC-02:**  
  Given the task card is in edit mode,  
  When I change the title to a non-empty value and click Save,  
  Then the task card displays the new title and the updated value is written to `taskboard:tasks` in `localStorage`.

- **AC-03:**  
  Given the task card is in edit mode,  
  When I clear the Title field and click Save,  
  Then an inline error "Title is required" appears and no `localStorage` write occurs.

- **AC-04:**  
  Given the task card is in edit mode,  
  When I press Escape or click Cancel,  
  Then the edit form closes, the card displays its original title, and `localStorage` is not modified.

- **AC-05:**  
  Given a task's title has been updated and the page is reloaded,  
  When the app mounts,  
  Then the task card shows the updated title.

---

## 3. Technical Notes

- Reuse `TaskForm.tsx` in edit mode: pass the existing `task` object as an `initialValues` prop.
- On save, call `useTaskStore`'s `updateTask(id: string, changes: Partial<Task>)` action which merges changes and calls `saveToStorage`.
- Edit mode is triggered by a double-click (`onDoubleClick`) handler on the card body — not on the delete icon.
- The `TaskForm` edit variant should show an "Update" button (not "Save") to distinguish from creation — label copy is negotiable.
- Edge case: two tasks in edit mode at the same time is not supported; opening a second edit form should close the first without saving.

---

## 4. Estimation

| Field            | Value                                                                              |
|------------------|------------------------------------------------------------------------------------|
| **Story Points** | 2                                                                                  |
| **Alt. (Days)**  | 1 day                                                                              |
| **Confidence**   | High                                                                               |
| **Sizing Notes** | Reuses `TaskForm.tsx`; main work is `updateTask` action + edit mode state management in the card. |

---

## 5. Dependencies & Blockers

| ID / Reference | Description                                                     | Status  |
|----------------|-----------------------------------------------------------------|---------|
| US-001.04      | Task persistence must exist for AC-05 (reload verification)     | Pending |
| US-001.02      | `TaskForm.tsx` must exist to be reused                          | Pending |

---

## 6. INVEST Checklist

- [x] **I — Independent:** Depends on US-001.02 and US-001.04, both earlier in the sequence.
- [x] **N — Negotiable:** Edit trigger (double-click vs. edit button) is negotiable; outcome is fixed.
- [x] **V — Valuable:** Allows updating tasks without delete-recreate; essential for day-to-day use.
- [x] **E — Estimable:** Reuses existing form component; no unknowns.
- [x] **S — Small:** Completable in 1 day.
- [x] **T — Testable:** All 5 ACs are verifiable via React Testing Library (simulate double-click → type → save/cancel).

---

## 7. Notes & Discussion

| # | Note / Question                                              | Author              | Date       |
|---|--------------------------------------------------------------|---------------------|------------|
| 1 | The `E` keyboard shortcut for edit mode is handled in EPIC-003 (US-003.04), not here. | GitHub Copilot (AI) | 2026-05-05 |
