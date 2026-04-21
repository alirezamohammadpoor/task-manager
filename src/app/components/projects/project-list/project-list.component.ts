import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
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
import { Project } from '../../../models/project.interface';
import { Task } from '../../../models/task.interface';
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
    ReactiveFormsModule,
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
                [formControl]="searchControl"
                placeholder="Search by project name..."
              />
              <mat-icon matSuffix>search</mat-icon>
            </mat-form-field>

            <mat-form-field appearance="fill" class="status-field">
              <mat-label>Status</mat-label>
              <mat-select [formControl]="statusFilterControl">
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
          <form [formGroup]="projectForm" (ngSubmit)="addProject()">
            <mat-form-field appearance="fill">
              <mat-label>Project Name</mat-label>
              <input matInput formControlName="name" />
              <mat-error *ngIf="projectForm.get('name')?.hasError('required')">
                Project name is required
              </mat-error>
            </mat-form-field>
            <mat-form-field appearance="fill">
              <mat-label>Description</mat-label>
              <input matInput formControlName="description" />
            </mat-form-field>
            <mat-form-field appearance="fill">
              <mat-label>Deadline</mat-label>
              <input
                matInput
                [matDatepicker]="projectPicker"
                formControlName="deadline"
              />
              <mat-datepicker-toggle
                matSuffix
                [for]="projectPicker"
              ></mat-datepicker-toggle>
              <mat-datepicker #projectPicker></mat-datepicker>
            </mat-form-field>
            <button
              mat-raised-button
              color="primary"
              type="submit"
              [disabled]="projectForm.invalid"
            >
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
                  {{ project.description }} | Deadline:
                  {{ project.deadline | date }} | Tasks:
                  {{ project.tasks.length }}
                </mat-panel-description>
              </mat-expansion-panel-header>

              <!-- Project Tasks -->
              <div class="tasks-container">
                <div class="tasks-header">
                  <h3>Tasks</h3>
                  <div class="tasks-controls">
                    <mat-form-field appearance="fill" class="task-filter">
                      <mat-label>Status</mat-label>
                      <mat-select [formControl]="taskStatusFilterControl">
                        <mat-option value="all">All</mat-option>
                        <mat-option value="todo">To Do</mat-option>
                        <mat-option value="in-progress"
                          >In Progress</mat-option
                        >
                        <mat-option value="completed">Completed</mat-option>
                      </mat-select>
                    </mat-form-field>
                    <mat-form-field appearance="fill" class="task-sort">
                      <mat-label>Sort By</mat-label>
                      <mat-select [formControl]="taskSortControl">
                        <mat-option value="priority">Priority</mat-option>
                        <mat-option value="dueDate">Due Date</mat-option>
                        <mat-option value="status">Status</mat-option>
                      </mat-select>
                    </mat-form-field>
                  </div>
                </div>
                <mat-list>
                  <mat-list-item
                    *ngFor="let task of filteredTasksMap[project.id]"
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
              <form
                [formGroup]="taskForm"
                (ngSubmit)="addTask(project.id)"
                class="add-task-form"
              >
                <mat-form-field appearance="fill">
                  <mat-label>Task Title</mat-label>
                  <input matInput formControlName="title" />
                  <mat-error
                    *ngIf="taskForm.get('title')?.hasError('required')"
                  >
                    Title is required
                  </mat-error>
                </mat-form-field>
                <mat-form-field appearance="fill">
                  <mat-label>Description</mat-label>
                  <input matInput formControlName="description" />
                </mat-form-field>
                <mat-form-field appearance="fill">
                  <mat-label>Priority</mat-label>
                  <mat-select formControlName="priority">
                    <mat-option value="low">Low</mat-option>
                    <mat-option value="medium">Medium</mat-option>
                    <mat-option value="high">High</mat-option>
                  </mat-select>
                </mat-form-field>
                <mat-form-field appearance="fill">
                  <mat-label>Due Date</mat-label>
                  <input
                    matInput
                    [matDatepicker]="taskPicker"
                    formControlName="dueDate"
                  />
                  <mat-datepicker-toggle
                    matSuffix
                    [for]="taskPicker"
                  ></mat-datepicker-toggle>
                  <mat-datepicker #taskPicker></mat-datepicker>
                </mat-form-field>
                <button
                  mat-raised-button
                  color="primary"
                  type="submit"
                  [disabled]="taskForm.invalid"
                >
                  <mat-icon>add</mat-icon>
                  Add Task
                </button>
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
  filteredTasksMap: { [projectId: number]: Task[] } = {};

  // Filter controls
  searchControl = new FormControl('');
  statusFilterControl = new FormControl('all');
  taskStatusFilterControl = new FormControl('all');
  taskSortControl = new FormControl('priority');

  // Add Project form
  projectForm: FormGroup;

  // Add Task form
  taskForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private projectService: ProjectService,
    private taskService: TaskService,
    private dialog: MatDialog
  ) {
    this.projectForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      deadline: [new Date()],
    });

    this.taskForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      priority: ['medium', Validators.required],
      dueDate: [new Date(), Validators.required],
    });
  }

  ngOnInit() {
    this.loadProjects();

    this.searchControl.valueChanges.subscribe(() => this.applyFilter());
    this.statusFilterControl.valueChanges.subscribe(() => this.applyFilter());
    this.taskStatusFilterControl.valueChanges.subscribe(() =>
      this.updateFilteredTasksMap()
    );
    this.taskSortControl.valueChanges.subscribe(() =>
      this.updateFilteredTasksMap()
    );
  }

  loadProjects() {
    this.projectService.getProjects().subscribe((projects) => {
      this.projects = projects;
      this.filteredProjects = projects;

      projects.forEach((project) => {
        this.taskService.getTasksByProject(project.id).subscribe((tasks) => {
          project.tasks = tasks;
          this.filteredProjects = [...this.projects];
          this.updateFilteredTasksMap();
        });
      });
    });
  }

  applyFilter() {
    const search = (this.searchControl.value || '').toLowerCase();
    const status = this.statusFilterControl.value;

    this.filteredProjects = this.projects.filter((project) => {
      const matchesSearch = project.name.toLowerCase().includes(search);
      const matchesStatus =
        status === 'all' || project.status === status;
      return matchesSearch && matchesStatus;
    });
  }

  addProject() {
    if (this.projectForm.valid) {
      const newProject: Project = {
        ...this.projectForm.value,
        id: Date.now(),
        status: 'active',
        tasks: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      this.projects = [...this.projects, newProject];
      this.applyFilter();
      this.projectForm.reset({ name: '', description: '', deadline: new Date() });
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
    if (this.taskForm.valid) {
      const newTask: Task = {
        ...this.taskForm.value,
        id: Date.now(),
        status: 'todo',
        projectId,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const project = this.projects.find((p) => p.id === projectId);
      if (project) {
        project.tasks.push(newTask);
        this.updateFilteredTasksMap();
      }
      this.taskForm.reset({
        title: '',
        description: '',
        priority: 'medium',
        dueDate: new Date(),
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
            this.updateFilteredTasksMap();
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
          const project = this.projects.find((p) =>
            p.tasks.some((t) => t.id === task.id)
          );
          if (project) {
            const i = project.tasks.findIndex((t) => t.id === task.id);
            if (i !== -1) project.tasks[i] = { ...result, id: task.id };
          }
          this.updateFilteredTasksMap();
        });
      }
    });
  }

  updateFilteredTasksMap(): void {
    const priorityOrder: Record<string, number> = {
      high: 0,
      medium: 1,
      low: 2,
    };
    const statusOrder: Record<string, number> = {
      todo: 0,
      'in-progress': 1,
      completed: 2,
    };
    const taskStatus = this.taskStatusFilterControl.value;
    const sortBy = this.taskSortControl.value;

    for (const project of this.projects) {
      let tasks = [...(project.tasks || [])];

      if (taskStatus !== 'all') {
        tasks = tasks.filter((task) => task.status === taskStatus);
      }

      tasks.sort((a, b) => {
        switch (sortBy) {
          case 'priority':
            return priorityOrder[a.priority] - priorityOrder[b.priority];
          case 'dueDate':
            if (!a.dueDate) return 1;
            if (!b.dueDate) return -1;
            return (
              new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
            );
          case 'status':
            return statusOrder[a.status] - statusOrder[b.status];
          default:
            return 0;
        }
      });

      this.filteredTasksMap[project.id] = tasks;
    }
  }
}
