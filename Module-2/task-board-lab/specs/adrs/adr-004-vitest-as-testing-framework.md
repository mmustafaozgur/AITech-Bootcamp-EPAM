# ADR-004 — Use Vitest as the Testing Framework

**Date:** 2026-05-05  
**Status:** `Accepted`  
**Deciders:** Engineering team

---

## Context

The Task Board is built with Vite as its build tool and requires a test framework that covers unit tests for utility functions and custom hooks, integration tests for `localStorage` persistence, and component tests with React Testing Library. The PRD's NFR 5.6 mandates ≥ 80% line coverage on utilities and hooks, measured by a CI-runnable coverage report. The testing framework must integrate natively with Vite's module resolution and TypeScript configuration to avoid a separate compilation step or conflicting `tsconfig` files.

---

## Decision

We will use Vitest as the test runner and assertion library, paired with `@testing-library/react` for component tests and `@vitest/coverage-v8` for coverage reporting.

---

## Consequences

### Positive
- Vitest reuses Vite's own module transform pipeline — the same `vite.config.ts`, TypeScript path aliases, and environment variables work in tests without a separate config.
- `describe`, `it`, `expect`, `vi.fn()`, and `vi.spyOn()` are Jest-compatible APIs; developers familiar with Jest have zero ramp-up time.
- Supports browser-like globals (`localStorage`, `window`, `document`) via `jsdom` or `happy-dom` environments without additional config.
- The `vitest bench` API provides first-class benchmark support, which is used in US-004.04 to verify the ≤ 50 ms `localStorage` write target.
- `@vitest/coverage-v8` uses Node's built-in V8 coverage engine — no Babel or Istanbul instrumentation step; faster and more accurate for native ES modules.

### Negative
- Vitest is a younger project than Jest (released 2022 vs. 2014); some ecosystem plugins and tooling integrations may lag behind their Jest counterparts.
- `vitest --watch` mode has known minor HMR edge cases with complex module graphs; workaround is to restart the watcher when configuration changes.
- The `bench` API is still considered experimental in Vitest's minor releases; the API surface may change across minor upgrades.

### Neutral / Trade-offs
- `happy-dom` is faster than `jsdom` but has less complete browser API coverage; given that the app uses `localStorage`, `crypto.randomUUID()`, and standard DOM events, either environment is suitable — `jsdom` is the safer default.
- Tests are co-located next to source files (`ComponentName.test.tsx`) following `agents.md` conventions; no separate `__tests__` directory is created.
- Coverage thresholds are configured in `vite.config.ts` under the `test.coverage.thresholds` key, keeping all test configuration in one file.

---

## Alternatives Considered

| Option | Pros | Cons | Reason Rejected |
|--------|------|------|-----------------|
| **Jest** | Most widely used JavaScript test runner; massive ecosystem; extensive documentation and community support | Requires a separate `babel.config.js` or `ts-jest` transformer to handle Vite's native ESM modules; path aliases must be duplicated in `jest.config.ts`; slower startup due to Babel transform; no native benchmark support | The Vite/ESM configuration overhead eliminates Jest's ecosystem advantage; Vitest provides the same API with native Vite integration |
| **Playwright (test runner only)** | Full browser automation; tests run in a real Chromium/Firefox/WebKit instance | Designed for end-to-end tests, not unit or integration tests; too heavy and slow for testing individual utility functions and hooks; requires a running server | Wrong tool for the majority of test cases (unit + integration); E2E tests are not in scope for MVP |
| **Cypress Component Testing** | Good DX for isolated component tests; visual debugging; integrates with the Cypress dashboard | Adds a heavy Cypress dependency; component test setup for Vite requires additional configuration; not designed for testing non-component utilities and hooks; much slower than Vitest for CI runs | Overkill for the test types required; slower CI execution; larger dependency footprint |
| **Mocha + Chai** | Highly configurable; long track record | Requires assembling multiple packages (mocha, chai, sinon, c8 for coverage, a DOM environment); no Vite-native integration; significantly more setup work than Vitest | Higher configuration burden with no capability advantage over Vitest for this use case |

---

## References

- [specs/prds/PRD-task-board-mvp.md](../prds/PRD-task-board-mvp.md) — NFR 5.6 (≥ 80% test coverage), NFR 5.1 (localStorage ≤ 50 ms benchmark)
- [agents.md](../../agents.md) — Test file co-location convention (`ComponentName.test.tsx`)
- [specs/epics/EPIC-004-performance-quality-and-polish.md](../epics/EPIC-004-performance-quality-and-polish.md)
- [specs/stories/STORY-004.02-vitest-coverage-reporting.md](../stories/STORY-004.02-vitest-coverage-reporting.md)
- [specs/stories/STORY-004.04-benchmark-localstorage-performance.md](../stories/STORY-004.04-benchmark-localstorage-performance.md)
