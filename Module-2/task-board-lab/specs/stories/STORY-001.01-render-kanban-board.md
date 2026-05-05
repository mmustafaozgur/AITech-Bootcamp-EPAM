# User Story: Render the 3-Column Kanban Board

**Story ID:** US-001.01  
**Epic:** EPIC-001 — Core Board & Task Management  
**Status:** Draft  
**Assignee:** TBD  
**Sprint / Iteration:** TBD  
**Created:** 2026-05-05  
**Last Updated:** 2026-05-05

---

## 1. User Story

> **As a** Alex (Senior Freelance Developer),  
> **I want to** see a 3-column Kanban board when I open the app,  
> **so that** I have an immediate visual workspace for tracking my tasks across projects with zero setup.

---

## 2. Acceptance Criteria

- **AC-01:**  
  Given the app URL is opened for the first time in a modern browser,  
  When the page finishes loading,  
  Then three columns labelled exactly "To Do", "In Progress", and "Done" are visible on screen.

- **AC-02:**  
  Given the app has loaded,  
  When I view the board,  
  Then each column has a visually distinct header with its label clearly readable.

- **AC-03:**  
  Given there are no tasks saved in `localStorage`,  
  When I view the board,  
  Then all three columns are empty and no error state or broken layout is shown.

- **AC-04:**  
  Given the app has loaded,  
  When I resize the browser window to a desktop width (≥ 1024 px),  
  Then all three columns remain fully visible side-by-side without overflow.

---

## 3. Technical Notes

- Create `KanbanBoard.tsx` as the top-level board component in `src/features/tasks/`.
- Create `KanbanColumn.tsx` as the reusable column component; accepts `title` and `status` props.
- Column statuses: `'todo'`, `'in-progress'`, `'done'`.
- Styles via CSS Module `KanbanBoard.module.css` / `KanbanColumn.module.css`.
- No `localStorage` reads in this story — that is handled in US-001.03/US-001.04.
- `taskboard:version` key should be set to `"1"` here as the first localStorage write of the app initialisation; actual task persistence is in US-001.03.

---

## 4. Estimation

| Field            | Value                                                        |
|------------------|--------------------------------------------------------------|
| **Story Points** | 1                                                            |
| **Alt. (Days)**  | 0.5 days                                                     |
| **Confidence**   | High                                                         |
| **Sizing Notes** | Pure layout work; no data logic; well-understood React pattern. |

---

## 5. Dependencies & Blockers

| ID / Reference | Description | Status |
|----------------|-------------|--------|
| None           | —           | —      |

---

## 6. INVEST Checklist

- [x] **I — Independent:** No upstream story dependencies; can be built first.
- [x] **N — Negotiable:** Column count and label copy can be adjusted; layout approach is flexible.
- [x] **V — Valuable:** Delivers the visual foundation users see on first load.
- [x] **E — Estimable:** Well-understood React layout; no unknowns.
- [x] **S — Small:** Completable in under a day.
- [x] **T — Testable:** AC-01 through AC-04 are each independently verifiable by inspection or automated snapshot test.

---

## 7. Notes & Discussion

| # | Note / Question                                                        | Author              | Date       |
|---|------------------------------------------------------------------------|---------------------|------------|
| 1 | Column order (left→right): To Do, In Progress, Done — confirm with design. | GitHub Copilot (AI) | 2026-05-05 |
