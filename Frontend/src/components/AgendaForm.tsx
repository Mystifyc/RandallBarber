import { useEffect, useMemo, useState } from "react";
import type { Barbero } from "../types/Barbero";
import type { Servicio } from "../types/Servicio";
import {
  crearCita,
  obtenerBarberosActivos,
  obtenerHorasDisponibles,
  obtenerServicios,
} from "../api/agendamientoApi";

const MOCK_SERVICIOS: Servicio[] = [
  { id: 1, nombre: "Corte clásico", duracion: 30, precio: 20000 },
  { id: 2, nombre: "Barba", duracion: 25, precio: 15000 },
  { id: 3, nombre: "Corte + barba", duracion: 60, precio: 30000 },
  { id: 4, nombre: "Servicio premium", duracion: 90, precio: 40000 },
];

const MOCK_BARBEROS = [
  {
    id: 1,
    nombre: "Randall Barber",
    especialidad: "Fade",
    telefono: "3001112233",
    activo: true,
  },
  {
    id: 2,
    nombre: "Kevin White",
    especialidad: "Barba",
    telefono: "3001112244",
    activo: true,
  },
  {
    id: 3,
    nombre: "Andrés Torres",
    especialidad: "Corte clásico",
    telefono: "3001112255",
    activo: true,
  },
];

const MOCK_HORARIOS = [
  "08:00:00",
  "08:30:00",
  "09:00:00",
  "09:30:00",
  "10:00:00",
  "10:30:00",
  "11:00:00",
  "11:30:00",
  "14:00:00",
  "14:30:00",
  "15:00:00",
  "15:30:00",
  "16:00:00",
  "16:30:00",
];

function formatearHora(hora: string) {
  return hora.slice(0, 5);
}

function formatearPrecio(precio?: number) {
  if (precio === undefined) return "Sin precio";
  return `$${precio.toLocaleString("es-CO")}`;
}

function formatearDuracion(duracion?: number) {
  if (!duracion) return "Duración no definida";
  return `${duracion} min`;
}

function esDomingo(fecha: string) {
  if (!fecha) return false;
  const [year, month, day] = fecha.split("-").map(Number);
  const fechaLocal = new Date(year, month - 1, day);
  return fechaLocal.getDay() === 0;
}

function AgendaForm() {
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [barberos, setBarberos] = useState<any[]>([]);
  const [horarios, setHorarios] = useState<string[]>([]);

  const [servicioId, setServicioId] = useState("");
  const [barberoId, setBarberoId] = useState("");
  const [fecha, setFecha] = useState("");
  const [hora, setHora] = useState("");

  const [loadingServicios, setLoadingServicios] = useState(false);
  const [loadingBarberos, setLoadingBarberos] = useState(false);
  const [loadingHorarios, setLoadingHorarios] = useState(false);
  const [guardando, setGuardando] = useState(false);

  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const [usandoMock, setUsandoMock] = useState(false);

  useEffect(() => {
    cargarDatosIniciales();
  }, []);

  useEffect(() => {
    setHora("");
    setHorarios([]);

    if (fecha && esDomingo(fecha)) {
      setError("No se pueden agendar citas los domingos.");
      return;
    }

    if (barberoId && fecha) {
      cargarHorariosDisponibles(Number(barberoId), fecha);
    }
  }, [barberoId, fecha]);

  async function cargarDatosIniciales() {
    try {
      setError("");
      setLoadingServicios(true);
      setLoadingBarberos(true);

      const [serviciosData, barberosData] = await Promise.all([
        obtenerServicios(),
        obtenerBarberosActivos(),
      ]);

      setServicios(serviciosData);
      setBarberos(barberosData);
      setUsandoMock(false);
    } catch (err) {
      console.error(err);
      setServicios(MOCK_SERVICIOS);
      setBarberos(MOCK_BARBEROS);
      setUsandoMock(true);
      setError("No se pudo conectar con el backend. Se cargaron datos de prueba.");
    } finally {
      setLoadingServicios(false);
      setLoadingBarberos(false);
    }
  }

  async function cargarHorariosDisponibles(barbero: number, dia: string) {
    try {
      setError("");
      setLoadingHorarios(true);

      const horas = await obtenerHorasDisponibles(barbero, dia);
      setHorarios(horas);
    } catch (err) {
      console.error(err);
      setHorarios(MOCK_HORARIOS);
      setUsandoMock(true);
      setError("Se cargaron horarios de prueba mientras se conecta el backend.");
    } finally {
      setLoadingHorarios(false);
    }
  }

  async function manejarAgendamiento(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!servicioId || !barberoId || !fecha || !hora) {
      setMensaje("");
      setError("Debes completar todos los campos para confirmar la cita.");
      return;
    }

    if (esDomingo(fecha)) {
      setMensaje("");
      setError("No se pueden agendar citas los domingos.");
      return;
    }

    try {
      setGuardando(true);
      setError("");
      setMensaje("");

      if (!usandoMock) {
        await crearCita({
          dia: fecha,
          hora,
          servicio: { id: Number(servicioId) },
          cliente: { id: 1 },
          barbero: { id: Number(barberoId) },
        });
      }

      setMensaje(
        usandoMock
          ? "Cita simulada correctamente. El flujo quedó listo para conectar con el backend."
          : "Cita agendada correctamente."
      );

      setServicioId("");
      setBarberoId("");
      setFecha("");
      setHora("");
      setHorarios([]);
    } catch (err) {
      console.error(err);
      setMensaje("");
      setError("No fue posible agendar la cita.");
    } finally {
      setGuardando(false);
    }
  }

  const hoy = new Date().toISOString().split("T")[0];

  const servicioSeleccionado = useMemo(
    () => servicios.find((s) => s.id === Number(servicioId)),
    [servicios, servicioId]
  );

  const barberoSeleccionado = useMemo(
    () => barberos.find((b) => b.id === Number(barberoId)),
    [barberos, barberoId]
  );

  const puedeConfirmar =
    !!servicioId &&
    !!barberoId &&
    !!fecha &&
    !!hora &&
    !esDomingo(fecha);

  return (
    <div className="agenda-wrapper">
      <div className="agenda-form-container">
        <div className="agenda-top">
          <div>
            <p className="agenda-mini-tag">Reserva online</p>
            <h3>Agenda tu cita en pocos pasos</h3>
            <p className="agenda-description">
              Elige el servicio, selecciona tu barbero favorito, escoge una fecha
              y confirma el horario disponible.
            </p>
          </div>

          {usandoMock && <span className="agenda-badge">Modo prueba</span>}
        </div>

        <div className="servicios-visual-section">
          <div className="servicios-visual-header">
            <h4>Servicios disponibles</h4>
            <p>Selecciona uno tocando la tarjeta o desde el desplegable.</p>
          </div>

          <div className="servicios-cards">
            {servicios.map((servicio) => (
              <button
                key={servicio.id}
                type="button"
                className={`servicio-card-select ${
                  servicioId === String(servicio.id) ? "activa" : ""
                }`}
                onClick={() => setServicioId(String(servicio.id))}
              >
                <span className="servicio-card-tag">Servicio</span>
                <h5>{servicio.nombre}</h5>
                <p>{formatearDuracion(servicio.duracion)}</p>
                <strong>{formatearPrecio(servicio.precio)}</strong>
              </button>
            ))}
          </div>
        </div>

        <form className="agenda-form" onSubmit={manejarAgendamiento}>
          <div className="agenda-grid">
            <div className="form-group">
              <label htmlFor="servicio">Servicio</label>
              <select
                id="servicio"
                value={servicioId}
                onChange={(e) => setServicioId(e.target.value)}
                disabled={loadingServicios}
              >
                <option value="">
                  {loadingServicios ? "Cargando servicios..." : "Seleccione un servicio"}
                </option>
                {servicios.map((servicio) => (
                  <option key={servicio.id} value={servicio.id}>
                    {servicio.nombre}
                    {servicio.precio !== undefined
                      ? ` - ${formatearPrecio(servicio.precio)}`
                      : ""}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="barbero">Barbero</label>
              <select
                id="barbero"
                value={barberoId}
                onChange={(e) => setBarberoId(e.target.value)}
                disabled={loadingBarberos}
              >
                <option value="">
                  {loadingBarberos ? "Cargando barberos..." : "Seleccione un barbero"}
                </option>
                {barberos.map((barbero) => (
                  <option key={barbero.id} value={barbero.id}>
                    {barbero.nombre}
                    {barbero.especialidad ? ` - ${barbero.especialidad}` : ""}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="fecha">Fecha</label>
              <input
                id="fecha"
                type="date"
                min={hoy}
                value={fecha}
                onChange={(e) => {
                  const nuevaFecha = e.target.value;
                  setFecha(nuevaFecha);

                  if (nuevaFecha && esDomingo(nuevaFecha)) {
                    setHora("");
                    setHorarios([]);
                    setMensaje("");
                    setError("No se pueden agendar citas los domingos.");
                  } else {
                    setError("");
                  }
                }}
              />
              <small className="field-help">
                No se permiten fechas pasadas ni domingos.
              </small>
            </div>

            <div className="form-group">
              <label htmlFor="hora">Horario disponible</label>
              <select
                id="hora"
                value={hora}
                onChange={(e) => setHora(e.target.value)}
                disabled={!barberoId || !fecha || loadingHorarios || esDomingo(fecha)}
              >
                <option value="">
                  {loadingHorarios
                    ? "Cargando horarios..."
                    : horarios.length > 0
                    ? "Seleccione una hora"
                    : "No hay horarios disponibles"}
                </option>

                {horarios.map((horario, index) => (
                  <option key={index} value={horario}>
                    {formatearHora(horario)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {servicioSeleccionado && (
            <div className="servicio-detalle-box">
              <div className="detalle-item">
                <span>Servicio seleccionado</span>
                <strong>{servicioSeleccionado.nombre}</strong>
              </div>
              <div className="detalle-item">
                <span>Duración</span>
                <strong>{formatearDuracion(servicioSeleccionado.duracion)}</strong>
              </div>
              <div className="detalle-item">
                <span>Precio</span>
                <strong>{formatearPrecio(servicioSeleccionado.precio)}</strong>
              </div>
            </div>
          )}

          {horarios.length > 0 && !esDomingo(fecha) && (
            <div className="horarios-quick">
              <h4>Horarios sugeridos</h4>
              <div className="horarios-chips">
                {horarios.slice(0, 8).map((horario) => (
                  <button
                    key={horario}
                    type="button"
                    className={`horario-chip ${hora === horario ? "activo" : ""}`}
                    onClick={() => setHora(horario)}
                  >
                    {formatearHora(horario)}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="agenda-summary">
            <div className="agenda-summary-header">
              <h4>Resumen de tu cita</h4>
              <span>Verifica antes de confirmar</span>
            </div>

            <div className="agenda-summary-grid">
              <div className="summary-item">
                <span>Servicio</span>
                <strong>{servicioSeleccionado?.nombre || "Sin seleccionar"}</strong>
                <small>{formatearDuracion(servicioSeleccionado?.duracion)}</small>
              </div>

              <div className="summary-item">
                <span>Barbero</span>
                <strong>{barberoSeleccionado?.nombre || "Sin seleccionar"}</strong>
                <small>{barberoSeleccionado?.especialidad || "Especialidad no definida"}</small>
              </div>

              <div className="summary-item">
                <span>Fecha</span>
                <strong>{fecha || "Sin seleccionar"}</strong>
                <small>
                  {fecha
                    ? esDomingo(fecha)
                      ? "Domingo no disponible"
                      : "Fecha válida"
                    : "Pendiente por elegir"}
                </small>
              </div>

              <div className="summary-item">
                <span>Hora</span>
                <strong>{hora ? formatearHora(hora) : "Sin seleccionar"}</strong>
                <small>Horario disponible</small>
              </div>
            </div>
          </div>

          {error && <p className="mensaje-error">{error}</p>}
          {mensaje && <p className="mensaje-exito">{mensaje}</p>}

          <div className="agenda-actions">
            <button
              type="button"
              className="btn-secondary-clean"
              onClick={() => {
                setServicioId("");
                setBarberoId("");
                setFecha("");
                setHora("");
                setHorarios([]);
                setMensaje("");
                setError("");
              }}
            >
              Limpiar
            </button>

            <button
              type="submit"
              className="btn-primary agenda-submit"
              disabled={guardando || !puedeConfirmar}
            >
              {guardando ? "Agendando..." : "Confirmar cita"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AgendaForm;