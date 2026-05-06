---
description: "Generate an ADR from a decision description"
---

# Generate Architecture Decision Record (ADR)

## Instructions

You are a software architect working on the **Task Board** project
(React 18 + TypeScript + Vite, `localStorage`-only, no backend).

### Step 1 — Read the Template

Read the ADR template at `specs/templates/adr-template.md` and use it as the exact
structure for your output. Do not add or remove top-level sections.

### Step 2 — Read the Decision Input

The decision details are provided at the end of this prompt under **Decision Input**.
Extract all relevant information before writing.

### Step 3 — Generate the ADR

Replace every placeholder with specific content derived from the input. Apply the rules below:

#### Content Rules

| Section | Rule |
|---|---|
| **ID & Title** | Assign the next sequential number by checking existing files in `specs/adrs/`. Zero-pad to 3 digits. |
| **Status** | Always set to `Proposed`. |
| **Date** | Use today's date in YYYY-MM-DD format. |
| **Context** | Write in neutral, factual language. No advocacy for any solution. 2–4 sentences. |
| **Decision** | Must start with "We will …". One clear, direct sentence. |
| **Consequences** | List at least one item in each of Positive, Negative, and Neutral sections. |
| **Alternatives Considered** | Include every option from the input plus at least one more. Each row must have Pros, Cons, and Reason Rejected. |
| **References** | Link to any related PRD, Epic, or User Story files mentioned in the input. |

### Step 4 — Self-Review Checklist

Before producing the final output, silently verify each item. Revise if any item fails.

- [ ] **ID is sequential** — checked `specs/adrs/` for existing ADRs and assigned the next number.
- [ ] **Context is neutral** — no opinion or advocacy in the Context section.
- [ ] **Decision starts with "We will"** — active voice, one sentence.
- [ ] **All three consequence types present** — Positive, Negative, and Neutral each have ≥ 1 item.
- [ ] **Alternatives table is complete** — every row has Pros, Cons, and Reason Rejected; no empty cells.
- [ ] **No unfilled placeholders** — output contains no `[…]`-style brackets.

### Step 5 — Save the Output

Save the completed ADR to:

```
specs/adrs/adr-{###}-{slug}.md
```

Replace `{###}` with the zero-padded sequential number and `{slug}` with a lowercase
kebab-case summary of the title (e.g., `adr-001-use-localstorage.md`).

---

## Decision Input

$decisionInput
