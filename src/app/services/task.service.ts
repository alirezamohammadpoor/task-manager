import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Observable, tap, map } from 'rxjs';
import { Task, TaskStatus, TaskPriority } from '../models/task.model';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private apiUrl = 'https://dummyjson.com/todos';
  private _tasks = signal<Task[]>([]);
  private _loading = signal(false);
  private _error = signal<string | null>(null);
  private localTasks: Task[] = [];
  private localId = 10000; // Start local IDs high to avoid collision

  tasks = this._tasks.asReadonly();
  loading = this._loading.asReadonly();
  error = this._error.asReadonly();

  constructor(private http: HttpClient) {
    // Load tasks on service initialization
    this.loadTasks();
  }

  private mapDummyTodoToTask(todo: any): Task {
    return {
      id: todo.id,
      title: todo.todo,
      description: todo.description || '',
      status: todo.completed ? 'completed' : 'todo',
      priority: 'medium',
      dueDate: '',
      userId: todo.userId,
    };
  }

  private mapTaskToDummyPayload(task: Partial<Task>) {
    return {
      todo: task.title,
      completed: task.status === 'completed',
      userId: task.userId,
    };
  }

  // Loads all tasks from the API
  private loadTasks(): void {
    this._loading.set(true);
    this._error.set(null);

    this.http
      .get<{ todos: any[] }>(this.apiUrl)
      .pipe(
        map((response) =>
          response.todos.map((todo) => this.mapDummyTodoToTask(todo))
        ),
        tap({
          next: (tasks) => {
            this._tasks.set(tasks);
            this._loading.set(false);
          },
          error: (error) => {
            this._error.set('Failed to load tasks');
            this._loading.set(false);
          },
        })
      )
      .subscribe();
  }

  // Returns all tasks as an Observable
  getTasks(): Observable<Task[]> {
    this._loading.set(true);
    this._error.set(null);
    return this.http.get<{ todos: any[] }>(this.apiUrl + '?limit=5').pipe(
      map((response) =>
        response.todos.map((todo) => this.mapDummyTodoToTask(todo))
      ),
      map((tasks) => [...tasks, ...this.localTasks]),
      tap({
        next: (tasks) => {
          this._tasks.set(tasks);
          this._loading.set(false);
        },
        error: (error) => {
          this._error.set(error.message);
          this._loading.set(false);
        },
      })
    );
  }

  // Returns a single task by ID
  getTask(id: number): Observable<Task> {
    this._loading.set(true);
    this._error.set(null);
    // Check local tasks first
    const local = this.localTasks.find((t) => t.id === id);
    if (local) {
      this._loading.set(false);
      return new Observable((observer) => {
        observer.next(local);
        observer.complete();
      });
    }
    return this.http.get<any>(`${this.apiUrl}/${id}`).pipe(
      map((todo) => this.mapDummyTodoToTask(todo)),
      tap({
        next: () => this._loading.set(false),
        error: (error) => {
          this._error.set(error.message);
          this._loading.set(false);
        },
      })
    );
  }

  // Creates a new task
  createTask(task: Omit<Task, 'id'>): Observable<Task> {
    this._loading.set(true);
    this._error.set(null);
    // Add to local cache
    const newTask: Task = { ...task, id: this.localId++ };
    this.localTasks.push(newTask);
    this._tasks.update((tasks) => [...tasks, newTask]);
    this._loading.set(false);
    return new Observable((observer) => {
      observer.next(newTask);
      observer.complete();
    });
  }

  // Updates an existing task
  updateTask(id: number, task: Partial<Task>): Observable<Task> {
    this._loading.set(true);
    this._error.set(null);
    // Update local task if present
    const localIdx = this.localTasks.findIndex((t) => t.id === id);
    if (localIdx !== -1) {
      this.localTasks[localIdx] = { ...this.localTasks[localIdx], ...task };
      this._tasks.update((tasks) =>
        tasks.map((t) => (t.id === id ? { ...t, ...task } : t))
      );
      this._loading.set(false);
      return new Observable((observer) => {
        observer.next(this.localTasks[localIdx]);
        observer.complete();
      });
    }
    // Otherwise, update remote
    const dummyPayload = this.mapTaskToDummyPayload(task);
    return this.http.put<any>(`${this.apiUrl}/${id}`, dummyPayload).pipe(
      map((todo) => this.mapDummyTodoToTask(todo)),
      tap({
        next: (updatedTask) => {
          this._tasks.update((tasks) =>
            tasks.map((t) => (t.id === id ? updatedTask : t))
          );
          this._loading.set(false);
        },
        error: (error) => {
          this._error.set(error.message);
          this._loading.set(false);
        },
      })
    );
  }

  // Deletes a task
  deleteTask(id: number): Observable<void> {
    this._loading.set(true);
    this._error.set(null);
    // Remove from local cache if present
    const localIdx = this.localTasks.findIndex((t) => t.id === id);
    if (localIdx !== -1) {
      this.localTasks.splice(localIdx, 1);
      this._tasks.update((tasks) => tasks.filter((t) => t.id !== id));
      this._loading.set(false);
      return new Observable((observer) => {
        observer.next();
        observer.complete();
      });
    }
    // Otherwise, delete remote
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap({
        next: () => {
          this._tasks.update((tasks) => tasks.filter((t) => t.id !== id));
          this._loading.set(false);
        },
        error: (error) => {
          this._error.set(error.message);
          this._loading.set(false);
        },
      })
    );
  }

  // Returns all tasks for a specific project
  getTasksByProject(projectId: number): Observable<Task[]> {
    this._loading.set(true);
    this._error.set(null);

    return this.http.get<Task[]>(`${this.apiUrl}?projectId=${projectId}`).pipe(
      tap({
        next: (tasks) => {
          this._tasks.set(tasks);
          this._loading.set(false);
        },
        error: (error) => {
          this._error.set('Failed to load tasks');
          this._loading.set(false);
        },
      })
    );
  }
}
