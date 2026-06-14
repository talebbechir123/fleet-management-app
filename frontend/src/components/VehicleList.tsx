import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { vehicleApi } from "../lib/api";
import type { Vehicle } from "../lib/api";

interface Props {
  onSelect: (id: string) => void;
  selectedId: string | null;
}

const STATUS_COLORS: Record<Vehicle["status"], string> = {
  active: "#22c55e",
  maintenance: "#f59e0b",
  retired: "#6b7280",
};

export function VehicleList({ onSelect, selectedId }: Props) {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ["vehicles"],
    queryFn: () => vehicleApi.list(),
  });

  const updateStatus = useMutation({
    mutationFn: ({ id, status }: { id: string; status: Vehicle["status"] }) =>
      vehicleApi.updateStatus(id, status),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["vehicles"] }),
  });

  const deleteVehicle = useMutation({
    mutationFn: (id: string) => vehicleApi.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["vehicles"] }),
  });

  if (isLoading) return <p>Loading vehicles...</p>;
  if (error) return <p style={{ color: "red" }}>Failed to load vehicles</p>;
  if (!data?.items.length) return <p>No vehicles yet. Create one above.</p>;

  return (
    <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
      {data.items.map((v) => (
        <li
          key={v._id}
          onClick={() => onSelect(v._id)}
          style={{
            padding: "12px 16px",
            marginBottom: 8,
            border: `2px solid ${selectedId === v._id ? "#3b82f6" : "#e5e7eb"}`,
            borderRadius: 8,
            cursor: "pointer",
            background: selectedId === v._id ? "#eff6ff" : "white",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <strong>{v.plate}</strong>
              <span
                style={{
                  marginLeft: 8,
                  padding: "2px 8px",
                  borderRadius: 12,
                  fontSize: 12,
                  background: STATUS_COLORS[v.status],
                  color: "white",
                }}
              >
                {v.status}
              </span>
              {v.isElectric && (
                <span style={{ marginLeft: 6, fontSize: 12, color: "#6b7280" }}>⚡ electric</span>
              )}
            </div>
            <span style={{ fontSize: 13, color: "#6b7280" }}>{v.mileage.toLocaleString()} km</span>
          </div>
          <div style={{ marginTop: 8, display: "flex", gap: 6 }}>
            {v.status === "active" && (
              <button
                onClick={(e) => { e.stopPropagation(); updateStatus.mutate({ id: v._id, status: "maintenance" }); }}
                disabled={updateStatus.isPending}
                style={{ fontSize: 12, padding: "2px 8px", cursor: "pointer" }}
              >
                Send to maintenance
              </button>
            )}
            {v.status === "maintenance" && (
              <button
                onClick={(e) => { e.stopPropagation(); updateStatus.mutate({ id: v._id, status: "active" }); }}
                disabled={updateStatus.isPending}
                style={{ fontSize: 12, padding: "2px 8px", cursor: "pointer" }}
              >
                Mark active
              </button>
            )}
            {v.status !== "retired" && (
              <button
                onClick={(e) => { e.stopPropagation(); updateStatus.mutate({ id: v._id, status: "retired" }); }}
                disabled={updateStatus.isPending}
                style={{ fontSize: 12, padding: "2px 8px", cursor: "pointer", color: "#ef4444" }}
              >
                Retire
              </button>
            )}
            <button
              onClick={(e) => { e.stopPropagation(); deleteVehicle.mutate(v._id); }}
              disabled={deleteVehicle.isPending}
              style={{ fontSize: 12, padding: "2px 8px", cursor: "pointer", marginLeft: "auto" }}
            >
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}