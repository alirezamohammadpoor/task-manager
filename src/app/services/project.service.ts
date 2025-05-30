import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Project } from '../models/project.interface';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  private apiUrl = 'http://localhost:3000/projects';

  // Mock data for testing
  private mockProjects: Project[] = [
    {
      id: 1,
      name: 'Website Redesign',
      description: 'Redesign company website with modern UI',
      status: 'active',
      tasks: [],
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-15'),
    },
    {
      id: 2,
      name: 'Mobile App Development',
      description: 'Create new mobile app for iOS and Android',
      status: 'active',
      tasks: [],
      createdAt: new Date('2024-02-01'),
      updatedAt: new Date('2024-02-15'),
    },
  ];

  constructor(private http: HttpClient) {}

  getProjects(): Observable<Project[]> {
    // Return mock data instead of HTTP request
    return of(this.mockProjects);
  }

  getProject(id: number): Observable<Project> {
    return of(this.mockProjects.find((p) => p.id === id)!);
  }

  createProject(project: Omit<Project, 'id'>): Observable<Project> {
    const newProject = {
      ...project,
      id: this.mockProjects.length + 1,
      tasks: [],
    };
    this.mockProjects.push(newProject);
    return of(newProject);
  }

  updateProject(id: number, project: Partial<Project>): Observable<Project> {
    const index = this.mockProjects.findIndex((p) => p.id === id);
    if (index !== -1) {
      this.mockProjects[index] = { ...this.mockProjects[index], ...project };
      return of(this.mockProjects[index]);
    }
    return of(this.mockProjects[0]); // Fallback
  }

  deleteProject(id: number): Observable<void> {
    const index = this.mockProjects.findIndex((p) => p.id === id);
    if (index !== -1) {
      this.mockProjects.splice(index, 1);
    }
    return of(void 0);
  }
}
