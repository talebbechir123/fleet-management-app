import { Router } from "express";
import { z } from "zod";
import { Types } from "mongoose";
import { maintenanceService } from "../services/maintenanceService.js";
import { validateBody } from "../middleware/validate.js";

const router = Router();

const scheduleSchema = z.object({
  vehicleId: z.string().refine((s) => Types.ObjectId.isValid(s), { message: "Invalid vehicleId" }),
  type: z.enum(["oil_change", "tire", "inspection", "battery", "other"]),
  scheduledStart: z.coerce.date(),
  scheduledEnd: z.coerce.date(),
  notes: z.string().optional(),
});

const completeSchema = z.object({
  costEur: z.number().nonnegative(),
});

router.post("/", validateBody(scheduleSchema), async (req, res, next) => {
  try {
    const event = await maintenanceService.schedule({
      ...req.body,
      vehicleId: new Types.ObjectId(req.body.vehicleId),
    });
    res.status(201).json(event);
  } catch (err) { next(err); }
});

router.get("/vehicle/:vehicleId", async (req, res, next) => {
  try {
    const vehicleId = req.params.vehicleId;
    const events = await maintenanceService.listForVehicle(vehicleId);
    res.json(events);
  } catch (err) { next(err); }
});

router.patch("/:id/complete", validateBody(completeSchema), async (req, res, next) => {
  try {
    const event = await maintenanceService.complete(String(req.params.id), req.body.costEur);
    res.json(event);
  } catch (err) { next(err); }
});

export { router as maintenanceRouter };
