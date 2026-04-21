import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TaskService } from './task.service';

describe('TaskService', () => {
  let service: TaskService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TaskService],
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

  it('should make GET request to load tasks by project (userId)', () => {
    service.getTasksByProject(1).subscribe();
    const req = httpMock.expectOne('https://dummyjson.com/todos/user/1');
    expect(req.request.method).toBe('GET');
  });
});
