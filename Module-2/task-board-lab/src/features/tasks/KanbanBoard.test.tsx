import { render, screen } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { KanbanBoard } from './KanbanBoard';

describe('KanbanBoard — US-001.01', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  // AC-01: three columns with exact labels are visible on load
  it('renders three columns labelled "To Do", "In Progress", and "Done"', () => {
    render(<KanbanBoard />);

    expect(screen.getByRole('region', { name: 'To Do' })).toBeInTheDocument();
    expect(screen.getByRole('region', { name: 'In Progress' })).toBeInTheDocument();
    expect(screen.getByRole('region', { name: 'Done' })).toBeInTheDocument();
  });

  // AC-02: each column has a visually distinct header with a readable label
  it('renders a heading inside each column', () => {
    render(<KanbanBoard />);

    const headings = screen.getAllByRole('heading', { level: 2 });
    const labels = headings.map((h) => h.textContent);

    expect(labels).toContain('To Do');
    expect(labels).toContain('In Progress');
    expect(labels).toContain('Done');
  });

  // AC-03: empty board shows no error state when localStorage has no tasks
  it('renders all three columns empty without errors when localStorage is empty', () => {
    render(<KanbanBoard />);

    // No tasks rendered means no role="article" or role="listitem" for cards
    expect(screen.queryByRole('article')).not.toBeInTheDocument();

    // All three column regions still present
    expect(screen.getAllByRole('region')).toHaveLength(3);
  });
});
