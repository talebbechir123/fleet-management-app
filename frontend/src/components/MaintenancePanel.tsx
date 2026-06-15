import { useState } from "react";
import type { FormEvent } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { maintenanceApi } from "../lib/api";
import type { MaintenanceEvent } from "../lib/api";

interface Props { vehicleId: string; }

const TYPE_LABELS: Record<MaintenanceEvent["type"], string> = {
  oil_change: "Oil change", tire: "Tire service",
  inspection: "Inspection", battery: "Battery", other: "Other",
};

export function MaintenancePanel({ vehicleId }: Props) {
  const qc = useQueryClient();
  const [type, setType] = useState<MaintenanceEvent["type"]>("oil_change");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [notes, setNotes] = useState("");

  const { data: events, isLoading } = useQuery({
    queryKey: ["maintenance", vehicleId],
    queryFn: () => maintenanceApi.listForVehicle(vehicleId),
  });

  const schedule = useMutation({
    mutationFn: maintenanceApi.schedule,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["maintenance", vehicleId] }); setStart(""); setEnd(""); setNotes(""); },
  });

  const complete = useMutation({
    mutationFn: ({ id, costEur }: { id: string; costEur: number }) => maintenanceApi.complete(id, costEur),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["maintenance", vehicleId] }),
  });

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    schedule.mutate({ vehicleId, type, scheduledStart: new Date(start).toISOString(), scheduledEnd: new Date(end).toISOString(), notes: notes || undefined });
  }

  return (
    <div>
      <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 12 }}>Schedule maintenance</h3>
      <form onSubmit={handleSubmit} style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
        <select value={type} onChange={(e) => setType(e.target.value as MaintenanceEvent["type"])} className="form-input" style={{ width: "auto" }}>
          {Object.entries(TYPE_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
        </select>
        <input type="datetime-local" value={start} onChange={(e) => setStart(e.target.value)} required className="form-input" style={{ width: "auto", flex: 1, minWidth: 170 }} />
        <input type="datetime-local" value={end} onChange={(e) => setEnd(e.target.value)} required className="form-input" style={{ width: "auto", flex: 1, minWidth: 170 }} />
        <input placeholder="Notes (optional)" value={notes} onChange={(e) => setNotes(e.target.value)} className="form-input" style={{ flex: 2, minWidth: 140 }} />
        <button type="submit" disabled={schedule.isPending} className="btn btn-primary btn-sm">
          {schedule.isPending ? "Scheduling..." : "Schedule"}
        </button>
      </form>
      {schedule.isError && <div className="alert-error" style={{ marginBottom: 12 }}>{(schedule.error as any)?.response?.data?.error ?? "Failed to schedule"}</div>}

      <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 8 }}>History</h3>
      {isLoading && <p style={{ color: "var(--text-muted)", fontSize: 14 }}>Loading...</p>}
      {!isLoading && (!events || events.length === 0) && <p style={{ color: "var(--text-muted)", fontSize: 14 }}>No events yet.</p>}
      {events?.map((ev) => (
        <div key={ev._id} className="card" style={{ padding: "10px 16px", marginBottom: 6, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
          <div>
            <span style={{ fontWeight: 600, fontSize: 13 }}>{TYPE_LABELS[ev.type]}</span>
            <span style={{ marginLeft: 10, fontSize: 13, color: "var(--text-muted)" }}>
              {new Date(ev.scheduledStart).toLocaleDateString()} – {new Date(ev.scheduledEnd).toLocaleDateString()}
            </span>
          </div>
          {ev.completedAt ? (
            <span className="badge badge-active">Done{ev.costEur != null ? ` · ${ev.costEur}€` : ""}</span>
          ) : (
            <button className="btn btn-sm btn-secondary" onClick={() => { const c = parseFloat(prompt("Cost in EUR?") ?? "0"); if (!isNaN(c)) complete.mutate({ id: ev._id, costEur: c }); }}>
              Complete
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
