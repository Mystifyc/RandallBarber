import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../../context/Authcontext";
import { obtenerCitas, type Cita } from "../../api/citasApi";
import { obtenerClientes, type Cliente } from "../../api/clientesApi";
import { obtenerServicios, type Servicio } from "../../api/serviciosApi";
import { obtenerBarberos, type Barbero } from "../../api/barberosApi";

type BarberSection = "inicio" | "citas" | "perfil";

function BarberPanel() {
  const { usuario } = useAuth();
  const [seccionActiva, setSeccionActiva] = useState<BarberSection>("inicio");
  const [citas, setCitas] = useState<Cita[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [barberos, setBarberos] = useState<Barbero[]>([]);
  const [cargandoDatos, setCargandoDatos] = useState(false);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setCargandoDatos(true);

        const [citasData, clientesData, serviciosData, barberosData] =
          await Promise.all([
            obtenerCitas(),
            obtenerClientes(),
            obtenerServicios(),
            obtenerBarberos(),
          ]);

        setCitas(citasData);
        setClientes(clientesData);
        setServicios(serviciosData);
        setBarberos(barberosData);
      } catch (error) {
        console.error("Error cargando datos del panel del barbero:", error);
      } finally {
        setCargandoDatos(false);
      }
    };

    cargarDatos();
  }, []);

  const barberoActual = useMemo(() => {
    if (!usuario) return null;
    return barberos.find((barbero) => barbero.id === usuario.id) || null;
  }, [barberos, usuario]);

  const citasDelBarbero = useMemo(() => {
    if (!barberoActual) return [];
    return citas.filter((cita) => cita.barbero.id === barberoActual.id);
  }, [citas, barberoActual]);

  const citasDeHoy = useMemo(() => {
    const hoy = new Date().toISOString().split("T")[0];
    return citasDelBarbero.filter((cita) => cita.dia === hoy);
  }, [citasDelBarbero]);

  const proximaCita = useMemo(() => {
    const ahora = new Date();

    return [...citasDelBarbero]
      .filter((cita) => {
        const fechaHoraCita = new Date(`${cita.dia}T${cita.hora}`);
        return fechaHoraCita >= ahora;
      })
      .sort((a, b) => {
        const fechaA = new Date(`${a.dia}T${a.hora}`).getTime();
        const fechaB = new Date(`${b.dia}T${b.hora}`).getTime();
        return fechaA - fechaB;
      })[0];
  }, [citasDelBarbero]);

  const obtenerNombreCliente = (id: number) => {
    return clientes.find((cliente) => cliente.id === id)?.nombre || `Cliente #${id}`;
  };

  const obtenerNombreServicio = (id: number) => {
    return servicios.find((servicio) => servicio.id === id)?.nombre || `Servicio #${id}`;
  };

  const formatearFecha = (fecha: string) => {
  return new Date(`${fecha}T00:00:00`).toLocaleDateString("es-CO", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

  const formatearHora = (hora: string) => {
    return hora.slice(0, 5);
  };

  const renderContenido = () => {
    if (seccionActiva === "citas") {
      return (
        <>
          <div className="panel-topbar">
            <div>
              <p className="panel-tag">Agenda</p>
              <h1>Mis citas</h1>
              <p className="panel-subtitle">
                Aquí puedes ver las reservas asignadas para hoy y los próximos días.
              </p>
            </div>

            <div className="panel-user-box">
              <span className="panel-user-role">BARBERO</span>
              <span className="panel-user-name">{usuario?.nombre}</span>
            </div>
          </div>

          <section className="panel-card">
            <div className="card-header">
              <div>
                <p className="mini-tag">Hoy</p>
                <h2>Citas del día</h2>
              </div>
            </div>

            <div className="appointments-table">
              {cargandoDatos ? (
                <p>Cargando citas...</p>
              ) : citasDelBarbero.length > 0 ? (
                citasDelBarbero.map((cita) => (
                  <div className="appointment-row" key={cita.id}>
                    <div>
                      <strong>{formatearFecha(cita.dia)} - {formatearHora(cita.hora)}</strong>
                      <p>{obtenerNombreServicio(cita.servicio.id)}</p>
                    </div>
                    <div>
                      <strong>Cliente</strong>
                      <p>{obtenerNombreCliente(cita.cliente.id)}</p>
                    </div>
                    <div>
                      <strong>Estado</strong>
                      <span className="status-badge confirmed">Agendada</span>
                    </div>
                  </div>
                ))
              ) : (
                <p>No tienes citas asignadas por ahora.</p>
              )}
            </div>
          </section>
        </>
      );
    }

    if (seccionActiva === "perfil") {
      return (
        <>
          <div className="panel-topbar">
            <div>
              <p className="panel-tag">Perfil</p>
              <h1>Mi perfil</h1>
              <p className="panel-subtitle">
                Revisa tu información general y tu estado dentro del sistema.
              </p>
            </div>

            <div className="panel-user-box">
              <span className="panel-user-role">BARBERO</span>
              <span className="panel-user-name">{usuario?.nombre}</span>
            </div>
          </div>

          <section className="panel-main-grid">
            <article className="panel-card side-card">
              <div className="profile-summary">
                <div className="profile-avatar">B</div>
                <h3>{usuario?.nombre}</h3>
                <p>Especialista en cortes modernos y perfilado</p>
              </div>

              <div className="info-list">
                <div className="info-item">
                  <span>Correo</span>
                  <strong>{usuario?.correo}</strong>
                </div>
                <div className="info-item">
                  <span>Estado</span>
                  <strong>Activo</strong>
                </div>
                <div className="info-item">
                  <span>Horario</span>
                  <strong>9:00 AM - 8:00 PM</strong>
                </div>
              </div>
            </article>

            <article className="panel-card large-card">
              <div className="card-header">
                <div>
                  <p className="mini-tag">Edición</p>
                  <h2>Editar perfil</h2>
                </div>
              </div>

              <div className="form-grid">
                <div className="field">
                  <label>Nombre</label>
                  <input type="text" defaultValue={usuario?.nombre} />
                </div>

                <div className="field">
                  <label>Correo</label>
                  <input type="email" defaultValue={usuario?.correo} />
                </div>

                <div className="field">
                  <label>Especialidad</label>
                  <input type="text" defaultValue="Cortes modernos y perfilado" />
                </div>
              </div>

              <div className="actions-row">
                <button className="action-btn">Guardar cambios</button>
              </div>
            </article>
          </section>
        </>
      );
    }

    return (
      <>
        <div className="panel-topbar">
          <div>
            <p className="panel-tag">Panel de trabajo</p>
            <h1>Bienvenido, {usuario?.nombre}</h1>
            <p className="panel-subtitle">
              Aquí puedes revisar tu jornada, tus citas y la disponibilidad del día.
            </p>
          </div>

          <div className="panel-user-box">
            <span className="panel-user-role">BARBERO</span>
            <span className="panel-user-name">{usuario?.nombre}</span>
          </div>
        </div>

        <section className="stats-grid">
          <article className="stat-card">
            <p className="stat-label">Citas hoy</p>
            <h3>{cargandoDatos ? "..." : citasDeHoy.length}</h3>
            <span className="stat-help">Turnos agendados para hoy</span>
          </article>

          <article className="stat-card">
            <p className="stat-label">Próxima cita</p>
            <h3>{proximaCita ? formatearHora(proximaCita.hora) : "--:--"}</h3>
            <span className="stat-help">
              Cliente: {proximaCita ? obtenerNombreCliente(proximaCita.cliente.id) : "Sin citas"}
            </span>
          </article>

          <article className="stat-card">
            <p className="stat-label">Disponibilidad</p>
            <h3>{barberoActual?.activo ? "Activa" : "Inactiva"}</h3>
            <span className="stat-help">Recibiendo reservas</span>
          </article>
        </section>

        <section className="panel-main-grid">
          <article className="panel-card large-card">
            <div className="card-header">
              <div>
                <p className="mini-tag">Agenda</p>
                <h2>Citas del día</h2>
              </div>
              <button className="ghost-btn" onClick={() => setSeccionActiva("citas")}>
                Ver agenda completa
              </button>
            </div>

            <div className="appointments-table">
              {cargandoDatos ? (
                <p>Cargando citas...</p>
              ) : citasDeHoy.length > 0 ? (
                citasDeHoy.map((cita) => (
                  <div className="appointment-row" key={cita.id}>
                    <div>
                      <strong>{formatearHora(cita.hora)}</strong>
                      <p>{obtenerNombreServicio(cita.servicio.id)}</p>
                    </div>
                    <div>
                      <strong>Cliente</strong>
                      <p>{obtenerNombreCliente(cita.cliente.id)}</p>
                    </div>
                    <div>
                      <strong>Estado</strong>
                      <span className="status-badge confirmed">Agendada</span>
                    </div>
                  </div>
                ))
              ) : (
                <p>No tienes citas para hoy.</p>
              )}
            </div>
          </article>

          <article className="panel-card side-card">
            <div className="card-header">
              <div>
                <p className="mini-tag">Perfil</p>
                <h2>Resumen rápido</h2>
              </div>
            </div>

            <div className="profile-summary">
              <div className="profile-avatar">B</div>
              <h3>{barberoActual?.nombre || usuario?.nombre}</h3>
              <p>{barberoActual?.especialidad || "Especialidad no disponible"}</p>
            </div>

            <div className="info-list">
              <div className="info-item">
                <span>Estado</span>
                <strong>Activo</strong>
              </div>
              <div className="info-item">
                <span>Horario</span>
                <strong>9:00 AM - 8:00 PM</strong>
              </div>
              <div className="info-item">
                <span>Total de citas</span>
                <strong>{citasDelBarbero.length}</strong>
              </div>
            </div>
          </article>
        </section>

        <section className="panel-bottom-grid">
          <article className="panel-card">
            <div className="card-header">
              <div>
                <p className="mini-tag">Próximas</p>
                <h2>Siguientes reservas</h2>
              </div>
            </div>
            <ul className="simple-list">
              {cargandoDatos ? (
                <li>Cargando próximas reservas...</li>
              ) : citasDelBarbero.length > 0 ? (
                [...citasDelBarbero]
                  .sort((a, b) => {
                    const fechaA = `${a.dia}T${a.hora}`;
                    const fechaB = `${b.dia}T${b.hora}`;
                    return fechaA.localeCompare(fechaB);
                  })
                  .slice(0, 3)
                  .map((cita) => (
                    <li key={cita.id}>
                      <strong>{cita.dia} - {formatearHora(cita.hora)}</strong>
                      <span>
                        {obtenerNombreServicio(cita.servicio.id)} - {obtenerNombreCliente(cita.cliente.id)}
                      </span>
                    </li>
                  ))
              ) : (
                <li>No hay próximas reservas.</li>
              )}
            </ul>
          </article>

          <article className="panel-card">
            <div className="card-header">
              <div>
                <p className="mini-tag">Acciones</p>
                <h2>Accesos rápidos</h2>
              </div>
            </div>

            <div className="quick-actions">
              <button className="action-btn" onClick={() => setSeccionActiva("citas")}>
                Ver citas
              </button>
              <button className="action-btn" onClick={() => setSeccionActiva("inicio")}>
                Actualizar disponibilidad
              </button>
              <button className="action-btn" onClick={() => setSeccionActiva("perfil")}>
                Editar perfil
              </button>
            </div>
          </article>
        </section>
      </>
    );
  };

  return (
    <div className="panel-page">
      <div className="panel-toolbar">
        <button
          className={seccionActiva === "inicio" ? "toolbar-btn active" : "toolbar-btn"}
          onClick={() => setSeccionActiva("inicio")}
        >
          Inicio
        </button>
        <button
          className={seccionActiva === "citas" ? "toolbar-btn active" : "toolbar-btn"}
          onClick={() => setSeccionActiva("citas")}
        >
          Citas
        </button>
        <button
          className={seccionActiva === "perfil" ? "toolbar-btn active" : "toolbar-btn"}
          onClick={() => setSeccionActiva("perfil")}
        >
          Perfil
        </button>
      </div>

      {renderContenido()}
    </div>
  );
}

export default BarberPanel;