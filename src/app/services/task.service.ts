import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { Task, TaskStatus, TaskPriority } from '../models/task.interface';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  // API URL for tasks
  private apiUrl = 'http://localhost:3000/tasks';

  // Signals for state management
  private tasksSignal = signal<Task[]>([]);
  private loadingSignal = signal<boolean>(false);
  private errorSignal = signal<string | null>(null);

  // Expose signals as readonly
  readonly tasks = this.tasksSignal.asReadonly();
  readonly loading = this.loadingSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();

  constructor(private http: HttpClient) {
    // Load tasks on service initialization
    this.loadTasks();
  }

  // Loads all tasks from the API
  private loadTasks(): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    this.http
      .get<Task[]>(this.apiUrl)
      .pipe(
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
      )
      .subscribe();
  }

  // Returns all tasks as an Observable
  getTasks(): Observable<Task[]> {
    // Always load fresh data from the API
    return this.http.get<Task[]>(this.apiUrl).pipe(
      tap((tasks) => {
        this.tasksSignal.set(tasks);
      })
    );
  }

  // Returns a single task by ID
  getTask(id: number): Observable<Task> {
    return this.http.get<Task>(`${this.apiUrl}/${id}`);
  }

  // Creates a new task
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

  // Updates an existing task
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

  // Deletes a task
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

  // Returns all tasks for a specific project
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
