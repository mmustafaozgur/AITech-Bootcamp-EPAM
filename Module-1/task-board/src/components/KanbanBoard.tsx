import { useRef, useState } from 'react';
import type { ColumnConfig, Task, TaskStatus } from '../types';
import KanbanColumn from './KanbanColumn';
import './KanbanBoard.css';

const COLUMNS: ColumnConfig[] = [
  { id: 'todo',       title: 'To Do',       accentColor: '#6366f1' },
  { id: 'inprogress', title: 'In Progress',  accentColor: '#f59e0b' },
  { id: 'done',       title: 'Done',         accentColor: '#10b981' },
];

const INITIAL_TASKS: Task[] = [
  { id: '1', title: 'Design wireframes',       description: 'Sketch initial UI layouts', status: 'todo',       createdAt: Date.now() - 5000 },
  { id: '2', title: 'Set up project structure', description: 'Vite + React + TS scaffold',  status: 'inprogress', createdAt: Date.now() - 3000 },
  { id: '3', title: 'Write unit tests',         description: '',                             status: 'todo',       createdAt: Date.now() - 2000 },
  { id: '4', title: 'Deploy to production',     description: 'Configure CI/CD pipeline',     status: 'done',       createdAt: Date.now() - 1000 },
];

export default function KanbanBoard() {
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const draggedId = useRef<string | null>(null);

  function addTask(status: TaskStatus, title: string, description: string) {
    const task: Task = {
      id: crypto.randomUUID(),
      title,
      description,
      status,
      createdAt: Date.now(),
    };
    setTasks((prev) => [...prev, task]);
  }

  function deleteTask(id: string) {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }

  function moveTask(id: string, status: TaskStatus) {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status } : t))
    );
  }

  function handleDragStart(id: string) {
    draggedId.current = id;
  }

  function handleDrop(status: TaskStatus) {
    if (draggedId.current) {
      moveTask(draggedId.current, status);
      draggedId.current = null;
    }
  }

  const tasksByStatus = (status: TaskStatus) =>
    tasks
      .filter((t) => t.status === status)
      .sort((a, b) => a.createdAt - b.createdAt);

  return (
    <div className="kanban-board">
      <header className="kanban-board__header">
        <h1 className="kanban-board__title">Task Board</h1>
        <p className="kanban-board__subtitle">
          {tasks.length} task{tasks.length !== 1 ? 's' : ''} total
        </p>
      </header>
      <div className="kanban-board__columns">
        {COLUMNS.map((col) => (
          <KanbanColumn
            key={col.id}
            column={col}
            tasks={tasksByStatus(col.id)}
            onAddTask={addTask}
            onDeleteTask={deleteTask}
            onMoveTask={moveTask}
            onDragStart={handleDragStart}
            onDrop={handleDrop}
          />
        ))}
      </div>
    </div>
  );
}
