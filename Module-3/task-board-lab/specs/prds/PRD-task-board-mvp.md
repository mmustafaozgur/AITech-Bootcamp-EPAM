# Product Requirements Document (PRD)

**Project Name:** Personal Task Board MVP  
**Version:** 1.0  
**Status:** Draft  
**Author(s):** AI-generated (GitHub Copilot)  
**Last Updated:** 2026-05-05  
**Stakeholders:** Solo developers, freelancers, students managing personal projects

---

## 1. Overview

### 1.1 Purpose
This document defines the requirements for a browser-based, frontend-only Kanban task board that lets solo developers manage work across multiple projects without installing or configuring heavyweight project management tools.

### 1.2 Problem Statement
Solo developers managing 2–3 concurrent projects lose an estimated **30 minutes per day** navigating tools like Jira that were designed for multi-person teams (labelled assumption: based on widely-cited developer productivity research showing 20–30 min/day overhead for project management tooling on small teams). Free-tier alternatives typically require account creation and impose feature limits after 30 days. Without a lightweight, zero-setup option, developers resort to sticky notes or unstructured text files, which provide no visual workflow status, no keyboard efficiency, and no persistence across sessions. Left unsolved, this overhead compounds to **~2.5 hours of lost productivity per week** per developer.

### 1.3 Goals

- **Goal 1:** Enable a developer to capture, organise, and move tasks across a 3-column Kanban board within 30 seconds of first opening the app.
- **Goal 2:** Reduce daily task-management overhead from an estimated 30 minutes to under 5 minutes by providing keyboard-shortcut-driven workflows and instant drag-and-drop interaction.
- **Goal 3:** Eliminate any dependency on a backend service or user account by persisting all board data to `localStorage`, making the tool work fully offline with zero setup.

---

## 2. User Personas

> Who are we building for?

### Persona 1: Alex
| Attribute      | Detail                                                                                  |
|----------------|-----------------------------------------------------------------------------------------|
| **Role**       | Senior Freelance Developer                                                              |
| **Age Range**  | 28–40                                                                                   |
| **Tech Level** | High                                                                                    |
| **Goals**      | Track tasks across 2–3 active client projects without switching between heavy tools    |
| **Pain Points**| Jira and Linear are overkill for solo work; require account login and internet access  |
| **Context**    | Reviews and updates the board at the start and end of every workday                    |

> *"I just need to see what I'm working on today without logging into a dozen services."*

### Persona 2: Jordan
| Attribute      | Detail                                                                                           |
|----------------|--------------------------------------------------------------------------------------------------|
| **Role**       | Junior Developer / CS Student                                                                    |
| **Age Range**  | 20–27                                                                                            |
| **Tech Level** | Medium                                                                                           |
| **Goals**      | Stay organised across personal projects and learning tasks without paying for a tool             |
| **Pain Points**| Free tiers of popular tools lock features after 30 days or require sign-up and email verification |
| **Context**    | Uses the board throughout the day, switching tasks multiple times per session                    |

> *"Every task board app wants me to create an account and then charges me after a month."*

---

## 3. Use Cases

> Key scenarios the system must support.

### UC-01: Create a New Task
- **Actor:** Solo developer (Alex or Jordan)
- **Precondition:** The app is open in a modern browser; the board is displayed.
- **Steps:**
  1. User clicks the "Add Task" button in any column header, or presses the `N` keyboard shortcut.
  2. An inline form or modal appears with a required **Title** field and an optional **Description** field.
  3. User enters a title (1–200 characters) and optionally a description.
  4. User clicks **Save** or presses `Enter`.
- **Postcondition:** A new task card appears at the bottom of the "To Do" column; the task is serialised and written to `localStorage` under `taskboard:tasks`.
- **Alternate Flows:** User presses `Escape` or clicks **Cancel** — the form closes, no task is created, `localStorage` is unchanged.

### UC-02: Move a Task via Drag and Drop
- **Actor:** Solo developer
- **Precondition:** At least one task card exists on the board.
- **Steps:**
  1. User clicks and holds a task card.
  2. User drags the card to a target column (To Do, In Progress, or Done).
  3. User releases the mouse button over the column.
- **Postcondition:** The task card appears in the target column; the task's `status` field is updated in `localStorage`.
- **Alternate Flows:** User drops the card outside any valid column drop zone — the card animates back to its original column; `localStorage` is not modified.

### UC-03: Move a Task via Keyboard Shortcut
- **Actor:** Solo developer (power user)
- **Precondition:** At least one task card exists; the user has focused a task card using `Tab` or arrow-key navigation.
- **Steps:**
  1. User navigates to a task card with `Tab` or arrow keys; the card shows a visible focus ring.
  2. User presses `→` (right arrow) to move the task to the next column, or `←` (left arrow) to move to the previous column.
- **Postcondition:** The task moves to the adjacent column; the change is persisted to `localStorage`; focus follows the card to its new position.
- **Alternate Flows:** Task is already in the first or last column — the shortcut has no effect and no error is shown; `localStorage` is unchanged.

### UC-04: Edit an Existing Task
- **Actor:** Solo developer
- **Precondition:** A task card exists on the board.
- **Steps:**
  1. User double-clicks a task card, or focuses it and presses `E`.
  2. The task title and description fields become editable in place.
  3. User modifies the title and/or description.
  4. User clicks **Save** or presses `Enter`.
- **Postcondition:** The task card displays the updated content; `localStorage` is updated.
- **Alternate Flows:** User presses `Escape` or clicks **Cancel** — fields revert to previous values; `localStorage` is unchanged.

### UC-05: Delete a Task
- **Actor:** Solo developer
- **Precondition:** At least one task card exists on the board.
- **Steps:**
  1. User clicks the delete icon (×) on a task card, or focuses the card and presses `Delete`.
  2. A confirmation prompt appears: "Delete this task? This cannot be undone."
  3. User confirms.
- **Postcondition:** The task card is removed from the board; the task entry is deleted from `localStorage`.
- **Alternate Flows:** User cancels the confirmation — the task remains on the board; `localStorage` is unchanged.

### UC-06: Restore Board State on Page Reload
- **Actor:** Browser (system-initiated)
- **Precondition:** The user has created tasks in a previous session; data is stored in `localStorage`.
- **Steps:**
  1. User closes the browser tab or refreshes the page.
  2. User reopens the app URL.
  3. The app reads `taskboard:tasks` from `localStorage` on mount.
- **Postcondition:** All tasks are displayed in their correct columns exactly as they were before the reload.
- **Alternate Flows:** `localStorage` is unavailable (private browsing, quota exceeded) — the app displays a non-blocking warning banner ("Storage unavailable — changes will not be saved") and operates in-memory for the session.

---

## 4. Functional Requirements

> What the system **must** do.

Use priority levels: **P0** = Must have (launch blocker) | **P1** = Should have | **P2** = Nice to have

| ID    | Requirement                                                                                                 | Priority | Notes                                                          |
|-------|-------------------------------------------------------------------------------------------------------------|----------|----------------------------------------------------------------|
| FR-01 | The app shall render a 3-column Kanban board with fixed columns labelled "To Do", "In Progress", and "Done". | P0       | Core layout; without this nothing works                        |
| FR-02 | Users shall be able to create a task with a required title (max 200 chars) and an optional description.     | P0       | Minimum viable data capture                                    |
| FR-03 | All tasks and their column assignments shall be persisted to `localStorage` under the key `taskboard:tasks` using JSON serialisation after every mutation. | P0 | Data must survive page reload             |
| FR-04 | Tasks shall be movable between columns via drag and drop using a mouse or touch input.                      | P0       | Core UX interaction                                            |
| FR-05 | Users shall be able to delete a task from any column, with a confirmation step to prevent accidental deletion. | P0    | Data integrity; launch blocker                                 |
| FR-06 | The app shall restore all tasks and column assignments from `localStorage` on every page load.              | P0       | Seamless session continuity; launch blocker                    |
| FR-07 | Users shall be able to edit a task's title and description after creation.                                  | P1       | Required for task updates                                      |
| FR-08 | Tasks shall be movable between columns using keyboard shortcuts (`←` / `→` when a card is focused).        | P1       | Accessibility and power-user feature                           |
| FR-09 | Each column header shall display a badge showing the current count of tasks in that column.                 | P2       | Useful at-a-glance indicator                                   |
| FR-10 | Users shall be able to reorder tasks within a column via drag and drop.                                     | P2       | Enhanced UX; deferred if time-constrained                      |

---

## 5. Non-Functional Requirements

> Quality attributes the system must satisfy.

### 5.1 Performance
- Initial First Contentful Paint (FCP) must be ≤ 1.5 seconds on a desktop with a ≥ 10 Mbps connection, measured via Lighthouse CI on every PR.
- `localStorage` read/write operations must complete in ≤ 50 ms for a board containing up to 200 tasks, measured via `performance.now()` in a Vitest benchmark.

### 5.2 Security
- All user-supplied text (task title, description) must be rendered as plain text (never via `innerHTML` with raw input) to prevent XSS injection.
- The app must not transmit any data over the network; all state must remain client-side in `localStorage`.
- All npm dependencies must pass `npm audit` with zero critical or high CVEs at time of release.

### 5.3 Reliability & Availability
- The app must function fully offline after the initial page load (no runtime network requests); verified via the Lighthouse "Works offline" audit returning a passing score.
- If `localStorage` is unavailable, the app must display a non-blocking warning banner within 1 second of detection and continue operating in-memory for the session without crashing.

### 5.4 Scalability
- The UI must maintain frame rendering above 30 fps (≤ 33 ms per frame) when the board contains up to 200 tasks across all columns, profiled via Chrome DevTools Performance panel.
- The `localStorage` data format must include a `taskboard:version` key so that future schema migrations can be applied without data loss.

### 5.5 Usability & Accessibility
- All interactive elements (task cards, buttons, add-task inputs) must be keyboard-navigable and must display a visible focus indicator with a colour contrast ratio of ≥ 3:1 between the focus ring and the adjacent background, conforming to WCAG 2.1 AA Success Criterion 2.4.11.
- A first-time user must be able to create their first task within 3 clicks or fewer from the moment the app loads, validated in a 5-participant usability study.

### 5.6 Maintainability
- Unit and integration test coverage for all utility functions and custom hooks must be ≥ 80%, measured via the Vitest `--coverage` report in CI.
- No React component file may exceed 150 lines; any component whose state logic exceeds 3 `useState` calls must have that logic extracted into a custom hook.

---

## 6. Success Metrics

> How we measure whether this product/feature is successful.

| Metric                                    | Baseline                                      | Target                                     | Measurement Method                                                             |
|-------------------------------------------|-----------------------------------------------|--------------------------------------------|--------------------------------------------------------------------------------|
| Time-to-first-task (new user)             | Not measured (assumed ≥ 60 s for Jira MVP)   | ≤ 30 seconds from page load to saved task | Screen-recorded usability session with 5 participants; median task time logged |
| localStorage persistence reliability      | 0% (new feature, no baseline)                | 100% of tasks restored after page reload  | Automated Vitest integration test: create 10 tasks, reload, assert count = 10  |
| Lighthouse Performance score (desktop)    | 0 (not yet measured; app not built)          | ≥ 90                                       | Lighthouse CI job on every pull request                                        |
| Keyboard shortcut adoption (task moves)   | 0% (new feature)                             | ≥ 40% of task moves via keyboard          | Observed and counted in 5-participant usability study                          |

**Review cadence:** Metrics will be reviewed at the end of each 2-week sprint for the first 6 weeks post-launch, then monthly thereafter.

---

## 7. Scope

### 7.1 In Scope
> Features and work explicitly included in this release.

- 3-column Kanban board with fixed columns: To Do, In Progress, Done
- Task CRUD: create, view, edit (title + description), and delete
- Drag-and-drop task movement between columns
- Keyboard shortcut navigation (`←` / `→`) for moving tasks between columns
- `localStorage` persistence with the `taskboard:` key prefix and version tracking
- Column task-count badges
- Session restoration from `localStorage` on page load
- Non-blocking warning banner when `localStorage` is unavailable

### 7.2 Out of Scope
> Features explicitly excluded from this release (with rationale).

| Item                               | Rationale                                                                                     |
|------------------------------------|-----------------------------------------------------------------------------------------------|
| User authentication / multi-user   | No backend by design; the tool is intentionally single-user; deferred to v2.0 if needed       |
| Cloud sync / remote persistence    | Requires a backend service; explicitly out of scope for MVP; deferred to v2.0                 |
| Custom columns (add/rename/delete) | Fixed 3-column Kanban is sufficient for MVP; added complexity deferred to v2.0                |
| Due dates, labels, and priority flags | Risk of scope creep for MVP; deferred to v2.0 after validating core board adoption         |
| Mobile / responsive layout         | Primary target is desktop browsers; mobile optimisation deferred to post-MVP                  |

### 7.3 Assumptions & Constraints
- **Assumption:** Users have a modern browser (Chrome 120+, Firefox 120+, or Safari 17+) with `localStorage` enabled and at least 5 MB of available storage quota.
- **Assumption:** "30 minutes/day overhead for solo Jira use" is a labelled estimate; actual savings will be validated in the usability study.
- **Constraint:** No backend, no API calls, no environment secrets — all persistence must use `localStorage`.
- **Constraint:** Tech stack is fixed: React 18 + Vite + TypeScript (strict mode, `no any`).
- **Constraint:** All styling must use CSS Modules or Tailwind; no inline style objects for layout.

---

## Appendix

### Open Questions
| #  | Question                                                                              | Owner              | Due Date   | Status |
|----|---------------------------------------------------------------------------------------|--------------------|------------|--------|
| 1  | Should task descriptions support multi-line text, or is a single-line title sufficient for MVP? | Product / Dev | 2026-05-12 | Open   |
| 2  | Is there a hard cap on tasks per column for UX/performance reasons (e.g., 50 tasks)?  | Dev                | 2026-05-12 | Open   |
| 3  | Should deleted tasks be soft-deleted (recoverable) or hard-deleted immediately?       | Product            | 2026-05-12 | Open   |

### Revision History
| Version | Date       | Author              | Summary of Changes |
|---------|------------|---------------------|--------------------|
| 1.0     | 2026-05-05 | GitHub Copilot (AI) | Initial draft      |
