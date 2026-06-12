import { Schema, model, Document, Model, models, Types } from "mongoose";

export interface IMaintenanceEvent {
  vehicleId: Types.ObjectId;
  type: "oil_change" | "tire" | "inspection" | "battery" | "other";
  scheduledStart: Date;
  scheduledEnd: Date;
  completedAt?: Date;
  notes?: string;
  costEur?: number;
}

export interface IMaintenanceEventDocument extends IMaintenanceEvent, Document {
  createdAt: Date;
  updatedAt: Date;
}

const maintenanceSchema = new Schema<IMaintenanceEventDocument>(
  {
    vehicleId: { type: Schema.Types.ObjectId, ref: "Vehicle", required: true, index: true },
    type: {
      type: String,
      enum: ["oil_change", "tire", "inspection", "battery", "other"],
      required: true,
    },
    scheduledStart: { type: Date, required: true },
    scheduledEnd: { type: Date, required: true },
    completedAt: Date,
    notes: String,
    costEur: { type: Number, min: 0 },
  },
  { timestamps: true }
);

maintenanceSchema.index({ vehicleId: 1, scheduledStart: 1, scheduledEnd: 1 });

export const MaintenanceEvent: Model<IMaintenanceEventDocument> =
  (models.MaintenanceEvent as Model<IMaintenanceEventDocument>) ||
  model<IMaintenanceEventDocument>("MaintenanceEvent", maintenanceSchema);