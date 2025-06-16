# Task Manager

A modern task management application built with Angular and Material Design.

## Features

- Create, read, update, and delete projects and tasks
- Assign tasks to projects
- Set task priorities and due dates
- Mark tasks as completed
- Responsive design for all devices

## Prerequisites

- Node.js (v14 or later)
- npm (v6 or later)

## Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd task-manager
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Install JSON Server (for local API simulation):
   ```bash
   npm install -D json-server
   ```

## Running the Application

1. Start the JSON Server (in one terminal):

   ```bash
   npx json-server --watch db.json --port 3000
   ```

2. Start the Angular development server (in another terminal):

   ```bash
   ng serve
   ```

3. Open your browser and navigate to [http://localhost:4200](http://localhost:4200).

## API Endpoints

- Projects: [http://localhost:3000/projects](http://localhost:3000/projects)
- Tasks: [http://localhost:3000/tasks](http://localhost:3000/tasks)

## Technologies Used

- Angular
- Angular Material
- JSON Server (for local API simulation)
- TypeScript
- HTML/CSS

## License

This project is licensed under the MIT License.

## Screenshots

![Project List View](screenshots/project-list.png)
![Task Management](screenshots/task-management.png)

## Development

- Built with Angular 17
- Uses Angular Material for UI components
- Implements Angular Signals for state management
- Custom components and directives for enhanced functionality

## Project Structure

```
src/
├── app/
│   ├── components/      # Feature components
│   ├── services/        # Data services
│   ├── models/          # TypeScript interfaces
│   └── shared/          # Shared components, pipes, directives
├── assets/             # Static assets
└── environments/       # Environment configurations
```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request
