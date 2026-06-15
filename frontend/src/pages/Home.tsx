import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { vehicleApi } from "../lib/api";

const CV_URL = "https://github.com/talebbechir123/fleet-management-app/public/Bechir_Devops_FullStack_eng.pdf";
const PHOTO_URL = "/fleet-management-app/profile.jpg";

export function Home() {
  const { data } = useQuery({
    queryKey: ["vehicles"],
    queryFn: () => vehicleApi.list(),
  });

  const total = data?.total ?? 0;
  const active = data?.items.filter((v) => v.status === "active").length ?? 0;
  const maintenance = data?.items.filter((v) => v.status === "maintenance").length ?? 0;
  const electric = data?.items.filter((v) => v.isElectric).length ?? 0;

  return (
    <div className="container">
      {/* ─── Hero: personal intro ─── */}
      <section className="hero">
        <img
          src={PHOTO_URL}
          alt="Ahmed Taleb Bechir"
          className="hero-photo"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Crect width='160' height='160' fill='%23e4e4e7'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='central' text-anchor='middle' fill='%2371717a' font-size='48' font-family='system-ui'%3EATB%3C/text%3E%3C/svg%3E";
          }}
        />
        <div className="hero-text">
          <h1 className="hero-name">Ahmed Taleb Bechir</h1>
          <p className="hero-role">Software Engineer · ENS Paris-Saclay</p>
          <p className="hero-bio">
            Systems engineer with experience in high-performance computing and
            network programming at Eviden. Building full stack products with
            TypeScript, Node.js, React, and MongoDB. Looking for early-stage
            product teams where engineering decisions shape the product.
          </p>
          <div className="hero-actions">
            <a href="mailto:talebbechir123@gmail.com">
              <button className="btn btn-primary btn-lg">Get in touch</button>
            </a>
            <a href={CV_URL} target="_blank" rel="noopener noreferrer">
              <button className="btn btn-secondary btn-lg">Download CV</button>
            </a>
            <a href="https://github.com/talebbechir123" target="_blank" rel="noopener noreferrer">
              <button className="btn btn-secondary btn-lg">GitHub</button>
            </a>
          </div>
        </div>
      </section>

      {/* ─── Live demo: fleet stats from the API ─── */}
      <section className="section">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 16 }}>
          <h2 className="section-title" style={{ marginBottom: 0 }}>Live fleet dashboard</h2>
          <Link to="/vehicles" style={{ fontSize: 14 }}>
            Open full dashboard →
          </Link>
        </div>
        <p style={{ color: "var(--text-secondary)", fontSize: 14, marginBottom: 16 }}>
          These numbers are pulled live from a Node.js API on Google Cloud Run,
          connected to MongoDB Atlas. Not mocked data.
        </p>
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-value">{total}</div>
            <div className="stat-label">Vehicles registered</div>
          </div>
          <div className="stat-card">
            <div className="stat-value" style={{ color: "var(--green)" }}>{active}</div>
            <div className="stat-label">Active</div>
          </div>
          <div className="stat-card">
            <div className="stat-value" style={{ color: "var(--amber)" }}>{maintenance}</div>
            <div className="stat-label">In maintenance</div>
          </div>
          <div className="stat-card">
            <div className="stat-value" style={{ color: "var(--accent)" }}>{electric}</div>
            <div className="stat-label">Electric</div>
          </div>
        </div>
      </section>

      {/* ─── Project showcase ─── */}
      <section className="section">
        <h2 className="section-title">What this project demonstrates</h2>
        <div className="showcase-grid">
          <div className="showcase-card">
            <div className="showcase-label" style={{ color: "var(--accent)" }}>Backend</div>
            <div className="showcase-title">Typed API with domain logic</div>
            <div className="showcase-desc">
              Node.js + Express + TypeScript. Service layer with state machine
              transitions and interval overlap queries for conflict detection.
              Zod validation on every input. Centralized error handling.
            </div>
          </div>
          <div className="showcase-card">
            <div className="showcase-label" style={{ color: "var(--green)" }}>Frontend</div>
            <div className="showcase-title">React with server state management</div>
            <div className="showcase-desc">
              React + TypeScript + React Query. Automatic cache invalidation
              on mutations. Typed API client with Axios. Client-side filtering
              and controlled forms.
            </div>
          </div>
          <div className="showcase-card">
            <div className="showcase-label" style={{ color: "var(--amber)" }}>Database</div>
            <div className="showcase-title">MongoDB with compound indexes</div>
            <div className="showcase-desc">
              Mongoose ODM with typed document interfaces. Compound indexes on
              (status, isElectric) and (vehicleId, scheduledStart, scheduledEnd).
              Overlap detection: a &lt; d AND b &gt; c.
            </div>
          </div>
          <div className="showcase-card">
            <div className="showcase-label" style={{ color: "var(--red)" }}>Infrastructure</div>
            <div className="showcase-title">Docker, K8S, Cloud Run, CI/CD</div>
            <div className="showcase-desc">
              Multi-stage Docker build. K8S manifests with liveness and readiness
              probes. Backend on Google Cloud Run. Frontend on GitHub Pages via
              GitHub Actions.
            </div>
          </div>
        </div>
      </section>

      {/* ─── Tech stack ─── */}
      <section className="section">
        <h2 className="section-title">Tech stack</h2>
        <div className="tags">
          {[
            "TypeScript", "Node.js", "Express", "React", "React Query",
            "MongoDB", "Mongoose", "Zod", "Docker", "Kubernetes",
            "Google Cloud Run", "GitHub Actions", "Vite",
          ].map((t) => (
            <span key={t} className="tag">{t}</span>
          ))}
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="footer">
        <p>
          Ahmed Taleb Bechir · {" "}
          <a href="mailto:talebbechir123@gmail.com">talebbechir123@gmail.com</a> · {" "}
          <a href="https://github.com/talebbechir123/fleet-management-app" target="_blank" rel="noopener noreferrer">
            Source on GitHub
          </a>
        </p>
      </footer>
    </div>
  );
}
