import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  MatDialogModule,
  MAT_DIALOG_DATA,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { Task, TaskStatus, TaskPriority } from '../../../models/task.interface';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  template: `
    <h2 mat-dialog-title>{{ data.task ? 'Edit Task' : 'New Task' }}</h2>
    <mat-dialog-content>
      <form (ngSubmit)="onSubmit()" #taskForm="ngForm">
        <mat-form-field appearance="fill">
          <mat-label>Title</mat-label>
          <input matInput [(ngModel)]="task.title" name="title" required />
        </mat-form-field>

        <mat-form-field appearance="fill">
          <mat-label>Description</mat-label>
          <input matInput [(ngModel)]="task.description" name="description" />
        </mat-form-field>

        <mat-form-field appearance="fill">
          <mat-label>Status</mat-label>
          <mat-select [(ngModel)]="task.status" name="status" required>
            <mat-option [value]="'todo'">To Do</mat-option>
            <mat-option [value]="'in-progress'">In Progress</mat-option>
            <mat-option [value]="'completed'">Completed</mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="fill">
          <mat-label>Priority</mat-label>
          <mat-select [(ngModel)]="task.priority" name="priority" required>
            <mat-option [value]="'low'">Low</mat-option>
            <mat-option [value]="'medium'">Medium</mat-option>
            <mat-option [value]="'high'">High</mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="fill">
          <mat-label>Due Date</mat-label>
          <input
            matInput
            [matDatepicker]="picker"
            [(ngModel)]="task.dueDate"
            name="dueDate"
          />
          <mat-datepicker-toggle
            matSuffix
            [for]="picker"
          ></mat-datepicker-toggle>
          <mat-datepicker #picker></mat-datepicker>
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">Cancel</button>
      <button
        mat-raised-button
        color="primary"
        (click)="onSubmit()"
        [disabled]="!taskForm.form.valid"
      >
        {{ data.task ? 'Update' : 'Create' }}
      </button>
    </mat-dialog-actions>
  `,
  styles: [
    `
      mat-dialog-content {
        min-width: 400px;
      }
      form {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }
      mat-form-field {
        width: 100%;
      }
    `,
  ],
})
export class TaskFormComponent {
  task: Partial<Task>;

  constructor(
    public dialogRef: MatDialogRef<TaskFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { task?: Task }
  ) {
    this.task = data.task
      ? { ...data.task }
      : {
          title: '',
          description: '',
          status: 'todo' as TaskStatus,
          priority: 'medium' as TaskPriority,
          dueDate: new Date(),
        };
  }

  onSubmit(): void {
    this.dialogRef.close(this.task);
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
