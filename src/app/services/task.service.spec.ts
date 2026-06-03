import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import {
  provideHttpClientTesting,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TaskService } from './task.service';

describe('TaskService', () => {
  let service: TaskService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(TaskService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should make GET request to load tasks from DummyJSON', () => {
    service.getTasks().subscribe();
    const req = httpMock.expectOne('https://dummyjson.com/todos?limit=50');
    expect(req.request.method).toBe('GET');
  });

  it('should map the DummyJSON todos response into Task objects', () => {
    let tasks: any[] = [];
    service.getTasks().subscribe((result) => (tasks = result));

    const req = httpMock.expectOne('https://dummyjson.com/todos?limit=50');
    req.flush({
      todos: [{ id: 1, todo: 'Buy milk', completed: true, userId: 5 }],
    });

    expect(tasks[0].title).toBe('Buy milk');
    expect(tasks[0].status).toBe('completed');
  });
});
