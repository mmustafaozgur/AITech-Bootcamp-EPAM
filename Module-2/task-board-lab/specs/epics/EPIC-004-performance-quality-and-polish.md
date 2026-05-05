# Epic: Performance, Quality & Polish

**Epic ID:** EPIC-004  
**Status:** Draft  
**PRD Reference:** PRD-task-board-mvp.md  
**Owner:** TBD  
**Target Release:** TBD  
**Created:** 2026-05-05  
**Last Updated:** 2026-05-05

---

## 1. Description

This epic hardens the completed board against performance, reliability, and quality targets defined in the PRD: achieving a Lighthouse Performance score ≥ 90, maintaining ≥ 30 fps with 200 tasks during drag-and-drop, reaching ≥ 80% test coverage, and adding the column task-count badge. It represents the "ship-ready" gate that turns a working prototype into a production-quality release. It depends on EPIC-001, EPIC-002, and EPIC-003 being functionally complete before measurement and optimisation can be finalised.

---

## 2. Primary Persona

**Persona:** Jordan — Junior Developer / CS Student  
**Why this persona:** Jordan switches tasks multiple times per session and is most sensitive to UI lag and unexpected data loss; hitting the performance and reliability targets directly improves Jordan's daily experience on a lower-powered machine.

> **Secondary personas (optional):** Alex — Senior Freelance Developer

---

## 3. Success Criteria

- [ ] **SC-01:** The app scores ≥ 90 on Lighthouse Performance (desktop) in the Lighthouse CI job on every pull request (aligned to PRD metric: *Lighthouse Performance score ≥ 90*).
- [ ] **SC-02:** Frame rendering stays above 30 fps (≤ 33 ms/frame) when the board contains 200 tasks and a drag-and-drop operation is in progress, profiled via Chrome DevTools Performance panel (aligned to NFR 5.4).
- [ ] **SC-03:** Unit and integration test coverage for all utility functions and custom hooks is ≥ 80%, reported by `vitest --coverage` in CI (aligned to NFR 5.6).
- [ ] **SC-04:** Each column header displays a live task-count badge that updates immediately after any create, delete, or move operation (aligned to FR-09).
- [ ] **SC-05:** `localStorage` read/write operations complete in ≤ 50 ms for a board of 200 tasks, verified by a `performance.now()` Vitest benchmark (aligned to NFR 5.1).

---

## 4. Scope & Complexity

**Estimate:** S

| Factor                 | Assessment                                                                                          |
|------------------------|-----------------------------------------------------------------------------------------------------|
| **UI Complexity**      | Low — column badge is a small UI addition; visual polish is CSS-only                                |
| **Backend Complexity** | None — frontend-only                                                                                |
| **Integrations**       | Lighthouse CI (GitHub Actions or similar) for automated score reporting                            |
| **Data Migration**     | Not Required                                                                                        |
| **New Infrastructure** | Required — Lighthouse CI pipeline configuration; Vitest coverage reporting in CI                   |
| **Unknowns / Risks**   | Lighthouse score is sensitive to bundle size; third-party DnD library (from EPIC-002) may impact score — tree-shaking must be verified |

> **Out of Scope:** New functional features (drag-and-drop, keyboard shortcuts) — those are in EPIC-002 and EPIC-003 respectively.

---

## 5. Dependencies

### Upstream Dependencies

| ID       | Dependency                                                                     | Type  | Status  |
|----------|--------------------------------------------------------------------------------|-------|---------|
| EPIC-001 | Full functional surface (CRUD, persistence) must be built before coverage can be measured | Epic | Pending |
| EPIC-002 | Drag-and-drop implementation must exist before DnD frame-rate can be profiled  | Epic  | Pending |
| EPIC-003 | Keyboard features must be complete before WCAG audit is finalised              | Epic  | Pending |

### Downstream Dependents

No downstream dependents identified. EPIC-004 is the final epic in the sequence.

---

## 6. User Stories

| Story ID | Title                                                                    | Priority | Status | Link / Notes       |
|----------|--------------------------------------------------------------------------|----------|--------|--------------------|
| US-TBD   | Display a task-count badge on each column header                         | P2       | To Do  | FR-09              |
| US-TBD   | Configure Lighthouse CI to enforce a Performance score ≥ 90 on each PR  | P1       | To Do  | NFR 5.1            |
| US-TBD   | Achieve ≥ 80% Vitest coverage for utility functions and custom hooks     | P1       | To Do  | NFR 5.6            |
| US-TBD   | Profile and fix any frame-rate drops during drag with 200 tasks          | P1       | To Do  | NFR 5.4            |
| US-TBD   | Benchmark and optimise localStorage read/write to ≤ 50 ms for 200 tasks | P1       | To Do  | NFR 5.1            |

> **Story template:** See `specs/templates/user-story-template.md` for the standard format.

---

## Appendix

### Open Questions

| #  | Question                                                                                           | Owner | Due Date   | Status |
|----|----------------------------------------------------------------------------------------------------|-------|------------|--------|
| 1  | Should the Lighthouse CI check be a required status check (blocks merge) or advisory only?         | Dev   | 2026-05-12 | Open   |
| 2  | Is 80% coverage a floor for the entire codebase or only for utility functions and hooks as stated in the NFR? | Dev | 2026-05-12 | Open |

### Revision History

| Version | Date       | Author              | Summary of Changes |
|---------|------------|---------------------|--------------------|
| 1.0     | 2026-05-05 | GitHub Copilot (AI) | Initial draft      |
