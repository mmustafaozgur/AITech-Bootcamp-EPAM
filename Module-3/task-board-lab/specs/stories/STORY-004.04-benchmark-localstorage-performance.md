# User Story: Benchmark localStorage Read/Write to ≤ 50 ms for 200 Tasks

**Story ID:** US-004.04  
**Epic:** EPIC-004 — Performance, Quality & Polish  
**Status:** Draft  
**Assignee:** TBD  
**Sprint / Iteration:** TBD  
**Created:** 2026-05-05  
**Last Updated:** 2026-05-05

---

## 1. User Story

> **As a** Jordan (Junior Developer / CS Student),  
> **I want to** have data saves complete without noticeable lag even with a large board,  
> **so that** the app feels instant regardless of how many tasks I have accumulated.

---

## 2. Acceptance Criteria

- **AC-01:**  
  Given a board with 200 mock tasks,  
  When `saveToStorage(tasks)` is called and timed with `performance.now()`,  
  Then the measured duration is ≤ 50 ms on a mid-range desktop machine.

- **AC-02:**  
  Given the benchmark is implemented as a Vitest bench test,  
  When `npm run test:bench` is executed,  
  Then the benchmark reports the median duration and the test fails if the median exceeds 50 ms.

- **AC-03:**  
  Given `loadFromStorage()` is called with `taskboard:tasks` containing 200 tasks,  
  When the duration is measured,  
  Then the parse and return operation also completes in ≤ 50 ms.

---

## 3. Technical Notes

- Create `src/utils/storageUtils.bench.ts` using Vitest's `bench` API:
  ```ts
  import { bench, expect } from 'vitest';
  import { saveToStorage, loadFromStorage } from './storageUtils';
  const mockTasks = Array.from({ length: 200 }, (_, i) => ({
    id: crypto.randomUUID(), title: `Task ${i}`, description: '', status: 'todo', order: i
  }));
  bench('saveToStorage 200 tasks', () => { saveToStorage(mockTasks); });
  bench('loadFromStorage 200 tasks', () => { loadFromStorage(); });
  ```
- Add `"test:bench": "vitest bench"` to `package.json` scripts.
- If the median exceeds 50 ms, investigate: JSON.stringify on 200 tasks is typically < 5 ms; the bottleneck is likely `localStorage.setItem` quota handling — consider debouncing writes (250 ms) for future tasks with descriptions > 1 kB.
- localStorage key used: `taskboard:tasks`.

---

## 4. Estimation

| Field            | Value                                                                         |
|------------------|-------------------------------------------------------------------------------|
| **Story Points** | 2                                                                             |
| **Alt. (Days)**  | 1 day                                                                         |
| **Confidence**   | High                                                                          |
| **Sizing Notes** | Bench test file + script entry + potential optimisation pass (debounce or batching). |

---

## 5. Dependencies & Blockers

| ID / Reference | Description                                              | Status  |
|----------------|----------------------------------------------------------|---------|
| US-001.03      | `saveToStorage` and `loadFromStorage` must exist in `storageUtils.ts` | Pending |

---

## 6. INVEST Checklist

- [x] **I — Independent:** Purely a benchmark + optimisation on existing utilities; no EPIC-002/003 dependency.
- [x] **N — Negotiable:** Benchmark threshold (50 ms) and test approach are negotiable.
- [x] **V — Valuable:** Verifies a concrete NFR (5.1) — guarantees users never experience save lag.
- [x] **E — Estimable:** Well-scoped; `storageUtils.ts` already exists.
- [x] **S — Small:** Completable in 1 day.
- [x] **T — Testable:** AC-01 to AC-03 verified by running `npm run test:bench` and inspecting median output.

---

## 7. Notes & Discussion

| # | Note / Question                                                                          | Author              | Date       |
|---|------------------------------------------------------------------------------------------|---------------------|------------|
| 1 | If the 50 ms budget is exceeded, a write-debounce (250 ms) can be added to `saveToStorage` as a non-breaking optimisation. | GitHub Copilot (AI) | 2026-05-05 |
