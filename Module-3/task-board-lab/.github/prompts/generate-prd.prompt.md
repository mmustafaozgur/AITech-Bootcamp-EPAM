---
description: "Generate a PRD from project brief"
---

# Generate PRD from Project Brief

## Instructions

You are a senior product manager. Your task is to generate a complete, high-quality
Product Requirements Document (PRD) from the project brief provided below.

### Step 1 — Read the Template

Read the PRD template at `specs/templates/prd-template.md` and use it as the exact
structure for your output. Do not add or remove top-level sections.

### Step 2 — Read the Project Brief

The project brief is provided at the end of this prompt under **Project Brief**.
Extract all relevant information from it before writing.

### Step 3 — Generate the PRD

Replace every placeholder (`[DESCRIPTION HERE]`, `[METRIC NAME]`, etc.) with specific,
researched content derived from the brief. Apply the rules below:

#### Content Rules

| Section | Rule |
|---|---|
| **Problem Statement** | Must include at least one quantified pain point (%, time, money, or frequency). If the brief lacks numbers, make a reasonable, clearly-labelled assumption. |
| **Goals** | 3 goals minimum. Each must be action-oriented (verb + object + outcome). |
| **Personas** | Give each persona a realistic first name and job title. Include one quote that captures their frustration. |
| **Use Cases** | Write at least 3 use cases. Each must have all five fields (Actor, Precondition, Steps, Postcondition, Alternate Flows). |
| **Functional Requirements** | Minimum 5 requirements. Assign P0/P1/P2 priority. P0 items must be launch-critical. |
| **Non-Functional Requirements** | All six sub-sections must have at least one concrete, measurable requirement (no vague statements like "should be fast"). |
| **Success Metrics** | All metrics must be SMART: include a numeric baseline, a numeric target, and a named measurement method. |
| **Scope** | In-scope list must have ≥ 3 items. Out-of-scope table must have ≥ 2 items with rationale. |

### Step 4 — Self-Review Checklist

Before producing the final output, silently verify each item. If any item fails,
revise the relevant section before outputting.

- [ ] **Problem has numbers** — the Problem Statement contains at least one quantified data point or labelled assumption.
- [ ] **Personas are named** — every persona has a first name and a specific job title (not just "user" or "manager").
- [ ] **Metrics are SMART** — every row in the Success Metrics table has a numeric baseline, numeric target, and measurement method.
- [ ] **Scope is unambiguous** — In Scope and Out of Scope items do not overlap; each Out of Scope item has a rationale.
- [ ] **No unfilled placeholders** — the output contains no `[DESCRIPTION HERE]`-style brackets.
- [ ] **All use cases are complete** — every use case has Actor, Precondition, Steps, Postcondition, and Alternate Flows.
- [ ] **Non-functional requirements are measurable** — no NFR uses vague language like "fast", "secure", or "reliable" without a number.

### Step 5 — Save the Output

Save the completed PRD to:

```
specs/prds/PRD-{feature-name}.md
```

Replace `{feature-name}` with a lowercase kebab-case slug derived from the project
name in the brief (e.g., `PRD-task-board-mvp.md`).

Set the document header fields:
- **Version:** 1.0
- **Status:** Draft
- **Last Updated:** today's date (YYYY-MM-DD)

---

## Project Brief

$projectBrief
