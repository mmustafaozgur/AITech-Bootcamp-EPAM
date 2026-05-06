# User Story: Configure Lighthouse CI to Enforce Performance Score ≥ 90

**Story ID:** US-004.03  
**Epic:** EPIC-004 — Performance, Quality & Polish  
**Status:** Draft  
**Assignee:** TBD  
**Sprint / Iteration:** TBD  
**Created:** 2026-05-05  
**Last Updated:** 2026-05-05

---

## 1. User Story

> **As a** Alex (Senior Freelance Developer),  
> **I want to** have every pull request automatically checked against a Lighthouse Performance score of ≥ 90,  
> **so that** performance regressions are caught before they reach the main branch.

---

## 2. Acceptance Criteria

- **AC-01:**  
  Given a PR is opened against the main branch,  
  When the CI workflow runs,  
  Then the Lighthouse CI job builds the app with `npm run build`, serves it, and runs a Lighthouse Performance audit.

- **AC-02:**  
  Given the Lighthouse audit completes with a Performance score ≥ 90,  
  When CI reports the result,  
  Then the PR check passes with a green status.

- **AC-03:**  
  Given the Lighthouse audit completes with a Performance score < 90,  
  When CI reports the result,  
  Then the PR check fails and a summary comment is posted on the PR showing the failing score and which categories failed.

- **AC-04:**  
  Given the LHCI workflow runs,  
  When the audit completes,  
  Then a Lighthouse HTML report artifact is uploaded to the workflow run for inspection.

---

## 3. Technical Notes

- Install `@lhci/cli` as a dev dependency.
- Create `.lighthouserc.json` at the project root:
  ```json
  {
    "ci": {
      "collect": { "startServerCommand": "npx serve dist", "url": ["http://localhost:3000"] },
      "assert": { "assertions": { "categories:performance": ["error", { "minScore": 0.9 }] } },
      "upload": { "target": "temporary-public-storage" }
    }
  }
  ```
- Add a GitHub Actions job `.github/workflows/lighthouse.yml` that:
  1. Runs `npm ci && npm run build`.
  2. Runs `npx lhci autorun`.
  3. Uploads `./lhci_reports/` as a workflow artifact.
- Ensure `npx serve` is available or install `serve` as a dev dependency.
- Vite prod build output directory: `dist/`.

---

## 4. Estimation

| Field            | Value                                                                                  |
|------------------|----------------------------------------------------------------------------------------|
| **Story Points** | 2                                                                                      |
| **Alt. (Days)**  | 1 day                                                                                  |
| **Confidence**   | Medium                                                                                 |
| **Sizing Notes** | LHCI configuration and workflow YAML are well-documented; uncertainty is first-run score calibration. |

---

## 5. Dependencies & Blockers

| ID / Reference | Description                                         | Status  |
|----------------|-----------------------------------------------------|---------|
| US-001.01      | App must build successfully (`npm run build`) first | Pending |

---

## 6. INVEST Checklist

- [x] **I — Independent:** CI configuration is independent of DnD and keyboard stories.
- [x] **N — Negotiable:** Score threshold, CI provider, and report storage target are flexible.
- [x] **V — Valuable:** Enforces the Lighthouse Performance PRD success metric on every PR.
- [x] **E — Estimable:** LHCI docs are comprehensive; medium confidence for first-run calibration.
- [x] **S — Small:** Completable in 1 day.
- [x] **T — Testable:** AC-01 to AC-04 verified by running the CI workflow on a test PR and inspecting the result.

---

## 7. Notes & Discussion

| # | Note / Question                                                                      | Author              | Date       |
|---|--------------------------------------------------------------------------------------|---------------------|------------|
| 1 | Clarify EPIC-004 open question #1: should the Lighthouse check block merge (required status check) or be advisory only? | GitHub Copilot (AI) | 2026-05-05 |
