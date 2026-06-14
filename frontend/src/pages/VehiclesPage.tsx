import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { vehicleApi } from "../lib/api";
import type { Vehicle } from "../lib/api";
import { MaintenancePanel } from "../components/MaintenancePanel";

const STATUS_COLORS: Record<Vehicle["status"], string> = {
  active: "#22c55e",
  maintenance: "#f59e0b",
  retired: "#6b7280",
};

export function VehiclesPage() {
  const queryClient = useQueryClient();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "active" | "maintenance" | "retired">("all");

  const { data, isLoading } = useQuery({
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vehicles"] });
      if (selectedId) setSelectedId(null);
    },
  });

  const filtered = data?.items.filter(
    (v) => filter === "all" || v.status === filter
  );

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: 24, fontFamily: "system-ui, sans-serif" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <Link to="/" style={{ color: "#3b82f6", textDecoration: "none", fontSize: 14 }}>Home</Link>
          <h1 style={{ margin: "8px 0 0" }}>Vehicles</h1>
        </div>
        <Link to="/add">
          <button style={{
            padding: "8px 20px", borderRadius: 8, background: "#3b82f6",
            color: "white", border: "none", cursor: "pointer", fontSize: 14
          }}>
            + Add vehicle
          </button>
        </Link>
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        {(["all", "active", "maintenance", "retired"] as const).map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            style={{
              padding: "4px 14px", borderRadius: 16, fontSize: 13, cursor: "pointer",
              border: filter === s ? "2px solid #3b82f6" : "1px solid #d1d5db",
              background: filter === s ? "#eff6ff" : "white",
              color: filter === s ? "#3b82f6" : "#374151",
            }}
          >
            {s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
        {data && (
          <span style={{ marginLeft: "auto", fontSize: 13, color: "#6b7280", alignSelf: "center" }}>
            {data.total} vehicles total
          </span>
        )}
      </div>

      {isLoading && <p>Loading...</p>}

      {!isLoading && !filtered?.length && (
        <p style={{ color: "#6b7280" }}>No vehicles found. <Link to="/add">Add one.</Link></p>
      )}

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        {filtered && filtered.length > 0 && (
          <>
            <thead>
              <tr style={{ borderBottom: "2px solid #e5e7eb", textAlign: "left" }}>
                <th style={{ padding: "8px 12px", fontSize: 13, color: "#6b7280" }}>Plate</th>
                <th style={{ padding: "8px 12px", fontSize: 13, color: "#6b7280" }}>Status</th>
                <th style={{ padding: "8px 12px", fontSize: 13, color: "#6b7280" }}>Mileage</th>
                <th style={{ padding: "8px 12px", fontSize: 13, color: "#6b7280" }}>Type</th>
                <th style={{ padding: "8px 12px", fontSize: 13, color: "#6b7280" }}>Acquired</th>
                <th style={{ padding: "8px 12px", fontSize: 13, color: "#6b7280" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((v) => (
                <tr
                  key={v._id}
                  onClick={() => setSelectedId(selectedId === v._id ? null : v._id)}
                  style={{
                    borderBottom: "1px solid #f3f4f6",
                    cursor: "pointer",
                    background: selectedId === v._id ? "#eff6ff" : "transparent",
                  }}
                >
                  <td style={{ padding: "10px 12px", fontWeight: 600 }}>{v.plate}</td>
                  <td style={{ padding: "10px 12px" }}>
                    <span style={{
                      padding: "2px 10px", borderRadius: 12, fontSize: 12,
                      background: STATUS_COLORS[v.status], color: "white"
                    }}>
                      {v.status}
                    </span>
                  </td>
                  <td style={{ padding: "10px 12px" }}>{v.mileage.toLocaleString()} km</td>
                  <td style={{ padding: "10px 12px" }}>{v.isElectric ? "⚡ Electric" : "⛽ Thermal"}</td>
                  <td style={{ padding: "10px 12px", fontSize: 13, color: "#6b7280" }}>
                    {new Date(v.acquiredAt).toLocaleDateString()}
                  </td>
                  <td style={{ padding: "10px 12px" }}>
                    <div style={{ display: "flex", gap: 4 }} onClick={(e) => e.stopPropagation()}>
                      {v.status === "active" && (
                        <button
                          onClick={() => updateStatus.mutate({ id: v._id, status: "maintenance" })}
                          style={{ fontSize: 11, padding: "3px 8px", cursor: "pointer", borderRadius: 4, border: "1px solid #f59e0b", background: "white", color: "#f59e0b" }}
                        >
                          Maintenance
                        </button>
                      )}
                      {v.status === "maintenance" && (
                        <button
                          onClick={() => updateStatus.mutate({ id: v._id, status: "active" })}
                          style={{ fontSize: 11, padding: "3px 8px", cursor: "pointer", borderRadius: 4, border: "1px solid #22c55e", background: "white", color: "#22c55e" }}
                        >
                          Activate
                        </button>
                      )}
                      {v.status !== "retired" && (
                        <button
                          onClick={() => updateStatus.mutate({ id: v._id, status: "retired" })}
                          style={{ fontSize: 11, padding: "3px 8px", cursor: "pointer", borderRadius: 4, border: "1px solid #6b7280", background: "white", color: "#6b7280" }}
                        >
                          Retire
                        </button>
                      )}
                      <button
                        onClick={() => { if (confirm(`Delete ${v.plate}?`)) deleteVehicle.mutate(v._id); }}
                        style={{ fontSize: 11, padding: "3px 8px", cursor: "pointer", borderRadius: 4, border: "1px solid #ef4444", background: "white", color: "#ef4444" }}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </>
        )}
      </table>

      {selectedId && (
        <div style={{ marginTop: 24, padding: 16, border: "1px solid #e5e7eb", borderRadius: 8 }}>
          <MaintenancePanel vehicleId={selectedId} />
        </div>
      )}
    </div>
  );
}
