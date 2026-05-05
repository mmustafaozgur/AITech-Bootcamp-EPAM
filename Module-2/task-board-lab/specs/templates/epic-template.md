# Epic: [EPIC TITLE]

<!-- Naming convention: Use a short, action-oriented title.
     Example: "User Authentication & Authorization" or "Real-Time Notifications" -->

**Epic ID:** [EPIC-###]  
**Status:** [Draft | Ready | In Progress | Done]  
**PRD Reference:** [Link or ID of the parent PRD, e.g., PRD-001]  
**Owner:** [PRODUCT OWNER / TEAM]  
**Target Release:** [vX.Y / Q# YYYY]  
**Created:** [YYYY-MM-DD]  
**Last Updated:** [YYYY-MM-DD]

---

## 1. Description

<!-- Write 2–3 sentences covering:
     - What this epic delivers
     - Why it matters to the user/business
     - How it fits into the broader product -->

[SENTENCE 1: What is being built and delivered in this epic.]  
[SENTENCE 2: Why this capability matters — the user or business value it unlocks.]  
[SENTENCE 3: How this epic relates to or enables other parts of the product.]

---

## 2. Primary Persona

<!-- Identify the single persona who benefits most from this epic.
     Reference a persona defined in the PRD where possible. -->

**Persona:** [PERSONA NAME / ROLE]  
**Why this persona:** [One sentence explaining why this group is the primary beneficiary.]

> **Secondary personas (optional):** [OTHER PERSONAS who benefit, or "None"]

---

## 3. Success Criteria

<!-- Define measurable, observable outcomes that confirm this epic is complete and valuable.
     Each criterion should be verifiable — avoid vague language like "improved" or "better".
     Aim for 3–5 criteria. -->

- [ ] **SC-01:** [MEASURABLE OUTCOME — e.g., "Users can log in using email/password within 3 seconds."]
- [ ] **SC-02:** [MEASURABLE OUTCOME — e.g., "Password reset flow completes end-to-end without errors."]
- [ ] **SC-03:** [MEASURABLE OUTCOME — e.g., "Session token expires after 30 minutes of inactivity."]
- [ ] **SC-04:** [MEASURABLE OUTCOME]
- [ ] **SC-05:** [MEASURABLE OUTCOME]

---

## 4. Scope & Complexity

<!-- Choose a T-shirt size estimate and justify it briefly.
     S = 1–2 sprints | M = 3–4 sprints | L = 5+ sprints (consider splitting) -->

**Estimate:** [ S | M | L ]

| Factor              | Assessment                                      |
|---------------------|-------------------------------------------------|
| **UI Complexity**   | [None / Low / Medium / High]                    |
| **Backend Complexity** | [None / Low / Medium / High]                 |
| **Integrations**    | [List external systems or "None"]               |
| **Data Migration**  | [Required / Not Required]                       |
| **New Infrastructure** | [Required / Not Required]                    |
| **Unknowns / Risks**| [KEY RISKS or "None identified"]                |

> **Splitting guidance:** If this epic is sized **L**, consider breaking it into smaller epics
> before writing user stories.

---

## 5. Dependencies

<!-- List everything that must exist or be completed before work on this epic can start or finish.
     Include both internal (other epics/teams) and external (third-party services, APIs) dependencies. -->

### Upstream Dependencies
> Things that must be **done before** this epic can start.

| ID          | Dependency                          | Type                  | Status        |
|-------------|-------------------------------------|-----------------------|---------------|
| [EPIC-### / EXT-###] | [DESCRIPTION OF DEPENDENCY] | [Epic / API / Infra / Team] | [Pending / In Progress / Done] |
| [EPIC-### / EXT-###] | [DESCRIPTION OF DEPENDENCY] | [Epic / API / Infra / Team] | [Pending / In Progress / Done] |

### Downstream Dependents
> Epics or features that are **blocked by** this epic.

| ID          | Dependent Epic / Feature            | Notes                 |
|-------------|-------------------------------------|-----------------------|
| [EPIC-###]  | [DESCRIPTION]                       | [WHY IT IS BLOCKED]   |
| [EPIC-###]  | [DESCRIPTION]                       | [WHY IT IS BLOCKED]   |

> If there are no dependencies, write: _"No dependencies identified."_

---

## 6. User Stories

<!-- User stories will be added here as they are written and refined.
     Each story should follow the format:
       "As a [persona], I want to [action] so that [benefit]."
     Link to individual story files or a tracking tool (e.g., Jira, GitHub Issues) as available. -->

<!-- ═══════════════════════════════════════════════════════
     PLACEHOLDER — Stories to be defined during sprint planning
     ═══════════════════════════════════════════════════════ -->

| Story ID   | Title                              | Priority | Status     | Link / Notes           |
|------------|------------------------------------|----------|------------|------------------------|
| [US-###]   | [USER STORY TITLE]                 | [P0/P1/P2] | [To Do]  | [LINK OR NOTE]         |
| [US-###]   | [USER STORY TITLE]                 | [P0/P1/P2] | [To Do]  | [LINK OR NOTE]         |
| [US-###]   | [USER STORY TITLE]                 | [P0/P1/P2] | [To Do]  | [LINK OR NOTE]         |

> **Story template:** See `specs/templates/user-story-template.md` for the standard format.

---

## Appendix

### Open Questions

<!-- Track unresolved questions that could affect scope or design decisions. -->

| #  | Question                              | Owner      | Due Date   | Status   |
|----|---------------------------------------|------------|------------|----------|
| 1  | [OPEN QUESTION]                       | [OWNER]    | [DATE]     | [Open]   |
| 2  | [OPEN QUESTION]                       | [OWNER]    | [DATE]     | [Open]   |

### Revision History

| Version | Date       | Author     | Summary of Changes         |
|---------|------------|------------|----------------------------|
| 1.0     | [DATE]     | [AUTHOR]   | Initial draft              |
