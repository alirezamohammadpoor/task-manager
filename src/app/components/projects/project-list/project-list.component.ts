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
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { ProjectService } from '../../../services/project.service';
import { TaskService } from '../../../services/task.service';
import { Project, ProjectStatus } from '../../../models/project.interface';
import { Task, TaskPriority, TaskStatus } from '../../../models/task.interface';
import { ProjectFormComponent } from '../project-form/project-form.component';
import { ConfirmationDialogComponent } from '../../../shared/confirmation-dialog/confirmation-dialog.component';
import { TaskFormComponent } from '../../tasks/task-form/task-form.component';
import { CustomButtonComponent } from '../../../shared/components/custom-button/custom-button.component';
import { PriorityLabelPipe } from '../../../shared/pipes/priority-label.pipe';
import { OverdueTaskDirective } from '../../../shared/directives/overdue-task.directive';

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
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    CustomButtonComponent,
    PriorityLabelPipe,
    OverdueTaskDirective,
  ],
  template: `
    <div class="project-container">
      <!-- Search and Filter Bar -->
      <mat-card class="search-card">
        <mat-card-content>
          <div class="filter-container">
            <mat-form-field appearance="fill" class="search-field">
              <mat-label>Search Projects</mat-label>
              <input
                matInput
                [(ngModel)]="searchQuery"
                (input)="applyFilter()"
                placeholder="Search by project name..."
              />
              <mat-icon matSuffix>search</mat-icon>
            </mat-form-field>

            <mat-form-field appearance="fill" class="status-field">
              <mat-label>Status</mat-label>
              <mat-select
                [(ngModel)]="statusFilter"
                (selectionChange)="applyFilter()"
              >
                <mat-option value="all">All</mat-option>
                <mat-option value="active">Active</mat-option>
                <mat-option value="completed">Completed</mat-option>
                <mat-option value="archived">Archived</mat-option>
              </mat-select>
            </mat-form-field>
          </div>
        </mat-card-content>
      </mat-card>

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
            <mat-expansion-panel *ngFor="let project of filteredProjects">
              <mat-expansion-panel-header>
                <mat-panel-title>
                  {{ project.name }}
                </mat-panel-title>
                <mat-panel-description>
                  {{ project.description }}
                </mat-panel-description>
              </mat-expansion-panel-header>

              <!-- Project Tasks -->
              <div class="tasks-container">
                <div class="tasks-header">
                  <h3>Tasks</h3>
                  <div class="tasks-controls">
                    <mat-form-field appearance="fill" class="task-filter">
                      <mat-label>Status</mat-label>
                      <mat-select
                        [(ngModel)]="taskStatusFilter"
                        (selectionChange)="applyTaskFilter(project)"
                      >
                        <mat-option value="all">All</mat-option>
                        <mat-option value="todo">To Do</mat-option>
                        <mat-option value="in-progress">In Progress</mat-option>
                        <mat-option value="completed">Completed</mat-option>
                      </mat-select>
                    </mat-form-field>
                    <mat-form-field appearance="fill" class="task-sort">
                      <mat-label>Sort By</mat-label>
                      <mat-select
                        [(ngModel)]="taskSortBy"
                        (selectionChange)="applyTaskSort(project)"
                      >
                        <mat-option value="priority">Priority</mat-option>
                        <mat-option value="dueDate">Due Date</mat-option>
                        <mat-option value="status">Status</mat-option>
                      </mat-select>
                    </mat-form-field>
                  </div>
                </div>
                <mat-list>
                  <mat-list-item
                    *ngFor="let task of getFilteredTasks(project)"
                    class="task-item"
                  >
                    <div class="task-content">
                      <div class="task-main">
                        <span
                          class="task-title"
                          appOverdueTask
                          [dueDate]="task.dueDate"
                          [isCompleted]="task.status === 'completed'"
                        >
                          {{ task.title }}
                        </span>
                        <span class="task-description" *ngIf="task.description">
                          {{ task.description }}
                        </span>
                      </div>
                      <div class="task-details">
                        <span class="task-status" [class]="task.status">
                          {{ task.status }}
                        </span>
                        <span class="task-priority" [class]="task.priority">
                          {{ task.priority | priorityLabel }}
                        </span>
                        <span class="task-due-date" *ngIf="task.dueDate">
                          Due: {{ task.dueDate | date }}
                        </span>
                      </div>
                    </div>
                    <div class="task-actions">
                      <app-custom-button
                        label="Edit"
                        icon="edit"
                        color="primary"
                        (clicked)="openTaskEditDialog(task)"
                      ></app-custom-button>
                      <app-custom-button
                        label="Delete"
                        icon="delete"
                        color="warn"
                        (clicked)="deleteTask(project.id, task.id)"
                      ></app-custom-button>
                    </div>
                  </mat-list-item>
                </mat-list>
              </div>

              <!-- Add Task Form -->
              <form (ngSubmit)="addTask(project.id)" class="add-task-form">
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
                <mat-form-field appearance="fill">
                  <mat-label>Priority</mat-label>
                  <mat-select
                    [(ngModel)]="newTask.priority"
                    name="priority"
                    required
                  >
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
                    [(ngModel)]="newTask.dueDate"
                    name="dueDate"
                  />
                  <mat-datepicker-toggle
                    matSuffix
                    [for]="picker"
                  ></mat-datepicker-toggle>
                  <mat-datepicker #picker></mat-datepicker>
                </mat-form-field>
                <app-custom-button
                  label="Add Task"
                  icon="add"
                  color="primary"
                  type="submit"
                ></app-custom-button>
              </form>

              <div class="project-actions">
                <app-custom-button
                  label="Edit"
                  icon="edit"
                  color="primary"
                  (clicked)="openEditDialog(project)"
                ></app-custom-button>
                <app-custom-button
                  label="Delete"
                  icon="delete"
                  color="warn"
                  (clicked)="deleteProject(project.id)"
                ></app-custom-button>
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
      .search-card {
        max-width: 800px;
        margin: 0 auto;
        width: 100%;
      }
      .filter-container {
        display: flex;
        gap: 16px;
      }
      .search-field {
        flex: 2;
      }
      .status-field {
        flex: 1;
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
      .tasks-container {
        margin: 16px 0;
      }
      .tasks-container h3 {
        margin-bottom: 16px;
        color: #333;
      }
      .task-item {
        margin-bottom: 8px;
        border-bottom: 1px solid #eee;
        padding: 8px 0;
      }
      .task-content {
        display: flex;
        flex-direction: column;
        gap: 8px;
        flex: 1;
      }
      .task-main {
        display: flex;
        flex-direction: column;
        gap: 4px;
      }
      .task-title {
        font-weight: 500;
        font-size: 16px;
      }
      .task-description {
        color: #666;
        font-size: 14px;
      }
      .task-details {
        display: flex;
        gap: 16px;
        align-items: center;
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
        align-items: flex-start;
        height: auto !important;
        padding: 8px 0;
      }
      .tasks-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 16px;
      }
      .tasks-controls {
        display: flex;
        gap: 16px;
      }
      .task-filter,
      .task-sort {
        width: 150px;
      }
      .task-status {
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 12px;
        text-transform: capitalize;
      }
      .task-status.todo {
        background-color: #e3f2fd;
        color: #1565c0;
      }
      .task-status.in-progress {
        background-color: #fff3e0;
        color: #ef6c00;
      }
      .task-status.completed {
        background-color: #e8f5e9;
        color: #2e7d32;
      }
      .task-actions {
        display: flex;
        gap: 8px;
      }
      .task-actions app-custom-button {
        margin: 0;
      }
    `,
  ],
})
export class ProjectListComponent implements OnInit {
  projects: Project[] = [];
  filteredProjects: Project[] = [];
  searchQuery: string = '';
  statusFilter: ProjectStatus | 'all' = 'all';
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
    priority: 'medium' as TaskPriority,
    dueDate: new Date(),
  };
  taskStatusFilter: TaskStatus | 'all' = 'all';
  taskSortBy: 'priority' | 'dueDate' | 'status' = 'priority';

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
      this.filteredProjects = projects;

      // Load tasks for each project
      projects.forEach((project) => {
        this.taskService.getTasksByProject(project.id).subscribe((tasks) => {
          project.tasks = tasks;
          // Force change detection by creating a new array
          this.filteredProjects = [...this.projects];
        });
      });
    });
  }

  applyFilter() {
    this.filteredProjects = this.projects.filter((project) => {
      const matchesSearch = project.name
        .toLowerCase()
        .includes(this.searchQuery.toLowerCase());
      const matchesStatus =
        this.statusFilter === 'all' || project.status === this.statusFilter;
      return matchesSearch && matchesStatus;
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
        priority: this.newTask.priority || ('medium' as TaskPriority),
      };
      this.taskService.createTask(task as Task).subscribe((newTask) => {
        const project = this.projects.find((p) => p.id === projectId);
        if (project) {
          project.tasks.push(newTask);
        }
        // Reset form with default values
        this.newTask = {
          title: '',
          description: '',
          status: 'todo',
          priority: 'medium' as TaskPriority,
          dueDate: new Date(),
        };
      });
    }
  }

  deleteProject(id: number) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: { message: 'Are you sure you want to delete this project?' },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.projectService.deleteProject(id).subscribe(() => {
          this.projects = this.projects.filter((project) => project.id !== id);
          this.applyFilter();
        });
      }
    });
  }

  deleteTask(projectId: number, taskId: number) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: { message: 'Are you sure you want to delete this task?' },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.taskService.deleteTask(taskId).subscribe(() => {
          const project = this.projects.find((p) => p.id === projectId);
          if (project) {
            project.tasks = project.tasks.filter((task) => task.id !== taskId);
          }
        });
      }
    });
  }

  openTaskEditDialog(task: Task): void {
    const dialogRef = this.dialog.open(TaskFormComponent, {
      width: '500px',
      data: { task },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.taskService.updateTask(task.id, result).subscribe(() => {
          this.loadProjects();
        });
      }
    });
  }

  getFilteredTasks(project: Project): Task[] {
    let tasks = [...project.tasks];

    // Apply status filter
    if (this.taskStatusFilter !== 'all') {
      tasks = tasks.filter((task) => task.status === this.taskStatusFilter);
    }

    // Apply sorting
    tasks.sort((a, b) => {
      switch (this.taskSortBy) {
        case 'priority':
          const priorityOrder = { high: 0, medium: 1, low: 2 };
          return priorityOrder[a.priority] - priorityOrder[b.priority];
        case 'dueDate':
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        case 'status':
          const statusOrder = { todo: 0, 'in-progress': 1, completed: 2 };
          return statusOrder[a.status] - statusOrder[b.status];
        default:
          return 0;
      }
    });

    return tasks;
  }

  applyTaskFilter(project: Project): void {
    // The filtering is handled in getFilteredTasks
  }

  applyTaskSort(project: Project): void {
    // The sorting is handled in getFilteredTasks
  }
}
