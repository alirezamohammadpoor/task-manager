import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ProjectService } from '../../../services/project.service';
import { TaskService } from '../../../services/task.service';
import { Project } from '../../../models/project.interface';
import { Task } from '../../../models/task.interface';

@Component({
  selector: 'app-project-detail',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule],
  template: `
    <div class="project-detail-container">
      <div class="header">
        <h1>{{ project?.name }}</h1>
        <button mat-raised-button color="primary">
          <mat-icon>edit</mat-icon>
          Edit Project
        </button>
      </div>

      <mat-card class="project-info">
        <mat-card-content>
          <p class="description">{{ project?.description }}</p>
          <div class="meta-info">
            <span>Status: {{ project?.status }}</span>
            <span>Created: {{ project?.createdAt | date }}</span>
          </div>
        </mat-card-content>
      </mat-card>

      <div class="tasks-section">
        <h2>Tasks</h2>
        <button mat-raised-button color="primary">
          <mat-icon>add</mat-icon>
          Add Task
        </button>
      </div>
    </div>
  `,
  styles: [
    `
      .project-detail-container {
        padding: 20px;
      }

      .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
      }

      .project-info {
        margin-bottom: 30px;
      }

      .description {
        font-size: 16px;
        margin-bottom: 20px;
      }

      .meta-info {
        display: flex;
        gap: 20px;
        color: rgba(0, 0, 0, 0.6);
      }

      .tasks-section {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
      }
    `,
  ],
})
export class ProjectDetailComponent implements OnInit {
  project: Project | null = null;
  tasks: Task[] = [];

  constructor(
    private route: ActivatedRoute,
    private projectService: ProjectService,
    private taskService: TaskService
  ) {}

  ngOnInit() {
    this.loadProject();
  }

  private loadProject() {
    const projectId = Number(this.route.snapshot.paramMap.get('id'));
    if (projectId) {
      this.projectService.getProject(projectId).subscribe((project) => {
        this.project = project;
        this.loadProjectTasks(projectId);
      });
    }
  }

  private loadProjectTasks(projectId: number) {
    this.taskService.getTasksByProject(projectId).subscribe((tasks) => {
      this.tasks = tasks;
    });
  }
}
