import type { Task, TaskStatus } from '../types';
import './KanbanCard.css';

interface KanbanCardProps {
  task: Task;
  onDelete: (id: string) => void;
  onMove: (id: string, status: TaskStatus) => void;
  onDragStart: (id: string) => void;
}

const STATUS_ORDER: TaskStatus[] = ['todo', 'inprogress', 'done'];

export default function KanbanCard({ task, onDelete, onMove, onDragStart }: KanbanCardProps) {
  const currentIndex = STATUS_ORDER.indexOf(task.status);

  return (
    <div
      className="kanban-card"
      draggable
      onDragStart={() => onDragStart(task.id)}
    >
      <div className="kanban-card__body">
        <p className="kanban-card__title">{task.title}</p>
        {task.description && (
          <p className="kanban-card__description">{task.description}</p>
        )}
      </div>
      <div className="kanban-card__actions">
        <div className="kanban-card__move-btns">
          <button
            className="kanban-card__move-btn"
            disabled={currentIndex === 0}
            onClick={() => onMove(task.id, STATUS_ORDER[currentIndex - 1])}
            title="Move left"
          >
            ←
          </button>
          <button
            className="kanban-card__move-btn"
            disabled={currentIndex === STATUS_ORDER.length - 1}
            onClick={() => onMove(task.id, STATUS_ORDER[currentIndex + 1])}
            title="Move right"
          >
            →
          </button>
        </div>
        <button
          className="kanban-card__delete-btn"
          onClick={() => onDelete(task.id)}
          title="Delete task"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
