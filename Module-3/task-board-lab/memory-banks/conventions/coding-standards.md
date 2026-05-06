# Coding Standards: Task Board

This document expands the project rules from [agents.md](../../agents.md) into an implementation standard for AI assistants and contributors working on task-board-lab.

## Naming Conventions

- **Files**:
	- React components: `PascalCase.tsx`
	- Hooks: `camelCase.ts`, prefixed with `use`
	- Utilities/helpers: `camelCase.ts`
	- Type definitions: `camelCase.types.ts`
	- Test files: co-located, suffix `.test.tsx` for component tests and `.test.ts` for non-UI tests
	- CSS Modules: `ComponentName.module.css`
	- Spec files: lowercase `kebab-case` with numeric prefixes where defined in `specs/`
- **Classes**: `PascalCase`
- **Functions/Variables**: `camelCase`
- **Constants**: `UPPER_SNAKE_CASE` for module-level constants that do not change
- **Database Tables**: Not applicable. This project has no database. Persistent browser storage keys must use the `taskboard:` prefix, for example `taskboard:tasks` and `taskboard:version`.

Additional naming rules:
- React components must use names that describe UI responsibility, for example `TaskCard`, `TaskList`, `BoardColumn`.
- Hooks must describe behavior, for example `useTaskStore`, `useKeyboardNavigation`.
- Boolean variables should read as predicates, for example `isDragging`, `hasStorageAccess`, `canMoveLeft`.
- Type aliases and interfaces should describe domain concepts clearly, for example `Task`, `TaskStatus`, `BoardState`.

## File Structure

Project structure must follow the feature-oriented layout defined in [agents.md](../../agents.md).

```text
task-board-lab/
├── agents.md
├── memory-banks/
├── specs/
├── src/
│   ├── components/         # Shared reusable UI components
│   ├── features/           # Feature-scoped implementation
│   │   └── tasks/          # Task board feature components, hooks, and types
│   ├── hooks/              # Shared hooks used across features
│   ├── utils/              # Pure utility functions and storage helpers
│   ├── types/              # Shared TypeScript types
│   ├── App.tsx
│   └── main.tsx
├── public/
├── index.html
├── vite.config.ts
├── tsconfig.json
└── package.json
```

File placement rules:
- Put feature-specific code under `src/features/<feature-name>/`.
- Put shared presentational components under `src/components/`.
- Put pure reusable helpers under `src/utils/`.
- Put cross-feature hooks under `src/hooks/`.
- Keep tests co-located with the source file they validate.
- Keep CSS Modules next to the component they style.
- Store specification files only under `specs/`; do not mix product specs into `src/`.

## Code Organization

- One React component per file.
- Keep components under ~150 lines; extract logic to hooks when state grows.
- Export components and hooks as named exports (not default exports).
- Co-locate related types with the feature; share common types via `src/types/`.

## TypeScript Rules

- Enable strict mode in `tsconfig.json` (already set in project template).
- No `any` — use `unknown` with type guards when the shape is truly unknown.
- Prefer explicit return types on all exported functions and hooks.
- Use `type` aliases for union types and simple shapes; use `interface` for object shapes that may be extended.
- Never cast with `as` unless absolutely necessary; prefer type narrowing.

## React Rules

- Functional components only — no class components.
- Hooks only (useState, useReducer, useEffect, custom hooks) — no lifecycle methods.
- Avoid prop drilling beyond 2 levels; lift state or use context if needed.
- Use `React.memo` only when profiling proves it is necessary.
- Do not use `useEffect` for derived state — compute it inline.

## CSS Modules Rules

- One `.module.css` file per component.
- Use `camelCase` class names inside CSS modules (e.g., `.columnHeader`, `.taskCard`).
- No global styles except for CSS resets/variables in `src/index.css`.
- Do not use inline styles unless driven by dynamic JavaScript values.
- Use CSS custom properties (variables) for shared design tokens (colors, spacing, etc.).

## Testing Rules

- Use Vitest as the test runner (configured in `vite.config.ts`).
- Use `@testing-library/react` for component tests.
- Each Acceptance Criterion in a User Story maps to at least one test case.
- Test file naming: `ComponentName.test.tsx` co-located with the source.
- Avoid testing implementation details; test observable behavior and rendered output.
- Mock `localStorage` in tests using `vi.stubGlobal` or a custom setup helper.

## localStorage Conventions

- All keys must use the `taskboard:` prefix.
- Known keys:
  - `taskboard:version` — schema version string (e.g., `"1"`)
  - `taskboard:tasks` — JSON array of Task objects
- Always wrap localStorage reads/writes in try/catch for resilience.
- Expose storage operations through a utility module (`src/utils/storage.ts`), never call `localStorage` directly from components.
