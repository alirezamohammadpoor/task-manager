import { Task, TaskPriority, TaskStatus } from '../../models/task.interface';

/** Sort weights so high priority / earlier status come first. */
const PRIORITY_ORDER: Record<TaskPriority, number> = { high: 0, medium: 1, low: 2 };
const STATUS_ORDER: Record<TaskStatus, number> = {
  todo: 0,
  'in-progress': 1,
  completed: 2,
};

/** Comparators for `Array.prototype.sort`, shared by the task and project lists. */
export const compareByPriority = (a: Task, b: Task): number =>
  PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority];

export const compareByStatus = (a: Task, b: Task): number =>
  STATUS_ORDER[a.status] - STATUS_ORDER[b.status];

export const compareByTitle = (a: Task, b: Task): number =>
  a.title.localeCompare(b.title);

/** Tasks without a due date sort last. */
export const compareByDueDate = (a: Task, b: Task): number => {
  if (!a.dueDate) return 1;
  if (!b.dueDate) return -1;
  return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
};
