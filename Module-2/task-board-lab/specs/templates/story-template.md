# User Story: [STORY TITLE]

<!-- Naming convention: Use a short, verb-led title describing the user action.
     Example: "Reset Password via Email" or "Filter Task List by Status" -->

**Story ID:** [US-###]  
**Epic:** [EPIC-### — EPIC TITLE]  
**Status:** [Draft | Ready | In Progress | In Review | Done]  
**Assignee:** [NAME]  
**Sprint / Iteration:** [SPRINT # or DATE RANGE]  
**Created:** [YYYY-MM-DD]  
**Last Updated:** [YYYY-MM-DD]

---

<!--
╔══════════════════════════════════════════════════════════════╗
║                   INVEST PRINCIPLES GUIDE                    ║
╠══════════════════════════════════════════════════════════════╣
║  I — Independent   Can this story be built without being     ║
║                    blocked by another unfinished story?      ║
║  N — Negotiable    Is the scope flexible (not a contract)?   ║
║  V — Valuable      Does it deliver clear value to the user   ║
║                    or business on its own?                   ║
║  E — Estimable     Does the team have enough info to size it?║
║  S — Small         Can it fit comfortably in one sprint?     ║
║  T — Testable      Can we write acceptance criteria for it?  ║
╚══════════════════════════════════════════════════════════════╝
Use the checklist in Section 6 before marking a story "Ready".
-->

---

## 1. User Story

<!-- Fill in each bracket. Keep the benefit focused on user value, not technical detail.
     ✅ Good: "...so that I don't have to re-enter my details every visit."
     ❌ Bad:  "...so that a session token is persisted in localStorage." -->

> **As a** [PERSONA / ROLE],  
> **I want to** [ACTION — what the user does or can do],  
> **so that** [BENEFIT — the value or outcome they receive].

---

## 2. Acceptance Criteria

<!-- Write 3–5 criteria using Given / When / Then (Gherkin) format.
     Each criterion must be:
       - Specific and unambiguous
       - Independently testable by QA
       - Written from the user's perspective, not the implementation's

     Template per criterion:
       Given [an initial context or state],
       When  [the user performs an action],
       Then  [an observable outcome occurs]. -->

- **AC-01:**  
  Given [INITIAL CONTEXT],  
  When [USER ACTION],  
  Then [EXPECTED OUTCOME].

- **AC-02:**  
  Given [INITIAL CONTEXT],  
  When [USER ACTION],  
  Then [EXPECTED OUTCOME].

- **AC-03:**  
  Given [INITIAL CONTEXT],  
  When [USER ACTION],  
  Then [EXPECTED OUTCOME].

- **AC-04 (optional):**  
  Given [INITIAL CONTEXT],  
  When [USER ACTION],  
  Then [EXPECTED OUTCOME].

- **AC-05 (optional):**  
  Given [INITIAL CONTEXT],  
  When [USER ACTION],  
  Then [EXPECTED OUTCOME].

---

## 3. Technical Notes

<!-- OPTIONAL — for implementation hints, constraints, or design pointers.
     Do NOT turn this into a spec; keep the story requirement-focused.
     Examples of what belongs here:
       - Relevant API endpoints or services to use/avoid
       - Known edge cases the developer should be aware of
       - UI/UX mock reference links
       - Security or accessibility considerations
       - Links to ADRs (Architecture Decision Records) -->

> _Add notes or remove this section if not needed._

- [TECHNICAL NOTE OR CONSTRAINT]
- [LINK TO MOCK / DESIGN FILE / ADR — or "N/A"]
- [EDGE CASE TO HANDLE]

---

## 4. Estimation

<!-- Story points follow a Fibonacci-like scale: 1, 2, 3, 5, 8, 13
     Use days only if your team doesn't use story points.

     Sizing guide (story points):
       1–2  → Trivial change, well-understood, low risk
       3    → Small, clear scope, minimal unknowns
       5    → Medium, some complexity or unknowns
       8    → Large, significant complexity — consider splitting
       13+  → Too large, must be split before committing to a sprint -->

| Field              | Value                                      |
|--------------------|--------------------------------------------|
| **Story Points**   | [ 1 / 2 / 3 / 5 / 8 / 13 ]               |
| **Alt. (Days)**    | [N/A or # days]                            |
| **Confidence**     | [High / Medium / Low]                      |
| **Sizing Notes**   | [Brief rationale for the estimate]         |

---

## 5. Dependencies & Blockers

<!-- List any stories, APIs, or decisions that must be resolved before work begins.
     Leave blank or write "None" if fully independent. -->

| ID / Reference       | Description                            | Status                     |
|----------------------|----------------------------------------|----------------------------|
| [US-### / EXT-###]   | [WHAT IS NEEDED AND WHY]               | [Pending / Done]           |
| [US-### / EXT-###]   | [WHAT IS NEEDED AND WHY]               | [Pending / Done]           |

---

## 6. INVEST Checklist

<!-- Complete this checklist before moving the story to "Ready for Sprint".
     A story must pass all six checks. If any fail, revise the story first. -->

- [ ] **I — Independent:** This story does not have unresolved dependencies on other incomplete stories.
- [ ] **N — Negotiable:** The implementation approach is flexible; only the outcome is fixed.
- [ ] **V — Valuable:** This story delivers standalone value to the user or business if shipped alone.
- [ ] **E — Estimable:** The team has enough context to size this story confidently.
- [ ] **S — Small:** This story can be completed within a single sprint.
- [ ] **T — Testable:** All acceptance criteria are specific and verifiable by a tester.

---

## 7. Notes & Discussion

<!-- Space for questions, decisions made during refinement, or links to relevant threads.
     Remove before closing the story, or archive here for future reference. -->

| #  | Note / Question                        | Author     | Date       |
|----|----------------------------------------|------------|------------|
| 1  | [NOTE OR OPEN QUESTION]                | [AUTHOR]   | [DATE]     |
