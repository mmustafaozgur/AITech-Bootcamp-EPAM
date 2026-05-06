import { render, screen } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { KanbanBoard } from './KanbanBoard';

describe('KanbanBoard — US-001.01', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  // AC-01: Three columns with exact labels are visible on load
  it('AC-01: renders exactly three columns labelled "To Do", "In Progress", and "Done"', () => {
    render(<KanbanBoard />);

    expect(screen.getByRole('region', { name: 'To Do' })).toBeInTheDocument();
    expect(screen.getByRole('region', { name: 'In Progress' })).toBeInTheDocument();
    expect(screen.getByRole('region', { name: 'Done' })).toBeInTheDocument();
  });

  // AC-02: Each column has a visually distinct header
  it('AC-02: each column has a heading with the column label', () => {
    render(<KanbanBoard />);

    expect(screen.getByRole('heading', { name: /to do/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /in progress/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /done/i })).toBeInTheDocument();
  });

  // AC-03: Empty localStorage results in three empty columns with no error
  it('AC-03: renders three empty columns without errors when localStorage has no tasks', () => {
    render(<KanbanBoard />);

    const columns = screen.getAllByRole('region');
    expect(columns).toHaveLength(3);
    // No task cards should be present
    expect(screen.queryAllByRole('article')).toHaveLength(0);
  });

  // AC-04: All three columns are rendered side-by-side (flex-row layout)
  it('AC-04: board renders all three columns inside a single board container', () => {
    render(<KanbanBoard />);

    const board = screen.getByRole('main', { name: 'Kanban board' });
    expect(board).toBeInTheDocument();
    // All three column regions must be direct children of the board
    const columns = screen.getAllByRole('region');
    expect(columns).toHaveLength(3);
    columns.forEach((col) => expect(board).toContainElement(col));
  });
});
