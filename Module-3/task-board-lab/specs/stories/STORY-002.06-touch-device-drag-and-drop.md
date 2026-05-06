# User Story: Support Drag-and-Drop on Touch Devices

**Story ID:** US-002.06  
**Epic:** EPIC-002 — Drag-and-Drop Task Movement  
**Status:** Draft  
**Assignee:** TBD  
**Sprint / Iteration:** TBD  
**Created:** 2026-05-05  
**Last Updated:** 2026-05-05

---

## 1. User Story

> **As a** Jordan (Junior Developer / CS Student),  
> **I want to** drag and drop task cards using my finger on a touchscreen,  
> **so that** the board is fully usable on my tablet without needing a mouse.

---

## 2. Acceptance Criteria

- **AC-01:**  
  Given I am on a touch device,  
  When I press and hold a task card for the activation delay,  
  Then the card lifts visually indicating it is being dragged.

- **AC-02:**  
  Given I am dragging a card on a touch device,  
  When I move my finger over a target column,  
  Then that column highlights as a valid drop zone (consistent with the mouse behaviour in US-002.03).

- **AC-03:**  
  Given I lift my finger over a valid target column on a touch device,  
  When the drag ends,  
  Then the task is moved to that column and the change is persisted to `taskboard:tasks` in `localStorage`.

- **AC-04:**  
  Given I lift my finger outside any column on a touch device,  
  When the drag ends,  
  Then the card snaps back to its original column and `localStorage` is unchanged.

---

## 3. Technical Notes

- Add `TouchSensor` from `@dnd-kit/core` to the `sensors` array in `DndContext`:
  ```tsx
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 5 } })
  );
  ```
- The `delay` prevents conflicts with native scroll on touch devices.
- Test on iOS Safari 17+ and Android Chrome 120+ (per EPIC-002 risk register).
- Verify that the existing `onDragEnd` handler works identically for touch events — no separate touch code path should be needed.

---

## 4. Estimation

| Field            | Value                                                                           |
|------------------|---------------------------------------------------------------------------------|
| **Story Points** | 2                                                                               |
| **Alt. (Days)**  | 1 day                                                                           |
| **Confidence**   | Medium                                                                          |
| **Sizing Notes** | `TouchSensor` configuration is small; the uncertainty is cross-browser touch testing on real or emulated devices. |

---

## 5. Dependencies & Blockers

| ID / Reference | Description                                                           | Status  |
|----------------|-----------------------------------------------------------------------|---------|
| US-002.02      | Core DnD move logic must be in place before touch sensor is layered in | Pending |

---

## 6. INVEST Checklist

- [x] **I — Independent:** Additive sensor configuration on top of existing DnD; no other story blocks it.
- [x] **N — Negotiable:** Activation delay and tolerance values are tunable.
- [x] **V — Valuable:** Enables tablet users to interact with the board; broadens addressable audience.
- [x] **E — Estimable:** `@dnd-kit` `TouchSensor` is documented; medium confidence due to device testing.
- [x] **S — Small:** Completable in 1 day including device emulation testing.
- [x] **T — Testable:** AC-01 to AC-04 verifiable via touch event simulation in RTL/Playwright; confirm on physical device or BrowserStack.

---

## 7. Notes & Discussion

| # | Note / Question                                                                       | Author              | Date       |
|---|---------------------------------------------------------------------------------------|---------------------|------------|
| 1 | Ensure `activationConstraint.delay` does not interfere with native vertical scroll on mobile — consider adding a distance tolerance. | GitHub Copilot (AI) | 2026-05-05 |
