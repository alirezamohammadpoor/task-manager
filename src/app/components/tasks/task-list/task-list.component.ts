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
import { TaskService } from '../../../services/task.service';
import { Task } from '../../../models/task.interface';

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
  ],
  template: `
    <div class="task-container">
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
            <mat-list-item *ngFor="let task of tasks">
              <mat-checkbox
                [checked]="task.status === 'completed'"
                (change)="toggleTaskStatus(task)"
              >
                {{ task.title }}
              </mat-checkbox>
              <button mat-icon-button (click)="deleteTask(task.id)">
                <mat-icon>delete</mat-icon>
              </button>
            </mat-list-item>
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
      }
      .add-task-card,
      .task-list-card {
        max-width: 600px;
        margin: 0 auto;
        width: 100%;
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
      }
    `,
  ],
})
export class TaskListComponent implements OnInit {
  tasks: Task[] = [];
  newTask: Partial<Task> = {
    title: '',
    description: '',
    status: 'todo',
    priority: 'medium',
    dueDate: new Date(),
    projectId: 1,
  };

  constructor(private taskService: TaskService) {}

  ngOnInit() {
    this.loadTasks();
  }

  loadTasks() {
    this.taskService.getTasks().subscribe((tasks) => {
      this.tasks = tasks;
    });
  }

  addTask() {
    if (this.newTask.title) {
      this.taskService.createTask(this.newTask as Task).subscribe((task) => {
        this.tasks.push(task);
        this.newTask = {
          title: '',
          description: '',
          status: 'todo',
          priority: 'medium',
          dueDate: new Date(),
          projectId: 1,
        };
      });
    }
  }

  toggleTaskStatus(task: Task) {
    const newStatus = task.status === 'completed' ? 'todo' : 'completed';
    this.taskService
      .updateTask(task.id, { status: newStatus })
      .subscribe((updatedTask) => {
        const index = this.tasks.findIndex((t) => t.id === task.id);
        if (index !== -1) {
          this.tasks[index] = updatedTask;
        }
      });
  }

  deleteTask(id: number) {
    this.taskService.deleteTask(id).subscribe(() => {
      this.tasks = this.tasks.filter((task) => task.id !== id);
    });
  }
}
