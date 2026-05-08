<!--
  SYNC IMPACT REPORT
  Version change: (new) → 1.0.0
  Added sections: Core Principles (I–IV), Quality Gates, Development Workflow, Governance
  Removed sections: N/A (initial ratification)
  Templates requiring updates:
    ✅ plan-template.md  — Constitution Check gates align with principles below
    ✅ spec-template.md  — Requirements section covers JSDoc and TypeScript constraints
    ✅ tasks-template.md — Setup phase includes strict-mode config and JSDoc tooling tasks
  Follow-up TODOs: none
-->

# AITech Lab Constitution

## Core Principles

### I. Clean Code

All source code MUST be readable, purposeful, and maintainable without additional explanation.

- Functions and methods MUST do exactly one thing and be named to reveal intent.
- Magic numbers and strings MUST be replaced with named constants.
- Duplication MUST be eliminated; shared logic lives in a single authoritative location.
- Side effects MUST be explicit — functions that mutate state or produce I/O MUST indicate so in their name or signature.
- Dead code MUST NOT be committed; remove unused imports, variables, and unreachable branches immediately.
- Code reviews MUST enforce these rules before merge.

**Rationale**: Readable code reduces onboarding time, lowers defect rates, and makes automated refactoring safe.

### II. TypeScript — Strict Mode (NON-NEGOTIABLE)

All TypeScript source files MUST compile under `strict: true` with zero type errors.

- `tsconfig.json` MUST include `"strict": true`, which enables `noImplicitAny`, `strictNullChecks`,
  `strictFunctionTypes`, `strictPropertyInitialization`, and `useUnknownInCatchVariables`.
- `any` MUST NOT appear in production code except where interacting with untyped third-party APIs,
  in which case a typed wrapper MUST be introduced immediately.
- `as` type assertions MUST be accompanied by an inline comment explaining why the assertion is safe.
- Interfaces and types MUST be defined for every public API boundary.
- CI MUST run `tsc --noEmit` as a mandatory gate; builds that fail type-checking MUST NOT merge.

**Rationale**: Strict typing surfaces bugs at compile time, makes refactoring safe, and serves as
machine-verified documentation for all data shapes.

### III. Testing Pyramid — 80 % Business-Logic Coverage

Testing MUST follow the Testing Pyramid: many unit tests, fewer integration tests, minimal E2E tests.

- Business logic (pure functions, domain services, state machines) MUST achieve ≥ 80 % line and
  branch coverage as measured by the project's coverage tool (e.g., Vitest/Istanbul, Jest).
- Unit tests MUST cover all public module exports that contain business logic.
- Integration tests MUST cover inter-service boundaries and external I/O (databases, APIs, queues).
- E2E tests are OPTIONAL but MUST be scoped to critical user journeys only.
- Coverage reports MUST be generated on every CI run; PRs that drop business-logic coverage below
  80 % MUST NOT merge.
- Tests MUST be deterministic; flaky tests MUST be fixed or deleted within one sprint.

**Rationale**: The pyramid model maximises coverage speed and reliability while keeping the suite
maintainable as the codebase scales.

### IV. JSDoc Documentation (NON-NEGOTIABLE)

Every exported symbol — function, class, method, type alias, interface, enum, and constant — MUST
have a complete JSDoc comment block.

- Each JSDoc block MUST include: `@description` (or leading summary line), `@param` for every
  parameter, `@returns` (unless `void`), and `@throws` for every documented error condition.
- Complex algorithms and non-obvious decisions MUST include an `@remarks` or inline explanatory
  comment.
- `@example` MUST be provided for all public utility functions and library entry points.
- Auto-generated API documentation (e.g., TypeDoc) MUST build without warnings as a CI gate.
- Internal (non-exported) helpers SHOULD include at minimum a one-line summary comment.

**Rationale**: JSDoc comments serve as the primary developer contract, power IDE tooling, and
generate living API documentation without additional maintenance overhead.

## Quality Gates

The following automated checks MUST pass on every pull request before merge:

- `tsc --noEmit` — zero TypeScript errors under strict mode.
- Test suite with coverage — business-logic coverage ≥ 80 % (lines and branches).
- TypeDoc build — zero documentation warnings for exported symbols.
- Linter (`eslint`) — zero errors; warnings MUST be reviewed and suppressed with justification.
- No `any` without a typed wrapper — enforced by `@typescript-eslint/no-explicit-any`.

## Development Workflow

- Features MUST be developed on a named branch following `###-feature-name` convention.
- All commits MUST be atomic and have a conventional commit message (`feat:`, `fix:`, `docs:`, etc.).
- Code reviews MUST explicitly verify each Core Principle before approval.
- Pair programming or async review is required for changes to shared interfaces or domain services.
- The Constitution supersedes all other team conventions; conflicts MUST be resolved by amending
  the Constitution, not by ignoring it.

## Governance

- This Constitution supersedes all oral agreements, wiki pages, and legacy conventions.
- Amendments require: (1) a written proposal explaining the rationale, (2) team consensus, and
  (3) a version bump following semantic versioning rules recorded here.
- MAJOR bump: removal or incompatible redefinition of an existing principle.
- MINOR bump: addition of a new principle or material expansion of existing guidance.
- PATCH bump: wording clarifications, typo fixes, non-semantic refinements.
- All PRs and code reviews MUST verify compliance with this document.

**Version**: 1.0.0 | **Ratified**: 2026-05-08 | **Last Amended**: 2026-05-08
