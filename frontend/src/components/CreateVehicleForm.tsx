import { useState } from "react";
import type { FormEvent } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { vehicleApi } from "../lib/api";

export function CreateVehicleForm() {
  const queryClient = useQueryClient();
  const [plate, setPlate] = useState("");
  const [mileage, setMileage] = useState(0);
  const [isElectric, setIsElectric] = useState(false);
  const [acquiredAt, setAcquiredAt] = useState("");

  const create = useMutation({
    mutationFn: vehicleApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vehicles"] });
      setPlate("");
      setMileage(0);
      setIsElectric(false);
      setAcquiredAt("");
    },
  });

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    create.mutate({ plate, mileage, isElectric, acquiredAt });
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 24 }}>
      <input
        placeholder="Plate (e.g. AB-123-CD)"
        value={plate}
        onChange={(e) => setPlate(e.target.value)}
        required
        style={{ padding: "6px 10px", borderRadius: 6, border: "1px solid #d1d5db", flex: 1, minWidth: 160 }}
      />
      <input
        type="number"
        placeholder="Mileage"
        value={mileage}
        onChange={(e) => setMileage(parseInt(e.target.value, 10) || 0)}
        min={0}
        required
        style={{ padding: "6px 10px", borderRadius: 6, border: "1px solid #d1d5db", width: 120 }}
      />
      <input
        type="date"
        value={acquiredAt}
        onChange={(e) => setAcquiredAt(e.target.value)}
        required
        style={{ padding: "6px 10px", borderRadius: 6, border: "1px solid #d1d5db" }}
      />
      <label style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 14 }}>
        <input
          type="checkbox"
          checked={isElectric}
          onChange={(e) => setIsElectric(e.target.checked)}
        />
        Electric
      </label>
      <button
        type="submit"
        disabled={create.isPending}
        style={{ padding: "6px 16px", borderRadius: 6, background: "#3b82f6", color: "white", border: "none", cursor: "pointer" }}
      >
        {create.isPending ? "Creating..." : "Add vehicle"}
      </button>
      {create.isError && <p style={{ color: "red", width: "100%", margin: 0 }}>Failed to create vehicle</p>}
    </form>
  );
}