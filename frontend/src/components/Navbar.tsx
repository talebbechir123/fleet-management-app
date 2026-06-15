import { Link, useLocation } from "react-router-dom";

export function Navbar() {
  const { pathname } = useLocation();

  const links = [
    { to: "/", label: "Home" },
    { to: "/vehicles", label: "Fleet" },
    { to: "/add", label: "Add vehicle" },
  ];

  return (
    <nav className="nav">
      <div className="nav-inner">
        <Link to="/" className="nav-brand">Ahmed Taleb Bechir</Link>
        <div className="nav-links">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={`nav-link ${pathname === l.to ? "active" : ""}`}
            >
              {l.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
