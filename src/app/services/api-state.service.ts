import { inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

/**
 * Base class for API-backed services.
 *
 * Owns the shared `loading`/`error` signals and the boilerplate that toggles
 * them around an HTTP call, so concrete services only describe the request.
 * Wrap any request in `track(...)` to get loading/error state for free.
 */
export abstract class ApiStateService {
  protected readonly http = inject(HttpClient);

  private readonly loadingSignal = signal(false);
  private readonly errorSignal = signal<string | null>(null);

  /** True while a tracked request is in flight. */
  readonly loading = this.loadingSignal.asReadonly();
  /** The last tracked request's error message, or null. */
  readonly error = this.errorSignal.asReadonly();

  protected track<T>(request$: Observable<T>, errorMessage: string): Observable<T> {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    return request$.pipe(
      tap({
        next: () => this.loadingSignal.set(false),
        error: () => {
          this.errorSignal.set(errorMessage);
          this.loadingSignal.set(false);
        },
      })
    );
  }
}
