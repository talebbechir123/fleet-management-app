import { Router } from "express";
import { z } from "zod";
import { vehicleService } from "../services/vehicleService.js";
import { validateBody } from "../middleware/validate.js";

const router = Router();

const createSchema = z.object({
  plate: z.string().min(1).max(20),
  status: z.enum(["active", "maintenance", "retired"]).optional(),
  mileage: z.number().int().nonnegative(),
  isElectric: z.boolean(),
  acquiredAt: z.coerce.date(),
});

const updateStatusSchema = z.object({
  status: z.enum(["active", "maintenance", "retired"]),
});

router.post("/", validateBody(createSchema), async (req, res, next) => {
  try {
    const created = await vehicleService.create({ ...req.body, status: req.body.status ?? "active" });
    res.status(201).json(created);
  } catch (err) { next(err); }
});

router.get("/", async (req, res, next) => {
  try {
    const status = typeof req.query.status === "string" ? req.query.status as "active" | "maintenance" | "retired" : undefined;
    const isElectric = req.query.isElectric === "true" ? true : req.query.isElectric === "false" ? false : undefined;
    const page = typeof req.query.page === "string" ? parseInt(req.query.page, 10) : undefined;
    const limit = typeof req.query.limit === "string" ? parseInt(req.query.limit, 10) : undefined;
    const result = await vehicleService.list({ status, isElectric, page, limit });
    res.json(result);
  } catch (err) { next(err); }
});

router.get("/:id", async (req, res, next) => {
  try {
    const v = await vehicleService.findById(req.params.id);
    if (!v) { res.status(404).json({ error: "Not found" }); return; }
    res.json(v);
  } catch (err) { next(err); }
});

router.patch("/:id/status", validateBody(updateStatusSchema), async (req, res, next) => {
  try {
    const updated = await vehicleService.updateStatus(String(req.params.id), req.body.status);
    res.json(updated);
  } catch (err) { next(err); }
});

router.delete("/:id", async (req, res, next) => {
  try {
    await vehicleService.delete(req.params.id);
    res.status(204).end();
  } catch (err) { next(err); }
});

export { router as vehiclesRouter };
