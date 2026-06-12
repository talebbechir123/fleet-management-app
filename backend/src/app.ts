import express, { Express } from "express";
import cors from "cors";
import { vehiclesRouter } from "./routes/vehicles.js";
import { maintenanceRouter } from "./routes/maintenance.js";
import { errorHandler } from "./middleware/errorHandler.js";

export const app: Express = express();

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use("/api/vehicles", vehiclesRouter);
app.use("/api/maintenance", maintenanceRouter);
app.use(errorHandler);