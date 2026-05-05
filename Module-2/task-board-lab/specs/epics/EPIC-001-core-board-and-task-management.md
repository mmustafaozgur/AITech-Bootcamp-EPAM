# Epic: Core Board & Task Management

**Epic ID:** EPIC-001  
**Status:** Draft  
**PRD Reference:** PRD-task-board-mvp.md  
**Owner:** TBD  
**Target Release:** TBD  
**Created:** 2026-05-05  
**Last Updated:** 2026-05-05

---

## 1. Description

This epic delivers the foundational Kanban board: a 3-column layout (To Do / In Progress / Done) with full task CRUD (create, read, edit, delete) and `localStorage` persistence so that data survives page reloads. It represents the minimum shippable product — without it, no other epic has anything to build on. It is intentionally scoped to eliminate every blocker for EPIC-002 and EPIC-003 while remaining independently deployable and immediately useful on its own.

---

## 2. Primary Persona

**Persona:** Alex — Senior Freelance Developer  
**Why this persona:** Alex needs to track tasks across 2–3 active projects with zero setup and zero account creation; the core board directly addresses that pain point on day one.

> **Secondary personas (optional):** Jordan — Junior Developer / CS Student

---

## 3. Success Criteria

- [ ] **SC-01:** A user can open the app in a browser with no prior setup and see the 3-column board within 3 seconds of the page loading (aligned to PRD metric: *Lighthouse Performance score ≥ 90*).
- [ ] **SC-02:** A user can create their first task within 3 clicks or fewer from the moment the app loads, with the task immediately visible on the board (aligned to PRD metric: *Time-to-first-task ≤ 30 seconds*).
- [ ] **SC-03:** A user can edit a task's title and/or description in place; the updated values persist after page reload (aligned to PRD metric: *localStorage persistence reliability 100%*).
- [ ] **SC-04:** A user can delete a task with a confirmation step; the task does not reappear after page reload (aligned to PRD metric: *localStorage persistence reliability 100%*).
- [ ] **SC-05:** All tasks and their column assignments are fully restored from `localStorage` on every page load; an automated Vitest integration test creates 10 tasks, reloads, and asserts count = 10 (aligned to PRD metric: *localStorage persistence reliability 100%*).

---

## 4. Scope & Complexity

**Estimate:** M

| Factor                 | Assessment                                                                 |
|------------------------|----------------------------------------------------------------------------|
| **UI Complexity**      | Medium — 3-column layout, task cards, inline edit form, confirmation dialog |
| **Backend Complexity** | None — frontend-only; no server-side code                                  |
| **Integrations**       | None — `localStorage` only                                                 |
| **Data Migration**     | Not Required — greenfield; initial `taskboard:version` key is set here     |
| **New Infrastructure** | Not Required — React + Vite project scaffold only                          |
| **Unknowns / Risks**   | `localStorage` quota in some browsers (~5 MB); handle quota-exceeded error gracefully |

---

## 5. Dependencies

### Upstream Dependencies

No dependencies identified. This is the foundational epic.

### Downstream Dependents

| ID       | Dependent Epic / Feature                     | Notes                                                                |
|----------|----------------------------------------------|----------------------------------------------------------------------|
| EPIC-002 | Drag-and-Drop Task Movement                  | Requires task cards and column components to exist before DnD can be layered in |
| EPIC-003 | Keyboard Accessibility & Navigation          | Requires task cards and the board DOM structure to be in place       |
| EPIC-004 | Performance, Quality & Polish                | Requires the full functional surface to be built before measuring and hardening |

---

## 6. User Stories

| Story ID | Title                                              | Priority | Status | Link / Notes                  |
|----------|----------------------------------------------------|----------|--------|-------------------------------|
| US-TBD   | View the Kanban board on app load                  | P0       | To Do  | FR-01                         |
| US-TBD   | Create a new task with a title and description     | P0       | To Do  | FR-02                         |
| US-TBD   | Persist all tasks to localStorage after each mutation | P0    | To Do  | FR-03                         |
| US-TBD   | Restore board state from localStorage on page load | P0      | To Do  | FR-06                         |
| US-TBD   | Delete a task with a confirmation prompt           | P0       | To Do  | FR-05                         |
| US-TBD   | Edit a task's title and description in place       | P1       | To Do  | FR-07                         |
| US-TBD   | Display a warning banner when localStorage is unavailable | P1 | To Do | NFR 5.3                      |

> **Story template:** See `specs/templates/user-story-template.md` for the standard format.

---

## Appendix

### Open Questions

| #  | Question                                                                              | Owner       | Due Date   | Status |
|----|---------------------------------------------------------------------------------------|-------------|------------|--------|
| 1  | Should task descriptions support multi-line text (textarea) or single-line input for MVP? | Product / Dev | 2026-05-12 | Open |
| 2  | Should deleted tasks be hard-deleted immediately, or soft-deleted (recoverable within session)? | Product | 2026-05-12 | Open |

### Revision History

| Version | Date       | Author              | Summary of Changes |
|---------|------------|---------------------|--------------------|
| 1.0     | 2026-05-05 | GitHub Copilot (AI) | Initial draft      |
