# Development Process — Task Board

This document describes the step-by-step workflow AI assistants and contributors must follow when implementing features on the task-board-lab project.

## Implementation Workflow

### 1. Locate the Spec
- Find the relevant User Story in `specs/stories/`.
- Read the full story: User Story statement, Acceptance Criteria, Technical Notes, and Dependencies.
- If a dependency story is not yet implemented, implement it first.

### 2. Understand the ACs
- Each Acceptance Criterion (AC) is the definition of done for the story.
- Map every AC to at least one test case before writing any implementation code.
- If an AC is ambiguous, note it in the story's Notes section before proceeding.

### 3. Scaffold Files
- Follow the file placement rules in [coding-standards.md](../conventions/coding-standards.md).
- Create components in `src/features/tasks/` (feature-specific) or `src/components/` (shared).
- Create CSS Modules next to the component file.
- Create test files co-located with the source file.

### 4. Implement
- Write the minimum code to satisfy all ACs — no gold-plating.
- Use TypeScript strict mode; no `any`.
- Use named exports.
- Keep components under ~150 lines; extract logic to hooks.
- Follow localStorage key conventions (`taskboard:` prefix).

### 5. Test
- Run tests with `npm test` (Vitest).
- All ACs must be covered by at least one passing test.
- Achieve meaningful coverage; 100% is not required but critical paths must be tested.

### 6. Update the Story Status
- Change the `**Status:**` field in the story file from `Draft` to `Implemented` (or `In Review`).
- If scope changed during implementation, update the story's Technical Notes section.

### 7. ADR First for Architecture Decisions
- Before introducing a new library, pattern, or significant architectural change, create an ADR in `specs/adrs/`.
- Use the template at `specs/templates/adr-template.md`.
- Use the `.github/prompts/generate-adr.prompt.md` prompt to generate it.

### 8. Snapshot Before Modifying Existing Specs
- If updating an ADR or story that has already been acted on, create a snapshot first:
  - Copy the file to `specs/snapshots/`.
  - Rename it: `<original-filename>.<YYYY-MM-DD>.md`.
  - Then modify the original.

## Branch and Commit Conventions

- Branch names: `feature/<story-id>-<short-slug>` (e.g., `feature/us-001.01-kanban-board`).
- Commit messages: imperative mood, present tense (e.g., `Add KanbanBoard layout component`).
- One logical change per commit; do not bundle unrelated changes.

## Running the Project

| Command           | Purpose                            |
|-------------------|------------------------------------|
| `npm install`     | Install dependencies               |
| `npm run dev`     | Start Vite dev server (localhost)  |
| `npm run build`   | Production build                   |
| `npm test`        | Run Vitest tests                   |
| `npm run lint`    | Run ESLint                         |
| `npm run preview` | Preview production build locally   |

## Definition of Done (DoD)

A story is considered done when:
- [ ] All ACs have passing automated tests.
- [ ] `npm run lint` exits with code 0.
- [ ] `npm run build` exits with code 0.
- [ ] Story status updated to `Implemented`.
- [ ] No regressions in previously passing tests.
