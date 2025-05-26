import { Task } from './task.interface';

export interface Project {
  id: number;
  name: string;
  description: string;
  status: ProjectStatus;
  tasks: Task[];
  createdAt: Date;
  updatedAt: Date;
}

export type ProjectStatus = 'active' | 'completed' | 'archived';
