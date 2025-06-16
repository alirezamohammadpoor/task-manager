// Task priority can be 'low', 'medium', or 'high'
export type TaskPriority = 'low' | 'medium' | 'high';

// Task status can be 'todo', 'in-progress', or 'completed'
export type TaskStatus = 'todo' | 'in-progress' | 'completed';

// Task interface describes a single task
export interface Task {
  id: number; // Unique task ID
  title: string; // Task title
  description: string; // Task description
  status: TaskStatus; // Task status
  priority: TaskPriority; // Task priority
  dueDate: Date; // Due date
  projectId: number; // ID of the project this task belongs to
  createdAt: Date; // When the task was created
  updatedAt: Date; // When the task was last updated
}
