export type TaskStatus = 'todo' | 'inprogress' | 'done';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  createdAt: number;
}

export interface ColumnConfig {
  id: TaskStatus;
  title: string;
  accentColor: string;
}
