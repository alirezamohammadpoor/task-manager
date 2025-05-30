import { Routes } from '@angular/router';
import { MainLayoutComponent } from './components/layout/main-layout/main-layout.component';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./components/dashboard/dashboard.component').then(
            (m) => m.DashboardComponent
          ),
      },
      {
        path: 'projects',
        loadComponent: () =>
          import(
            './components/projects/project-list/project-list.component'
          ).then((m) => m.ProjectListComponent),
      },
      {
        path: 'projects/:id',
        loadComponent: () =>
          import(
            './components/projects/project-detail/project-detail.component'
          ).then((m) => m.ProjectDetailComponent),
      },
      {
        path: 'tasks',
        loadComponent: () =>
          import('./components/tasks/task-list/task-list.component').then(
            (m) => m.TaskListComponent
          ),
      },
      {
        path: 'tasks/:id',
        loadComponent: () =>
          import('./components/tasks/task-detail/task-detail.component').then(
            (m) => m.TaskDetailComponent
          ),
      },
    ],
  },
];
