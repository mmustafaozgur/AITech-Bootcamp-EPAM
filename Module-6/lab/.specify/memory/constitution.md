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

## Testing Principles

### 1. Testing Philosophy

- Test-Driven Development (TDD) approach is mandatory for all new business logic and bug fixes.
- Follow the RED-GREEN-REFACTOR cycle: write a failing test (RED), make it pass (GREEN), then refactor.
- Write tests FIRST before implementation; code without tests MUST NOT be merged.
- Generate tests from specifications and acceptance criteria, not from implementation details.

**Rationale**: TDD ensures requirements are met, reduces regression risk, and enables safe refactoring.

### 2. Coverage Requirements

- Testing Pyramid distribution: ~70% unit, ~20% integration, ~10% E2E.
- Unit tests MUST cover services, utilities, and business logic modules.
- Integration tests MUST cover API endpoints, database operations, and service boundaries.
- E2E tests MUST be written only for critical user workflows.
- Static analysis: TypeScript strict mode and ESLint (with project rules) MUST pass on every PR.
- Coverage targets: ≥ 80% line, ≥ 75% branch, ≥ 75% mutation score (as measured by Vitest/Jest/Istanbul/Stryker).

**Rationale**: High coverage and static analysis catch defects early and ensure code quality.

### 3. Test Types & Organization

- Unit tests: `tests/unit/**/*.test.ts` (mirror `src/` structure; one test file per source file)
- Integration tests: `tests/integration/**/*.test.ts` (grouped by feature)
- E2E tests: `tests/e2e/**/*.spec.ts` (grouped by user journey)
- One test file per source file for unit tests.

**Rationale**: Consistent organization and file extensions make tests easy to locate and maintain.

### 4. Naming Conventions

- Unit/Integration test files: `ComponentName.test.ts` (e.g., `UserService.test.ts`)
- E2E test files: `user-journey-name.spec.ts` (e.g., `login-flow.spec.ts`)
- Test suites: `describe('ComponentName', ...)`
- Test cases: `it('should do X when Y', ...)`

**Rationale**: Naming conventions improve clarity, searchability, and onboarding for new contributors.

### 5. Test Anatomy

- Primary pattern: Arrange-Act-Assert (AAA) in all test cases.
- Use `beforeEach` for test-specific setup (NOT `beforeAll` except for global expensive setup).
- Each test MUST be independent and runnable in isolation.
- No shared global state between tests; use local variables or fixtures.

**Rationale**: Proper test anatomy ensures reliability, maintainability, and ease of debugging.

### 6. Mocking & Test Data

- Mock external services (email, payment, third-party APIs).
- Stub time-dependent functions (e.g., `Date.now()`, timers).
- Use fakes such as in-memory databases for unit tests.
- Use test fixtures for complex data setups.
- Extract helpers (e.g., `createTestUser()`, `setupMockAPI()`) for reuse.
- DO NOT mock code you own or simple utilities.

**Rationale**: Proper use of mocks, stubs, and fakes ensures tests are isolated, fast, and reliable.

### 7. Quality Criteria (CRITICAL)

**What makes a good test:**
- Tests observable behavior (not implementation details).
- Has meaningful assertions (not tautological: `expect(x).toBe(x)`).
- Tests one thing (single responsibility).
- Is fast (<1s for unit, <5s for integration).
- Is deterministic (same result every run).

**Quality gates:**
- Mutation score: ≥ 75% (use Stryker for TypeScript/Node.js).
- No always-true assertions (tautological tests).
- All expected values (oracles) validated by human.
- Coverage: ≥ 80% line, ≥ 75% branch.

**Anti-patterns to avoid:**
- Testing private methods/internal state.
- Interdependent tests (test order matters).
- Brittle tests (break on refactoring).
- Flaky tests (intermittent failures).
- Tests without assertions.
- Copy-pasted test logic (extract helpers).

**Rationale**: High-quality tests provide confidence, prevent regressions, and support maintainable code.


### 8. Tools & Frameworks

**Static analysis:**
- Type checker: TypeScript (`tsc`) strict mode
- Linter: ESLint (`eslint`) with project config

**Unit/Integration testing:**
- Framework: Vitest ^1.x or Jest ^29.x
- Assertion: built-in (expect)
- Mocking: Vitest/Jest built-in mocks

**E2E testing:**
- Framework: Playwright ^1.x (preferred) or Cypress ^13.x
- Optional: Stagehand for AI-native browser automation

**Coverage & Quality:**
- Coverage tool: Vitest/Jest/Istanbul (≥ 80% line, ≥ 75% branch)
- Mutation testing: Stryker (≥ 75% score)

**Execution commands (pnpm):**
- Type check: `pnpm typecheck` (runs `tsc --noEmit`)
- Lint: `pnpm lint` (runs `eslint .`)
- Run all tests: `pnpm test`
- Run unit tests: `pnpm test:unit`
- Run integration tests: `pnpm test:integration`
- Run E2E tests: `pnpm test:e2e`
- Generate coverage: `pnpm coverage`
- Run mutation testing: `pnpm mutation`

**Pre-commit hook:** typecheck + lint + unit tests
**CI/CD pipeline:** All checks + all tests + coverage + mutation (main branch)

**Rationale**: Standardized tools and commands ensure consistency, automation, and enforce quality gates across the team.

**Version**: 2.1.0 | **Ratified**: 2026-05-08 | **Last Amended**: 2026-05-11
