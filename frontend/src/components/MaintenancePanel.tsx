import { useState, type FormEvent } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { maintenanceApi } from "../lib/api";
import type { MaintenanceEvent } from "../lib/api";

interface Props {
  vehicleId: string;
}

export function MaintenancePanel({ vehicleId }: Props) {
  const queryClient = useQueryClient();
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["maintenance", vehicleId] });
      setStart("");
      setEnd("");
      setNotes("");
    },
  });

  const complete = useMutation({
    mutationFn: ({ id, costEur }: { id: string; costEur: number }) =>
      maintenanceApi.complete(id, costEur),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["maintenance", vehicleId] }),
  });

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    schedule.mutate({
      vehicleId,
      type,
      scheduledStart: new Date(start).toISOString(),
      scheduledEnd: new Date(end).toISOString(),
      notes: notes || undefined,
    });
  }

  return (
    <div style={{ marginTop: 24 }}>
      <h3 style={{ marginBottom: 12 }}>Schedule maintenance</h3>
      <form onSubmit={handleSubmit} style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
        <select
          value={type}
          onChange={(e) => setType(e.target.value as MaintenanceEvent["type"])}
          style={{ padding: "6px 10px", borderRadius: 6, border: "1px solid #d1d5db" }}
        >
          <option value="oil_change">Oil change</option>
          <option value="tire">Tire</option>
          <option value="inspection">Inspection</option>
          <option value="battery">Battery</option>
          <option value="other">Other</option>
        </select>
        <input
          type="datetime-local"
          value={start}
          onChange={(e) => setStart(e.target.value)}
          required
          style={{ padding: "6px 10px", borderRadius: 6, border: "1px solid #d1d5db" }}
        />
        <input
          type="datetime-local"
          value={end}
          onChange={(e) => setEnd(e.target.value)}
          required
          style={{ padding: "6px 10px", borderRadius: 6, border: "1px solid #d1d5db" }}
        />
        <input
          placeholder="Notes (optional)"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          style={{ padding: "6px 10px", borderRadius: 6, border: "1px solid #d1d5db", flex: 1 }}
        />
        <button
          type="submit"
          disabled={schedule.isPending}
          style={{ padding: "6px 16px", borderRadius: 6, background: "#f59e0b", color: "white", border: "none", cursor: "pointer" }}
        >
          {schedule.isPending ? "Scheduling..." : "Schedule"}
        </button>
        {schedule.isError && (
          <p style={{ color: "red", width: "100%", margin: 0 }}>
            {(schedule.error as any)?.response?.data?.error ?? "Failed to schedule"}
          </p>
        )}
      </form>

      <h3>Events</h3>
      {isLoading && <p>Loading...</p>}
      {events?.map((ev) => (
        <div
          key={ev._id}
          style={{ padding: 10, marginBottom: 8, border: "1px solid #e5e7eb", borderRadius: 6, fontSize: 13 }}
        >
          <strong>{ev.type.replace("_", " ")}</strong>
          <span style={{ marginLeft: 8, color: "#6b7280" }}>
            {new Date(ev.scheduledStart).toLocaleDateString()} to {new Date(ev.scheduledEnd).toLocaleDateString()}
          </span>
          {ev.completedAt ? (
            <span style={{ marginLeft: 8, color: "#22c55e" }}>
              Completed — {ev.costEur != null ? `${ev.costEur}€` : ""}
            </span>
          ) : (
            <button
              onClick={() => {
                const cost = parseFloat(prompt("Cost in EUR?") ?? "0");
                if (!isNaN(cost)) complete.mutate({ id: ev._id, costEur: cost });
              }}
              style={{ marginLeft: 8, fontSize: 12, padding: "2px 8px", cursor: "pointer" }}
            >
              Mark complete
            </button>
          )}
        </div>
      ))}
    </div>
  );
}