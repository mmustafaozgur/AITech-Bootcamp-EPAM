# User Story: Show Warning Banner When localStorage Is Unavailable

**Story ID:** US-001.07  
**Epic:** EPIC-001 — Core Board & Task Management  
**Status:** Draft  
**Assignee:** TBD  
**Sprint / Iteration:** TBD  
**Created:** 2026-05-05  
**Last Updated:** 2026-05-05

---

## 1. User Story

> **As a** Alex (Senior Freelance Developer),  
> **I want to** see a clear warning if the app cannot save my data,  
> **so that** I know my tasks won't persist before I start working.

---

## 2. Acceptance Criteria

- **AC-01:**  
  Given `localStorage` throws a `SecurityError` or `QuotaExceededError` when probed on app mount,  
  When the app finishes loading,  
  Then a non-blocking banner appears at the top of the board with the exact message "Storage unavailable — changes will not be saved."

- **AC-02:**  
  Given the warning banner is visible,  
  When I create, edit, or delete a task,  
  Then all CRUD operations continue to function in-memory for the session without a JavaScript error.

- **AC-03:**  
  Given `localStorage` is available and functional,  
  When the app loads normally,  
  Then no warning banner is displayed.

- **AC-04:**  
  Given the warning banner is displayed,  
  When I click the close button (×) on the banner,  
  Then the banner is dismissed for the current session.

---

## 3. Technical Notes

- Create `isStorageAvailable(): boolean` in `src/utils/storageUtils.ts`; probe by calling `localStorage.setItem('taskboard:probe', '1')` and `removeItem` inside a try/catch.
- Create `StorageBanner.tsx` in `src/components/`; renders only when `!storageAvailable`.
- Expose `storageAvailable` from `useTaskStore.ts` or a dedicated `useStorageStatus.ts` hook.
- In-memory mode: `useTaskStore` operates normally with React state; all writes to `localStorage` are silently skipped.
- Render the banner as the first child inside `KanbanBoard.tsx`, above the columns.

---

## 4. Estimation

| Field            | Value                                                                          |
|------------------|--------------------------------------------------------------------------------|
| **Story Points** | 1                                                                              |
| **Alt. (Days)**  | 0.5 days                                                                       |
| **Confidence**   | High                                                                           |
| **Sizing Notes** | Small utility function + simple banner component; logic already scaffolded in US-001.03. |

---

## 5. Dependencies & Blockers

| ID / Reference | Description                                                        | Status  |
|----------------|--------------------------------------------------------------------|---------|
| US-001.03      | `storageUtils.ts` must exist; `isStorageAvailable` is added to it  | Pending |

---

## 6. INVEST Checklist

- [x] **I — Independent:** Can be built right after US-001.03; no other open stories block it.
- [x] **N — Negotiable:** Banner styling, copy, and dismiss behaviour are flexible.
- [x] **V — Valuable:** Prevents silent data loss — a key trust/reliability requirement (NFR 5.3).
- [x] **E — Estimable:** Trivial component; no unknowns.
- [x] **S — Small:** Completable in half a day.
- [x] **T — Testable:** All 4 ACs are verifiable by mocking `localStorage` to throw in Vitest.

---

## 7. Notes & Discussion

| # | Note / Question                                        | Author              | Date       |
|---|--------------------------------------------------------|---------------------|------------|
| 1 | Banner must not block user interaction — use a dismissible top-of-page ribbon, not a modal. | GitHub Copilot (AI) | 2026-05-05 |
