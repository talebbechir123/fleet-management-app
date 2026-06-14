import express, { Express } from "express";
import cors from "cors";
import { vehiclesRouter } from "./routes/vehicles.js";
import { maintenanceRouter } from "./routes/maintenance.js";
import { healthRouter } from "./routes/health.js";
import { errorHandler } from "./middleware/errorHandler.js";

export const app: Express = express();

app.use(cors());
app.use(express.json());

app.use("/", healthRouter);
app.use("/api/vehicles", vehiclesRouter);
app.use("/api/maintenance", maintenanceRouter);
app.use(errorHandler);
