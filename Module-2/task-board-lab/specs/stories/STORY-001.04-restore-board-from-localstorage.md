# User Story: Restore Board State from localStorage on Page Load

**Story ID:** US-001.04  
**Epic:** EPIC-001 — Core Board & Task Management  
**Status:** Draft  
**Assignee:** TBD  
**Sprint / Iteration:** TBD  
**Created:** 2026-05-05  
**Last Updated:** 2026-05-05

---

## 1. User Story

> **As a** Alex (Senior Freelance Developer),  
> **I want to** see all my tasks restored automatically when I refresh the page,  
> **so that** I never have to re-enter work I have already captured.

---

## 2. Acceptance Criteria

- **AC-01:**  
  Given tasks exist under `taskboard:tasks` in `localStorage`,  
  When the app mounts in the browser,  
  Then all tasks are displayed on the board in their correct columns.

- **AC-02:**  
  Given `taskboard:tasks` contains a task with `status: 'in-progress'`,  
  When the app mounts,  
  Then that task appears in the "In Progress" column and not in "To Do" or "Done".

- **AC-03:**  
  Given `taskboard:tasks` is absent from `localStorage` (first visit),  
  When the app mounts,  
  Then the board renders all three columns as empty with no JavaScript error.

- **AC-04:**  
  Given `taskboard:tasks` contains invalid JSON (corrupted data),  
  When the app mounts,  
  Then the board renders empty, the corrupted value is cleared from `localStorage`, and no crash occurs.

---

## 3. Technical Notes

- Use a lazy initialiser in `useTaskStore.ts`: `useState<Task[]>(() => loadFromStorage())`.
- `loadFromStorage()` is from `src/utils/storageUtils.ts` (introduced in US-001.03); wrap `JSON.parse` in a try/catch that returns `[]` on failure and clears the bad key.
- Task ordering within each column: sort by `task.order` ascending before rendering.
- Write an automated integration test: seed `localStorage` with 10 mock tasks, render `<KanbanBoard />`, and assert all 10 cards are in the DOM.

---

## 4. Estimation

| Field            | Value                                                                          |
|------------------|--------------------------------------------------------------------------------|
| **Story Points** | 2                                                                              |
| **Alt. (Days)**  | 1 day                                                                          |
| **Confidence**   | High                                                                           |
| **Sizing Notes** | Reads from utility already built in US-001.03; main work is error handling and the integration test. |

---

## 5. Dependencies & Blockers

| ID / Reference | Description                                                      | Status  |
|----------------|------------------------------------------------------------------|---------|
| US-001.03      | `loadFromStorage()` utility and `taskboard:tasks` key must exist | Pending |

---

## 6. INVEST Checklist

- [x] **I — Independent:** Depends only on US-001.03's storage utility; no other in-flight stories blocked.
- [x] **N — Negotiable:** Error-recovery strategy (clear vs. keep corrupt data) is negotiable.
- [x] **V — Valuable:** Without session restore, the board is useless across browser sessions.
- [x] **E — Estimable:** Well-understood; reuses existing utility.
- [x] **S — Small:** Primarily a `useState` lazy initialiser + test; completable in 1 day.
- [x] **T — Testable:** All 4 ACs are verifiable via Vitest + React Testing Library.

---

## 7. Notes & Discussion

| # | Note / Question                                                                           | Author              | Date       |
|---|-------------------------------------------------------------------------------------------|---------------------|------------|
| 1 | If `taskboard:version` indicates a schema mismatch in the future, the migration utility in `src/utils/migrations.ts` should run before `loadFromStorage` returns tasks. | GitHub Copilot (AI) | 2026-05-05 |
