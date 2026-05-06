import { KanbanColumn } from './KanbanColumn';
import styles from './KanbanBoard.module.css';

const COLUMNS = [
  { title: 'To Do', status: 'todo' as const },
  { title: 'In Progress', status: 'in-progress' as const },
  { title: 'Done', status: 'done' as const },
];

export function KanbanBoard() {
  return (
    <main className={styles.board} aria-label="Kanban board">
      {COLUMNS.map((col) => (
        <KanbanColumn key={col.status} title={col.title} status={col.status} />
      ))}
    </main>
  );
}
