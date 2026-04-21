import { Task } from './task.interface';

export type ProjectStatus = 'active' | 'completed' | 'archived';

export interface Project {
  id: number;
  name: string;
  description: string;
  status: ProjectStatus;
  deadline: Date;
  tasks: Task[];
  createdAt: Date;
  updatedAt: Date;
}
