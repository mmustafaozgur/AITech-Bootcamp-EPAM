# User Story: Highlight Drop Zones During an Active Drag

**Story ID:** US-002.03  
**Epic:** EPIC-002 — Drag-and-Drop Task Movement  
**Status:** Draft  
**Assignee:** TBD  
**Sprint / Iteration:** TBD  
**Created:** 2026-05-05  
**Last Updated:** 2026-05-05

---

## 1. User Story

> **As a** Alex (Senior Freelance Developer),  
> **I want to** see valid drop zones visually highlighted while I drag a card,  
> **so that** I know exactly where I can drop it without guessing.

---

## 2. Acceptance Criteria

- **AC-01:**  
  Given I begin dragging a task card,  
  When the card hovers over a column,  
  Then that column's background or border changes to a highlight colour distinct from its resting state.

- **AC-02:**  
  Given I am dragging a task card,  
  When the card is not over any column (e.g., over the page margin),  
  Then no column shows a highlight.

- **AC-03:**  
  Given a column is highlighted as a drop target,  
  When I release the card over it and the drop completes,  
  Then the column's highlight immediately returns to its resting visual state.

- **AC-04:**  
  Given I cancel the drag (press Escape),  
  When the drag is cancelled,  
  Then all column highlights are removed and the board returns to its resting state.

---

## 3. Technical Notes

- Use `isOver` returned by `useDroppable` in each `KanbanColumn.tsx` to conditionally apply a CSS class (e.g., `column--drop-active`).
- Define `column--drop-active` in `KanbanColumn.module.css` with a background-colour or border change.
- No new state required — `isOver` is reactive to the `DndContext` drag state.
- Accessibility note: highlight should not rely on colour alone; also add a border or pattern change to support colour-blind users.

---

## 4. Estimation

| Field            | Value                                                           |
|------------------|-----------------------------------------------------------------|
| **Story Points** | 1                                                               |
| **Alt. (Days)**  | 0.5 days                                                        |
| **Confidence**   | High                                                            |
| **Sizing Notes** | CSS class toggle via `isOver`; no logic changes; purely visual. |

---

## 5. Dependencies & Blockers

| ID / Reference | Description                                                                         | Status  |
|----------------|-------------------------------------------------------------------------------------|---------|
| US-002.02      | `useDroppable` must be on columns and `DndContext` active before `isOver` is available | Pending |

---

## 6. INVEST Checklist

- [x] **I — Independent:** Pure CSS enhancement on top of US-002.02; no other stories block it.
- [x] **N — Negotiable:** Exact highlight style (colour, border) is negotiable.
- [x] **V — Valuable:** Significantly improves affordance and discoverability of drop targets.
- [x] **E — Estimable:** Trivial; single CSS class toggle.
- [x] **S — Small:** Completable in half a day.
- [x] **T — Testable:** AC-01 to AC-04 verifiable via pointer event simulation + DOM class assertions.

---

## 7. Notes & Discussion

| # | Note / Question                                                             | Author              | Date       |
|---|-----------------------------------------------------------------------------|---------------------|------------|
| 1 | Consider adding a smooth CSS transition (200 ms) on the column background for a polished feel. | GitHub Copilot (AI) | 2026-05-05 |
