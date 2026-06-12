import { Schema, model, Document, Model, models, Types } from "mongoose";

export interface IVehicle {
  plate: string;
  status: "active" | "maintenance" | "retired";
  mileage: number;
  isElectric: boolean;
  acquiredAt: Date;
}

export interface IVehicleDocument extends IVehicle, Document {
  createdAt: Date;
  updatedAt: Date;
}

const vehicleSchema = new Schema<IVehicleDocument>(
  {
    plate: { type: String, required: true, unique: true, index: true },
    status: {
      type: String,
      enum: ["active", "maintenance", "retired"],
      default: "active",
      index: true,
    },
    mileage: { type: Number, required: true, min: 0 },
    isElectric: { type: Boolean, required: true },
    acquiredAt: { type: Date, required: true },
  },
  { timestamps: true }
);

vehicleSchema.index({ status: 1, isElectric: 1 });

export const Vehicle: Model<IVehicleDocument> =
  (models.Vehicle as Model<IVehicleDocument>) ||
  model<IVehicleDocument>("Vehicle", vehicleSchema);