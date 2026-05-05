# ADR-001 — Use localStorage for All Data Persistence

**Date:** 2026-05-05  
**Status:** `Accepted`  
**Deciders:** Product / Engineering team

---

## Context

The Task Board is a single-page React application targeting solo developers who need a zero-setup, zero-account task board. There is no server-side component and no intention to introduce one in the MVP. The application must persist task data across browser sessions so that a page refresh does not reset the board. A mechanism must be chosen that works offline, requires no authentication, and is available natively in every modern browser.

---

## Decision

We will use the browser's `localStorage` API as the sole persistence layer, storing all task data serialised as JSON under the key prefix `taskboard:` (e.g., `taskboard:tasks`, `taskboard:version`).

---

## Consequences

### Positive
- Zero dependencies and zero infrastructure — `localStorage` is available in every modern browser with no setup.
- Works fully offline after the initial page load; no network requests required for any CRUD operation.
- Data is private to the user's device and browser profile; no account, login, or privacy policy needed for MVP.
- Instant read/write performance for typical board sizes (≤ 200 tasks); measured target of ≤ 50 ms per operation is easily achievable.

### Negative
- Data is not synchronised across devices or browsers; a user who switches machines starts with an empty board.
- `localStorage` has a per-origin storage quota of approximately 5 MB in most browsers; very large boards with long descriptions could hit this limit.
- `localStorage` is synchronous — large serialisation operations on the main thread can cause jank; mitigated by debouncing writes if needed.
- Data can be lost if the user clears browser storage or uses private/incognito browsing mode.

### Neutral / Trade-offs
- A `taskboard:version` key enables future schema migrations via a `migrations.ts` utility without breaking existing data.
- If multi-device sync is required in a future version, a backend + sync layer can be introduced; the storage utility (`storageUtils.ts`) is designed as a single abstraction point to make this swap easier.
- The application must handle `localStorage` being unavailable (private browsing, quota exceeded) gracefully — a non-blocking warning banner is shown (FR from PRD NFR 5.3, implemented in US-001.07).

---

## Alternatives Considered

| Option | Pros | Cons | Reason Rejected |
|--------|------|------|-----------------|
| **IndexedDB** | Larger storage quota (~unlimited); asynchronous; supports structured data | Significantly more complex API; requires a wrapper library (e.g., `idb`) for ergonomic use; async adds complexity to all data flows | Overkill for MVP data volumes; adds unnecessary dependency and complexity |
| **sessionStorage** | Same API as `localStorage`; data cleared on tab close prevents stale data | Data does not survive page reload or new tabs; violates the core requirement of cross-session persistence | Fails the session-restore requirement (FR-06, UC-06) |
| **Backend REST API + database** | Enables multi-device sync, sharing, cloud backup | Requires server infrastructure, authentication, hosting costs, and backend code; directly violates the "no backend" constraint | Explicitly out of scope per PRD section 7.2; contradicts the zero-setup product vision |
| **File System Access API** | Persistent cross-session storage; user controls the file location | Not supported in all browsers (Firefox has limited support); requires user permission prompts on every save; poor UX | Poor browser support and disruptive UX for a quick task board |

---

## References

- [specs/prds/PRD-task-board-mvp.md](../prds/PRD-task-board-mvp.md) — Section 7.2 Out of Scope (Cloud sync), NFR 5.3 (localStorage unavailability handling)
- [specs/epics/EPIC-001-core-board-and-task-management.md](../epics/EPIC-001-core-board-and-task-management.md)
- [specs/stories/STORY-001.03-persist-tasks-to-localstorage.md](../stories/STORY-001.03-persist-tasks-to-localstorage.md)
- [specs/stories/STORY-001.04-restore-board-from-localstorage.md](../stories/STORY-001.04-restore-board-from-localstorage.md)
- [specs/stories/STORY-001.07-storage-unavailable-warning-banner.md](../stories/STORY-001.07-storage-unavailable-warning-banner.md)
