# User Story: Snap Card Back When Dropped Outside a Valid Zone

**Story ID:** US-002.04  
**Epic:** EPIC-002 — Drag-and-Drop Task Movement  
**Status:** Draft  
**Assignee:** TBD  
**Sprint / Iteration:** TBD  
**Created:** 2026-05-05  
**Last Updated:** 2026-05-05

---

## 1. User Story

> **As a** Alex (Senior Freelance Developer),  
> **I want to** have a dragged card return to its original position if I drop it somewhere invalid,  
> **so that** accidental drops never misplace or lose my tasks.

---

## 2. Acceptance Criteria

- **AC-01:**  
  Given I am dragging a task card,  
  When I release it outside any column drop zone (e.g., over the page header or sidebar),  
  Then the card animates back to its original column and position.

- **AC-02:**  
  Given the card has snapped back to its origin,  
  When I inspect `localStorage`,  
  Then `taskboard:tasks` is unchanged (the task's `status` and `order` are unmodified).

- **AC-03:**  
  Given I am on a touch device and lift my finger outside a valid drop zone,  
  When the drag ends,  
  Then the card also returns to its original column and position.

- **AC-04:**  
  Given I press Escape during an active drag,  
  When the drag is cancelled,  
  Then the card returns to its original position without triggering any state or `localStorage` mutation.

---

## 3. Technical Notes

- `@dnd-kit` fires `onDragEnd` with `event.over === null` when released outside a droppable; the existing guard in US-002.02 already skips the `moveTask` call in this case.
- Visual snap-back: apply a CSS `transition: transform 200ms ease` on the card element; when `transform` resets to `null` after drag end, the browser animates the return.
- No additional animation library is needed.
- `@dnd-kit` does not provide a built-in "cancel drag on Escape" handler by default; add a `keydown` listener on `DndContext` to call `useSensor`'s cancel mechanism, or use `KeyboardSensor` from `@dnd-kit/core`.

---

## 4. Estimation

| Field            | Value                                                                            |
|------------------|----------------------------------------------------------------------------------|
| **Story Points** | 2                                                                                |
| **Alt. (Days)**  | 1 day                                                                            |
| **Confidence**   | High                                                                             |
| **Sizing Notes** | Guard logic already exists from US-002.02; main work is the CSS animation and Escape cancellation. |

---

## 5. Dependencies & Blockers

| ID / Reference | Description                                                        | Status  |
|----------------|--------------------------------------------------------------------|---------|
| US-002.02      | `onDragEnd` guard for `event.over === null` must be in place first | Pending |

---

## 6. INVEST Checklist

- [x] **I — Independent:** Polishes existing US-002.02 drop logic; no other stories block it.
- [x] **N — Negotiable:** Animation duration and easing are flexible.
- [x] **V — Valuable:** Prevents data loss from accidental drops — a key user trust feature.
- [x] **E — Estimable:** CSS animation + Escape handler; well-understood scope.
- [x] **S — Small:** Completable in 1 day.
- [x] **T — Testable:** AC-01/AC-03 verifiable via pointer event simulation; AC-02 via `localStorage` assertion; AC-04 via keyboard event simulation.

---

## 7. Notes & Discussion

| # | Note / Question                                                                   | Author              | Date       |
|---|-----------------------------------------------------------------------------------|---------------------|------------|
| 1 | If `@dnd-kit`'s `KeyboardSensor` is added for Escape cancellation, it also enables basic keyboard navigation of DnD — coordinate with EPIC-003. | GitHub Copilot (AI) | 2026-05-05 |
