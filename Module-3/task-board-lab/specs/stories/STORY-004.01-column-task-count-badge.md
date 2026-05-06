# User Story: Display a Live Task-Count Badge on Each Column Header

**Story ID:** US-004.01  
**Epic:** EPIC-004 — Performance, Quality & Polish  
**Status:** Draft  
**Assignee:** TBD  
**Sprint / Iteration:** TBD  
**Created:** 2026-05-05  
**Last Updated:** 2026-05-05

---

## 1. User Story

> **As a** Jordan (Junior Developer / CS Student),  
> **I want to** see a count of tasks in each column header,  
> **so that** I can assess my workload at a glance without having to count cards manually.

---

## 2. Acceptance Criteria

- **AC-01:**  
  Given the "To Do" column contains 3 tasks,  
  When I view the board,  
  Then the "To Do" column header displays a badge showing "3".

- **AC-02:**  
  Given a task is moved from "To Do" to "In Progress",  
  When the move completes,  
  Then the "To Do" badge decreases by 1 and the "In Progress" badge increases by 1 — both update immediately without a page reload.

- **AC-03:**  
  Given a column contains 0 tasks,  
  When I view the board,  
  Then the badge for that column displays "0" (not hidden or omitted).

- **AC-04:**  
  Given I create a new task,  
  When the task appears on the board,  
  Then the "To Do" badge increments by 1 immediately.

---

## 3. Technical Notes

- The badge is a `<span>` rendered inside `KanbanColumn.tsx` next to the column title.
- Count is derived: `tasks.filter(t => t.status === column.status).length` — purely derived from existing state; no new state needed.
- Style via `KanbanColumn.module.css`; the badge should be visually distinct (e.g., rounded pill, muted background).
- No additional props required; `KanbanColumn` already receives its task list or can derive the count from the global store.

---

## 4. Estimation

| Field            | Value                                                              |
|------------------|--------------------------------------------------------------------|
| **Story Points** | 1                                                                  |
| **Alt. (Days)**  | 0.5 days                                                           |
| **Confidence**   | High                                                               |
| **Sizing Notes** | Purely derived UI; a `<span>` with a computed count — trivial change. |

---

## 5. Dependencies & Blockers

| ID / Reference | Description                                       | Status  |
|----------------|---------------------------------------------------|---------|
| US-001.01      | `KanbanColumn.tsx` must exist                     | Pending |

---

## 6. INVEST Checklist

- [x] **I — Independent:** Pure UI addition on existing components; no other stories block it.
- [x] **N — Negotiable:** Badge styling and whether to show "0" are negotiable details.
- [x] **V — Valuable:** Immediate at-a-glance workload visibility; improves daily use.
- [x] **E — Estimable:** Single computed value in a span; trivially sized.
- [x] **S — Small:** Completable in half a day.
- [x] **T — Testable:** AC-01 to AC-04 verifiable via RTL render assertions on badge text content.

---

## 7. Notes & Discussion

| # | Note / Question                                           | Author              | Date       |
|---|-----------------------------------------------------------|---------------------|------------|
| 1 | Badge should have `aria-label="3 tasks"` for screen reader accessibility. | GitHub Copilot (AI) | 2026-05-05 |
