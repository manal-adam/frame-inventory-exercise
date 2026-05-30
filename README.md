# Frame Inventory

The Frame Inventory system is a full-stack application for managing advertising frame inventory and lifecycle.
It supports:
- CRUD operations on frames
- CSV bulk upload with validation and error reporting
- Frame history tracking
- Simple UI for uploading, viewing, editing, and deleting frames


Bring the whole stack up with one command:

```bash
docker compose up --build
```

## Modules

| Module    | Stack                               | Path            |
|-----------|-------------------------------------|-----------------|
| backend   | Java 21, Spring Boot 3.5, Gradle    | `src/backend/`  |
| frontend  | React 19, Vite, TypeScript          | `src/frontend/` |

## Services

`docker compose up` starts every dependency the exercise needs:

| Service               | Host port | Container port | Notes                                                  |
|-----------------------|-----------|----------------|--------------------------------------------------------|
| frontend              | 3000      | 3000           | Vite dev server, proxies `/api` to the backend         |
| backend               | 8080      | 8080           | Spring Boot, exposes `GET /api/health`                 |
| mongodb               | 27017     | 27017          | Intended for frame data                                |

### Credentials

| Service               | User       | Password       | Database         |
|-----------------------|------------|----------------|------------------|
| mongodb               | `root`     | `root`         | `frames`         |

## Smoke test

Once the stack is up:

- Open <http://localhost:3000> &mdash; the page calls `/api/health` and prints the JSON response.
- Hit the backend directly: <http://localhost:8080/api/health>.

## Running modules without Docker

### Backend

```bash
cd src/backend
./gradlew bootRun
```

### Frontend

```bash
cd src/frontend
npm install
npm run dev
```

## Running Tests

### Backend

```bash
cd src/backend
./gradlew test
```

### Frontend

```bash
cd src/frontend
npm test
```

## API Documentation

### Frames

| Method | Endpoint            | Description    |
|--------|---------------------|----------------|
| Get    | `/api/frames`       | List all frames |
| Get    | `/api/frames/{frameId}` | Get frame with history|
| Post   | `/api/frames`       | Create frame  |
| Put    | `/api/frames/{frameId}` | Update frame|
| Delete | `/api/frames/{frameId}` | Delete frame |

### CSV upload

| Method | Endpoint              | Description    |
|--------|-----------------------|----------------|
| Post   | `/api/frames/upload`  | Upload CSV file|

## Architecture Overview

- Backend - Spring Boot, Java 21, Gradle
- Frontend - React 19, Vite, TypeScript
- Database - MongoDB

I approached the exercise incrementally, focusing on delivering working functionality in small, manageable steps.

I began by simplifying the provided infrastructure and selecting MongoDB as the primary datastore. From there, I implemented the core backend functionality first, including the frame domain model, persistence layer, REST API, and history tracking. This ensured that the main business functionality was available and testable before any frontend work began.

Once the CRUD operations were complete, I implemented CSV upload functionality, including validation, duplicate detection, error reporting, and bulk uploads. Particular attention was given to ensuring that the import failures provided useful feedback to allow users to identify and correct problems in uploaded files.

With the backend complete, I built the frontend, starting with frame listing and navigation before adding frame details, history views, create and edit forms, CSV upload functionality, and frame deletion. Having the backend endpoints available first allowed each frontend feature to be implemented and tested against real application behaviour as it was developed.

Testing was added alongside development, with unit tests written for backend services and frontend components. Integration tests were added to verify end-to-end backend behaviour against a real MongoDB instance using Testcontainers.

To keep the work manageable and reduce risk, I split the implementation into a series of small PRs, each focused on a single piece of functionality. This made it easier to validate progress, maintain code quality, and avoid introducing multiple concerns in a single change.

| PR | Title                                                  | Scope                                         |
|----|--------------------------------------------------------|-----------------------------------------------|
| 1  | Simplify docker compose configuration                  | Infrastructure cleanup                        |
| 2  | feat: Add MongoDB Frame entity and repository          | Backend: entity, repository, MongoDB config   |
| 3  | feat: Add Frame CRUD REST endpoints                    | Backend: controller, service, validation      |
| 4  | feat: Add CSV bulk upload endpoint                     | Backend: CSV parsing, bulk insert             |
| 5  | feat: Add frame history tracking                       | Backend: audit trail on updates               |
| 6  | feat: Add frontend project structure and design tokens | Frontend: setup, tokens, shared components    |
| 7  | feat: Add frame list page                              | Frontend: list view with table                |
| 8  | feat: Add frame detail and history views               | Frontend: detail page, history timeline       |
| 9  | feat: Add frame create/edit forms                      | Frontend: form components                     |
| 10 | feat: Add CSV upload UI                                | Frontend: file upload component               |
| 11 | chore: Add tests and update documentation              | Unit tests, integration tests, README updates |


### Key design decisions

#### 1. Simplified Data Model

The source CSV field contains a large number of columns describing location information, commercial metadata, pricing, dimensions, and other details. Rather than modelling every field, I selected a smaller subset of attributes that were sufficient to demonstrate the core requirements of the exercise: frame identification, type and status management, history tracking, and CSV upload.

This reduced the complexity of the domain model and allowed development to be focused on the functionality requested by the exercise.

The trade-off is that some information present in the source data is not represented in the application.

 
#### 2. MongoDB with embedded document model 

Frame history is stored in the frame document rather than a separate collection. This approach was chosen to keep the data model simple and aligned with the scope of the exercise.
It allows a frame and its full history to be retrieved in a single database call.

The trade-off is that this approach is less suitable for large scale datasets where history can grow significantly and more complex queries are required. 


#### 3. No DTO layer


The application returns the frame entity directly from the backend rather than introducing a separate DTO layer. This helped keep the code simple and avoided creating additional classes and mapping logic.
   
The trade-off is that the API is more closely coupled to the backend model. In a larger application, a DTO layer would provide a cleaner separation between the internal backend model and the API.

#### 4. Synchronous CSV upload

CSV uploads are handled synchronously to keep the implementation straightforward and avoid the complexities that come with asynchronous processing like background jobs and queues.
This was considered sufficient for the scale of data in this exercise.

The main trade-off is that this approach would not scale well for very large files where asynchronous processing would be more appropriate.


#### 5. Frontend constants instead of backend enums.

Status and type values are defined in frontend constants rather than backend enums to keep the implementation simple for this exercise.

The trade-off is that there is no single source of truth, which can lead to inconsistencies if frontend and backend definitions diverge.

#### 6. Testcontainers for integration testing

Integration tests use Testcontainers and a real MongoDB instance rather than mocked repositories. This provides greater confidence that database interactions work correctly, at the cost of slightly longer test execution times.

### Test Coverage

The project contains:

- 51 backend tests (45 unit tests, 6 integration tests)
- 73 frontend tests

Backend integration tests use Testcontainers to run against a real MongoDB instance.