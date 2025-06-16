import { Component, Inject, OnInit } from '@angular/core';
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
import { MatCardModule } from '@angular/material/card';
import { Task, TaskStatus, TaskPriority } from '../../../models/task.model';
import { TaskService } from '../../../services/task.service';
import { Router, ActivatedRoute } from '@angular/router';

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
    MatCardModule,
  ],
  templateUrl: './task-form.component.html',
})
export class TaskFormComponent implements OnInit {
  task: Partial<Task> = {
    title: '',
    description: '',
    status: 'todo',
    priority: 'medium',
    dueDate: '',
    userId: 1,
  };

  constructor(
    public dialogRef: MatDialogRef<TaskFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { task?: Task },
    private taskService: TaskService,
    public router: Router,
    private route: ActivatedRoute
  ) {
    if (data.task) {
      this.task = { ...data.task };
    }
  }

  ngOnInit() {
    const taskId = this.route.snapshot.paramMap.get('id');
    if (taskId) {
      this.loadTask(Number(taskId));
    }
  }

  loadTask(id: number) {
    this.taskService.getTasks().subscribe({
      next: (tasks) => {
        const task = tasks.find((t) => t.id === id);
        if (task) {
          this.task = { ...task };
        }
      },
      error: (error) => {
        console.error('Failed to load task:', error);
      },
    });
  }

  onSubmit() {
    if (this.task.title) {
      if (this.task.id) {
        this.taskService.updateTask(this.task.id, this.task).subscribe({
          next: () => {
            this.router.navigate(['/tasks']);
          },
          error: (error) => {
            console.error('Failed to update task:', error);
          },
        });
      } else {
        this.taskService.createTask(this.task as Omit<Task, 'id'>).subscribe({
          next: () => {
            this.router.navigate(['/tasks']);
          },
          error: (error) => {
            console.error('Failed to create task:', error);
          },
        });
      }
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
