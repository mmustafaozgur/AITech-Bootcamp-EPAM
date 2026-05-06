---
description: "Break Epic into User Stories"
---

# Break Epic into User Stories

## Instructions

You are a senior product manager breaking an Epic into well-formed, sprint-ready
User Stories. Your goal is to produce 5–7 stories that a developer can pick up
and implement without further clarification.

### Step 1 — Read the Inputs

Read all three files before writing anything:

1. **Story template:** `specs/templates/story-template.md` — use this as the exact
   structure for every story you produce.
2. **Epic file:** the path supplied in `$epicFile` — extract the Epic ID, Description,
   Primary Persona, Success Criteria, and any noted scope boundaries.
3. **Parent PRD** *(if referenced in the Epic's header)*: skim Goals and Personas
   to ensure story language is consistent with the PRD.

### Step 2 — Identify User Stories

Analyse the Epic and identify **5–7 User Stories**. Apply all rules below.

#### Story Identification Rules

| Rule | Requirement |
|---|---|
| **Format** | Every story must follow: *"As a [persona], I want to [action], so that [benefit]."* Persona must match the Epic's Primary Persona or a named PRD persona — never "user" or "the system". |
| **Size** | Each story must be completable in **1–3 days** by one developer. If a candidate story is larger, split it. |
| **Vertical slice** | Each story must cut through all layers needed (UI + logic + storage) — no horizontal slices like "add all API calls" or "style all components". |
| **Coverage** | Collectively the stories must cover all P0 Functional Requirements scoped to this Epic. Note any P1/P2 items deferred to future sprints. |
| **Independence** | Minimise dependencies between stories. Where a dependency is unavoidable, note it in the story's Dependencies section and sequence stories accordingly. |

#### Sequencing

Order stories from foundational to advanced. Assign IDs using the parent Epic number:
`US-{epicNumber}.01`, `US-{epicNumber}.02`, … matching the Epic ID (e.g., if the
Epic is `EPIC-002`, stories are `US-002.01`, `US-002.02`, etc.).

### Step 3 — Fill Each Story

Populate every field in the story template. Replace all placeholders — output must
contain no `[DESCRIPTION HERE]`-style brackets.

| Template Field | Rule |
|---|---|
| **Story ID** | `US-{epicNumber}.{nn}` — zero-padded two digits (`.01`, `.02`, …). |
| **Epic** | Reference the parent Epic ID and title from `$epicFile`. |
| **User Story sentence** | Persona = named role; Action = specific UI or system interaction; Benefit = business or user outcome, not a technical detail. |
| **Acceptance Criteria** | 3–5 items in Given / When / Then format. Each must be independently testable. No two ACs should test the same observable behaviour. |
| **Technical Notes** | Include: relevant localStorage key (following `taskboard:` prefix convention from `agents.md`), component or hook name suggestion, any edge cases. Mark as optional if genuinely none exist. |
| **Estimation** | Assign story points (1, 2, or 3 — max 3 for a 1–3 day story). Add a one-line sizing rationale. |
| **Dependencies** | List upstream story IDs required before this can start, or write "None". |
| **INVEST Checklist** | All 6 boxes must be checked. If any cannot be checked, revise the story until they can. |

### Step 4 — Self-Review Checklist

Silently verify every item before producing output. Revise any story that fails.

- [ ] **Count:** 5–7 stories produced — no fewer, no more.
- [ ] **Format:** every story sentence follows *As a / I want to / so that* with a named persona.
- [ ] **Size:** every story is estimated at ≤ 3 story points (≤ 3 days).
- [ ] **ACs:** every story has 3–5 Given/When/Then acceptance criteria with no duplicates.
- [ ] **INVEST:** all 6 INVEST checkboxes are checked on every story.
- [ ] **Coverage:** all P0 requirements in the Epic's scope are addressed by at least one story.
- [ ] **Vertical slices:** no story is purely a backend, frontend, or styling task.
- [ ] **No placeholders:** output contains no unfilled `[BRACKET]` text.
- [ ] **Consistent naming:** persona names match the PRD/Epic; localStorage keys use `taskboard:` prefix.
- [ ] **Dependencies are sequenced:** if Story B depends on Story A, Story A has a lower sequence number.

### Step 5 — Save the Output

Save each story as a separate file:

```
specs/stories/STORY-{epicNumber}.{nn}-{slug}.md
```

- `{epicNumber}` — three-digit Epic ID (e.g., `002`).
- `{nn}` — zero-padded two-digit story sequence within the Epic (e.g., `01`).
- `{slug}` — lowercase kebab-case derived from the story title.

Example: `specs/stories/STORY-002.01-create-task.md`

Set the header fields for each file:
- **Story ID:** `US-{epicNumber}.{nn}` (matching the filename)
- **Epic:** ID and title from `$epicFile`
- **Status:** Draft
- **Sprint / Iteration:** leave as `[TBD]`

After saving all files, output a **story breakdown summary** in this format:

```
## Story Breakdown Summary — {Epic Title}

| Story ID     | Title                        | Persona         | Points | Depends On       |
|--------------|------------------------------|-----------------|--------|------------------|
| US-{e}.01    | [title]                      | [persona]       | 2      | —                |
| US-{e}.02    | [title]                      | [persona]       | 3      | US-{e}.01        |
| US-{e}.03    | [title]                      | [persona]       | 1      | —                |
| US-{e}.04    | [title]                      | [persona]       | 2      | US-{e}.02        |
| US-{e}.05    | [title]                      | [persona]       | 3      | US-{e}.03        |

**Total points:** [sum]
**PRD requirements covered:** [list P0 FRs addressed]
**Deferred to future sprint:** [list any P1/P2 items not included, or "None"]
```

---

## Inputs

**Epic file path:**

$epicFile
