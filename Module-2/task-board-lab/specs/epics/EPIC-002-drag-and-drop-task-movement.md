# Epic: Drag-and-Drop Task Movement

**Epic ID:** EPIC-002  
**Status:** Draft  
**PRD Reference:** PRD-task-board-mvp.md  
**Owner:** TBD  
**Target Release:** TBD  
**Created:** 2026-05-05  
**Last Updated:** 2026-05-05

---

## 1. Description

This epic adds drag-and-drop interaction so users can move task cards between columns — and reorder them within a column — using a mouse or touch input. It transforms the board from a data-entry tool into an intuitive visual workflow manager, directly reducing the time it takes to update task status. It depends on EPIC-001 for the task card and column components and, once complete, unblocks EPIC-004's performance hardening of the drag interaction.

---

## 2. Primary Persona

**Persona:** Alex — Senior Freelance Developer  
**Why this persona:** Alex reviews and updates the board at the start and end of every workday; drag-and-drop is the fastest way to reflect changing priorities across 2–3 projects without context-switching.

> **Secondary personas (optional):** Jordan — Junior Developer / CS Student

---

## 3. Success Criteria

- [ ] **SC-01:** A user can drag a task card from any column and drop it on any other column; the card appears in the target column and the change is reflected in `localStorage` immediately (aligned to PRD metric: *localStorage persistence reliability 100%*).
- [ ] **SC-02:** Dropping a card outside any valid drop zone animates the card back to its origin column; `localStorage` is not modified (aligned to PRD metric: *localStorage persistence reliability 100%*).
- [ ] **SC-03:** A user can drag a task card to reorder it within its current column; the new order is persisted to `localStorage` (aligned to PRD metric: *localStorage persistence reliability 100%*).
- [ ] **SC-04:** The drag-and-drop interaction functions correctly on touch-screen devices (aligned to FR-04: "mouse or touch input").
- [ ] **SC-05:** Moving a task between columns via drag-and-drop can be completed in a single fluid gesture; end-to-end gesture time is ≤ 2 seconds in user testing (supports PRD metric: *Time-to-first-task ≤ 30 seconds* for workflow efficiency).

---

## 4. Scope & Complexity

**Estimate:** M

| Factor                 | Assessment                                                                               |
|------------------------|------------------------------------------------------------------------------------------|
| **UI Complexity**      | High — drag handles, drop-zone highlight states, drag preview, card snap-back animation  |
| **Backend Complexity** | None — frontend-only                                                                     |
| **Integrations**       | None — uses a React DnD library (e.g., `@dnd-kit/core`) or native HTML5 Drag and Drop API |
| **Data Migration**     | Not Required — adds `order` field to existing task schema; handled via `taskboard:version` bump in EPIC-001 |
| **New Infrastructure** | Not Required                                                                             |
| **Unknowns / Risks**   | Touch event support varies across browsers; chosen DnD library must be verified for iOS Safari and Android Chrome |

> **Out of Scope:** Keyboard-based task movement (←/→ shortcuts) — that is owned by EPIC-003.

---

## 5. Dependencies

### Upstream Dependencies

| ID       | Dependency                                           | Type  | Status  |
|----------|------------------------------------------------------|-------|---------|
| EPIC-001 | Task cards and column components must exist in the DOM | Epic  | Pending |

### Downstream Dependents

| ID       | Dependent Epic / Feature              | Notes                                                        |
|----------|---------------------------------------|--------------------------------------------------------------|
| EPIC-004 | Performance, Quality & Polish         | DnD frame-rate benchmarking (30 fps at 200 tasks) cannot be measured until DnD exists |

---

## 6. User Stories

| Story ID | Title                                                     | Priority | Status | Link / Notes |
|----------|-----------------------------------------------------------|----------|--------|--------------|
| US-TBD   | Move a task to a different column via drag and drop       | P0       | To Do  | FR-04        |
| US-TBD   | Snap a task card back when dropped outside a valid zone   | P1       | To Do  | FR-04 alt flow |
| US-TBD   | Reorder tasks within a column via drag and drop           | P2       | To Do  | FR-10        |
| US-TBD   | Support drag-and-drop on touch devices                    | P1       | To Do  | FR-04        |

> **Story template:** See `specs/templates/user-story-template.md` for the standard format.

---

## Appendix

### Open Questions

| #  | Question                                                                                     | Owner | Due Date   | Status |
|----|----------------------------------------------------------------------------------------------|-------|------------|--------|
| 1  | Should we use `@dnd-kit/core` or the native HTML5 Drag and Drop API? (`@dnd-kit` has better accessibility but adds a dependency.) | Dev | 2026-05-12 | Open |
| 2  | Is there a hard cap on tasks per column (e.g., 50) that would simplify the reorder logic?    | Dev   | 2026-05-12 | Open   |

### Revision History

| Version | Date       | Author              | Summary of Changes |
|---------|------------|---------------------|--------------------|
| 1.0     | 2026-05-05 | GitHub Copilot (AI) | Initial draft      |
