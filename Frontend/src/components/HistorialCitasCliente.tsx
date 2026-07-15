import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import {
  actualizarCita,
  eliminarCita,
  obtenerCitas,
  obtenerHistorialCitasCliente,
  obtenerHorasDisponibles,
  type Cita,
  type HistorialCitaCliente,
} from "../api/citasApi";
import { obtenerBarberos, type Barbero } from "../api/barberosApi";
import { obtenerServicios, type Servicio } from "../api/serviciosApi";
import { useAuth } from "../context/Authcontext";

type EstadoFiltro = "TODAS" | "PENDIENTE" | "COMPLETADA" | "CANCELADA";

function HistorialCitasCliente() {
  const { usuario } = useAuth();

  const [historial, setHistorial] = useState<HistorialCitaCliente[]>([]);
  const [citasActivas, setCitasActivas] = useState<Cita[]>([]);
  const [barberos, setBarberos] = useState<Barbero[]>([]);
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [horasDisponibles, setHorasDisponibles] = useState<string[]>([]);

  const [estadoFiltro, setEstadoFiltro] = useState<EstadoFiltro>("TODAS");
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [mensajeError, setMensajeError] = useState("");
  const [mensajeExito, setMensajeExito] = useState("");

  const [citaEditando, setCitaEditando] = useState<Cita | null>(null);
  const [editServicioId, setEditServicioId] = useState("");
  const [editBarberoId, setEditBarberoId] = useState("");
  const [editFecha, setEditFecha] = useState("");
  const [editHora, setEditHora] = useState("");

  const cargarDatos = async () => {
    if (!usuario || usuario.rol !== "CLIENTE") {
      setCargando(false);
      return;
    }

    try {
      setCargando(true);
      setMensajeError("");

      const [historialData, citasData, barberosData, serviciosData] =
        await Promise.all([
          obtenerHistorialCitasCliente(usuario.id),
          obtenerCitas(),
          obtenerBarberos(),
          obtenerServicios(),
        ]);

      const citasDelCliente = citasData.filter(
        (cita) =>
          cita.cliente.id === usuario.id &&
          (!cita.estado || cita.estado === "ACTIVA")
      );

      setHistorial(historialData);
      setCitasActivas(citasDelCliente);
      setBarberos(barberosData.filter((barbero) => barbero.activo));
      setServicios(serviciosData);
    } catch (error) {
      console.error("Error cargando historial de citas:", error);
      setMensajeError("No se pudo cargar el historial de citas.");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, [usuario]);

  const obtenerEstadoVisual = (cita: HistorialCitaCliente): EstadoFiltro => {
    if (cita.estado === "CANCELADA") {
      return "CANCELADA";
    }

    const fechaHoraCita = new Date(`${cita.dia}T${cita.hora}`);
    const ahora = new Date();

    if (fechaHoraCita < ahora) {
      return "COMPLETADA";
    }

    return "PENDIENTE";
  };

  const historialFiltrado = useMemo(() => {
    if (estadoFiltro === "TODAS") {
      return historial;
    }

    return historial.filter((cita) => obtenerEstadoVisual(cita) === estadoFiltro);
  }, [historial, estadoFiltro]);

  const formatearFecha = (fecha: string) => {
    const partes = fecha.split("-");

    if (partes.length !== 3) {
      return fecha;
    }

    return `${partes[2]}/${partes[1]}/${partes[0]}`;
  };

  const formatearHora = (hora: string) => {
    return hora.slice(0, 5);
  };

  const obtenerClaseEstado = (estado: EstadoFiltro) => {
    if (estado === "CANCELADA") return "cancelled";
    if (estado === "COMPLETADA") return "completed";
    return "active";
  };

  const buscarCitaActiva = (citaId: number) => {
    return citasActivas.find((cita) => cita.id === citaId) || null;
  };

  const cargarHoras = async (
    barberoId: string,
    fecha: string,
    horaActual?: string
  ) => {
    if (!barberoId || !fecha) {
      setHorasDisponibles([]);
      return;
    }

    try {
      const horas = await obtenerHorasDisponibles(Number(barberoId), fecha);

      if (horaActual && !horas.includes(horaActual)) {
        setHorasDisponibles([horaActual, ...horas]);
      } else {
        setHorasDisponibles(horas);
      }
    } catch (error) {
      console.error("Error cargando horas disponibles:", error);
      setHorasDisponibles([]);
      setMensajeError("No se pudieron cargar las horas disponibles.");
    }
  };

  const confirmarCita = () => {
    setMensajeError("");
    setMensajeExito("Tu cita ya se encuentra confirmada.");
  };

  const iniciarEdicion = async (cita: Cita) => {
    setMensajeError("");
    setMensajeExito("");

    setCitaEditando(cita);
    setEditServicioId(String(cita.servicio.id));
    setEditBarberoId(String(cita.barbero.id));
    setEditFecha(cita.dia);
    setEditHora(cita.hora);

    await cargarHoras(String(cita.barbero.id), cita.dia, cita.hora);
  };

  const cancelarEdicion = () => {
    setCitaEditando(null);
    setEditServicioId("");
    setEditBarberoId("");
    setEditFecha("");
    setEditHora("");
    setHorasDisponibles([]);
  };

  const manejarActualizar = async (e: FormEvent) => {
    e.preventDefault();

    if (!usuario || !citaEditando) return;

    if (!editServicioId || !editBarberoId || !editFecha || !editHora) {
      setMensajeError("Completa todos los campos para actualizar la cita.");
      return;
    }

    try {
      setGuardando(true);
      setMensajeError("");
      setMensajeExito("");

      await actualizarCita(citaEditando.id, {
        dia: editFecha,
        hora: editHora.length === 5 ? `${editHora}:00` : editHora,
        cliente: { id: usuario.id },
        barbero: { id: Number(editBarberoId) },
        servicio: { id: Number(editServicioId) },
      });

      setMensajeExito("Tu cita fue modificada correctamente.");
      cancelarEdicion();
      await cargarDatos();

      window.dispatchEvent(new Event("randallbarber:notificaciones-actualizadas"));
    } catch (error: any) {
      console.error("Error actualizando cita:", error);

      const data = error?.response?.data;
      const mensaje =
        typeof data === "string"
          ? data
          : data?.message
          ? data.message
          : "No se pudo actualizar la cita.";

      setMensajeError(mensaje);
    } finally {
      setGuardando(false);
    }
  };

  const manejarCancelarCita = async (citaId: number) => {
    const confirmar = window.confirm("¿Seguro que deseas cancelar esta cita?");

    if (!confirmar) return;

    try {
      setGuardando(true);
      setMensajeError("");
      setMensajeExito("");

      await eliminarCita(citaId);

      setMensajeExito("Tu cita fue cancelada correctamente.");
      cancelarEdicion();
      await cargarDatos();

      window.dispatchEvent(new Event("randallbarber:notificaciones-actualizadas"));
    } catch (error) {
      console.error("Error cancelando cita:", error);
      setMensajeError("No se pudo cancelar la cita.");
    } finally {
      setGuardando(false);
    }
  };

  if (!usuario || usuario.rol !== "CLIENTE") {
    return null;
  }

  if (cargando) {
    return (
      <div className="historial-card">
        <p>Cargando historial de citas...</p>
      </div>
    );
  }

  if (historial.length === 0) {
    return (
      <div className="historial-card historial-empty">
        <h3>Aún no tienes citas registradas</h3>
        <p>
          Cuando reserves un servicio en RandallBarber, aparecerá aquí tu historial.
        </p>
      </div>
    );
  }

  return (
    <div className="historial-card">
      {mensajeError && <p className="historial-error">{mensajeError}</p>}
      {mensajeExito && <p className="historial-success">{mensajeExito}</p>}

      <div className="historial-filter-bar">
        <div>
          <h3>Mi historial de citas</h3>
          <p>Filtra tus citas por estado o gestiona tus citas pendientes.</p>
        </div>

        <div className="historial-filter-actions">
          <select
            value={estadoFiltro}
            onChange={(e) => setEstadoFiltro(e.target.value as EstadoFiltro)}
          >
            <option value="TODAS">Todas</option>
            <option value="PENDIENTE">Pendientes</option>
            <option value="COMPLETADA">Completadas</option>
            <option value="CANCELADA">Canceladas</option>
          </select>

          <button type="button" onClick={() => setEstadoFiltro("TODAS")}>
            Limpiar filtro
          </button>
        </div>
      </div>

      {citaEditando && (
        <form className="historial-edit-form" onSubmit={manejarActualizar}>
          <h3>Modificar cita</h3>

          <div className="historial-edit-grid">
            <div>
              <label>Servicio</label>
              <select
                value={editServicioId}
                onChange={(e) => setEditServicioId(e.target.value)}
              >
                <option value="">Selecciona un servicio</option>
                {servicios.map((servicio) => (
                  <option key={servicio.id} value={servicio.id}>
                    {servicio.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label>Barbero</label>
              <select
                value={editBarberoId}
                onChange={async (e) => {
                  const value = e.target.value;
                  setEditBarberoId(value);
                  setEditHora("");
                  await cargarHoras(value, editFecha);
                }}
              >
                <option value="">Selecciona un barbero</option>
                {barberos.map((barbero) => (
                  <option key={barbero.id} value={barbero.id}>
                    {barbero.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label>Fecha</label>
              <input
                type="date"
                value={editFecha}
                min={new Date().toISOString().split("T")[0]}
                onChange={async (e) => {
                  const value = e.target.value;
                  setEditFecha(value);
                  setEditHora("");
                  await cargarHoras(editBarberoId, value);
                }}
              />
            </div>

            <div>
              <label>Hora</label>
              <select
                value={editHora}
                onChange={(e) => setEditHora(e.target.value)}
              >
                <option value="">Selecciona una hora</option>
                {horasDisponibles.map((hora) => (
                  <option key={hora} value={hora}>
                    {hora.slice(0, 5)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="historial-edit-actions">
            <button type="submit" disabled={guardando}>
              {guardando ? "Guardando..." : "Guardar cambios"}
            </button>

            <button type="button" onClick={cancelarEdicion}>
              Cancelar edición
            </button>
          </div>
        </form>
      )}

      {historialFiltrado.length === 0 ? (
        <div className="historial-empty">
          <h3>No hay resultados</h3>
          <p>No tienes citas con el estado seleccionado.</p>
        </div>
      ) : (
        <div className="historial-table-wrapper">
          <table className="historial-table">
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Hora</th>
                <th>Servicio</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>

            <tbody>
              {historialFiltrado.map((cita) => {
                const estadoVisual = obtenerEstadoVisual(cita);
                const citaActiva = buscarCitaActiva(cita.id);

                return (
                  <tr key={cita.id}>
                    <td>{formatearFecha(cita.dia)}</td>
                    <td>{formatearHora(cita.hora)}</td>
                    <td>{cita.servicio}</td>
                    <td>
                      <span
                        className={`historial-status ${obtenerClaseEstado(
                          estadoVisual
                        )}`}
                      >
                        {estadoVisual}
                      </span>
                    </td>

                    <td>
                      {citaActiva && estadoVisual === "PENDIENTE" ? (
                        <div className="historial-actions">
                          <button type="button" onClick={confirmarCita}>
                            Confirmar
                          </button>

                          <button
                            type="button"
                            onClick={() => iniciarEdicion(citaActiva)}
                          >
                            Modificar
                          </button>

                          <button
                            type="button"
                            className="danger"
                            disabled={guardando}
                            onClick={() => manejarCancelarCita(cita.id)}
                          >
                            Cancelar
                          </button>
                        </div>
                      ) : (
                        <span className="historial-no-actions">Sin acciones</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default HistorialCitasCliente;