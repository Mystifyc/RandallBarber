import { useEffect, useMemo, useState } from "react";
import type { Notificacion } from "../../types/Notificacion";
import {
  eliminarNotificacion,
  marcarNotificacionComoLeida,
  obtenerNotificacionesAdmin,
  obtenerNotificacionesPorBarbero,
  obtenerNotificacionesPorCliente,
} from "../../api/notificacionesApi";

interface Props {
  rol: "ADMIN" | "CLIENTE" | "BARBERO";
  usuarioId?: number;
}

function NotificacionesPanel({ rol, usuarioId }: Props) {
  const [notificaciones, setNotificaciones] = useState<Notificacion[]>([]);
  const [cargando, setCargando] = useState(false);
  const [mensajeError, setMensajeError] = useState("");

  const cargarNotificaciones = async () => {
    try {
      setCargando(true);
      setMensajeError("");

      let data: Notificacion[] = [];

      if (rol === "ADMIN") {
        data = await obtenerNotificacionesAdmin();
      }

      if (rol === "CLIENTE") {
        if (!usuarioId) {
          setNotificaciones([]);
          return;
        }

        data = await obtenerNotificacionesPorCliente(usuarioId);
      }

      if (rol === "BARBERO") {
        if (!usuarioId) {
          setNotificaciones([]);
          return;
        }

        data = await obtenerNotificacionesPorBarbero(usuarioId);
      }

      setNotificaciones(data);
    } catch (error) {
      console.error("Error cargando notificaciones:", error);
      setMensajeError("No se pudieron cargar las notificaciones.");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarNotificaciones();
  }, [rol, usuarioId]);

  useEffect(() => {
    const recargarNotificaciones = () => {
      cargarNotificaciones();
    };

    window.addEventListener(
      "randallbarber:notificaciones-actualizadas",
      recargarNotificaciones
    );

    return () => {
      window.removeEventListener(
        "randallbarber:notificaciones-actualizadas",
        recargarNotificaciones
      );
    };
  }, [rol, usuarioId]);

  const totalNoLeidas = useMemo(() => {
    return notificaciones.filter((notificacion) => !notificacion.leida).length;
  }, [notificaciones]);

  const marcarComoLeida = async (id: number) => {
    try {
      await marcarNotificacionComoLeida(id);
      await cargarNotificaciones();
    } catch (error) {
      console.error("Error marcando notificación como leída:", error);
      setMensajeError("No se pudo marcar la notificación como leída.");
    }
  };

  const eliminar = async (id: number) => {
    try {
      await eliminarNotificacion(id);
      await cargarNotificaciones();
    } catch (error) {
      console.error("Error eliminando notificación:", error);
      setMensajeError("No se pudo eliminar la notificación.");
    }
  };

  const obtenerTituloPanel = () => {
    if (rol === "ADMIN") return "Notificaciones del sistema";
    if (rol === "CLIENTE") return "Mis notificaciones";
    if (rol === "BARBERO") return "Mis citas asignadas";
    return "Notificaciones";
  };

  const obtenerDescripcionPanel = () => {
    if (rol === "ADMIN") {
      return "Aquí verás movimientos importantes del sistema, como creación, modificación o cancelación de citas.";
    }

    if (rol === "CLIENTE") {
      return "Aquí verás recordatorios, confirmaciones y cambios importantes relacionados con tus citas.";
    }

    if (rol === "BARBERO") {
      return "Aquí verás nuevas citas asignadas, modificaciones y cancelaciones relacionadas con tu agenda.";
    }

    return "Listado de notificaciones.";
  };

  const obtenerTextoTipo = (tipo: string) => {
    if (tipo === "CITA_CREADA") return "Cita creada";
    if (tipo === "CITA_ACTUALIZADA") return "Cita actualizada";
    if (tipo === "CITA_ELIMINADA") return "Cita eliminada";
    if (tipo === "CITA_CANCELADA") return "Cita cancelada";
    if (tipo === "CITA_CONFIRMADA") return "Cita confirmada";
    if (tipo === "CITA_MODIFICADA") return "Cita modificada";
    if (tipo === "RECORDATORIO") return "Recordatorio";
    return "Notificación";
  };

  const obtenerClaseTipo = (tipo: string) => {
    if (tipo === "CITA_CREADA") return "notification-type created";
    if (tipo === "CITA_CONFIRMADA") return "notification-type created";

    if (tipo === "CITA_ACTUALIZADA") return "notification-type updated";
    if (tipo === "CITA_MODIFICADA") return "notification-type updated";
    if (tipo === "RECORDATORIO") return "notification-type updated";

    if (tipo === "CITA_ELIMINADA") return "notification-type deleted";
    if (tipo === "CITA_CANCELADA") return "notification-type deleted";

    return "notification-type";
  };

  const formatearFecha = (fecha: string) => {
    return new Date(fecha).toLocaleString("es-CO", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatearFechaCita = (fecha?: string) => {
    if (!fecha) return "Fecha por confirmar";

    return new Date(`${fecha}T00:00:00`).toLocaleDateString("es-CO", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const formatearHoraCita = (hora?: string) => {
    if (!hora) return "Hora por confirmar";
    return hora.slice(0, 5);
  };

  return (
    <section className="notifications-panel">
      <div className="notifications-header">
        <div>
          <p className="section-tag">Notificaciones</p>
          <h2>{obtenerTituloPanel()}</h2>
          <p>{obtenerDescripcionPanel()}</p>
        </div>

        <div className="notifications-counter">
          <span>{totalNoLeidas}</span>
          <small>sin leer</small>
        </div>
      </div>

      {mensajeError && (
        <div className="notification-error">
          <p>{mensajeError}</p>
        </div>
      )}

      {cargando ? (
        <div className="notifications-empty">
          <p>Cargando notificaciones...</p>
        </div>
      ) : notificaciones.length === 0 ? (
        <div className="notifications-empty">
          <h3>No hay notificaciones</h3>
          <p>Cuando haya novedades, aparecerán aquí.</p>
        </div>
      ) : (
        <div className="notifications-list">
          {notificaciones.map((notificacion) => (
            <article
              key={notificacion.id}
              className={`notification-card ${
                notificacion.leida ? "read" : "unread"
              }`}
            >
              <div className="notification-card-header">
                <div className="notification-card-badges">
                  <span className={obtenerClaseTipo(notificacion.tipo)}>
                    {obtenerTextoTipo(notificacion.tipo)}
                  </span>

                  {!notificacion.leida && (
                    <span className="notification-status">Nueva</span>
                  )}
                </div>

                <button
                  type="button"
                  className="notification-delete-btn"
                  aria-label="Eliminar notificación"
                  title="Eliminar notificación"
                  onClick={() => eliminar(notificacion.id)}
                >
                  x
                </button>
              </div>

              <h3>{notificacion.titulo}</h3>
              <p>{notificacion.mensaje}</p>

              {rol === "CLIENTE" && notificacion.cita && (
                <div className="notification-appointment-details">
                  <div>
                    <span>Fecha</span>
                    <strong>{formatearFechaCita(notificacion.cita.dia)}</strong>
                  </div>

                  <div>
                    <span>Hora</span>
                    <strong>{formatearHoraCita(notificacion.cita.hora)}</strong>
                  </div>

                  <div>
                    <span>Servicio</span>
                    <strong>
                      {notificacion.cita.servicio?.nombre ?? "Servicio reservado"}
                    </strong>
                  </div>

                  <div>
                    <span>Barbero</span>
                    <strong>
                      {notificacion.cita.barbero?.nombre ?? "Barbero asignado"}
                    </strong>
                  </div>
                </div>
              )}

              <div className="notification-card-footer">
                <small>{formatearFecha(notificacion.fechaCreacion)}</small>

                {!notificacion.leida && (
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => marcarComoLeida(notificacion.id)}
                  >
                    Marcar como leída
                  </button>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default NotificacionesPanel;