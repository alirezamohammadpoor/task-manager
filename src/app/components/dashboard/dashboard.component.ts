import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { ProjectService } from '../../services/project.service';
import { TaskService } from '../../services/task.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule],
  template: `
    <div class="dashboard-container">
      <h1>Dashboard</h1>

      <div class="stats-grid">
        <mat-card>
          <mat-card-content>
            <div class="stat-item">
              <mat-icon>folder</mat-icon>
              <div class="stat-info">
                <span class="stat-value">{{ totalProjects }}</span>
                <span class="stat-label">Total Projects</span>
              </div>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card>
          <mat-card-content>
            <div class="stat-item">
              <mat-icon>task</mat-icon>
              <div class="stat-info">
                <span class="stat-value">{{ totalTasks }}</span>
                <span class="stat-label">Total Tasks</span>
              </div>
            </div>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
  styles: [
    `
      .dashboard-container {
        padding: 20px;
      }

      .stats-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 20px;
        margin-bottom: 20px;
      }

      .stat-item {
        display: flex;
        align-items: center;
        gap: 16px;
      }

      .stat-info {
        display: flex;
        flex-direction: column;
      }

      .stat-value {
        font-size: 24px;
        font-weight: bold;
      }

      .stat-label {
        color: rgba(0, 0, 0, 0.6);
      }
    `,
  ],
})
export class DashboardComponent implements OnInit {
  totalProjects = 0;
  totalTasks = 0;

  constructor(
    private projectService: ProjectService,
    private taskService: TaskService
  ) {}

  ngOnInit() {
    this.loadDashboardData();
  }

  private loadDashboardData() {
    // Load projects
    this.projectService.getProjects().subscribe((projects) => {
      this.totalProjects = projects.length;
    });

    // Load tasks
    this.taskService.getTasks().subscribe((tasks) => {
      this.totalTasks = tasks.length;
    });
  }
}
