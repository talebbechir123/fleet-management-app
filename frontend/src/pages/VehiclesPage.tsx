import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { vehicleApi } from "../lib/api";
import type { Vehicle } from "../lib/api";
import { MaintenancePanel } from "../components/MaintenancePanel";

type Filter = "all" | "active" | "maintenance" | "retired";
const BADGE: Record<Vehicle["status"], string> = { active: "badge badge-active", maintenance: "badge badge-maintenance", retired: "badge badge-retired" };

export function VehiclesPage() {
  const qc = useQueryClient();
  const [selected, setSelected] = useState<string | null>(null);
  const [filter, setFilter] = useState<Filter>("all");

  const { data, isLoading, error } = useQuery({ queryKey: ["vehicles"], queryFn: () => vehicleApi.list() });

  const updateStatus = useMutation({
    mutationFn: ({ id, status }: { id: string; status: Vehicle["status"] }) => vehicleApi.updateStatus(id, status),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["vehicles"] }),
  });

  const del = useMutation({
    mutationFn: (id: string) => vehicleApi.delete(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["vehicles"] }); setSelected(null); },
  });

  const items = data?.items ?? [];
  const filtered = items.filter((v) => filter === "all" || v.status === filter);
  const counts = { active: items.filter((v) => v.status === "active").length, maintenance: items.filter((v) => v.status === "maintenance").length, retired: items.filter((v) => v.status === "retired").length };

  return (
    <div className="container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Fleet vehicles</h1>
          <p className="page-subtitle">{data ? `${data.total} registered` : "Loading..."}</p>
        </div>
        <Link to="/add"><button className="btn btn-primary">+ Add vehicle</button></Link>
      </div>

      <div className="stats-grid" style={{ marginBottom: 20 }}>
        <div className="stat-card"><div className="stat-value">{items.length}</div><div className="stat-label">Total</div></div>
        <div className="stat-card"><div className="stat-value" style={{ color: "var(--green)" }}>{counts.active}</div><div className="stat-label">Active</div></div>
        <div className="stat-card"><div className="stat-value" style={{ color: "var(--amber)" }}>{counts.maintenance}</div><div className="stat-label">Maintenance</div></div>
        <div className="stat-card"><div className="stat-value" style={{ color: "var(--gray)" }}>{counts.retired}</div><div className="stat-label">Retired</div></div>
      </div>

      <div className="filters" style={{ marginBottom: 16 }}>
        {(["all", "active", "maintenance", "retired"] as const).map((s) => (
          <button key={s} className={`pill ${filter === s ? "active" : ""}`} onClick={() => setFilter(s)}>
            {s.charAt(0).toUpperCase() + s.slice(1)}
            {s !== "all" && <span style={{ marginLeft: 4, opacity: 0.6 }}>({counts[s]})</span>}
          </button>
        ))}
      </div>

      {error && <div className="alert-error" style={{ marginBottom: 16 }}>Failed to load vehicles.</div>}
      {isLoading && <p style={{ color: "var(--text-muted)", padding: "24px 0" }}>Loading...</p>}

      {!isLoading && filtered.length === 0 && (
        <div className="empty">
          <p>{filter === "all" ? "No vehicles yet." : `No ${filter} vehicles.`}</p>
          {filter === "all" && <Link to="/add"><button className="btn btn-primary" style={{ marginTop: 8 }}>Add your first vehicle</button></Link>}
        </div>
      )}

      {filtered.length > 0 && (
        <div className="card" style={{ marginBottom: 24 }}>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Plate</th><th>Status</th><th>Mileage</th><th>Type</th><th>Acquired</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((v) => (
                  <tr key={v._id} className={selected === v._id ? "selected" : ""} onClick={() => setSelected(selected === v._id ? null : v._id)}>
                    <td style={{ fontWeight: 600 }}>{v.plate}</td>
                    <td><span className={BADGE[v.status]}>{v.status}</span></td>
                    <td>{v.mileage.toLocaleString()} km</td>
                    <td>{v.isElectric ? "\u26A1 Electric" : "\u26FD Thermal"}</td>
                    <td style={{ color: "var(--text-muted)", fontSize: 13 }}>{new Date(v.acquiredAt).toLocaleDateString()}</td>
                    <td>
                      <div style={{ display: "flex", gap: 4 }} onClick={(e) => e.stopPropagation()}>
                        {v.status === "active" && <button className="btn btn-sm btn-secondary" onClick={() => updateStatus.mutate({ id: v._id, status: "maintenance" })} disabled={updateStatus.isPending}>Maintenance</button>}
                        {v.status === "maintenance" && <button className="btn btn-sm btn-secondary" onClick={() => updateStatus.mutate({ id: v._id, status: "active" })} disabled={updateStatus.isPending}>Activate</button>}
                        {v.status !== "retired" && <button className="btn btn-sm btn-secondary" onClick={() => updateStatus.mutate({ id: v._id, status: "retired" })} disabled={updateStatus.isPending}>Retire</button>}
                        <button className="btn btn-sm btn-danger" onClick={() => { if (confirm(`Delete ${v.plate}?`)) del.mutate(v._id); }} disabled={del.isPending}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {selected && (
        <div className="card card-body" style={{ marginBottom: 32 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h2 style={{ fontSize: 17, fontWeight: 700 }}>Maintenance: {items.find((v) => v._id === selected)?.plate}</h2>
            <button className="btn btn-sm btn-secondary" onClick={() => setSelected(null)}>Close</button>
          </div>
          <MaintenancePanel vehicleId={selected} />
        </div>
      )}
    </div>
  );
}
