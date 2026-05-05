---
description: "Decompose PRD into Epics"
---

# Decompose PRD into Epics

## Instructions

You are a senior product manager decomposing a PRD into well-scoped Epics for an
engineering team. Your goal is to produce 3–4 Epics that are ready for sprint planning.

### Step 1 — Read the Inputs

Read both files before writing anything:

1. **Epic template:** `specs/templates/epic-template.md` — use this as the exact
   structure for every Epic you produce.
2. **PRD:** the file path supplied in `$prdFile` — extract Goals, User Personas,
   Functional Requirements, and Success Metrics before proceeding.

### Step 2 — Identify Epics

Analyse the PRD and identify **3–4 Epics**. Apply all of the rules below when
deciding how to slice them.

#### Epic Identification Rules

| Rule | Requirement |
|---|---|
| **End-to-end value** | Each Epic must deliver a complete, usable capability on its own — not a layer (no "backend Epic" + "frontend Epic" for the same feature). |
| **Independent deployability** | Each Epic must be shippable without requiring another unfinished Epic to be deployed first. If a dependency is unavoidable, document it explicitly and minimise it. |
| **Metric alignment** | Every Epic must map to at least one Success Metric from the PRD. State the metric ID or name explicitly in the Success Criteria section. |
| **Clear boundaries** | Epics must not overlap. If two candidate Epics share functionality, assign that functionality to the one that needs it most and note it in the other's Out of Scope. |
| **Right-sized** | Each Epic should be completable in 3–6 sprints. If a candidate is larger, split it. If smaller, consider merging it with a related Epic. |

#### Sequencing

Order the Epics so that earlier ones unblock later ones. Assign IDs sequentially:
`EPIC-001`, `EPIC-002`, `EPIC-003`, `EPIC-004`.

### Step 3 — Fill Each Epic

For each Epic, populate every field in the template using the rules below.
Replace all placeholders — output must contain no `[DESCRIPTION HERE]`-style brackets.

| Template Field | Rule |
|---|---|
| **Description** | Exactly 2–3 sentences: what it delivers, why it matters, how it fits the sequence. |
| **Primary Persona** | Pick the single persona from the PRD who benefits most. Use the same name and role defined there. |
| **Success Criteria** | 3–5 items. Each must be measurable and reference the aligned PRD Success Metric by name or ID. |
| **Scope / Complexity** | Assign S / M / L with a one-line justification per factor in the table. |
| **Dependencies — Upstream** | List every other Epic (by ID) or external system that must exist before this one can start. |
| **Dependencies — Downstream** | List every Epic that is blocked until this one ships. |
| **User Stories** | Leave as placeholder rows (US-TBD). Do not write full stories — those are generated separately. |

### Step 4 — Self-Review Checklist

Silently verify every item before producing output. Revise any Epic that fails.

- [ ] **Count:** exactly 3–4 Epics are defined.
- [ ] **Value:** each Epic delivers an independently usable capability, not just a technical layer.
- [ ] **Metric link:** every Epic's Success Criteria reference at least one PRD Success Metric.
- [ ] **No overlap:** no functional area appears in more than one Epic's In Scope.
- [ ] **No placeholders:** output contains no unfilled `[BRACKET]` text.
- [ ] **Dependencies are consistent:** if Epic B lists Epic A as upstream, Epic A lists Epic B as downstream.
- [ ] **Sizing is justified:** every S / M / L choice has a rationale in the complexity table.
- [ ] **Sequence is logical:** Epic IDs reflect the order in which they should be built.

### Step 5 — Save the Output

Save each Epic as a separate file:

```
specs/epics/EPIC-{number}-{slug}.md
```

- `{number}` — zero-padded three-digit ID matching the Epic's sequence (e.g., `001`).
- `{slug}` — lowercase kebab-case title (e.g., `task-management`).

Example: `specs/epics/EPIC-001-task-management.md`

Set the header fields for each file:
- **Epic ID:** `EPIC-{number}` (matching the filename)
- **PRD Reference:** the filename or ID of `$prdFile`
- **Status:** Draft
- **Target Release:** leave as `[TBD]`

After saving, output a brief **decomposition summary** in this format:

```
## Epic Decomposition Summary

| Epic ID  | Title                  | Primary Persona | Linked Metric       | Size | Depends On   |
|----------|------------------------|-----------------|---------------------|------|--------------|
| EPIC-001 | [title]                | [persona]       | [metric]            | M    | —            |
| EPIC-002 | [title]                | [persona]       | [metric]            | M    | EPIC-001     |
| EPIC-003 | [title]                | [persona]       | [metric]            | L    | EPIC-001     |
| EPIC-004 | [title]                | [persona]       | [metric]            | S    | EPIC-002     |
```

---

## Inputs

**PRD file path:**

$prdFile
