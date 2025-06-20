import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Project } from '../models/project.interface';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  // API URL for projects
  private apiUrl = 'http://localhost:3000/projects';

  // Signals for state management
  private projectsSignal = signal<Project[]>([]);
  private loadingSignal = signal<boolean>(false);
  private errorSignal = signal<string | null>(null);

  // Expose signals as readonly
  readonly projects = this.projectsSignal.asReadonly();
  readonly loading = this.loadingSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();

  constructor(private http: HttpClient) {
    // Load projects on service initialization
    this.loadProjects();
  }

  // Loads all projects from the API
  private loadProjects(): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    this.http
      .get<Project[]>(this.apiUrl)
      .pipe(
        tap({
          next: (projects) => {
            this.projectsSignal.set(projects);
            this.loadingSignal.set(false);
          },
          error: (error) => {
            this.errorSignal.set('Failed to load projects');
            this.loadingSignal.set(false);
          },
        })
      )
      .subscribe();
  }

  // Returns all projects as an Observable
  getProjects(): Observable<Project[]> {
    return this.http.get<Project[]>(this.apiUrl);
  }

  // Returns a single project by ID
  getProject(id: number): Observable<Project> {
    return this.http.get<Project>(`${this.apiUrl}/${id}`);
  }

  // Creates a new project
  createProject(project: Project): Observable<Project> {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    return this.http.post<Project>(this.apiUrl, project).pipe(
      tap({
        next: (newProject) => {
          this.projectsSignal.update((projects) => [...projects, newProject]);
          this.loadingSignal.set(false);
        },
        error: (error) => {
          this.errorSignal.set('Failed to create project');
          this.loadingSignal.set(false);
        },
      })
    );
  }

  // Updates an existing project
  updateProject(id: number, project: Project): Observable<Project> {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    return this.http.put<Project>(`${this.apiUrl}/${id}`, project).pipe(
      tap({
        next: (updatedProject) => {
          this.projectsSignal.update((projects) =>
            projects.map((p) => (p.id === id ? updatedProject : p))
          );
          this.loadingSignal.set(false);
        },
        error: (error) => {
          this.errorSignal.set('Failed to update project');
          this.loadingSignal.set(false);
        },
      })
    );
  }

  // Deletes a project
  deleteProject(id: number): Observable<void> {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap({
        next: () => {
          this.projectsSignal.update((projects) =>
            projects.filter((p) => p.id !== id)
          );
          this.loadingSignal.set(false);
        },
        error: (error) => {
          this.errorSignal.set('Failed to delete project');
          this.loadingSignal.set(false);
        },
      })
    );
  }
}
