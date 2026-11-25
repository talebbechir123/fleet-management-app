# Fleet Management OS

A full-stack fleet management platform: typed REST API, MongoDB data model with enforced business rules, React dashboard, containerised backend and automated frontend deployment.

**Live demo:** https://talebbechir123.github.io/fleet-management-app

## Tech stack

| Layer | Technology |
|---|---|
| Backend | Node.js, Express, TypeScript, Mongoose, Zod |
| Frontend | React, TypeScript, React Query, React Router, Axios, Vite |
| Database | MongoDB (Atlas or local) |
| Delivery | Multi-stage Docker image for the API · GitHub Actions → GitHub Pages for the frontend |

## Features

- **Vehicle lifecycle as a state machine** — `active`, `maintenance`, `retired`, with transition rules enforced server-side (a retired vehicle cannot be reactivated).
- **Maintenance scheduling with conflict detection** — overlapping time ranges for the same vehicle are rejected.
- **Validated, typed API** — every request body is checked with Zod; errors return a consistent typed payload.
- **Indexed queries** — compound MongoDB indexes on `(status, isElectric)` and `(vehicleId, scheduledStart, scheduledEnd)`.
- **Health probes** — separate liveness and readiness endpoints, ready for an orchestrator such as Kubernetes or Cloud Run.

## Architecture

```
fleet-management-app/
├── backend/
│   ├── src/
│   │   ├── routes/        Thin HTTP handlers (vehicles, maintenance, health)
│   │   ├── services/      Business logic: state machine, conflict detection
│   │   ├── models/        Mongoose schemas and indexes
│   │   ├── middleware/    Zod validation, central error handler
│   │   └── config.ts      Environment configuration
│   └── Dockerfile         Multi-stage build (tsc → slim runtime)
├── frontend/
│   └── src/
│       ├── pages/         Home, Vehicles, Add Vehicle
│       ├── components/    Navbar, MaintenancePanel
│       └── lib/api.ts     Typed API client
└── .github/workflows/     Frontend build and GitHub Pages deployment
```

### Design decisions

- **Service layer separation.** Routes only deal with HTTP; all domain logic lives in services, which keeps handlers small and the logic testable.
- **Server-side state machine.** Status transitions are validated in the service layer, so invalid states are impossible regardless of the client.
- **Interval overlap check.** Two intervals `[a, b]` and `[c, d]` overlap when `a < d AND b > c`. The query is backed by the compound index on `(vehicleId, scheduledStart, scheduledEnd)`.
- **Liveness vs readiness.** `/health/live` always returns 200 while the process runs. `/health/ready` checks `mongoose.connection.readyState` and returns 503 when the database is unreachable, so no traffic is routed to an instance that cannot serve it.

## Getting started

**Backend** (port 3001):

```bash
cd backend
npm install
export MONGO_URI="mongodb://localhost:27017/fleet"   # default if unset
npm run dev
```

**Frontend** (port 5173):

```bash
cd frontend
npm install
npm run dev
```

**Docker** (API only):

```bash
cd backend
docker build -t fleet-api .
docker run -p 3001:3001 -e MONGO_URI="<your-uri>" fleet-api
```

## API reference

| Method | Endpoint | Description |
|---|---|---|
| GET | `/health/live` | Liveness probe |
| GET | `/health/ready` | Readiness probe (checks the database) |
| POST | `/api/vehicles` | Create a vehicle |
| GET | `/api/vehicles` | List vehicles (filterable by status) |
| GET | `/api/vehicles/:id` | Get a vehicle |
| PATCH | `/api/vehicles/:id/status` | Change vehicle status |
| DELETE | `/api/vehicles/:id` | Delete a vehicle |
| POST | `/api/maintenance` | Schedule maintenance (with conflict detection) |
| GET | `/api/maintenance/vehicle/:vehicleId` | List maintenance events for a vehicle |
| PATCH | `/api/maintenance/:id/complete` | Mark maintenance as complete, with cost |

## Author

**Ahmed Taleb Bechir**
[atbechir.com](https://atbechir.com) · [LinkedIn](https://www.linkedin.com/in/ahmed-taleb-bechir-97a7301a4) · [GitHub](https://github.com/talebbechir123) · talebbechir123@gmail.com
