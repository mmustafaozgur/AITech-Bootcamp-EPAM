# Epic: Keyboard Accessibility & Navigation

**Epic ID:** EPIC-003  
**Status:** Draft  
**PRD Reference:** PRD-task-board-mvp.md  
**Owner:** TBD  
**Target Release:** TBD  
**Created:** 2026-05-05  
**Last Updated:** 2026-05-05

---

## 1. Description

This epic delivers keyboard-driven task management: users can navigate to any task card via `Tab` or arrow keys, move cards between columns with `←` / `→` shortcuts, and trigger create/edit/delete actions without touching the mouse. It makes the board a power-user and accessibility tool, directly addressing WCAG 2.1 AA compliance and the PRD's keyboard-shortcut adoption metric. It depends on EPIC-001 for the board structure and task cards, but is independent of EPIC-002's drag-and-drop work.

---

## 2. Primary Persona

**Persona:** Alex — Senior Freelance Developer  
**Why this persona:** Alex is a high-tech-level user who reviews the board daily and will benefit most from keyboard-shortcut efficiency; reducing the need to context-switch to a mouse during a coding session is a primary pain-point driver.

> **Secondary personas (optional):** Jordan — Junior Developer / CS Student

---

## 3. Success Criteria

- [ ] **SC-01:** A user can navigate to any task card on the board using `Tab` and/or arrow keys; each focused card displays a visible focus ring with a colour contrast ratio of ≥ 3:1, conforming to WCAG 2.1 AA SC 2.4.11 (aligned to NFR 5.5).
- [ ] **SC-02:** A user can press `←` or `→` on a focused task card to move it to the adjacent column; the move is persisted to `localStorage` and focus follows the card to its new position (aligned to PRD metric: *Keyboard shortcut adoption ≥ 40% of task moves*).
- [ ] **SC-03:** A user can press `N` to open the new-task form without clicking; the form is keyboard-navigable and submittable via `Enter` (aligned to PRD metric: *Time-to-first-task ≤ 30 seconds*).
- [ ] **SC-04:** A user can press `E` on a focused card to enter edit mode, and `Escape` to cancel without saving (aligned to PRD functional requirement FR-07 and UC-04).
- [ ] **SC-05:** A user can press `Delete` on a focused card to trigger the confirmation prompt; `Enter` confirms deletion and `Escape` cancels it — all without mouse interaction (aligned to PRD metric: *localStorage persistence reliability 100%*).

---

## 4. Scope & Complexity

**Estimate:** S

| Factor                 | Assessment                                                                                      |
|------------------------|-------------------------------------------------------------------------------------------------|
| **UI Complexity**      | Medium — focus ring styling, `aria-` attributes on cards and columns, keyboard event handlers   |
| **Backend Complexity** | None — frontend-only                                                                            |
| **Integrations**       | None                                                                                            |
| **Data Migration**     | Not Required                                                                                    |
| **New Infrastructure** | Not Required                                                                                    |
| **Unknowns / Risks**   | Keyboard event conflicts with browser or OS shortcuts (e.g., `←`/`→` in text inputs); event handlers must be scoped to card focus only |

> **Out of Scope:** Drag-and-drop interaction — that is owned by EPIC-002.

---

## 5. Dependencies

### Upstream Dependencies

| ID       | Dependency                                                        | Type  | Status  |
|----------|-------------------------------------------------------------------|-------|---------|
| EPIC-001 | Task card and column DOM components must exist and be rendered    | Epic  | Pending |

### Downstream Dependents

| ID       | Dependent Epic / Feature      | Notes                                                                      |
|----------|-------------------------------|----------------------------------------------------------------------------|
| EPIC-004 | Performance, Quality & Polish | WCAG audit and keyboard-adoption measurement cannot be finalised until keyboard features are complete |

---

## 6. User Stories

| Story ID | Title                                                                 | Priority | Status | Link / Notes  |
|----------|-----------------------------------------------------------------------|----------|--------|---------------|
| US-TBD   | Navigate task cards with Tab and arrow keys                           | P1       | To Do  | FR-08, NFR 5.5 |
| US-TBD   | Move a focused task to an adjacent column via ← / → keyboard shortcut | P1      | To Do  | FR-08         |
| US-TBD   | Open the new-task form via the N keyboard shortcut                    | P1       | To Do  | UC-01         |
| US-TBD   | Enter and exit task edit mode via E and Escape keyboard shortcuts     | P1       | To Do  | FR-07, UC-04  |
| US-TBD   | Trigger task deletion via the Delete keyboard shortcut                | P1       | To Do  | FR-05, UC-05  |

> **Story template:** See `specs/templates/user-story-template.md` for the standard format.

---

## Appendix

### Open Questions

| #  | Question                                                                                         | Owner | Due Date   | Status |
|----|--------------------------------------------------------------------------------------------------|-------|------------|--------|
| 1  | Should the `N` shortcut open the form pre-targeted to the "To Do" column always, or to whichever column the user last focused? | Product / Dev | 2026-05-12 | Open |
| 2  | Are there additional shortcuts needed for power users (e.g., `D` for done, `P` for in progress)? | Product | 2026-05-12 | Open |

### Revision History

| Version | Date       | Author              | Summary of Changes |
|---------|------------|---------------------|--------------------|
| 1.0     | 2026-05-05 | GitHub Copilot (AI) | Initial draft      |
