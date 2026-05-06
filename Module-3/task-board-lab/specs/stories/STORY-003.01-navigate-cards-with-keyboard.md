# User Story: Navigate Task Cards with Tab and Arrow Keys

**Story ID:** US-003.01  
**Epic:** EPIC-003 — Keyboard Accessibility & Navigation  
**Status:** Draft  
**Assignee:** TBD  
**Sprint / Iteration:** TBD  
**Created:** 2026-05-05  
**Last Updated:** 2026-05-05

---

## 1. User Story

> **As a** Alex (Senior Freelance Developer),  
> **I want to** move focus to any task card using the keyboard,  
> **so that** I can operate the board entirely without a mouse during a coding session.

---

## 2. Acceptance Criteria

- **AC-01:**  
  Given the board is displayed,  
  When I press Tab repeatedly,  
  Then focus moves sequentially through all interactive elements including task cards, and each receives a visible focus indicator.

- **AC-02:**  
  Given a task card has focus,  
  When I press the down arrow key,  
  Then focus moves to the next task card in the same column (if one exists).

- **AC-03:**  
  Given a task card has focus,  
  When I press the up arrow key,  
  Then focus moves to the previous task card in the same column (if one exists).

- **AC-04:**  
  Given a task card has focus and displays a focus ring,  
  When the focus ring colour and the adjacent background are measured,  
  Then the contrast ratio between the two is ≥ 3:1, conforming to WCAG 2.1 AA Success Criterion 2.4.11.

---

## 3. Technical Notes

- Add `tabIndex={0}` and `role="button"` to each `TaskCard.tsx` root element.
- Implement focus ring via `:focus-visible` in `TaskCard.module.css` (not `:focus`, to avoid mouse-click outlines).
- For arrow key navigation within a column, use a `keydown` handler on the column's container that calls `focus()` on the adjacent card ref.
- Use `useRef` arrays in `KanbanColumn.tsx` to track card refs; update the array on render.
- Do not override ↑/↓ keys when focus is inside an input or textarea (check `event.target.tagName`).

---

## 4. Estimation

| Field            | Value                                                                       |
|------------------|-----------------------------------------------------------------------------|
| **Story Points** | 2                                                                           |
| **Alt. (Days)**  | 1 day                                                                       |
| **Confidence**   | High                                                                        |
| **Sizing Notes** | `tabIndex`, `role`, focus ring CSS, and arrow-key handler — well-understood patterns. |

---

## 5. Dependencies & Blockers

| ID / Reference | Description                                               | Status  |
|----------------|-----------------------------------------------------------|---------|
| US-001.01      | Task cards and column DOM components must be rendered     | Pending |

---

## 6. INVEST Checklist

- [x] **I — Independent:** Depends only on EPIC-001's completed board; no EPIC-002 dependency.
- [x] **N — Negotiable:** Exact key bindings and focus ring style are flexible.
- [x] **V — Valuable:** Makes the board operable for keyboard-only and assistive-technology users.
- [x] **E — Estimable:** Standard accessibility pattern; no unknowns.
- [x] **S — Small:** Completable in 1 day.
- [x] **T — Testable:** AC-01 to AC-03 via RTL `userEvent.tab()` / `keyboard('{ArrowDown}')` assertions; AC-04 via automated accessibility audit (axe-core).

---

## 7. Notes & Discussion

| # | Note / Question                                                                       | Author              | Date       |
|---|---------------------------------------------------------------------------------------|---------------------|------------|
| 1 | Consider adding `aria-label` to each card (e.g., "Task: Fix login bug, status: To Do") for screen reader announcements. | GitHub Copilot (AI) | 2026-05-05 |
