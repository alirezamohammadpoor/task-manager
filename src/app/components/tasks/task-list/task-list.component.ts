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
import { Task, TaskStatus, TaskPriority } from '../../../models/task.model';

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
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss'],
})
export class TaskListComponent implements OnInit {
  newTask: Partial<Task> = {
    title: '',
    description: '',
    status: 'todo',
    priority: 'medium',
    dueDate: '',
    userId: 1,
  };
  searchQuery: string = '';
  statusFilter: 'all' | TaskStatus = 'all';
  priorityFilter: 'all' | TaskPriority = 'all';
  filteredTasks: Task[] = [];

  constructor(public taskService: TaskService) {}

  ngOnInit() {
    this.loadTasks();
  }

  loadTasks() {
    this.taskService.getTasks().subscribe({
      next: (tasks) => {
        this.filteredTasks = tasks;
        this.applyFilters();
      },
      error: (error) => {
        console.error('Failed to load tasks:', error);
      },
    });
  }

  applyFilters() {
    let tasks = [...this.taskService.tasks()];

    if (this.searchQuery) {
      tasks = tasks.filter((task) =>
        task.title.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }
    if (this.statusFilter !== 'all') {
      tasks = tasks.filter((task) => task.status === this.statusFilter);
    }
    if (this.priorityFilter !== 'all') {
      tasks = tasks.filter((task) => task.priority === this.priorityFilter);
    }
    this.filteredTasks = tasks;
  }

  toggleTaskStatus(task: Task) {
    const newStatus: TaskStatus =
      task.status === 'completed' ? 'todo' : 'completed';
    this.taskService.updateTask(task.id, { status: newStatus }).subscribe({
      next: () => {
        this.applyFilters();
      },
      error: (error) => {
        console.error('Failed to update task:', error);
      },
    });
  }

  deleteTask(id: number) {
    this.taskService.deleteTask(id).subscribe({
      next: () => {
        this.applyFilters();
      },
      error: (error) => {
        console.error('Failed to delete task:', error);
      },
    });
  }

  createTask() {
    if (this.newTask.title) {
      this.taskService.createTask(this.newTask as Omit<Task, 'id'>).subscribe({
        next: () => {
          this.newTask = {
            title: '',
            description: '',
            status: 'todo',
            priority: 'medium',
            dueDate: '',
            userId: 1,
          };
          this.applyFilters();
        },
        error: (error) => {
          console.error('Failed to create task:', error);
        },
      });
    }
  }
}
