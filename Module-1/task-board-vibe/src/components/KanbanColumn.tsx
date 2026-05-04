import { useState } from 'react';
import type { ColumnConfig, Task, TaskStatus } from '../types';
import KanbanCard from './KanbanCard';
import './KanbanColumn.css';

interface KanbanColumnProps {
  column: ColumnConfig;
  tasks: Task[];
  onAddTask: (status: TaskStatus, title: string, description: string) => void;
  onDeleteTask: (id: string) => void;
  onMoveTask: (id: string, status: TaskStatus) => void;
  onDragStart: (id: string) => void;
  onDrop: (status: TaskStatus) => void;
}

export default function KanbanColumn({
  column,
  tasks,
  onAddTask,
  onDeleteTask,
  onMoveTask,
  onDragStart,
  onDrop,
}: KanbanColumnProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
    setIsDragOver(true);
  }

  function handleDragLeave() {
    setIsDragOver(false);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragOver(false);
    onDrop(column.id);
  }

  function handleAdd() {
    const title = newTitle.trim();
    if (!title) return;
    onAddTask(column.id, title, newDescription.trim());
    setNewTitle('');
    setNewDescription('');
    setIsAdding(false);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAdd();
    }
    if (e.key === 'Escape') {
      setIsAdding(false);
      setNewTitle('');
      setNewDescription('');
    }
  }

  return (
    <div
      className={`kanban-column${isDragOver ? ' kanban-column--drag-over' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="kanban-column__header" style={{ borderTopColor: column.accentColor }}>
        <span className="kanban-column__title">{column.title}</span>
        <span className="kanban-column__count" style={{ background: column.accentColor }}>
          {tasks.length}
        </span>
      </div>

      <div className="kanban-column__cards">
        {tasks.map((task) => (
          <KanbanCard
            key={task.id}
            task={task}
            onDelete={onDeleteTask}
            onMove={onMoveTask}
            onDragStart={onDragStart}
          />
        ))}
      </div>

      <div className="kanban-column__footer">
        {isAdding ? (
          <div className="kanban-column__add-form">
            <input
              className="kanban-column__input"
              placeholder="Task title"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              onKeyDown={handleKeyDown}
              autoFocus
            />
            <input
              className="kanban-column__input"
              placeholder="Description (optional)"
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <div className="kanban-column__add-actions">
              <button
                className="kanban-column__confirm-btn"
                style={{ background: column.accentColor }}
                onClick={handleAdd}
                disabled={!newTitle.trim()}
              >
                Add
              </button>
              <button
                className="kanban-column__cancel-btn"
                onClick={() => {
                  setIsAdding(false);
                  setNewTitle('');
                  setNewDescription('');
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button
            className="kanban-column__add-btn"
            onClick={() => setIsAdding(true)}
          >
            + Add task
          </button>
        )}
      </div>
    </div>
  );
}
