# Fleet Management OS

A full stack fleet management platform built to demonstrate end-to-end software engineering: typed APIs, database design, containerized deployment, and Kubernetes orchestration.

Live demo: https://talebbechir123.github.io/fleet-management-app

## Tech stack

Backend: Node.js, Express, TypeScript, Mongoose, Zod
Frontend: React, TypeScript, React Query, React Router, Axios, Vite
Database: MongoDB Atlas
Infrastructure: Docker, Kubernetes (manifests with liveness/readiness probes), Google Cloud Run

## Features

- Vehicle CRUD with status state machine (active, maintenance, retired) and enforced transition rules
- Maintenance event scheduling with time range conflict detection (interval overlap query)
- Zod validation on every API input with typed error responses
- Compound MongoDB indexes for query performance
- Separate liveness and readiness probes (readiness checks database connection before accepting traffic)
- Dockerized backend with multi-stage build
- Kubernetes deployment manifests with resource limits and secrets management

## Project structure

    fleet-app/
      backend/
        src/
          routes/          Express route handlers
          models/          Mongoose schemas and interfaces
          services/        Business logic layer
          middleware/       Validation, error handling
        Dockerfile
      frontend/
        src/
          pages/           Home, Vehicles, Add Vehicle
          components/      VehicleList, MaintenancePanel
          lib/             Typed API client
      k8s/
        deployment.yaml    2-replica deployment with probes
        service.yaml       ClusterIP service

## Running locally

Backend:

    cd backend
    cp .env.example .env   (add your MONGO_URI)
    npm install
    npm run dev            (runs on port 3001)

Frontend:

    cd frontend
    npm install
    npm run dev            (runs on port 5173)

## API endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /health/live | Liveness probe |
| GET | /health/ready | Readiness probe (checks DB) |
| POST | /api/vehicles | Create a vehicle |
| GET | /api/vehicles | List vehicles (filterable by status) |
| GET | /api/vehicles/:id | Get a vehicle |
| PATCH | /api/vehicles/:id/status | Update vehicle status |
| DELETE | /api/vehicles/:id | Delete a vehicle |
| POST | /api/maintenance | Schedule maintenance (with conflict detection) |
| GET | /api/maintenance/vehicle/:id | List maintenance events for a vehicle |
| PATCH | /api/maintenance/:id/complete | Mark maintenance complete with cost |

## Architecture decisions

Service layer separation: Routes are thin, all domain logic lives in services. This makes testing easier and keeps route handlers focused on HTTP concerns.

Status state machine: Vehicle status transitions are enforced server-side. A retired vehicle cannot be reactivated. This prevents invalid states regardless of client behavior.

Conflict detection: Maintenance events are checked for time range overlaps before insertion. Two intervals [a,b] and [c,d] overlap when a < d AND b > c. Backed by a compound index on (vehicleId, scheduledStart, scheduledEnd).

Liveness vs readiness: The liveness probe always returns 200 (the process is alive). The readiness probe checks mongoose.connection.readyState and returns 503 if the database is unreachable, preventing traffic from reaching a pod that cannot serve requests.

## Author

Ahmed Taleb Bechir
GitHub: https://github.com/talebbechir123
Email: talebbechir123@gmail.com