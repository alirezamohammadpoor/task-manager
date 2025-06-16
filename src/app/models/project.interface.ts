import { Task } from './task.model';

// Project status can be 'active', 'completed', or 'archived'
export type ProjectStatus = 'active' | 'completed' | 'archived';

// Project interface describes a single project
export interface Project {
  id: number; // Unique project ID
  name: string; // Project name
  description: string; // Project description
  status: ProjectStatus; // Project status
  tasks: Task[]; // List of tasks in this project
  createdAt: Date; // When the project was created
  updatedAt: Date; // When the project was last updated
}
