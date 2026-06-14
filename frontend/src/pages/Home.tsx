import { Link } from "react-router-dom";

export function Home() {
  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: 48, fontFamily: "system-ui, sans-serif" }}>
      <div style={{ textAlign: "center", marginBottom: 48 }}>
        <h1 style={{ fontSize: 40, marginBottom: 8, letterSpacing: -1 }}>Fleet Management OS</h1>
        <p style={{ color: "#6b7280", fontSize: 18, maxWidth: 600, margin: "0 auto", lineHeight: 1.6 }}>
          A full stack fleet management platform built as a portfolio project to demonstrate
          end-to-end software engineering: from typed APIs and database design
          to containerized deployment and Kubernetes orchestration.
        </p>
      </div>

      <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap", marginBottom: 48 }}>
        <Link to="/vehicles" style={{ textDecoration: "none" }}>
          <div style={{
            padding: "24px 32px", border: "2px solid #3b82f6",
            borderRadius: 12, cursor: "pointer", minWidth: 200, textAlign: "center",
          }}>
            <h2 style={{ margin: 0, color: "#3b82f6" }}>Vehicles</h2>
            <p style={{ color: "#6b7280", margin: "8px 0 0" }}>View and manage all vehicles</p>
          </div>
        </Link>
        <Link to="/add" style={{ textDecoration: "none" }}>
          <div style={{
            padding: "24px 32px", border: "2px solid #22c55e",
            borderRadius: 12, cursor: "pointer", minWidth: 200, textAlign: "center",
          }}>
            <h2 style={{ margin: 0, color: "#22c55e" }}>Add Vehicle</h2>
            <p style={{ color: "#6b7280", margin: "8px 0 0" }}>Register a new vehicle</p>
          </div>
        </Link>
      </div>

      <div style={{ background: "#f9fafb", borderRadius: 12, padding: 32, marginBottom: 32 }}>
        <h2 style={{ fontSize: 22, marginTop: 0, marginBottom: 16 }}>What this project demonstrates</h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
          <div>
            <h3 style={{ fontSize: 15, color: "#3b82f6", marginBottom: 6 }}>Backend Engineering</h3>
            <p style={{ fontSize: 14, color: "#374151", lineHeight: 1.6, margin: 0 }}>
              RESTful API built with Node.js, Express, and TypeScript. Service layer architecture
              with domain logic (state machine transitions, time range conflict detection),
              Zod schema validation on every input, and centralized error handling.
            </p>
          </div>
          <div>
            <h3 style={{ fontSize: 15, color: "#22c55e", marginBottom: 6 }}>Frontend Engineering</h3>
            <p style={{ fontSize: 14, color: "#374151", lineHeight: 1.6, margin: 0 }}>
              React with TypeScript, React Router for navigation, and React Query for
              server state management with automatic cache invalidation. Typed API client
              with Axios. Controlled forms and optimistic UI patterns.
            </p>
          </div>
          <div>
            <h3 style={{ fontSize: 15, color: "#f59e0b", marginBottom: 6 }}>Database Design</h3>
            <p style={{ fontSize: 14, color: "#374151", lineHeight: 1.6, margin: 0 }}>
              MongoDB with Mongoose ODM. Compound indexes for query performance,
              typed document interfaces, and an interval overlap query for maintenance
              conflict detection: two ranges [a,b] and [c,d] overlap when a &lt; d AND b &gt; c.
            </p>
          </div>
          <div>
            <h3 style={{ fontSize: 15, color: "#8b5cf6", marginBottom: 6 }}>DevOps and Infrastructure</h3>
            <p style={{ fontSize: 14, color: "#374151", lineHeight: 1.6, margin: 0 }}>
              Dockerized backend, Kubernetes manifests with separate liveness and readiness
              probes (readiness checks the database connection state before accepting traffic),
              resource limits, and secrets management. Deployed on Google Cloud Run.
            </p>
          </div>
        </div>
      </div>

      <div style={{ background: "#f9fafb", borderRadius: 12, padding: 32, marginBottom: 32 }}>
        <h2 style={{ fontSize: 22, marginTop: 0, marginBottom: 16 }}>Tech stack</h2>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {[
            "TypeScript", "Node.js", "Express", "React", "React Query",
            "MongoDB", "Mongoose", "Zod", "Docker", "Kubernetes",
            "Google Cloud Run", "GitHub Actions", "Vite",
          ].map((tech) => (
            <span
              key={tech}
              style={{
                padding: "4px 14px", borderRadius: 16, fontSize: 13,
                background: "white", border: "1px solid #d1d5db", color: "#374151",
              }}
            >
              {tech}
            </span>
          ))}
        </div>
      </div>

      <div style={{ textAlign: "center", color: "#9ca3af", fontSize: 13, marginTop: 32 }}>
        <p>
          Built by Ahmed Taleb Bechir.
          {" "}
          <a
            href="https://github.com/talebbechir123/fleet-management-app"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#6b7280" }}
          >
            View source on GitHub
          </a>
        </p>
      </div>
    </div>
  );
}
