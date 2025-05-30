import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
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

  constructor(private http: HttpClient) {}

  getTasks(): Observable<Task[]> {
    return of(this.mockTasks);
  }

  getTask(id: number): Observable<Task> {
    return of(this.mockTasks.find((t) => t.id === id)!);
  }

  createTask(task: Omit<Task, 'id'>): Observable<Task> {
    const newTask = {
      ...task,
      id: this.mockTasks.length + 1,
    };
    this.mockTasks.push(newTask);
    return of(newTask);
  }

  updateTask(id: number, task: Partial<Task>): Observable<Task> {
    const index = this.mockTasks.findIndex((t) => t.id === id);
    if (index !== -1) {
      this.mockTasks[index] = { ...this.mockTasks[index], ...task };
      return of(this.mockTasks[index]);
    }
    return of(this.mockTasks[0]); // Fallback
  }

  deleteTask(id: number): Observable<void> {
    const index = this.mockTasks.findIndex((t) => t.id === id);
    if (index !== -1) {
      this.mockTasks.splice(index, 1);
    }
    return of(void 0);
  }

  getTasksByProject(projectId: number): Observable<Task[]> {
    return of(this.mockTasks.filter((t) => t.projectId === projectId));
  }
}
