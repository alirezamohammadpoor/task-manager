import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, tap } from 'rxjs';
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
export class ProjectService {
  private apiUrl = 'https://dummyjson.com/products';

  private loadingSignal = signal(false);
  private errorSignal = signal<string | null>(null);

  readonly loading = this.loadingSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();

  constructor(private http: HttpClient) {}

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
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    return this.http
      .get<DummyProductResponse>(`${this.apiUrl}?limit=10`)
      .pipe(
        map((response) =>
          response.products.map((product) => this.mapProduct(product))
        ),
        tap({
          next: () => this.loadingSignal.set(false),
          error: () => {
            this.errorSignal.set('Failed to load projects');
            this.loadingSignal.set(false);
          },
        })
      );
  }

  getProject(id: number): Observable<Project> {
    return this.http
      .get<DummyProduct>(`${this.apiUrl}/${id}`)
      .pipe(map((product) => this.mapProduct(product)));
  }

  searchProjects(query: string): Observable<Project[]> {
    return this.http
      .get<DummyProductResponse>(`${this.apiUrl}/search?q=${query}`)
      .pipe(
        map((response) =>
          response.products.map((product) => this.mapProduct(product))
        )
      );
  }

  createProject(project: Project): Observable<Project> {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    return this.http
      .post<DummyProduct>(`${this.apiUrl}/add`, {
        title: project.name,
        description: project.description,
      })
      .pipe(
        map((product) => this.mapProduct(product)),
        tap({
          next: () => this.loadingSignal.set(false),
          error: () => {
            this.errorSignal.set('Failed to create project');
            this.loadingSignal.set(false);
          },
        })
      );
  }

  updateProject(id: number, project: Project): Observable<Project> {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    return this.http
      .put<DummyProduct>(`${this.apiUrl}/${id}`, {
        title: project.name,
        description: project.description,
      })
      .pipe(
        map((product) => this.mapProduct(product)),
        tap({
          next: () => this.loadingSignal.set(false),
          error: () => {
            this.errorSignal.set('Failed to update project');
            this.loadingSignal.set(false);
          },
        })
      );
  }

  deleteProject(id: number): Observable<void> {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    return this.http.delete<any>(`${this.apiUrl}/${id}`).pipe(
      map(() => undefined),
      tap({
        next: () => this.loadingSignal.set(false),
        error: () => {
          this.errorSignal.set('Failed to delete project');
          this.loadingSignal.set(false);
        },
      })
    );
  }
}
