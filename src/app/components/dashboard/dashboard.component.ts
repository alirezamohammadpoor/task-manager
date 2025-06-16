import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { ProjectService } from '../../services/project.service';
import { TaskService } from '../../services/task.service';
import { Project } from '../../models/project.interface';
import { Task } from '../../models/task.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule],
  template: `
    <div class="dashboard-container">
      <h1>Dashboard</h1>

      <div class="stats-grid">
        <!-- Total Projects -->
        <mat-card class="stat-card">
          <mat-card-content>
            <div class="stat-content">
              <mat-icon>folder</mat-icon>
              <div class="stat-info">
                <h2>Total Projects</h2>
                <p class="stat-number">{{ totalProjects }}</p>
              </div>
            </div>
          </mat-card-content>
        </mat-card>

        <!-- Total Tasks -->
        <mat-card class="stat-card">
          <mat-card-content>
            <div class="stat-content">
              <mat-icon>task</mat-icon>
              <div class="stat-info">
                <h2>Total Tasks</h2>
                <p class="stat-number">{{ totalTasks }}</p>
              </div>
            </div>
          </mat-card-content>
        </mat-card>

        <!-- Tasks by Status -->
        <mat-card class="stat-card">
          <mat-card-content>
            <div class="stat-content">
              <mat-icon>check_circle</mat-icon>
              <div class="stat-info">
                <h2>Tasks by Status</h2>
                <div class="status-stats">
                  <p>Todo: {{ tasksByStatus['todo'] }}</p>
                  <p>In Progress: {{ tasksByStatus['in-progress'] }}</p>
                  <p>Completed: {{ tasksByStatus['completed'] }}</p>
                </div>
              </div>
            </div>
          </mat-card-content>
        </mat-card>
      </div>

      <mat-card>
        <mat-card-header>
          <mat-card-title>Task Statistics</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <div class="stats-grid">
            <div class="stat-item">
              <h3>Total Tasks</h3>
              <p>{{ taskStats.total }}</p>
            </div>
            <div class="stat-item">
              <h3>Completed Tasks</h3>
              <p>{{ taskStats.completed }}</p>
            </div>
            <div class="stat-item">
              <h3>Active Tasks</h3>
              <p>{{ taskStats.active }}</p>
            </div>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [
    `
      .dashboard-container {
        padding: 20px;
      }
      .stats-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 20px;
        margin-top: 20px;
      }
      .stat-card {
        height: 100%;
      }
      .stat-content {
        display: flex;
        align-items: center;
        gap: 16px;
      }
      .stat-info {
        flex: 1;
      }
      .stat-number {
        font-size: 2em;
        font-weight: bold;
        margin: 0;
      }
      .status-stats {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }
      mat-icon {
        font-size: 2.5em;
        width: 2.5em;
        height: 2.5em;
      }
      .stat-item {
        text-align: center;
        padding: 20px;
        background-color: #f5f5f5;
        border-radius: 8px;
      }
      .stat-item h3 {
        margin: 0;
        color: #666;
      }
      .stat-item p {
        margin: 10px 0 0;
        font-size: 24px;
        font-weight: bold;
        color: #333;
      }
    `,
  ],
})
export class DashboardComponent implements OnInit {
  totalProjects = 0;
  totalTasks = 0;
  tasksByStatus: { [key: string]: number } = {
    todo: 0,
    'in-progress': 0,
    completed: 0,
  };

  taskStats = {
    total: 0,
    completed: 0,
    active: 0,
  };

  constructor(
    private projectService: ProjectService,
    private taskService: TaskService
  ) {}

  ngOnInit() {
    this.loadStats();
    this.loadTaskStats();
  }

  loadStats() {
    // Load projects
    this.projectService.getProjects().subscribe((projects) => {
      this.totalProjects = projects.length;
    });

    // Load tasks
    this.taskService.getTasks().subscribe((tasks) => {
      this.totalTasks = tasks.length;

      // Count tasks by status
      this.tasksByStatus = tasks.reduce(
        (acc, task) => {
          acc[task.status] = (acc[task.status] || 0) + 1;
          return acc;
        },
        { todo: 0, 'in-progress': 0, completed: 0 }
      );
    });
  }

  loadTaskStats() {
    this.taskService.getTasks().subscribe({
      next: (tasks) => {
        this.taskStats = {
          total: tasks.length,
          completed: tasks.filter((task) => task.status === 'completed').length,
          active: tasks.filter((task) => task.status !== 'completed').length,
        };
      },
      error: (error) => {
        console.error('Failed to load task stats:', error);
      },
    });
  }
}
