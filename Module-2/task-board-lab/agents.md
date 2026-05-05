# Project Conventions for AI Assistants

This file defines the conventions for the **Task Board** project.
Follow these rules when generating code, creating spec files, or modifying the codebase.

---

## Tech Stack

| Layer          | Technology                        | Notes                                      |
|----------------|-----------------------------------|--------------------------------------------|
| UI Framework   | React 18                          | Functional components and hooks only       |
| Build Tool     | Vite                              | Use `npm run dev` / `npm run build`        |
| Language       | TypeScript (strict mode)          | No `any`; prefer explicit types            |
| Styling        | [CSS Modules / Tailwind / etc.]   | Update this line when decided              |
| State          | React `useState` / `useReducer`   | No Redux unless complexity demands it      |
| Persistence    | `localStorage`                    | No backend; no external API calls         |
| Testing        | [Vitest + Testing Library]        | Update this line when decided              |
| Package Mgr    | npm                               |                                            |

> **No backend.** All data is read from and written to `localStorage`. Do not introduce
> server-side code, environment secrets, or external fetch calls.

---

## Specification Structure

All product specifications live under `specs/`. The hierarchy mirrors the planning process:

```
specs/
├── templates/          # Blank reusable templates (do not edit filled specs here)
│   ├── prd-template.md
│   ├── epic-template.md
│   ├── story-template.md
│   └── adr-template.md
├── prds/               # One file per Product Requirements Document
├── epics/              # One file per Epic, grouped under a PRD
├── stories/            # One file per User Story, grouped under an Epic
├── adrs/               # One file per Architecture Decision Record
└── snapshots/          # Point-in-time copies of spec files (date-stamped)
```

### Hierarchy

```
PRD  (1)
 └── Epic  (many per PRD)
      └── User Story  (many per Epic)

ADR  (independent — one per architectural decision)
```

---

## Naming Conventions

### Spec Files

All spec filenames use **kebab-case** with a numeric ID prefix.

| Type        | Pattern                              | Example                              |
|-------------|--------------------------------------|--------------------------------------|
| PRD         | `prd-###-<slug>.md`                  | `prd-001-task-board-mvp.md`          |
| Epic        | `epic-###-<slug>.md`                 | `epic-001-task-management.md`        |
| User Story  | `us-###-<slug>.md`                   | `us-001-create-task.md`              |
| ADR         | `adr-###-<slug>.md`                  | `adr-001-use-localstorage.md`        |
| Snapshot    | `<original-name>.<YYYY-MM-DD>.md`    | `adr-001-use-localstorage.2026-05-05.md` |

- IDs are **zero-padded to 3 digits** (`001`, `002`, …).
- Slugs are **lowercase kebab-case** derived from the title.
- IDs are **globally unique** per type (Epic IDs do not restart per PRD).

### Source Code Files

| Artifact            | Convention                        | Example                          |
|---------------------|-----------------------------------|----------------------------------|
| React component     | `PascalCase.tsx`                  | `TaskCard.tsx`                   |
| Hook                | `camelCase.ts`, prefixed `use`    | `useLocalStorage.ts`             |
| Utility / helper    | `camelCase.ts`                    | `formatDate.ts`                  |
| Type definitions    | `camelCase.types.ts`              | `task.types.ts`                  |
| Test file           | co-located, suffix `.test.tsx`    | `TaskCard.test.tsx`              |
| CSS Module          | same name as component, `.module.css` | `TaskCard.module.css`        |

---

## File Organization

```
task-board-lab/
├── agents.md               # ← this file
├── .github/
│   └── prompts/            # AI prompt files (*.prompt.md) for spec generation
│       ├── generate-prd.prompt.md
│       ├── decompose-epics.prompt.md
│       ├── decompose-stories.prompt.md
│       └── generate-adr.prompt.md
├── specs/                  # Product specifications (see above)
├── src/
│   ├── components/         # Reusable UI components
│   ├── features/           # Feature-scoped folders (component + hook + types)
│   │   └── tasks/
│   │       ├── TaskList.tsx
│   │       ├── TaskCard.tsx
│   │       ├── useTaskStore.ts
│   │       └── task.types.ts
│   ├── hooks/              # Shared hooks (used across features)
│   ├── utils/              # Pure utility functions
│   ├── types/              # Shared TypeScript types and interfaces
│   ├── App.tsx
│   └── main.tsx
├── public/
├── index.html
├── vite.config.ts
├── tsconfig.json
└── package.json
```

---

## localStorage Conventions

- **Key prefix:** `taskboard:` (e.g., `taskboard:tasks`, `taskboard:columns`).
- **Format:** JSON — always `JSON.parse` / `JSON.stringify`.
- **Schema changes:** bump a version key (`taskboard:version`) and write a migration
  function in `src/utils/migrations.ts`.
- Never store sensitive data in `localStorage`.

---

## Code Conventions

- **No `any`** — use `unknown` with type guards if the shape is truly unknown.
- **Prefer named exports** over default exports for components and hooks.
- **One component per file.**
- Keep components under ~150 lines; extract logic into hooks when state grows.
- Write AC-driven unit tests: each Acceptance Criterion in a User Story should map to
  at least one test case.

---

## ADR Conventions

- Store all Architecture Decision Records in `specs/adrs/`.
- Use the template at `specs/templates/adr-template.md`.
- Use the prompt at `.github/prompts/generate-adr.prompt.md` to generate a new ADR.
- Valid status values: `Proposed` → `Accepted` → `Deprecated` / `Superseded by ADR-###`.
- ADR IDs are **globally unique** and never reused, even if an ADR is deprecated.

---

## Snapshot Conventions

- Snapshots are point-in-time copies of any spec file (ADR, PRD, Epic, Story).
- Store all snapshots in `specs/snapshots/`.
- Filename pattern: `<original-filename>.<YYYY-MM-DD>.md`
  (e.g., `adr-001-use-localstorage.2026-05-05.md`).
- A snapshot may update the **Status** field and add a **Snapshot note** block at the
  top to describe what has changed since the original was written.
- Do **not** modify any other content — snapshots must faithfully reflect the state of
  the document at the time they were taken.

---

## Workflow for AI Assistants

When asked to implement a feature:

1. **Find the spec** — look in `specs/stories/` for the relevant User Story.
2. **Check ACs** — use the Acceptance Criteria as the definition of done.
3. **Follow naming conventions** — file names, component names, localStorage keys.
4. **No backend** — if a feature seems to need an API, use `localStorage` instead.
5. **Update specs** — if scope changes during implementation, update the story file.
6. **ADR first** — for any significant architectural choice, create an ADR in `specs/adrs/`
   before writing code. Use `generate-adr.prompt.md` to generate it.
7. **Snapshot before changes** — if updating an existing ADR or spec that has already been
   acted on, create a snapshot in `specs/snapshots/` before modifying the original.
