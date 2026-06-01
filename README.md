# Task Manager

A task management application built with **Angular 19** and **Angular Material**. Manage
projects and the tasks inside them — create, edit, delete, search, filter, prioritise and
set deadlines — backed by the public [DummyJSON](https://dummyjson.com/docs) API.

## Features

**Projects**

- List projects with name, description, deadline and task count
- Create, edit and delete projects
- Search by name and filter by status (active / completed / archived)

**Tasks**

- View the tasks inside each project (expandable project list)
- Create, edit and delete tasks
- Mark tasks as done / not done
- Filter by status (all / to‑do / in‑progress / completed) and priority (low / medium / high)
- Sort by priority, due date or status, and set a deadline per task

**Dashboard** — totals for projects and tasks, plus a tasks‑by‑status breakdown.

## Prerequisites

- Node.js 20 LTS or newer
- npm 10 or newer

## Installation & running

```bash
npm install      # install dependencies
npm start        # ng serve → http://localhost:4200
```

```bash
npm run build    # production build into dist/
npm test         # run the unit tests once (Karma + Jasmine, headless Chrome)
```

> `npm test` uses watch mode by default. For a single CI‑style run:
> `ng test --watch=false --browsers=ChromeHeadless`.

## API integration

The app talks to **DummyJSON** over `HttpClient` and adapts its sample data to the
domain model:

| Domain | DummyJSON endpoint | Mapping |
| --- | --- | --- |
| Projects | `/products` | `title → name`, `description → description`, `price → synthetic deadline` |
| Tasks | `/todos` | `todo → title`, `completed → status`, `userId → projectId` |

DummyJSON **simulates** writes — `POST`/`PUT`/`DELETE` return a realistic response but do
not persist. The app therefore updates its own state **optimistically (local‑first)** after
each call, so the UI reflects changes immediately while still exercising the real HTTP layer.

## Architecture

```
src/app/
├── components/
│   ├── dashboard/            # stats overview
│   ├── layout/main-layout/   # toolbar + sidenav shell
│   ├── projects/             # project-list (+ inline tasks) and project-form dialog
│   └── tasks/                # task-list and task-form dialog
├── services/
│   ├── api-state.service.ts  # base class: shared loading/error signals + HTTP wrapper
│   ├── project.service.ts    # Projects CRUD against DummyJSON /products
│   └── task.service.ts       # Tasks CRUD against DummyJSON /todos
├── models/                   # Project and Task interfaces (+ status/priority unions)
├── shared/
│   ├── components/custom-button/   # generic, reusable button
│   ├── confirmation-dialog/        # generic confirm dialog
│   ├── directives/overdue-task.directive.ts   # custom directive
│   └── pipes/priority-label.pipe.ts           # custom pipe
├── app.routes.ts             # routing: dashboard / projects / tasks (lazy-loaded)
└── app.config.ts             # providers (router, HttpClient)
```

Key technical choices:

- **Standalone components** with **lazy‑loaded routes**.
- **Angular Signals** for asynchronous state: `loading` and `error` live on a small
  `ApiStateService` base class, so both feature services share the boilerplate via a single
  `track()` helper instead of repeating it on every request.
- **Reactive Forms** with validation (`required`, `minLength`, `maxLength`) for every form.
- **Error handling** on every API call, surfaced to the user through the `error` signal.
- A **custom directive** (`appOverdueTask`, highlights overdue tasks), a **custom pipe**
  (`priorityLabel`), and **generic reusable components** (`CustomButton`, `ConfirmationDialog`).

## Testing

Unit tests (Jasmine/Karma) cover both services (`ProjectService`, `TaskService` — HTTP
behaviour via `HttpTestingController`) and several components (`DashboardComponent`,
`CustomButtonComponent`, plus reactive‑form validation for the project and task lists).

## Reflections

- **Signals + a base service** removed a lot of duplicated loading/error wiring and made the
  two services almost declarative — each method just describes its request and an error message.
- **DummyJSON's non‑persistent writes** drove the local‑first approach: call the API for real,
  but treat client state as the source of truth so the UX stays consistent.

### Possible improvements

Drag‑and‑drop status changes (Angular CDK), real persistence, project‑level progress tracking,
theming, and import/export.

## Screenshots

_Add screenshots of the dashboard, project list and task list here before submitting, e.g.:_

```
![Dashboard](screenshots/dashboard.png)
![Projects](screenshots/projects.png)
```
