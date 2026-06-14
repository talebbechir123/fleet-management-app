import { Router } from "express";
import mongoose from "mongoose";

const router = Router();

router.get("/health/live", (_req, res) => {
  res.json({ status: "ok" });
});

router.get("/health/ready", (_req, res) => {
  const dbState = mongoose.connection.readyState;
  if (dbState !== 1) {
    res.status(503).json({ status: "not ready", db: "disconnected" });
    return;
  }
  res.json({ status: "ok", db: "connected" });
});

export { router as healthRouter };
