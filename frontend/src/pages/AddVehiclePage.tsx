import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { vehicleApi } from "../lib/api";

export function AddVehiclePage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [plate, setPlate] = useState("");
  const [mileage, setMileage] = useState(0);
  const [isElectric, setIsElectric] = useState(false);
  const [acquiredAt, setAcquiredAt] = useState("");

  const create = useMutation({
    mutationFn: vehicleApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vehicles"] });
      navigate("/vehicles");
    },
  });

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    create.mutate({ plate, mileage, isElectric, acquiredAt });
  }

  return (
    <div style={{ maxWidth: 500, margin: "0 auto", padding: 24, fontFamily: "system-ui, sans-serif" }}>
      <Link to="/vehicles" style={{ color: "#3b82f6", textDecoration: "none", fontSize: 14 }}>Back to vehicles</Link>
      <h1 style={{ marginTop: 8, marginBottom: 24 }}>Add Vehicle</h1>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div>
          <label style={{ display: "block", marginBottom: 4, fontSize: 14, fontWeight: 500 }}>Plate number</label>
          <input
            value={plate}
            onChange={(e) => setPlate(e.target.value)}
            placeholder="AB-123-CD"
            required
            style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: "1px solid #d1d5db", boxSizing: "border-box" }}
          />
        </div>
        <div>
          <label style={{ display: "block", marginBottom: 4, fontSize: 14, fontWeight: 500 }}>Mileage (km)</label>
          <input
            type="number"
            value={mileage}
            onChange={(e) => setMileage(parseInt(e.target.value, 10) || 0)}
            min={0}
            required
            style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: "1px solid #d1d5db", boxSizing: "border-box" }}
          />
        </div>
        <div>
          <label style={{ display: "block", marginBottom: 4, fontSize: 14, fontWeight: 500 }}>Acquired date</label>
          <input
            type="date"
            value={acquiredAt}
            onChange={(e) => setAcquiredAt(e.target.value)}
            required
            style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: "1px solid #d1d5db", boxSizing: "border-box" }}
          />
        </div>
        <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14 }}>
          <input
            type="checkbox"
            checked={isElectric}
            onChange={(e) => setIsElectric(e.target.checked)}
          />
          Electric vehicle
        </label>
        <button
          type="submit"
          disabled={create.isPending}
          style={{
            padding: "10px 24px", borderRadius: 8, background: "#22c55e",
            color: "white", border: "none", cursor: "pointer", fontSize: 16, fontWeight: 500
          }}
        >
          {create.isPending ? "Creating..." : "Add vehicle"}
        </button>
        {create.isError && (
          <p style={{ color: "#ef4444", margin: 0 }}>
            {(create.error as any)?.response?.data?.error ?? "Failed to create vehicle"}
          </p>
        )}
      </form>
    </div>
  );
}
