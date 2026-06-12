import { Types } from "mongoose";
import { MaintenanceEvent, IMaintenanceEvent, IMaintenanceEventDocument } from "../models/MaintenanceEvent.js";
import { Vehicle } from "../models/Vehicle.js";
import { HttpError } from "../middleware/errorHandler.js";

export const maintenanceService = {
  async schedule(input: IMaintenanceEvent): Promise<IMaintenanceEventDocument> {
    if (input.scheduledEnd <= input.scheduledStart) {
      throw new HttpError(400, "End time must be after start time");
    }

    const vehicle = await Vehicle.findById(input.vehicleId);
    if (!vehicle) throw new HttpError(404, "Vehicle not found");

    // Two ranges [a,b] and [c,d] overlap when a < d AND b > c
    const conflict = await MaintenanceEvent.findOne({
      vehicleId: input.vehicleId,
      scheduledStart: { $lt: input.scheduledEnd },
      scheduledEnd: { $gt: input.scheduledStart },
    });

    if (conflict) {
      throw new HttpError(409, "Conflicting maintenance event exists", {
        conflictingEventId: conflict._id,
      });
    }

    return MaintenanceEvent.create(input);
  },

  async listForVehicle(vehicleId: string): Promise<IMaintenanceEventDocument[]> {
    return MaintenanceEvent.find({ vehicleId: new Types.ObjectId(vehicleId) })
      .sort({ scheduledStart: -1 })
      .limit(50);
  },

  async complete(id: string, costEur: number): Promise<IMaintenanceEventDocument> {
    const event = await MaintenanceEvent.findById(id);
    if (!event) throw new HttpError(404, "Maintenance event not found");
    if (event.completedAt) throw new HttpError(400, "Event already completed");
    event.completedAt = new Date();
    event.costEur = costEur;
    await event.save();
    return event;
  },
};