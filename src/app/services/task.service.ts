import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Observable, map, tap } from 'rxjs';
import { Task } from '../models/task.interface';

interface DummyTodo {
  id: number;
  todo: string;
  completed: boolean;
  userId: number;
}

interface DummyTodoResponse {
  todos: DummyTodo[];
  total: number;
  skip: number;
  limit: number;
}

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private apiUrl = 'https://dummyjson.com/todos';

  private loadingSignal = signal(false);
  private errorSignal = signal<string | null>(null);

  readonly loading = this.loadingSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();

  constructor(private http: HttpClient) {}

  private mapTodo(todo: DummyTodo): Task {
    return {
      id: todo.id,
      title: todo.todo,
      description: '',
      status: todo.completed ? 'completed' : 'todo',
      priority: 'medium',
      dueDate: new Date(),
      projectId: todo.userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  getTasks(): Observable<Task[]> {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    return this.http.get<DummyTodoResponse>(`${this.apiUrl}?limit=50`).pipe(
      map((response) => response.todos.map((todo) => this.mapTodo(todo))),
      tap({
        next: () => this.loadingSignal.set(false),
        error: () => {
          this.errorSignal.set('Failed to load tasks');
          this.loadingSignal.set(false);
        },
      })
    );
  }

  getTask(id: number): Observable<Task> {
    return this.http
      .get<DummyTodo>(`${this.apiUrl}/${id}`)
      .pipe(map((todo) => this.mapTodo(todo)));
  }

  createTask(task: Task): Observable<Task> {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    return this.http
      .post<DummyTodo>(`${this.apiUrl}/add`, {
        todo: task.title,
        completed: task.status === 'completed',
        userId: task.projectId,
      })
      .pipe(
        map((todo) => this.mapTodo(todo)),
        tap({
          next: () => this.loadingSignal.set(false),
          error: () => {
            this.errorSignal.set('Failed to create task');
            this.loadingSignal.set(false);
          },
        })
      );
  }

  updateTask(id: number, task: Task): Observable<Task> {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    return this.http
      .put<DummyTodo>(`${this.apiUrl}/${id}`, {
        todo: task.title,
        completed: task.status === 'completed',
      })
      .pipe(
        map((todo) => this.mapTodo(todo)),
        tap({
          next: () => this.loadingSignal.set(false),
          error: () => {
            this.errorSignal.set('Failed to update task');
            this.loadingSignal.set(false);
          },
        })
      );
  }

  deleteTask(id: number): Observable<void> {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    return this.http.delete<any>(`${this.apiUrl}/${id}`).pipe(
      map(() => undefined),
      tap({
        next: () => this.loadingSignal.set(false),
        error: () => {
          this.errorSignal.set('Failed to delete task');
          this.loadingSignal.set(false);
        },
      })
    );
  }

  getTasksByProject(projectId: number): Observable<Task[]> {
    return this.http
      .get<DummyTodoResponse>(`${this.apiUrl}/user/${projectId}`)
      .pipe(
        map((response) => response.todos.map((todo) => this.mapTodo(todo)))
      );
  }
}
