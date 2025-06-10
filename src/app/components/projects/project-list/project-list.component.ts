import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ProjectService } from '../../../services/project.service';
import { Project } from '../../../models/project.interface';
import { ProjectFormComponent } from '../project-form/project-form.component';

@Component({
  selector: 'app-project-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
  ],
  template: `
    <div class="project-list-container">
      <div class="header">
        <h1>Projects</h1>
        <button mat-raised-button color="primary" (click)="openProjectDialog()">
          <mat-icon>add</mat-icon>
          New Project
        </button>
      </div>

      <div class="projects-grid">
        <mat-card *ngFor="let project of projects" class="project-card">
          <mat-card-header>
            <mat-card-title>{{ project.name }}</mat-card-title>
            <mat-card-subtitle>{{ project.status }}</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <p>{{ project.description }}</p>
          </mat-card-content>
          <mat-card-actions>
            <button mat-button [routerLink]="['/projects', project.id]">
              View Details
            </button>
            <button
              mat-button
              color="primary"
              (click)="openProjectDialog(project)"
            >
              Edit
            </button>
            <button mat-button color="warn" (click)="deleteProject(project.id)">
              Delete
            </button>
          </mat-card-actions>
        </mat-card>
      </div>
    </div>
  `,
  styles: [
    `
      .project-list-container {
        padding: 20px;
      }

      .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
      }

      .projects-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 20px;
      }

      .project-card {
        height: 100%;
        display: flex;
        flex-direction: column;
      }

      mat-card-content {
        flex-grow: 1;
      }

      mat-card-actions {
        display: flex;
        justify-content: flex-end;
        gap: 8px;
      }
    `,
  ],
})
export class ProjectListComponent implements OnInit {
  projects: Project[] = [];

  constructor(
    private projectService: ProjectService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.loadProjects();
  }

  loadProjects() {
    this.projectService.getProjects().subscribe((projects) => {
      this.projects = projects;
    });
  }

  openProjectDialog(project?: Project) {
    const dialogRef = this.dialog.open(ProjectFormComponent, {
      data: project || null,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (project) {
          // Update existing project
          this.projectService
            .updateProject(project.id, result)
            .subscribe(() => {
              this.loadProjects();
            });
        } else {
          // Create new project
          this.projectService.createProject(result).subscribe(() => {
            this.loadProjects();
          });
        }
      }
    });
  }

  deleteProject(id: number) {
    if (confirm('Are you sure you want to delete this project?')) {
      this.projectService.deleteProject(id).subscribe(() => {
        this.loadProjects();
      });
    }
  }
}
