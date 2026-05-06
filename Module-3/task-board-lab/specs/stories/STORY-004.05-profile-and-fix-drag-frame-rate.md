# User Story: Profile and Fix Frame-Rate Drops During Drag with 200 Tasks

**Story ID:** US-004.05  
**Epic:** EPIC-004 — Performance, Quality & Polish  
**Status:** Draft  
**Assignee:** TBD  
**Sprint / Iteration:** TBD  
**Created:** 2026-05-05  
**Last Updated:** 2026-05-05

---

## 1. User Story

> **As a** Jordan (Junior Developer / CS Student),  
> **I want to** have the board stay smooth during drag-and-drop even with many tasks,  
> **so that** the app never feels sluggish or unresponsive on my machine.

---

## 2. Acceptance Criteria

- **AC-01:**  
  Given the board contains 200 tasks spread across 3 columns,  
  When a drag-and-drop operation is performed end-to-end,  
  Then Chrome DevTools Performance panel shows no frames exceeding 33 ms (≥ 30 fps) during the drag gesture.

- **AC-02:**  
  Given the developer has applied render optimisations (`React.memo`, `useCallback`),  
  When the board is profiled again with 200 tasks,  
  Then re-profiling confirms all frames are within the 33 ms budget.

- **AC-03:**  
  Given the optimisations are applied,  
  When `npm run build` is executed,  
  Then the production bundle size does not increase by more than 5 kB gzipped compared to the pre-fix baseline.

- **AC-04:**  
  Given the frame-rate fix is in place,  
  When a developer reads `KanbanBoard.tsx` and `TaskCard.tsx`,  
  Then each component has a code comment referencing the performance profiling rationale for any `React.memo` or `useCallback` usage.

---

## 3. Technical Notes

- Profiling steps:
  1. Run `npm run build && npx serve dist` to serve the production build.
  2. Open Chrome DevTools → Performance tab → record a drag gesture with 200 tasks.
  3. Identify long frames (red bars > 33 ms) and the component responsible.
- Common fixes:
  - Wrap `TaskCard.tsx` with `React.memo` to prevent re-rendering all 200 cards on each drag-over event.
  - Wrap `onDragOver` / `onDragEnd` callbacks in `useCallback` inside `KanbanBoard.tsx`.
  - Ensure `DndContext`'s `onDragOver` only updates the `overId` state, not the full task list.
- Bundle size baseline: run `npm run build` and record the `dist/assets/*.js` gzipped size before applying any fix.
- Note: `React.memo` and `useCallback` add complexity — only apply where profiling confirms a benefit.

---

## 4. Estimation

| Field            | Value                                                                                    |
|------------------|------------------------------------------------------------------------------------------|
| **Story Points** | 3                                                                                        |
| **Alt. (Days)**  | 1.5 days                                                                                 |
| **Confidence**   | Medium                                                                                   |
| **Sizing Notes** | Profiling is quick; identifying the root cause and applying the correct fix has moderate uncertainty. |

---

## 5. Dependencies & Blockers

| ID / Reference | Description                                                                         | Status  |
|----------------|-------------------------------------------------------------------------------------|---------|
| US-002.02      | Drag-and-drop must be fully implemented before frame-rate can be profiled            | Pending |
| US-004.03      | Lighthouse CI should be in place to catch bundle size regressions from AC-03        | Pending |

---

## 6. INVEST Checklist

- [x] **I — Independent:** Depends on US-002.02 (DnD) and US-004.03 (CI); both are sequenced earlier.
- [x] **N — Negotiable:** Specific optimisation techniques (`React.memo` vs. `useMemo` vs. windowing) are flexible.
- [x] **V — Valuable:** Ensures the app remains usable on lower-powered devices at full task capacity.
- [x] **E — Estimable:** Medium confidence; root cause may vary, but the profiling approach is well-defined.
- [x] **S — Small:** 3 points (1.5 days) — within sprint boundary.
- [x] **T — Testable:** AC-01/AC-02 verified by profiling screenshots; AC-03 by bundle size diff; AC-04 by code review.

---

## 7. Notes & Discussion

| # | Note / Question                                                                              | Author              | Date       |
|---|----------------------------------------------------------------------------------------------|---------------------|------------|
| 1 | If windowing (virtualisation) is needed for > 200 tasks, this becomes a larger story — flag and split before committing. | GitHub Copilot (AI) | 2026-05-05 |
