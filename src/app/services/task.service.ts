import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
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
  private tasksSignal = signal<Task[]>([]);
  private loadingSignal = signal<boolean>(false);
  private errorSignal = signal<string | null>(null);

  // Expose signals as readonly
  readonly tasks = this.tasksSignal.asReadonly();
  readonly loading = this.loadingSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();

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

  createTask(task: Task): Observable<Task> {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    return this.http.post<Task>(this.apiUrl, task).pipe(
      tap({
        next: (newTask) => {
          this.tasksSignal.update((tasks) => [...tasks, newTask]);
          this.loadingSignal.set(false);
        },
        error: (error) => {
          this.errorSignal.set('Failed to create task');
          this.loadingSignal.set(false);
        },
      })
    );
  }

  updateTask(id: number, task: Task): Observable<Task> {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    return this.http.put<Task>(`${this.apiUrl}/${id}`, task).pipe(
      tap({
        next: (updatedTask) => {
          this.tasksSignal.update((tasks) =>
            tasks.map((t) => (t.id === id ? updatedTask : t))
          );
          this.loadingSignal.set(false);
        },
        error: (error) => {
          this.errorSignal.set('Failed to update task');
          this.loadingSignal.set(false);
        },
      })
    );
  }

  deleteTask(id: number): Observable<void> {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap({
        next: () => {
          this.tasksSignal.update((tasks) => tasks.filter((t) => t.id !== id));
          this.loadingSignal.set(false);
        },
        error: (error) => {
          this.errorSignal.set('Failed to delete task');
          this.loadingSignal.set(false);
        },
      })
    );
  }

  getTasksByProject(projectId: number): Observable<Task[]> {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    return this.http.get<Task[]>(`${this.apiUrl}?projectId=${projectId}`).pipe(
      tap({
        next: (tasks) => {
          this.tasksSignal.set(tasks);
          this.loadingSignal.set(false);
        },
        error: (error) => {
          this.errorSignal.set('Failed to load tasks');
          this.loadingSignal.set(false);
        },
      })
    );
  }
}
