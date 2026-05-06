import type { TaskStatus } from './task.types';
import styles from './KanbanColumn.module.css';

interface KanbanColumnProps {
  title: string;
  status: TaskStatus;
  children?: React.ReactNode;
}

export function KanbanColumn({ title, children }: KanbanColumnProps) {
  return (
    <section className={styles.column} aria-label={title}>
      <header className={styles.header}>
        <h2 className={styles.title}>{title}</h2>
      </header>
      <div className={styles.cardList}>
        {children}
      </div>
    </section>
  );
}
