import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ApiStateService } from './api-state.service';
import { Project } from '../models/project.interface';

interface DummyProduct {
  id: number;
  title: string;
  description: string;
  price: number;
  category: string;
  tags: string[];
}

interface DummyProductResponse {
  products: DummyProduct[];
  total: number;
  skip: number;
  limit: number;
}

@Injectable({
  providedIn: 'root',
})
export class ProjectService extends ApiStateService {
  private apiUrl = 'https://dummyjson.com/products';

  private mapProduct(product: DummyProduct): Project {
    return {
      id: product.id,
      name: product.title,
      description: product.description,
      status: 'active',
      deadline: new Date(Date.now() + product.price * 86400000),
      tasks: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  getProjects(): Observable<Project[]> {
    return this.track(
      this.http
        .get<DummyProductResponse>(`${this.apiUrl}?limit=10`)
        .pipe(map((response) => response.products.map((p) => this.mapProduct(p)))),
      'Failed to load projects'
    );
  }

  createProject(project: Project): Observable<Project> {
    return this.track(
      this.http
        .post<DummyProduct>(`${this.apiUrl}/add`, {
          title: project.name,
          description: project.description,
        })
        .pipe(map((product) => this.mapProduct(product))),
      'Failed to create project'
    );
  }

  updateProject(id: number, project: Project): Observable<Project> {
    return this.track(
      this.http
        .put<DummyProduct>(`${this.apiUrl}/${id}`, {
          title: project.name,
          description: project.description,
        })
        .pipe(map((product) => this.mapProduct(product))),
      'Failed to update project'
    );
  }

  deleteProject(id: number): Observable<void> {
    return this.track(
      this.http
        .delete<DummyProduct>(`${this.apiUrl}/${id}`)
        .pipe(map(() => undefined)),
      'Failed to delete project'
    );
  }
}
