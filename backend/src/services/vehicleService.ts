import { Vehicle, IVehicle, IVehicleDocument } from "../models/vehicle.js";
import { HttpError } from "../middleware/errorHandler.js";

const ALLOWED_TRANSITIONS: Record<IVehicle["status"], IVehicle["status"][]> = {
  active: ["maintenance", "retired"],
  maintenance: ["active", "retired"],
  retired: [],
};

export const vehicleService = {
  async create(input: IVehicle): Promise<IVehicleDocument> {
    const existing = await Vehicle.findOne({ plate: input.plate });
    if (existing) throw new HttpError(409, "Vehicle with this plate already exists");
    return Vehicle.create(input);
  },

  async findById(id: string): Promise<IVehicleDocument | null> {
    return Vehicle.findById(id);
  },

  async list(filter: {
    status?: IVehicle["status"];
    isElectric?: boolean;
    page?: number;
    limit?: number;
  }): Promise<{ items: IVehicleDocument[]; total: number }> {
    const page = filter.page ?? 1;
    const limit = Math.min(filter.limit ?? 20, 100);
    const query: Record<string, unknown> = {};
    if (filter.status) query.status = filter.status;
    if (filter.isElectric !== undefined) query.isElectric = filter.isElectric;

    const [items, total] = await Promise.all([
      Vehicle.find(query).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit),
      Vehicle.countDocuments(query),
    ]);
    return { items, total };
  },

  async updateStatus(id: string, newStatus: IVehicle["status"]): Promise<IVehicleDocument> {
    const vehicle = await Vehicle.findById(id);
    if (!vehicle) throw new HttpError(404, "Vehicle not found");
    const allowed = ALLOWED_TRANSITIONS[vehicle.status];
    if (!allowed.includes(newStatus)) {
      throw new HttpError(400, `Cannot transition from ${vehicle.status} to ${newStatus}`);
    }
    vehicle.status = newStatus;
    await vehicle.save();
    return vehicle;
  },

  async delete(id: string): Promise<void> {
    const result = await Vehicle.findByIdAndDelete(id);
    if (!result) throw new HttpError(404, "Vehicle not found");
  },
};