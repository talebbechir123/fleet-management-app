import axios from "axios";

export const api = axios.create({
  baseURL: "https://fleet-backend-999392819034.europe-west1.run.app/api",
});

export interface Vehicle {
  _id: string;
  plate: string;
  status: "active" | "maintenance" | "retired";
  mileage: number;
  isElectric: boolean;
  acquiredAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface VehicleListResponse {
  items: Vehicle[];
  total: number;
}

export interface MaintenanceEvent {
  _id: string;
  vehicleId: string;
  type: "oil_change" | "tire" | "inspection" | "battery" | "other";
  scheduledStart: string;
  scheduledEnd: string;
  completedAt?: string;
  costEur?: number;
  notes?: string;
}

export const vehicleApi = {
  list: (params?: { status?: string }) =>
    api.get<VehicleListResponse>("/vehicles", { params }).then((r) => r.data),

  get: (id: string) =>
    api.get<Vehicle>(`/vehicles/${id}`).then((r) => r.data),

  create: (input: { plate: string; mileage: number; isElectric: boolean; acquiredAt: string }) =>
    api.post<Vehicle>("/vehicles", input).then((r) => r.data),

  updateStatus: (id: string, status: Vehicle["status"]) =>
    api.patch<Vehicle>(`/vehicles/${id}/status`, { status }).then((r) => r.data),

  delete: (id: string) =>
    api.delete(`/vehicles/${id}`).then(() => undefined),
};

export const maintenanceApi = {
  schedule: (input: {
    vehicleId: string;
    type: MaintenanceEvent["type"];
    scheduledStart: string;
    scheduledEnd: string;
    notes?: string;
  }) => api.post<MaintenanceEvent>("/maintenance", input).then((r) => r.data),

  listForVehicle: (vehicleId: string) =>
    api.get<MaintenanceEvent[]>(`/maintenance/vehicle/${vehicleId}`).then((r) => r.data),

  complete: (id: string, costEur: number) =>
    api.patch<MaintenanceEvent>(`/maintenance/${id}/complete`, { costEur }).then((r) => r.data),
};