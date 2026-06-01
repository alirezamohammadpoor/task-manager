import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ApiStateService } from './api-state.service';
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
export class TaskService extends ApiStateService {
  private apiUrl = 'https://dummyjson.com/todos';

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
    return this.track(
      this.http
        .get<DummyTodoResponse>(`${this.apiUrl}?limit=50`)
        .pipe(map((response) => response.todos.map((t) => this.mapTodo(t)))),
      'Failed to load tasks'
    );
  }

  getTasksByProject(projectId: number): Observable<Task[]> {
    return this.track(
      this.http
        .get<DummyTodoResponse>(`${this.apiUrl}/user/${projectId}`)
        .pipe(map((response) => response.todos.map((t) => this.mapTodo(t)))),
      'Failed to load tasks for project'
    );
  }

  createTask(task: Task): Observable<Task> {
    return this.track(
      this.http
        .post<DummyTodo>(`${this.apiUrl}/add`, {
          todo: task.title,
          completed: task.status === 'completed',
          userId: task.projectId,
        })
        .pipe(map((todo) => this.mapTodo(todo))),
      'Failed to create task'
    );
  }

  updateTask(id: number, task: Task): Observable<Task> {
    return this.track(
      this.http
        .put<DummyTodo>(`${this.apiUrl}/${id}`, {
          todo: task.title,
          completed: task.status === 'completed',
        })
        .pipe(map((todo) => this.mapTodo(todo))),
      'Failed to update task'
    );
  }

  deleteTask(id: number): Observable<void> {
    return this.track(
      this.http
        .delete<DummyTodo>(`${this.apiUrl}/${id}`)
        .pipe(map(() => undefined)),
      'Failed to delete task'
    );
  }
}
