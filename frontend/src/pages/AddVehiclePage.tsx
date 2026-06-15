import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { vehicleApi } from "../lib/api";

export function AddVehiclePage() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [plate, setPlate] = useState("");
  const [mileage, setMileage] = useState(0);
  const [isElectric, setIsElectric] = useState(false);
  const [acquiredAt, setAcquiredAt] = useState("");

  const create = useMutation({
    mutationFn: vehicleApi.create,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["vehicles"] }); navigate("/vehicles"); },
  });

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    create.mutate({ plate, mileage, isElectric, acquiredAt });
  }

  return (
    <div className="container" style={{ paddingTop: 32, paddingBottom: 64 }}>
      <Link to="/vehicles" style={{ fontSize: 14, color: "var(--text-muted)" }}>← Back to fleet</Link>
      <h1 className="page-title" style={{ marginTop: 8, marginBottom: 24 }}>Add vehicle</h1>

      <div className="card card-body" style={{ maxWidth: 480 }}>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div className="form-group">
            <label className="form-label">Plate number</label>
            <input value={plate} onChange={(e) => setPlate(e.target.value)} placeholder="AB-123-CD" required className="form-input" />
          </div>
          <div className="form-group">
            <label className="form-label">Mileage (km)</label>
            <input type="number" value={mileage} onChange={(e) => setMileage(parseInt(e.target.value, 10) || 0)} min={0} required className="form-input" />
          </div>
          <div className="form-group">
            <label className="form-label">Acquired date</label>
            <input type="date" value={acquiredAt} onChange={(e) => setAcquiredAt(e.target.value)} required className="form-input" />
          </div>
          <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, cursor: "pointer" }}>
            <input type="checkbox" checked={isElectric} onChange={(e) => setIsElectric(e.target.checked)} style={{ width: 16, height: 16 }} />
            Electric vehicle
          </label>
          {create.isError && <div className="alert-error">{(create.error as any)?.response?.data?.error ?? "Failed to create vehicle"}</div>}
          <button type="submit" disabled={create.isPending} className="btn btn-success btn-lg">
            {create.isPending ? "Creating..." : "Add vehicle"}
          </button>
        </form>
      </div>
    </div>
  );
}
