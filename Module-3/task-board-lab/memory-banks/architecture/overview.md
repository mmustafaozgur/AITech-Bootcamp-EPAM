# Architecture Overview - task-board-lab

This document provides architecture context for AI assistants implementing and reviewing the Personal Task Board MVP.

## System Architecture

### Pattern: Frontend Monolith (Client-Only SPA)
We use a frontend monolith architecture (single React application served as static assets) with no backend services.

Rationale:
- Matches PRD goal of zero setup and offline-first behavior.
- Minimizes operational complexity for solo developers and students.
- Reduces delivery time by keeping all logic in one deployable unit.

### Key Components and Responsibilities
- App Shell: bootstraps the UI, global layout, and routing boundary (if introduced later).
- Board View: renders fixed Kanban columns (To Do, In Progress, Done).
- Task Management Module: handles create, edit, delete, and validation for task entities.
- Interaction Module: handles drag-and-drop and keyboard movement interactions.
- Persistence Module: reads/writes board state to localStorage using taskboard:* keys and JSON.
- Resilience Module: detects storage unavailability and exposes a non-blocking warning banner.

Rationale:
- Component/module boundaries map directly to MVP functional requirements (FR-01 to FR-10).
- Clear separation allows AI assistants to change one behavior (for example persistence or interaction) without regressions in other areas.

### Communication Patterns
- Synchronous in-process communication: React state updates, props/callbacks, and hooks.
- Browser API interaction: localStorage API for persistence and restoration.
- No network communication: no REST, GraphQL, or message broker usage in MVP.

Rationale:
- Eliminates backend latency and account dependencies.
- Preserves deterministic behavior for offline usage and local testing.

### Data Flow
1. User action occurs (click, keyboard shortcut, drag/drop).
2. Interaction/task logic validates input and computes the next board state.
3. UI state updates immediately for responsive feedback.
4. Persistence module serializes and stores the updated state in localStorage.
5. On app load, state is restored from localStorage; if unavailable, app falls back to in-memory state and shows warning.

Rationale:
- Supports PRD persistence reliability target (100% restore in tests).
- Supports fast workflows needed by personas Alex and Jordan, who switch tasks frequently.

### Persona and Goal Alignment
- Alex (senior freelancer): needs low-overhead task switching across multiple projects; architecture prioritizes instant local interactions and keyboard support.
- Jordan (junior developer/student): needs free, no-login usage; architecture avoids paid services and account flows.
- Product goals supported: first task within 30 seconds, reduced daily overhead, zero backend dependency.

## Tech Stack

### Frontend
- Language: TypeScript (strict mode).
- Framework: React 18.
- Build Tool: Vite.
- State Management: React useState and useReducer (no Redux by default).
- Styling: CSS Modules (established by project ADR) with maintainable component-level styles.

Rationale:
- React + Vite provides fast iteration and lightweight runtime.
- Strict TypeScript increases safety for evolving task schemas and keyboard/drag interactions.

### Backend
- None (intentionally absent for MVP).

Rationale:
- Explicit PRD and project convention constraint: no server-side code, no external API calls.

### Data and Persistence
- Database type: Browser localStorage (client-side key-value store).
- Data format: JSON via JSON.stringify/JSON.parse.
- Key strategy: taskboard: prefix with version key support for migrations.

Rationale:
- Delivers offline persistence with zero infrastructure cost.
- Version key enables safe schema evolution without immediate backend introduction.

### Infrastructure and Tooling
- Build: Vite (fast HMR, optimized production bundles).
- Testing: Vitest + @testing-library/react (co-located tests, AC-driven coverage).
- Linting: ESLint with TypeScript rules.
- CI: GitHub Actions (lint, test, build on every push).
- Performance gate: Lighthouse CI (LCP < 2.5s, CLS < 0.1, TTI < 3.5s).

Rationale:
- Vite's native ESM support ensures sub-second dev server starts.
- Vitest shares Vite's transform pipeline, eliminating separate Jest config.
- Lighthouse CI gates prevent performance regressions in drag-and-drop heavy UI.
