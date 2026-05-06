# User Story: Configure Vitest Coverage Reporting at ≥ 80%

**Story ID:** US-004.02  
**Epic:** EPIC-004 — Performance, Quality & Polish  
**Status:** Draft  
**Assignee:** TBD  
**Sprint / Iteration:** TBD  
**Created:** 2026-05-05  
**Last Updated:** 2026-05-05

---

## 1. User Story

> **As a** Alex (Senior Freelance Developer),  
> **I want to** see a test coverage report in CI that enforces ≥ 80% coverage on utility functions and hooks,  
> **so that** the team can track quality regressions before they reach the main branch.

---

## 2. Acceptance Criteria

- **AC-01:**  
  Given `@vitest/coverage-v8` is installed and `vite.config.ts` includes coverage configuration,  
  When I run `npm run test:coverage`,  
  Then a coverage report is printed to the terminal and a `coverage/` directory is generated containing `lcov.info`.

- **AC-02:**  
  Given all utility functions in `src/utils/` and custom hooks in `src/hooks/` and `src/features/` are exercised by tests,  
  When the coverage report is generated,  
  Then the combined line coverage for those directories is reported as ≥ 80%.

- **AC-03:**  
  Given a PR is opened,  
  When the CI workflow runs,  
  Then a GitHub Actions step runs `npm run test:coverage` and the job fails if line coverage for `src/utils/` and hook files drops below 80%.

- **AC-04:**  
  Given the CI coverage check passes,  
  When the results are available,  
  Then the coverage report artifact is uploaded to the workflow run for inspection.

---

## 3. Technical Notes

- Install `@vitest/coverage-v8` as a dev dependency.
- Add to `vite.config.ts`:
  ```ts
  test: {
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
      include: ['src/utils/**', 'src/hooks/**', 'src/features/**/*.ts'],
      thresholds: { lines: 80 }
    }
  }
  ```
- Add `"test:coverage": "vitest run --coverage"` to `package.json` scripts.
- Add a GitHub Actions step:
  ```yaml
  - run: npm run test:coverage
  - uses: actions/upload-artifact@v4
    with:
      name: coverage-report
      path: coverage/
  ```
- Existing tests for `storageUtils.ts`, `useTaskStore.ts`, and migration utils count toward the threshold.

---

## 4. Estimation

| Field            | Value                                                                                   |
|------------------|-----------------------------------------------------------------------------------------|
| **Story Points** | 3                                                                                       |
| **Alt. (Days)**  | 1.5 days                                                                                |
| **Confidence**   | Medium                                                                                  |
| **Sizing Notes** | Config is quick; the uncertainty is writing enough tests to reach the 80% threshold across all utils and hooks. |

---

## 5. Dependencies & Blockers

| ID / Reference | Description                                                    | Status  |
|----------------|----------------------------------------------------------------|---------|
| US-001.03      | `storageUtils.ts` must exist to be covered                     | Pending |
| US-001.04      | Storage restore utility must exist to be covered               | Pending |

---

## 6. INVEST Checklist

- [x] **I — Independent:** CI configuration is independent of all EPIC-002/003 stories.
- [x] **N — Negotiable:** Coverage threshold (80%) and included directories are negotiable.
- [x] **V — Valuable:** Enforces quality gates — prevents untested code from shipping.
- [x] **E — Estimable:** Well-understood tooling; uncertainty only in test-writing time.
- [x] **S — Small:** 3 points (1.5 days) — within the sprint boundary.
- [x] **T — Testable:** AC-01 verified by running the script; AC-02 by coverage report output; AC-03/AC-04 by CI workflow execution.

---

## 7. Notes & Discussion

| # | Note / Question                                                                                | Author              | Date       |
|---|------------------------------------------------------------------------------------------------|---------------------|------------|
| 1 | Clarify EPIC-004 open question #2: is the 80% floor scoped to `src/utils/` + hooks only, or the entire codebase? | GitHub Copilot (AI) | 2026-05-05 |
