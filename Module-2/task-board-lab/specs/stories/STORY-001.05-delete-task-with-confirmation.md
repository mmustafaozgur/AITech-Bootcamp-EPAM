# User Story: Delete a Task with Confirmation

**Story ID:** US-001.05  
**Epic:** EPIC-001 — Core Board & Task Management  
**Status:** Draft  
**Assignee:** TBD  
**Sprint / Iteration:** TBD  
**Created:** 2026-05-05  
**Last Updated:** 2026-05-05

---

## 1. User Story

> **As a** Alex (Senior Freelance Developer),  
> **I want to** delete a task after confirming my intent,  
> **so that** I don't accidentally remove work items I meant to keep.

---

## 2. Acceptance Criteria

- **AC-01:**  
  Given a task card is visible on the board,  
  When I click the delete icon (×) on the card,  
  Then a confirmation dialog appears with the message "Delete this task? This cannot be undone."

- **AC-02:**  
  Given the confirmation dialog is open,  
  When I click the Confirm button,  
  Then the task card is removed from the board and the task is no longer present in `localStorage` under `taskboard:tasks`.

- **AC-03:**  
  Given the confirmation dialog is open,  
  When I click Cancel,  
  Then the dialog closes, the task card remains on the board, and `localStorage` is not modified.

- **AC-04:**  
  Given a task has been deleted and the page is reloaded,  
  When the app mounts,  
  Then the deleted task does not reappear on the board.

---

## 3. Technical Notes

- Create a reusable `ConfirmDialog.tsx` in `src/components/`; accepts `message`, `onConfirm`, and `onCancel` props.
- The delete icon (×) is rendered inside `TaskCard.tsx`; it is visible on hover (or always visible on touch).
- On confirm, call `useTaskStore`'s `deleteTask(id: string)` action which removes the task from state and calls `saveToStorage`.
- `ConfirmDialog.tsx` will be reused by the keyboard delete shortcut in EPIC-003 (US-003.05).
- Accessibility: the dialog must trap focus while open and return focus to the delete icon on cancel.

---

## 4. Estimation

| Field            | Value                                                                        |
|------------------|------------------------------------------------------------------------------|
| **Story Points** | 2                                                                            |
| **Alt. (Days)**  | 1 day                                                                        |
| **Confidence**   | High                                                                         |
| **Sizing Notes** | Dialog component + delete action in store + integration test; no complex logic. |

---

## 5. Dependencies & Blockers

| ID / Reference | Description                                              | Status  |
|----------------|----------------------------------------------------------|---------|
| US-001.04      | Tasks must be persisted and restorable before delete can be verified end-to-end | Pending |

---

## 6. INVEST Checklist

- [x] **I — Independent:** Depends on US-001.04 (persistence) which is the prior story in sequence.
- [x] **N — Negotiable:** Dialog styling and exact button labels are flexible.
- [x] **V — Valuable:** Prevents accidental data loss — a critical user trust feature.
- [x] **E — Estimable:** Standard dialog pattern; no unknowns.
- [x] **S — Small:** Completable in 1 day.
- [x] **T — Testable:** All 4 ACs are verifiable via Vitest + React Testing Library (simulate click → confirm).

---

## 7. Notes & Discussion

| # | Note / Question                                                                  | Author              | Date       |
|---|----------------------------------------------------------------------------------|---------------------|------------|
| 1 | Hard-delete for MVP; soft-delete (undo) deferred to a future sprint per PRD open question #2. | GitHub Copilot (AI) | 2026-05-05 |
