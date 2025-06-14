import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatMenuModule } from '@angular/material/menu';
import { TaskService } from '../../../services/task.service';
import { Task, TaskStatus, TaskPriority } from '../../../models/task.interface';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatCheckboxModule,
    MatListModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatMenuModule,
  ],
  template: `
    <div class="task-container">
      <!-- Loading Spinner -->
      @if (taskService.loading()) {
      <div class="loading-overlay">
        <mat-spinner></mat-spinner>
      </div>
      }

      <!-- Error Message -->
      @if (taskService.error()) {
      <mat-card class="error-card">
        <mat-card-content>
          {{ taskService.error() }}
        </mat-card-content>
      </mat-card>
      }

      <!-- Filters and Sort -->
      <mat-card class="filters-card">
        <mat-card-content>
          <div class="filters-container">
            <mat-form-field appearance="fill">
              <mat-label>Search Tasks</mat-label>
              <input
                matInput
                [(ngModel)]="searchQuery"
                (input)="applyFilters()"
                placeholder="Search by title..."
              />
            </mat-form-field>

            <mat-form-field appearance="fill">
              <mat-label>Status</mat-label>
              <mat-select
                [(ngModel)]="statusFilter"
                (selectionChange)="applyFilters()"
              >
                <mat-option value="all">All</mat-option>
                <mat-option value="todo">To Do</mat-option>
                <mat-option value="in-progress">In Progress</mat-option>
                <mat-option value="completed">Completed</mat-option>
              </mat-select>
            </mat-form-field>

            <mat-form-field appearance="fill">
              <mat-label>Priority</mat-label>
              <mat-select
                [(ngModel)]="priorityFilter"
                (selectionChange)="applyFilters()"
              >
                <mat-option value="all">All</mat-option>
                <mat-option value="low">Low</mat-option>
                <mat-option value="medium">Medium</mat-option>
                <mat-option value="high">High</mat-option>
              </mat-select>
            </mat-form-field>

            <mat-form-field appearance="fill">
              <mat-label>Sort By</mat-label>
              <mat-select
                [(ngModel)]="sortBy"
                (selectionChange)="applyFilters()"
              >
                <mat-option value="dueDate">Due Date</mat-option>
                <mat-option value="priority">Priority</mat-option>
                <mat-option value="title">Title</mat-option>
              </mat-select>
            </mat-form-field>
          </div>
        </mat-card-content>
      </mat-card>

      <!-- Add Task Form -->
      <mat-card class="add-task-card">
        <mat-card-header>
          <mat-card-title>Add New Task</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <form (ngSubmit)="addTask()">
            <mat-form-field appearance="fill">
              <mat-label>Task Title</mat-label>
              <input
                matInput
                [(ngModel)]="newTask.title"
                name="title"
                required
              />
            </mat-form-field>
            <mat-form-field appearance="fill">
              <mat-label>Description</mat-label>
              <input
                matInput
                [(ngModel)]="newTask.description"
                name="description"
              />
            </mat-form-field>
            <button mat-raised-button color="primary" type="submit">
              Add Task
            </button>
          </form>
        </mat-card-content>
      </mat-card>

      <!-- Task List -->
      <mat-card class="task-list-card">
        <mat-card-header>
          <mat-card-title>Tasks</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <mat-list>
            @for (task of filteredTasks; track task.id) {
            <mat-list-item>
              <mat-checkbox
                [checked]="task.status === 'completed'"
                (change)="toggleTaskStatus(task)"
              >
                {{ task.title }}
              </mat-checkbox>
              <span class="task-priority" [class]="task.priority">
                {{ task.priority }}
              </span>
              <span class="task-due-date">
                Due: {{ task.dueDate | date }}
              </span>
              <button mat-icon-button (click)="deleteTask(task.id)">
                <mat-icon>delete</mat-icon>
              </button>
            </mat-list-item>
            }
          </mat-list>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [
    `
      .task-container {
        padding: 20px;
        display: flex;
        flex-direction: column;
        gap: 20px;
        position: relative;
      }
      .filters-card,
      .add-task-card,
      .task-list-card {
        max-width: 800px;
        margin: 0 auto;
        width: 100%;
      }
      .filters-container {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 16px;
      }
      form {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }
      mat-form-field {
        width: 100%;
      }
      mat-list-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 16px;
      }
      .task-priority {
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 12px;
        text-transform: capitalize;
      }
      .task-priority.high {
        background-color: #ffebee;
        color: #c62828;
      }
      .task-priority.medium {
        background-color: #fff3e0;
        color: #ef6c00;
      }
      .task-priority.low {
        background-color: #e8f5e9;
        color: #2e7d32;
      }
      .task-due-date {
        font-size: 12px;
        color: #666;
      }
      .loading-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(255, 255, 255, 0.8);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
      }
      .error-card {
        background-color: #ffebee;
        color: #c62828;
        margin-bottom: 20px;
      }
    `,
  ],
})
export class TaskListComponent implements OnInit {
  newTask: Partial<Task> = {
    title: '',
    description: '',
    status: 'todo',
    priority: 'medium',
    dueDate: new Date(),
    projectId: 1,
  };

  // Filter and sort properties
  searchQuery: string = '';
  statusFilter: TaskStatus | 'all' = 'all';
  priorityFilter: TaskPriority | 'all' = 'all';
  sortBy: 'dueDate' | 'priority' | 'title' = 'dueDate';
  filteredTasks: Task[] = [];

  constructor(public taskService: TaskService) {}

  ngOnInit() {
    this.loadTasks();
  }

  loadTasks() {
    this.taskService.getTasks().subscribe(() => {
      this.applyFilters();
    });
  }

  applyFilters() {
    let tasks = [...this.taskService.tasks()];

    // Apply search filter
    if (this.searchQuery) {
      tasks = tasks.filter((task) =>
        task.title.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }

    // Apply status filter
    if (this.statusFilter !== 'all') {
      tasks = tasks.filter((task) => task.status === this.statusFilter);
    }

    // Apply priority filter
    if (this.priorityFilter !== 'all') {
      tasks = tasks.filter((task) => task.priority === this.priorityFilter);
    }

    // Apply sorting
    tasks.sort((a, b) => {
      switch (this.sortBy) {
        case 'dueDate':
          return a.dueDate.getTime() - b.dueDate.getTime();
        case 'priority':
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        case 'title':
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

    this.filteredTasks = tasks;
  }

  addTask() {
    if (this.newTask.title) {
      this.taskService.createTask(this.newTask as Task).subscribe(() => {
        this.newTask = {
          title: '',
          description: '',
          status: 'todo',
          priority: 'medium',
          dueDate: new Date(),
          projectId: 1,
        };
        this.applyFilters();
      });
    }
  }

  toggleTaskStatus(task: Task) {
    const newStatus: TaskStatus =
      task.status === 'completed' ? 'todo' : 'completed';
    this.taskService
      .updateTask(task.id, { status: newStatus })
      .subscribe(() => {
        this.applyFilters();
      });
  }

  deleteTask(id: number) {
    this.taskService.deleteTask(id).subscribe(() => {
      this.applyFilters();
    });
  }
}
