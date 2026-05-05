# User Story: Create a New Task

**Story ID:** US-001.02  
**Epic:** EPIC-001 — Core Board & Task Management  
**Status:** Draft  
**Assignee:** TBD  
**Sprint / Iteration:** TBD  
**Created:** 2026-05-05  
**Last Updated:** 2026-05-05

---

## 1. User Story

> **As a** Alex (Senior Freelance Developer),  
> **I want to** create a task with a title and an optional description,  
> **so that** I can add work items to my board within 3 clicks of opening the app.

---

## 2. Acceptance Criteria

- **AC-01:**  
  Given the board is displayed,  
  When I click the "Add Task" button in any column header,  
  Then a task form appears with a required "Title" field and an optional "Description" field.

- **AC-02:**  
  Given the task form is open,  
  When I enter a title between 1 and 200 characters and click Save,  
  Then a new task card appears at the bottom of the "To Do" column with the entered title visible.

- **AC-03:**  
  Given the task form is open,  
  When I leave the Title field empty and click Save,  
  Then an inline error message "Title is required" appears and the task is not created.

- **AC-04:**  
  Given the task form is open,  
  When I enter a title that is 201 characters or longer,  
  Then an inline error message "Title must be 200 characters or fewer" appears and the task is not created.

- **AC-05:**  
  Given the task form is open,  
  When I press Escape or click Cancel,  
  Then the form closes, no task card appears, and the board state is unchanged.

---

## 3. Technical Notes

- Task schema: `{ id: string, title: string, description: string, status: 'todo' | 'in-progress' | 'done', order: number }`.
- Generate `id` using `crypto.randomUUID()`.
- New tasks default to `status: 'todo'`; the "Add Task" button in other columns also creates tasks in "To Do" for MVP.
- Create `TaskForm.tsx` in `src/features/tasks/`; reuse in edit mode (US-001.06).
- State management via `useTaskStore.ts` custom hook in `src/features/tasks/`.
- localStorage key: `taskboard:tasks` — but the actual persistence logic is in US-001.03; this story only wires the in-memory state.
- Edge case: `description` is optional; store as empty string `""` if not provided.

---

## 4. Estimation

| Field            | Value                                                                          |
|------------------|--------------------------------------------------------------------------------|
| **Story Points** | 2                                                                              |
| **Alt. (Days)**  | 1 day                                                                          |
| **Confidence**   | High                                                                           |
| **Sizing Notes** | Form component + validation + in-memory state add-up; no persistence in this story. |

---

## 5. Dependencies & Blockers

| ID / Reference | Description                                   | Status  |
|----------------|-----------------------------------------------|---------|
| US-001.01      | KanbanBoard and KanbanColumn components must exist | Pending |

---

## 6. INVEST Checklist

- [x] **I — Independent:** Depends only on US-001.01 (layout scaffold), which is the first story.
- [x] **N — Negotiable:** Form style (inline vs. modal) and field count are flexible; outcome is fixed.
- [x] **V — Valuable:** Delivers the core "capture a task" workflow — the single most important user action.
- [x] **E — Estimable:** Well-understood form pattern; no unknowns.
- [x] **S — Small:** Completable in 1 day; validation + in-memory state only.
- [x] **T — Testable:** All 5 ACs are independently verifiable via unit or integration tests.

---

## 7. Notes & Discussion

| # | Note / Question                                                                          | Author              | Date       |
|---|------------------------------------------------------------------------------------------|---------------------|------------|
| 1 | Should the "Add Task" button appear in all 3 column headers, or only in "To Do"? Defaulting to "To Do" column only for MVP. | GitHub Copilot (AI) | 2026-05-05 |
