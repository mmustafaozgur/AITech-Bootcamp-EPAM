import type { TaskStatus } from './task.types';
import styles from './KanbanColumn.module.css';

interface KanbanColumnProps {
  title: string;
  status: TaskStatus;
}

export function KanbanColumn({ title }: KanbanColumnProps) {
  return (
    <section className={styles.column} aria-label={title}>
      <h2 className={styles.header}>{title}</h2>
      <div className={styles.taskList} />
    </section>
  );
}
