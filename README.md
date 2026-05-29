# Frame Inventory

The Frame Inventory system is a full-stack application for managing advertising frame inventory and lifecycle.
It supports:
- CRUD operations on frames
- CSV bulk upload with validation and error reporting
- Frame history tracking
- Simple UI for uploading, viewing, editing, and deleting frames


Monorepo scaffold for the frame-inventory take-home exercise. Bring the whole stack up with one command:

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

The application is intentionally simple and optimised for the take-home exercise rather than a production grade application.

### Key design decisions

#### 1. MongoDB with embedded document model 

frame history is stored in the frame document rather than a separate collection. This approach was chosen to keep the data model simple and aligned with the scope of the exercise.
It allows a frame and its full history to be retrieved in a single database call.

The trade-off is that this approach is less suitable for large scale datasets where history can grow significantly and more complex queries are required. 


#### 2. No DTO layer - the entities are directly returned from the repository


The application returns the frame entity directly from the backend rather than introducing a dedicated DTO layer. This decision was made to reduce boilerplate and keep the implementation lightweight and focused on core functionality.
   
This improved development speed and simplicity but introduced tighter coupling between the backend model and the API contract, which would be undesirable in a larger application.

#### 3. Synchronous CSV upload:

CSV uploads are handled synchronously to keep the implementation straightforward and avoid the complexities that come with asynchronous processing like background jobs and queues.
This was considered sufficient for the scale of data in this exercise.

The main trade-off is that this approach would not scale well for very large files where asynchronous processing would be more appropriate.


#### 4. Frontend constants for enums - status and type values are defined in frontend constants, not backend enums.

Status and type values are defined in frontend constants rather than backend enums to keep the system simpler and more flexible.

The downside is that there is no single source of truth, which can lead to inconsistencies if frontend and backend definitions diverge.

#### 5. Simplified Data Model

The domain model focuses on a small set of core frame attributes required for the exercise: frameId, type, format, environment, status.
The full CSV contains a significantly larger number of fields, such as location, commercial metadata, pricing, and dimensional data. These were intentionally excluded from the domain model to keep the implementation focused on demonstrating CRUD operations, history tracking, and CSV ingestion. 

The trade-off is that the system is simple at the cost of not fully representing the richness of the dataset.