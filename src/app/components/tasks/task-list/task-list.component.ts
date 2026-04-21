import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { TaskService } from '../../../services/task.service';
import { Task, TaskStatus } from '../../../models/task.interface';
import { PriorityLabelPipe } from '../../../shared/pipes/priority-label.pipe';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatCheckboxModule,
    MatListModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    PriorityLabelPipe,
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
                [formControl]="searchControl"
                placeholder="Search by title..."
              />
            </mat-form-field>

            <mat-form-field appearance="fill">
              <mat-label>Status</mat-label>
              <mat-select [formControl]="statusFilterControl">
                <mat-option value="all">All</mat-option>
                <mat-option value="todo">To Do</mat-option>
                <mat-option value="in-progress">In Progress</mat-option>
                <mat-option value="completed">Completed</mat-option>
              </mat-select>
            </mat-form-field>

            <mat-form-field appearance="fill">
              <mat-label>Priority</mat-label>
              <mat-select [formControl]="priorityFilterControl">
                <mat-option value="all">All</mat-option>
                <mat-option value="low">Low</mat-option>
                <mat-option value="medium">Medium</mat-option>
                <mat-option value="high">High</mat-option>
              </mat-select>
            </mat-form-field>

            <mat-form-field appearance="fill">
              <mat-label>Sort By</mat-label>
              <mat-select [formControl]="sortByControl">
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
          <form [formGroup]="taskForm" (ngSubmit)="addTask()">
            <mat-form-field appearance="fill">
              <mat-label>Task Title</mat-label>
              <input matInput formControlName="title" />
              <mat-error *ngIf="taskForm.get('title')?.hasError('required')">
                Title is required
              </mat-error>
            </mat-form-field>
            <mat-form-field appearance="fill">
              <mat-label>Description</mat-label>
              <input matInput formControlName="description" />
            </mat-form-field>
            <button
              mat-raised-button
              color="primary"
              type="submit"
              [disabled]="taskForm.invalid"
            >
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
                {{ task.priority | priorityLabel }}
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
  allTasks: Task[] = [];
  filteredTasks: Task[] = [];

  // Filter controls
  searchControl = new FormControl('');
  statusFilterControl = new FormControl('all');
  priorityFilterControl = new FormControl('all');
  sortByControl = new FormControl('dueDate');

  // Add Task form
  taskForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public taskService: TaskService
  ) {
    this.taskForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
    });
  }

  ngOnInit() {
    this.loadTasks();

    this.searchControl.valueChanges.subscribe(() => this.applyFilters());
    this.statusFilterControl.valueChanges.subscribe(() => this.applyFilters());
    this.priorityFilterControl.valueChanges.subscribe(() =>
      this.applyFilters()
    );
    this.sortByControl.valueChanges.subscribe(() => this.applyFilters());
  }

  loadTasks() {
    this.taskService.getTasks().subscribe({
      next: (tasks) => {
        this.allTasks = tasks;
        this.applyFilters();
      },
      error: () => {},
    });
  }

  applyFilters() {
    let tasks = [...this.allTasks];
    const search = (this.searchControl.value || '').toLowerCase();
    const status = this.statusFilterControl.value;
    const priority = this.priorityFilterControl.value;
    const sortBy = this.sortByControl.value;

    if (search) {
      tasks = tasks.filter((task) =>
        task.title.toLowerCase().includes(search)
      );
    }

    if (status !== 'all') {
      tasks = tasks.filter((task) => task.status === status);
    }

    if (priority !== 'all') {
      tasks = tasks.filter((task) => task.priority === priority);
    }

    tasks.sort((a, b) => {
      switch (sortBy) {
        case 'dueDate':
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return (
            new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
          );
        case 'priority':
          const priorityOrder: Record<string, number> = {
            high: 0,
            medium: 1,
            low: 2,
          };
          return priorityOrder[a.priority] - priorityOrder[b.priority];
        case 'title':
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

    this.filteredTasks = tasks;
  }

  addTask() {
    if (this.taskForm.valid) {
      const task: Task = {
        ...this.taskForm.value,
        status: 'todo',
        priority: 'medium',
        dueDate: new Date(),
        projectId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as Task;
      this.taskService.createTask(task).subscribe((newTask) => {
        this.allTasks.push(newTask);
        this.applyFilters();
        this.taskForm.reset({ title: '', description: '' });
      });
    }
  }

  toggleTaskStatus(task: Task): void {
    const updatedTask = {
      ...task,
      status:
        task.status === 'completed' ? 'todo' : ('completed' as TaskStatus),
    };
    this.taskService.updateTask(task.id, updatedTask).subscribe(() => {
      const i = this.allTasks.findIndex((t) => t.id === task.id);
      if (i !== -1) this.allTasks[i] = updatedTask;
      this.applyFilters();
    });
  }

  deleteTask(id: number) {
    this.taskService.deleteTask(id).subscribe(() => {
      this.allTasks = this.allTasks.filter((t) => t.id !== id);
      this.applyFilters();
    });
  }
}
