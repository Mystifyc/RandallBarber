/*import { useAuth } from "../../context/Authcontext";
import BarberPanel from "./BarberPanel";
import AdminPanel from "./AdminPanel";
import "./DashboardLayout.css";

function DashboardLayout() {
  const { usuario, logout } = useAuth();

  return (
    <div className="dashboard-shell">
      <aside className="dashboard-sidebar">
        <div className="sidebar-brand">
          <h2>RandallBarber</h2>
          <p>{usuario?.rol}</p>
        </div>

        <nav className="dashboard-menu">
          <button className="menu-item active">Inicio</button>
          <button className="menu-item">Citas</button>
          <button className="menu-item">Perfil</button>

          {usuario?.rol === "ADMIN" && (
            <>
              <button className="menu-item">Servicios</button>
              <button className="menu-item">Barberos</button>
              <button className="menu-item">Clientes</button>
            </>
          )}
        </nav>

        <button className="logout-btn" onClick={logout}>
          Cerrar sesión
        </button>
      </aside>

      <main className="dashboard-content">
        {usuario?.rol === "BARBERO" && <BarberPanel />}
        {usuario?.rol === "ADMIN" && <AdminPanel />}
      </main>
    </div>
  );
}

export default DashboardLayout;*/

import { useState } from "react";
import { useAuth } from "../../context/Authcontext";
import BarberPanel from "./BarberPanel";
import AdminPanel from "./AdminPanel";
import "./DashboardLayout.css";

type DashboardSection = "inicio" | "citas" | "perfil" | "servicios" | "barberos" | "clientes";

function DashboardLayout() {
  const { usuario, logout } = useAuth();
  const [seccionActiva, setSeccionActiva] = useState<DashboardSection>("inicio");

  return (
    <div className="dashboard-shell">
      <aside className="dashboard-sidebar">
        <div className="sidebar-brand">
          <h2>RandallBarber</h2>
          <p>{usuario?.rol}</p>
        </div>

        <nav className="dashboard-menu">
          <button
            className={seccionActiva === "inicio" ? "menu-item active" : "menu-item"}
            onClick={() => setSeccionActiva("inicio")}
          >
            Inicio
          </button>

          <button
            className={seccionActiva === "citas" ? "menu-item active" : "menu-item"}
            onClick={() => setSeccionActiva("citas")}
          >
            Citas
          </button>

          <button
            className={seccionActiva === "perfil" ? "menu-item active" : "menu-item"}
            onClick={() => setSeccionActiva("perfil")}
          >
            Perfil
          </button>

          {usuario?.rol === "ADMIN" && (
            <>
              <button
                className={seccionActiva === "servicios" ? "menu-item active" : "menu-item"}
                onClick={() => setSeccionActiva("servicios")}
              >
                Servicios
              </button>

              <button
                className={seccionActiva === "barberos" ? "menu-item active" : "menu-item"}
                onClick={() => setSeccionActiva("barberos")}
              >
                Barberos
              </button>

              <button
                className={seccionActiva === "clientes" ? "menu-item active" : "menu-item"}
                onClick={() => setSeccionActiva("clientes")}
              >
                Clientes
              </button>
            </>
          )}
        </nav>

        <button className="logout-btn" onClick={logout}>
          Cerrar sesión
        </button>
      </aside>

      <main className="dashboard-content">
        {usuario?.rol === "BARBERO" && <BarberPanel />}

        {usuario?.rol === "ADMIN" && <AdminPanel />}
      </main>
    </div>
  );
}

export default DashboardLayout;