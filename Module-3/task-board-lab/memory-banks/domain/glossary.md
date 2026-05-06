# Domain Glossary — Task Board

This glossary defines the domain terms used in the Task Board project. Use these definitions consistently in code, specs, and conversations.

## Core Entities

### Task
The fundamental unit of work on the board. A task has:
- `id` — unique identifier (UUID string).
- `title` — short label describing the work item (required, non-empty).
- `status` — current column the task belongs to (`'todo'`, `'in-progress'`, or `'done'`).
- `createdAt` — ISO 8601 timestamp of creation.

### Board
The full Kanban view containing all columns and their tasks. Conceptually maps to the entire `taskboard:tasks` localStorage array.

### Column
One of the three fixed vertical lanes on the board. Columns are not stored separately — they are derived from grouping tasks by `status`.

| Column Label | Status Value  |
|--------------|---------------|
| To Do        | `todo`        |
| In Progress  | `in-progress` |
| Done         | `done`        |

### TaskStatus
A TypeScript union type representing the three valid column statuses:
```ts
type TaskStatus = 'todo' | 'in-progress' | 'done';
```

## Interactions

### Drag-and-Drop (DnD)
Moving a task from one column to another by dragging the task card and dropping it onto a target column or position. Implemented via `@dnd-kit/core`.

### Drop Zone
The highlighted target area within a column that indicates where a dragged task will land. Activated only while a drag operation is in progress.

### Reorder
Moving a task within the same column to a different vertical position, without changing its `status`.

## Persistence

### localStorage
The browser's key-value storage used as the sole persistence layer. All task data is stored here under the `taskboard:` prefix.

### Schema Version
The value of `taskboard:version` key. Starts at `"1"`. Bumped whenever the stored data shape changes in a backwards-incompatible way, triggering a migration function.

### Migration
A function in `src/utils/migrations.ts` that transforms stored data from an older schema version to a newer one when the app detects a version mismatch on startup.

## UI Concepts

### Warning Banner
A non-blocking UI element shown at the top of the board when localStorage is unavailable. Informs the user that tasks will not be persisted between sessions.

### Inline Edit
Editing a task's title directly on the task card, without navigating to a separate page or modal.

### Confirmation
A brief prompt (e.g., a confirm dialog or inline confirmation button) shown before a destructive action such as deleting a task.

## Personas

### Alex
Senior freelance developer. Primary persona. Values keyboard shortcuts, fast task capture, and zero setup friction.

### Jordan
Junior developer / student. Secondary persona. Values free access with no account or backend required.
