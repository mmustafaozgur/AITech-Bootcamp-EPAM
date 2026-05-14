# AITech Bootcamp — EPAM

Lab work from the EPAM AI Technology Bootcamp. Each module is a self-contained exercise exploring a different aspect of AI-assisted software development, from vibe coding to structured specification to test generation.

---

## Modules

### Module 1 — Vibe Coding

Rapid AI-assisted prototyping across three iterative rounds. Starting from a minimal prompt, each round refines the output by adding more specific requirements and observing how the AI's assumptions evolve. Includes a **task board** app (`task-board-vibe`, React + Vite) and an **auth system** (`lab/round-1` through `round-3`, Node.js + Express + JWT) with written reflections on what the AI assumed vs. what was actually needed.

### Module 2 — AI-Assisted Specification

Using AI to generate structured product specs for a React task board. The `specs/` directory follows a full planning hierarchy — PRDs, epics, user stories, ADRs, and snapshot outputs. An `agents.md` file defines project conventions so AI assistants generate consistent, on-spec artifacts.

### Module 3 — Guided Implementation

Taking the specs from Module 2 and building the actual task board (`task-board-lab`) in React + TypeScript. The project includes components, feature slices, hooks, and a test setup, demonstrating AI-guided implementation from specification through code.

### Module 4 — MCP (Model Context Protocol)

Integrating Claude with external tools via MCP. The lab uses a Jira MCP server to generate and sync specs (epics, PRDs, stories) directly with a Jira project, exploring how AI agents can maintain bidirectional context with project management systems.

### Module 5 — Structured Specification (SpecKit)

Writing production-grade feature specifications with AI. The `specs/001-user-auth/` directory contains a complete SpecKit artifact: a detailed spec with acceptance scenarios, a data model, API contracts, a test checklist, a research document, and an implementation plan — all for a user authentication system.

### Module 6 — Test Generation

AI-generated test suites for a Node.js/TypeScript backend. The auth service (`src/`) covers registration, login, logout/refresh, password reset, email verification, and profile deletion, each with a corresponding Jest test file in `src/__tests__/`. Uses Drizzle ORM and covers real database interactions.

---

## Author

Mustafa Ozgur — EPAM AI Technology Bootcamp
