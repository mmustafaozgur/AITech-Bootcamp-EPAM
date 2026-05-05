# User Story: Open New-Task Form via N Keyboard Shortcut

**Story ID:** US-003.03  
**Epic:** EPIC-003 — Keyboard Accessibility & Navigation  
**Status:** Draft  
**Assignee:** TBD  
**Sprint / Iteration:** TBD  
**Created:** 2026-05-05  
**Last Updated:** 2026-05-05

---

## 1. User Story

> **As a** Alex (Senior Freelance Developer),  
> **I want to** press N anywhere on the board to open the new-task form,  
> **so that** I can capture a task instantly without leaving my keyboard.

---

## 2. Acceptance Criteria

- **AC-01:**  
  Given focus is not inside a text input or textarea,  
  When I press the N key,  
  Then the new-task form opens with focus placed on the Title field.

- **AC-02:**  
  Given the new-task form is opened via the N shortcut,  
  When I type a title and press Enter,  
  Then the task is created in the "To Do" column and saved to `taskboard:tasks` in `localStorage`.

- **AC-03:**  
  Given focus is inside a text input (e.g., an already-open task form's Title field),  
  When I press N,  
  Then the shortcut has no effect and the letter "n" is typed as a normal character.

- **AC-04:**  
  Given the new-task form is open,  
  When I press Escape,  
  Then the form closes without creating a task, and focus returns to the element that triggered the shortcut.

---

## 3. Technical Notes

- Add a `keydown` listener to `KanbanBoard.tsx` (or `document`) to catch the `n` / `N` key globally.
- Guard: check `event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement` — skip if true.
- On trigger, call the existing add-task form open handler (reuse the mechanism from US-001.02's "Add Task" button).
- On open, call `titleInputRef.current?.focus()` to place the cursor in the Title field.
- On Escape, close the form and call `previousFocusRef.current?.focus()` to restore focus.

---

## 4. Estimation

| Field            | Value                                                                           |
|------------------|---------------------------------------------------------------------------------|
| **Story Points** | 1                                                                               |
| **Alt. (Days)**  | 0.5 days                                                                        |
| **Confidence**   | High                                                                            |
| **Sizing Notes** | Single global `keydown` guard + focus management; reuses existing form component entirely. |

---

## 5. Dependencies & Blockers

| ID / Reference | Description                                            | Status  |
|----------------|--------------------------------------------------------|---------|
| US-001.02      | New-task form (`TaskForm.tsx`) must exist              | Pending |

---

## 6. INVEST Checklist

- [x] **I — Independent:** Depends on US-001.02 (form exists); no EPIC-003 story blocks it.
- [x] **N — Negotiable:** Which column the form pre-targets is negotiable (To Do by default).
- [x] **V — Valuable:** Enables zero-mouse task capture — directly reduces time-to-first-task.
- [x] **E — Estimable:** Trivial event handler; well-understood.
- [x] **S — Small:** Completable in half a day.
- [x] **T — Testable:** AC-01 to AC-04 verifiable via `userEvent.keyboard('n')` + DOM assertions.

---

## 7. Notes & Discussion

| # | Note / Question                                                                              | Author              | Date       |
|---|----------------------------------------------------------------------------------------------|---------------------|------------|
| 1 | If the answer to EPIC-003 open question #1 is "target the last-focused column", update the handler to track the last focused column in a ref. | GitHub Copilot (AI) | 2026-05-05 |
