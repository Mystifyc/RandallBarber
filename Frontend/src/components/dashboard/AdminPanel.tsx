import type { FormEvent } from "react";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../../context/Authcontext";
import {
  obtenerCitas,
  obtenerHorasDisponibles,
  crearCita,
  actualizarCita,
  eliminarCita,
  type Cita,
} from "../../api/citasApi";
import { obtenerBarberos, type Barbero } from "../../api/barberosApi";
import { obtenerServicios, type Servicio } from "../../api/serviciosApi";
import { obtenerClientes, type Cliente } from "../../api/clientesApi";

type AdminSection =
  | "inicio"
  | "citas"
  | "perfil"
  | "servicios"
  | "barberos"
  | "clientes";

function AdminPanel() {
  const { usuario } = useAuth();
  const [seccionActiva, setSeccionActiva] = useState<AdminSection>("inicio");

  const [citas, setCitas] = useState<Cita[]>([]);
  const [cargandoCitas, setCargandoCitas] = useState(false);
  const [barberos, setBarberos] = useState<Barbero[]>([]);
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);

  const [clienteId, setClienteId] = useState("");
  const [barberoId, setBarberoId] = useState("");
  const [servicioId, setServicioId] = useState("");
  const [fechaCita, setFechaCita] = useState("");
  const [horaCita, setHoraCita] = useState("");
  const [horasDisponibles, setHorasDisponibles] = useState<string[]>([]);
  const [guardandoCita, setGuardandoCita] = useState(false);

  const [mensajeExito, setMensajeExito] = useState("");
  const [mensajeError, setMensajeError] = useState("");

  const [citaEditandoId, setCitaEditandoId] = useState<number | null>(null);

  const cargarDatos = async () => {
    try {
      setCargandoCitas(true);

      const [citasData, barberosData, serviciosData, clientesData] =
        await Promise.all([
          obtenerCitas(),
          obtenerBarberos(),
          obtenerServicios(),
          obtenerClientes(),
        ]);

      setCitas(citasData);
      setBarberos(barberosData);
      setServicios(serviciosData);
      setClientes(clientesData);
    } catch (error) {
      console.error("Error cargando datos del panel:", error);
      setMensajeError("No se pudieron cargar los datos del panel.");
    } finally {
      setCargandoCitas(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const citasHoy = useMemo(() => {
    const hoy = new Date().toISOString().split("T")[0];
    return citas.filter((cita) => cita.dia === hoy);
  }, [citas]);

  const barberosActivos = useMemo(() => {
    return barberos.filter((barbero) => barbero.activo);
  }, [barberos]);

  const obtenerNombreBarbero = (id: number) => {
    return (
      barberos.find((barbero) => barbero.id === id)?.nombre || `Barbero #${id}`
    );
  };

  const obtenerNombreCliente = (id: number) => {
    return (
      clientes.find((cliente) => cliente.id === id)?.nombre || `Cliente #${id}`
    );
  };

  const obtenerNombreServicio = (id: number) => {
    return (
      servicios.find((servicio) => servicio.id === id)?.nombre ||
      `Servicio #${id}`
    );
  };

  const limpiarFormularioCita = () => {
    setCitaEditandoId(null);
    setClienteId("");
    setBarberoId("");
    setServicioId("");
    setFechaCita("");
    setHoraCita("");
    setHorasDisponibles([]);
  };

  const cargarHorasDisponibles = async (
    nuevoBarberoId: string,
    nuevaFecha: string
  ) => {
    setMensajeError("");
    setMensajeExito("");

    if (!nuevoBarberoId || !nuevaFecha) {
      setHorasDisponibles([]);
      setHoraCita("");
      return;
    }

    try {
      const horas = await obtenerHorasDisponibles(
        Number(nuevoBarberoId),
        nuevaFecha
      );
      setHorasDisponibles(horas);
      setHoraCita("");
    } catch (error) {
      console.error("Error cargando horas disponibles:", error);
      setHorasDisponibles([]);
      setMensajeError("No se pudieron cargar las horas disponibles.");
    }
  };

  const manejarGuardarCita = async (e: FormEvent) => {
    e.preventDefault();

    setMensajeError("");
    setMensajeExito("");

    if (!clienteId || !barberoId || !servicioId || !fechaCita || !horaCita) {
      setMensajeError("Debes completar todos los campos de la cita.");
      return;
    }

    try {
      setGuardandoCita(true);

      const payload = {
        dia: fechaCita,
        hora: horaCita.length === 5 ? `${horaCita}:00` : horaCita,
        cliente: { id: Number(clienteId) },
        barbero: { id: Number(barberoId) },
        servicio: { id: Number(servicioId) },
      };

      if (citaEditandoId) {
        await actualizarCita(citaEditandoId, payload);
        setMensajeExito("Cita actualizada correctamente.");
      } else {
        await crearCita(payload);
        setMensajeExito("Cita creada correctamente.");
      }

      limpiarFormularioCita();
      await cargarDatos();
    } catch (error: any) {
      console.error("Error guardando cita:", error);

      const data = error?.response?.data;
      const mensaje =
        typeof data === "string"
          ? data
          : data?.message
          ? data.message
          : "No se pudo guardar la cita.";

      setMensajeError(mensaje);
    } finally {
      setGuardandoCita(false);
    }
  };

  const manejarEditarCita = async (cita: Cita) => {
    setMensajeError("");
    setMensajeExito("");

    setCitaEditandoId(cita.id);
    setClienteId(String(cita.cliente.id));
    setBarberoId(String(cita.barbero.id));
    setServicioId(String(cita.servicio.id));
    setFechaCita(cita.dia);
    setHoraCita(cita.hora.length >= 5 ? cita.hora.slice(0, 5) : cita.hora);

    await cargarHorasDisponibles(String(cita.barbero.id), cita.dia);
  };

  const manejarEliminarCita = async (id: number) => {
    const confirmado = window.confirm(
      "¿Seguro que quieres eliminar esta cita?"
    );
    if (!confirmado) return;

    try {
      setMensajeError("");
      setMensajeExito("");

      await eliminarCita(id);

      if (citaEditandoId === id) {
        limpiarFormularioCita();
      }

      setMensajeExito("Cita eliminada correctamente.");
      await cargarDatos();
    } catch (error) {
      console.error("Error eliminando cita:", error);
      setMensajeError("No se pudo eliminar la cita.");
    }
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
              <p className="panel-tag">Citas</p>
              <h1>Gestión de citas</h1>
              <p className="panel-subtitle">
                Aquí podrás revisar, crear, editar y eliminar las reservas del
                sistema.
              </p>
            </div>

            <div className="panel-user-box">
              <span className="panel-user-role">ADMIN</span>
              <span className="panel-user-name">{usuario?.nombre}</span>
            </div>
          </div>

          <section className="panel-card">
            <div className="card-header card-header-stack">
              <div>
                <p className="mini-tag">Reservas</p>
                <h2>Citas registradas</h2>
              </div>
            </div>

            <form className="appointment-form" onSubmit={manejarGuardarCita}>
              <div className="appointment-form-header">
                <div>
                  <p className="mini-tag">Nueva reserva</p>
                  <h3>{citaEditandoId ? "Editar cita" : "Crear cita"}</h3>
                </div>
                <p className="appointment-form-text">
                  Selecciona cliente, barbero, servicio, fecha y una hora
                  disponible.
                </p>
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label>Cliente</label>
                  <select
                    value={clienteId}
                    onChange={(e) => setClienteId(e.target.value)}
                    required
                  >
                    <option value="">Selecciona un cliente</option>
                    {clientes.map((cliente) => (
                      <option key={cliente.id} value={cliente.id}>
                        {cliente.nombre}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Barbero</label>
                  <select
                    value={barberoId}
                    onChange={async (e) => {
                      const value = e.target.value;
                      setBarberoId(value);
                      await cargarHorasDisponibles(value, fechaCita);
                    }}
                    required
                  >
                    <option value="">Selecciona un barbero</option>
                    {barberosActivos.map((barbero) => (
                      <option key={barbero.id} value={barbero.id}>
                        {barbero.nombre}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Servicio</label>
                  <select
                    value={servicioId}
                    onChange={(e) => setServicioId(e.target.value)}
                    required
                  >
                    <option value="">Selecciona un servicio</option>
                    {servicios.map((servicio) => (
                      <option key={servicio.id} value={servicio.id}>
                        {servicio.nombre}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Fecha</label>
                  <input
                    type="date"
                    value={fechaCita}
                    min={new Date().toISOString().split("T")[0]}
                    onChange={async (e) => {
                      const value = e.target.value;
                      setFechaCita(value);
                      await cargarHorasDisponibles(barberoId, value);
                    }}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Hora disponible</label>
                  <select
                    value={horaCita}
                    onChange={(e) => setHoraCita(e.target.value)}
                    required
                    disabled={
                      !barberoId || !fechaCita || horasDisponibles.length === 0
                    }
                  >
                    <option value="">Selecciona una hora</option>
                    {horasDisponibles.map((hora) => (
                      <option key={hora} value={hora}>
                        {hora}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group form-action">
                  <label>&nbsp;</label>
                  <button type="submit" disabled={guardandoCita}>
                    {guardandoCita
                      ? "Guardando..."
                      : citaEditandoId
                      ? "Actualizar cita"
                      : "Crear cita"}
                  </button>

                  {citaEditandoId && (
                    <button
                      type="button"
                      className="cancel-edit-btn"
                      onClick={() => {
                        limpiarFormularioCita();
                        setMensajeError("");
                        setMensajeExito("");
                      }}
                    >
                      Cancelar edición
                    </button>
                  )}
                </div>
              </div>

              {!barberoId || !fechaCita ? (
                <p className="form-helper">
                  Selecciona un barbero y una fecha para consultar horarios
                  disponibles.
                </p>
              ) : horasDisponibles.length === 0 ? (
                <p className="form-helper form-helper-warning">
                  No hay horas disponibles para ese barbero en esa fecha.
                </p>
              ) : null}

              {mensajeExito && (
                <p className="form-message form-message-success">
                  {mensajeExito}
                </p>
              )}
              {mensajeError && (
                <p className="form-message form-message-error">
                  {mensajeError}
                </p>
              )}
            </form>

            <div className="appointments-table">
              {cargandoCitas ? (
                <p>Cargando citas...</p>
              ) : citas.length > 0 ? (
                citas.map((cita) => (
                  <div className="appointment-row" key={cita.id}>
                    <div>
                      <strong>
                        {formatearFecha(cita.dia)} - {formatearHora(cita.hora)}
                      </strong>
                      <p>{obtenerNombreServicio(cita.servicio.id)}</p>
                    </div>

                    <div>
                      <strong>Cliente</strong>
                      <p>{obtenerNombreCliente(cita.cliente.id)}</p>
                    </div>

                    <div>
                      <strong>Barbero</strong>
                      <span className="status-badge confirmed">
                        {obtenerNombreBarbero(cita.barbero.id)}
                      </span>
                    </div>

                    <div className="appointment-actions">
                      <button
                        type="button"
                        className="table-action-btn edit"
                        onClick={() => manejarEditarCita(cita)}
                      >
                        Editar
                      </button>

                      <button
                        type="button"
                        className="table-action-btn delete"
                        onClick={() => manejarEliminarCita(cita.id)}
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-panel-state">
                  <h3>No hay citas registradas</h3>
                  <p>Cuando empieces a crear reservas, aparecerán aquí.</p>
                </div>
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
                Aquí puedes visualizar y editar la información básica del
                administrador.
              </p>
            </div>

            <div className="panel-user-box">
              <span className="panel-user-role">ADMIN</span>
              <span className="panel-user-name">{usuario?.nombre}</span>
            </div>
          </div>

          <section className="panel-main-grid">
            <article className="panel-card side-card">
              <div className="profile-summary">
                <div className="profile-avatar">A</div>
                <h3>{usuario?.nombre}</h3>
                <p>Administrador general del sistema RandallBarber</p>
              </div>

              <div className="info-list">
                <div className="info-item">
                  <span>Correo</span>
                  <strong>{usuario?.correo}</strong>
                </div>
                <div className="info-item">
                  <span>Rol</span>
                  <strong>Administrador</strong>
                </div>
                <div className="info-item">
                  <span>Estado</span>
                  <strong>Activo</strong>
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
                  <label>Cargo</label>
                  <input type="text" defaultValue="Administrador general" />
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

    if (seccionActiva === "servicios") {
      return (
        <>
          <div className="panel-topbar">
            <div>
              <p className="panel-tag">Servicios</p>
              <h1>Gestión de servicios</h1>
              <p className="panel-subtitle">
                Aquí podrás crear, editar y organizar los servicios de la
                barbería.
              </p>
            </div>

            <div className="panel-user-box">
              <span className="panel-user-role">ADMIN</span>
              <span className="panel-user-name">{usuario?.nombre}</span>
            </div>
          </div>

          <section className="panel-card">
            <div className="card-header">
              <div>
                <p className="mini-tag">Listado</p>
                <h2>Servicios disponibles</h2>
              </div>
            </div>

            <ul className="simple-list">
              {servicios.length > 0 ? (
                servicios.map((servicio) => (
                  <li key={servicio.id}>
                    <strong>{servicio.nombre}</strong>
                    <span>
                      Duración: {servicio.duracion} min · Precio: $
                      {servicio.precio.toLocaleString("es-CO")}
                    </span>
                  </li>
                ))
              ) : (
                <li className="empty-list-item">No hay servicios registrados todavía.</li>
              )}
            </ul>
          </section>
        </>
      );
    }

    if (seccionActiva === "barberos") {
      return (
        <>
          <div className="panel-topbar">
            <div>
              <p className="panel-tag">Barberos</p>
              <h1>Gestión de barberos</h1>
              <p className="panel-subtitle">
                Administra el equipo de trabajo y su estado dentro del sistema.
              </p>
            </div>

            <div className="panel-user-box">
              <span className="panel-user-role">ADMIN</span>
              <span className="panel-user-name">{usuario?.nombre}</span>
            </div>
          </div>

          <section className="panel-card">
            <div className="card-header">
              <div>
                <p className="mini-tag">Equipo</p>
                <h2>Barberos registrados</h2>
              </div>
            </div>

            <ul className="simple-list">
              {barberos.length > 0 ? (
                barberos.map((barbero) => (
                  <li key={barbero.id}>
                    <strong>{barbero.nombre}</strong>
                    <span>
                      Especialidad: {barbero.especialidad} · Estado:{" "}
                      {barbero.activo ? "Activo" : "Inactivo"}
                    </span>
                  </li>
                ))
              ) : (
                <li className="empty-list-item">No hay barberos registrados todavía.</li>
              )}
            </ul>
          </section>
        </>
      );
    }

    if (seccionActiva === "clientes") {
      return (
        <>
          <div className="panel-topbar">
            <div>
              <p className="panel-tag">Clientes</p>
              <h1>Gestión de clientes</h1>
              <p className="panel-subtitle">
                Consulta y administra la información de los clientes
                registrados.
              </p>
            </div>

            <div className="panel-user-box">
              <span className="panel-user-role">ADMIN</span>
              <span className="panel-user-name">{usuario?.nombre}</span>
            </div>
          </div>

          <section className="panel-card">
            <div className="card-header">
              <div>
                <p className="mini-tag">Clientes</p>
                <h2>Listado general</h2>
              </div>
            </div>

            <ul className="simple-list">
              {clientes.length > 0 ? (
                clientes.map((cliente) => (
                  <li key={cliente.id}>
                    <strong>{cliente.nombre}</strong>
                    <span>
                      {cliente.correo} · {cliente.telefono}
                    </span>
                  </li>
                ))
              ) : (
                <li className="empty-list-item">No hay clientes registrados todavía.</li>
              )}
            </ul>
          </section>
        </>
      );
    }

    return (
      <>
        <div className="panel-topbar">
          <div>
            <p className="panel-tag">Administración</p>
            <h1>Bienvenido, {usuario?.nombre}</h1>
            <p className="panel-subtitle">
              Gestiona barberos, clientes, servicios y citas desde un solo
              lugar.
            </p>
          </div>

          <div className="panel-user-box">
            <span className="panel-user-role">ADMIN</span>
            <span className="panel-user-name">{usuario?.nombre}</span>
          </div>
        </div>

        <section className="stats-grid">
          <article className="stat-card">
            <p className="stat-label">Clientes</p>
            <h3>{clientes.length}</h3>
            <span className="stat-help">Registrados en la barbería</span>
          </article>

          <article className="stat-card">
            <p className="stat-label">Barberos</p>
            <h3>{barberosActivos.length}</h3>
            <span className="stat-help">Activos actualmente</span>
          </article>

          <article className="stat-card">
            <p className="stat-label">Citas hoy</p>
            <h3>{citasHoy.length}</h3>
            <span className="stat-help">Reservas del día</span>
          </article>
        </section>

        <section className="panel-main-grid">
          <article className="panel-card large-card">
            <div className="card-header">
              <div>
                <p className="mini-tag">Gestión</p>
                <h2>Resumen administrativo</h2>
              </div>
            </div>

            <p className="panel-subtitle">
              Desde aquí puedes revisar el comportamiento general del sistema y
              acceder rápidamente a cada módulo.
            </p>

            <div className="quick-actions">
              <button
                className="action-btn"
                onClick={() => setSeccionActiva("servicios")}
              >
                Gestionar servicios
              </button>
              <button
                className="action-btn"
                onClick={() => setSeccionActiva("barberos")}
              >
                Gestionar barberos
              </button>
              <button
                className="action-btn"
                onClick={() => setSeccionActiva("clientes")}
              >
                Gestionar clientes
              </button>
              <button
                className="action-btn"
                onClick={() => setSeccionActiva("citas")}
              >
                Gestionar citas
              </button>
            </div>
          </article>

          <article className="panel-card side-card">
            <div className="card-header">
              <div>
                <p className="mini-tag">Estado</p>
                <h2>Resumen rápido</h2>
              </div>
            </div>

            <div className="info-list">
              <div className="info-item">
                <span>Sistema</span>
                <strong>Operativo</strong>
              </div>
              <div className="info-item">
                <span>Reservas activas</span>
                <strong>{citas.length}</strong>
              </div>
              <div className="info-item">
                <span>Última actualización</span>
                <strong>Hoy</strong>
              </div>
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
          className={
            seccionActiva === "inicio" ? "toolbar-btn active" : "toolbar-btn"
          }
          onClick={() => setSeccionActiva("inicio")}
        >
          Inicio
        </button>
        <button
          className={
            seccionActiva === "citas" ? "toolbar-btn active" : "toolbar-btn"
          }
          onClick={() => setSeccionActiva("citas")}
        >
          Citas
        </button>
        <button
          className={
            seccionActiva === "perfil" ? "toolbar-btn active" : "toolbar-btn"
          }
          onClick={() => setSeccionActiva("perfil")}
        >
          Perfil
        </button>
        <button
          className={
            seccionActiva === "servicios" ? "toolbar-btn active" : "toolbar-btn"
          }
          onClick={() => setSeccionActiva("servicios")}
        >
          Servicios
        </button>
        <button
          className={
            seccionActiva === "barberos" ? "toolbar-btn active" : "toolbar-btn"
          }
          onClick={() => setSeccionActiva("barberos")}
        >
          Barberos
        </button>
        <button
          className={
            seccionActiva === "clientes" ? "toolbar-btn active" : "toolbar-btn"
          }
          onClick={() => setSeccionActiva("clientes")}
        >
          Clientes
        </button>
      </div>

      {renderContenido()}
    </div>
  );
}

export default AdminPanel;