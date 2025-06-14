import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Task } from '../models/task.interface';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private apiUrl = 'http://localhost:3000/tasks';

  // Mock data for testing
  private mockTasks: Task[] = [
    {
      id: 1,
      title: 'Design Homepage',
      description: 'Create new homepage design',
      status: 'todo',
      priority: 'high',
      dueDate: new Date('2024-03-01'),
      projectId: 1,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
    },
    {
      id: 2,
      title: 'Implement Navigation',
      description: 'Build responsive navigation menu',
      status: 'in-progress',
      priority: 'medium',
      dueDate: new Date('2024-03-15'),
      projectId: 1,
      createdAt: new Date('2024-01-02'),
      updatedAt: new Date('2024-01-15'),
    },
    {
      id: 3,
      title: 'Setup Development Environment',
      description: 'Configure development tools and environment',
      status: 'completed',
      priority: 'high',
      dueDate: new Date('2024-02-01'),
      projectId: 2,
      createdAt: new Date('2024-02-01'),
      updatedAt: new Date('2024-02-15'),
    },
  ];

  // Signals for state management
  private tasksSignal = signal<Task[]>(this.mockTasks);
  private loadingSignal = signal<boolean>(false);
  private errorSignal = signal<string | null>(null);

  // Public signals
  public tasks = this.tasksSignal.asReadonly();
  public loading = this.loadingSignal.asReadonly();
  public error = this.errorSignal.asReadonly();

  constructor(private http: HttpClient) {}

  getTasks(): Observable<Task[]> {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    try {
      const tasks = this.mockTasks;
      this.tasksSignal.set(tasks);
      return of(tasks);
    } catch (err) {
      this.errorSignal.set('Failed to load tasks');
      return of([]);
    } finally {
      this.loadingSignal.set(false);
    }
  }

  getTask(id: number): Observable<Task> {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    try {
      const task = this.mockTasks.find((t) => t.id === id);
      if (!task) {
        throw new Error('Task not found');
      }
      return of(task);
    } catch (err) {
      this.errorSignal.set('Failed to load task');
      return of(this.mockTasks[0]); // Fallback
    } finally {
      this.loadingSignal.set(false);
    }
  }

  createTask(task: Omit<Task, 'id'>): Observable<Task> {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    try {
      const newTask = {
        ...task,
        id: this.mockTasks.length + 1,
      };
      this.mockTasks.push(newTask);
      this.tasksSignal.set([...this.mockTasks]);
      return of(newTask);
    } catch (err) {
      this.errorSignal.set('Failed to create task');
      return of(this.mockTasks[0]); // Fallback
    } finally {
      this.loadingSignal.set(false);
    }
  }

  updateTask(id: number, task: Partial<Task>): Observable<Task> {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    try {
      const index = this.mockTasks.findIndex((t) => t.id === id);
      if (index === -1) {
        throw new Error('Task not found');
      }
      this.mockTasks[index] = { ...this.mockTasks[index], ...task };
      this.tasksSignal.set([...this.mockTasks]);
      return of(this.mockTasks[index]);
    } catch (err) {
      this.errorSignal.set('Failed to update task');
      return of(this.mockTasks[0]); // Fallback
    } finally {
      this.loadingSignal.set(false);
    }
  }

  deleteTask(id: number): Observable<void> {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    try {
      const index = this.mockTasks.findIndex((t) => t.id === id);
      if (index === -1) {
        throw new Error('Task not found');
      }
      this.mockTasks.splice(index, 1);
      this.tasksSignal.set([...this.mockTasks]);
      return of(void 0);
    } catch (err) {
      this.errorSignal.set('Failed to delete task');
      return of(void 0);
    } finally {
      this.loadingSignal.set(false);
    }
  }

  getTasksByProject(projectId: number): Observable<Task[]> {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    try {
      const tasks = this.mockTasks.filter((t) => t.projectId === projectId);
      return of(tasks);
    } catch (err) {
      this.errorSignal.set('Failed to load project tasks');
      return of([]);
    } finally {
      this.loadingSignal.set(false);
    }
  }
}
