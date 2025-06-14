import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ProjectService } from '../../../services/project.service';
import { TaskService } from '../../../services/task.service';
import { Project } from '../../../models/project.interface';
import { Task } from '../../../models/task.interface';
import { ProjectFormComponent } from '../project-form/project-form.component';

@Component({
  selector: 'app-project-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatListModule,
    MatIconModule,
    MatExpansionModule,
    MatDialogModule,
  ],
  template: `
    <div class="project-container">
      <!-- Add Project Form -->
      <mat-card class="add-project-card">
        <mat-card-header>
          <mat-card-title>Add New Project</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <form (ngSubmit)="addProject()">
            <mat-form-field appearance="fill">
              <mat-label>Project Name</mat-label>
              <input
                matInput
                [(ngModel)]="newProject.name"
                name="name"
                required
              />
            </mat-form-field>
            <mat-form-field appearance="fill">
              <mat-label>Description</mat-label>
              <input
                matInput
                [(ngModel)]="newProject.description"
                name="description"
              />
            </mat-form-field>
            <button mat-raised-button color="primary" type="submit">
              Add Project
            </button>
          </form>
        </mat-card-content>
      </mat-card>

      <!-- Project List -->
      <mat-card class="project-list-card">
        <mat-card-header>
          <mat-card-title>Projects</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <mat-accordion>
            <mat-expansion-panel *ngFor="let project of projects">
              <mat-expansion-panel-header>
                <mat-panel-title>
                  {{ project.name }}
                </mat-panel-title>
                <mat-panel-description>
                  {{ project.description }}
                </mat-panel-description>
              </mat-expansion-panel-header>

              <!-- Project Tasks -->
              <mat-list>
                <mat-list-item *ngFor="let task of project.tasks">
                  <span [class.completed]="task.status === 'completed'">
                    {{ task.title }}
                  </span>
                  <button
                    mat-icon-button
                    (click)="deleteTask(project.id, task.id)"
                  >
                    <mat-icon>delete</mat-icon>
                  </button>
                </mat-list-item>
              </mat-list>

              <!-- Add Task Form -->
              <form (ngSubmit)="addTask(project.id)" class="add-task-form">
                <mat-form-field appearance="fill">
                  <mat-label>New Task</mat-label>
                  <input
                    matInput
                    [(ngModel)]="newTask.title"
                    name="title"
                    required
                  />
                </mat-form-field>
                <button mat-raised-button color="primary" type="submit">
                  Add Task
                </button>
              </form>

              <div class="project-actions">
                <button
                  mat-icon-button
                  color="primary"
                  (click)="openEditDialog(project)"
                >
                  <mat-icon>edit</mat-icon>
                </button>
                <button
                  mat-icon-button
                  color="warn"
                  (click)="deleteProject(project.id)"
                >
                  <mat-icon>delete</mat-icon>
                </button>
              </div>
            </mat-expansion-panel>
          </mat-accordion>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [
    `
      .project-container {
        padding: 20px;
        display: flex;
        flex-direction: column;
        gap: 20px;
      }
      .add-project-card,
      .project-list-card {
        max-width: 800px;
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
      .add-task-form {
        margin-top: 16px;
        padding: 16px;
        background: #f5f5f5;
        border-radius: 4px;
      }
      .completed {
        text-decoration: line-through;
        color: #888;
      }
      .project-actions {
        display: flex;
        gap: 8px;
        margin-top: 16px;
      }
      mat-list-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
    `,
  ],
})
export class ProjectListComponent implements OnInit {
  projects: Project[] = [];
  newProject: Partial<Project> = {
    name: '',
    description: '',
    status: 'active',
    tasks: [],
  };
  newTask: Partial<Task> = {
    title: '',
    description: '',
    status: 'todo',
    priority: 'medium',
    dueDate: new Date(),
  };

  constructor(
    private projectService: ProjectService,
    private taskService: TaskService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.loadProjects();
  }

  loadProjects() {
    this.projectService.getProjects().subscribe((projects) => {
      this.projects = projects;
      // Load tasks for each project
      this.projects.forEach((project) => {
        this.taskService.getTasksByProject(project.id).subscribe((tasks) => {
          project.tasks = tasks;
        });
      });
    });
  }

  addProject() {
    if (this.newProject.name) {
      this.projectService
        .createProject(this.newProject as Project)
        .subscribe((project) => {
          this.projects.push(project);
          this.newProject = {
            name: '',
            description: '',
            status: 'active',
            tasks: [],
          };
        });
    }
  }

  openEditDialog(project: Project) {
    const dialogRef = this.dialog.open(ProjectFormComponent, {
      data: project,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.projectService
          .updateProject(project.id, result)
          .subscribe((updatedProject) => {
            const index = this.projects.findIndex((p) => p.id === project.id);
            if (index !== -1) {
              this.projects[index] = updatedProject;
            }
          });
      }
    });
  }

  addTask(projectId: number) {
    if (this.newTask.title) {
      const task = {
        ...this.newTask,
        projectId,
      };
      this.taskService.createTask(task as Task).subscribe((newTask) => {
        const project = this.projects.find((p) => p.id === projectId);
        if (project) {
          project.tasks.push(newTask);
        }
        this.newTask = {
          title: '',
          description: '',
          status: 'todo',
          priority: 'medium',
          dueDate: new Date(),
        };
      });
    }
  }

  deleteProject(id: number) {
    this.projectService.deleteProject(id).subscribe(() => {
      this.projects = this.projects.filter((project) => project.id !== id);
    });
  }

  deleteTask(projectId: number, taskId: number) {
    this.taskService.deleteTask(taskId).subscribe(() => {
      const project = this.projects.find((p) => p.id === projectId);
      if (project) {
        project.tasks = project.tasks.filter((task) => task.id !== taskId);
      }
    });
  }
}
