# User Story: Persist Tasks to localStorage After Each Mutation

**Story ID:** US-001.03  
**Epic:** EPIC-001 — Core Board & Task Management  
**Status:** Draft  
**Assignee:** TBD  
**Sprint / Iteration:** TBD  
**Created:** 2026-05-05  
**Last Updated:** 2026-05-05

---

## 1. User Story

> **As a** Alex (Senior Freelance Developer),  
> **I want to** have every change I make saved automatically,  
> **so that** my tasks are never lost between browser sessions.

---

## 2. Acceptance Criteria

- **AC-01:**  
  Given I create a task with the title "Fix login bug",  
  When the task is saved,  
  Then `JSON.parse(localStorage.getItem('taskboard:tasks'))` returns an array containing an object with `title: "Fix login bug"`.

- **AC-02:**  
  Given a task exists on the board,  
  When I delete it,  
  Then `JSON.parse(localStorage.getItem('taskboard:tasks'))` no longer contains an entry with that task's `id`.

- **AC-03:**  
  Given a task exists on the board,  
  When I move it to a different column,  
  Then `localStorage.getItem('taskboard:tasks')` reflects the updated `status` value for that task immediately.

- **AC-04:**  
  Given `localStorage` is unavailable (simulated via `localStorage.setItem` throwing a `QuotaExceededError`),  
  When a save is attempted,  
  Then no uncaught JavaScript error is thrown and the app continues to operate in-memory.

- **AC-05:**  
  Given the app is opened for the first time,  
  When the app mounts,  
  Then `localStorage.getItem('taskboard:version')` returns `"1"`.

---

## 3. Technical Notes

- All writes go through a `saveToStorage(tasks: Task[])` utility in `src/utils/storageUtils.ts`.
- Wrap `localStorage.setItem` in a try/catch; on catch, set a React context flag `storageAvailable: false`.
- localStorage keys:
  - `taskboard:tasks` — JSON array of `Task[]`.
  - `taskboard:version` — string `"1"` (written once on first load; used for future migrations).
- `useTaskStore.ts` must call `saveToStorage` after every state mutation (create, update, delete, move).
- `storageUtils.ts` should also export `loadFromStorage(): Task[]` (used in US-001.04).
- Edge case: If `JSON.stringify` fails (circular reference, etc.), catch and log — do not crash.

---

## 4. Estimation

| Field            | Value                                                                              |
|------------------|------------------------------------------------------------------------------------|
| **Story Points** | 2                                                                                  |
| **Alt. (Days)**  | 1 day                                                                              |
| **Confidence**   | High                                                                               |
| **Sizing Notes** | Utility function + integration with existing hook; error handling adds modest complexity. |

---

## 5. Dependencies & Blockers

| ID / Reference | Description                                        | Status  |
|----------------|----------------------------------------------------|---------|
| US-001.02      | `useTaskStore` and task mutation actions must exist | Pending |

---

## 6. INVEST Checklist

- [x] **I — Independent:** Builds on US-001.02's in-memory store; clearly separable persistence layer.
- [x] **N — Negotiable:** Serialisation format and error handling approach are flexible.
- [x] **V — Valuable:** Delivers session persistence — without this, the board resets on every reload.
- [x] **E — Estimable:** localStorage API is well-understood; no unknowns.
- [x] **S — Small:** Isolated to `storageUtils.ts` + hook integration; completable in 1 day.
- [x] **T — Testable:** All 5 ACs are verifiable via Vitest unit/integration tests using `localStorage` mocks.

---

## 7. Notes & Discussion

| # | Note / Question                                                                     | Author              | Date       |
|---|-------------------------------------------------------------------------------------|---------------------|------------|
| 1 | `taskboard:version` value `"1"` is the seed for the migration utility in `src/utils/migrations.ts` (to be built when schema changes). | GitHub Copilot (AI) | 2026-05-05 |
