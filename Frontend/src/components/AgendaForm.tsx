import { useEffect, useMemo, useState } from "react";
import { obtenerBarberos, type Barbero } from "../api/barberosApi";
import { obtenerServicios, type Servicio } from "../api/serviciosApi";
import { obtenerClientes, type Cliente } from "../api/clientesApi";
import { crearCita, obtenerHorasDisponibles } from "../api/citasApi";
import { useAuth } from "../context/Authcontext";
import "./AgendaForm.css";

function AgendaForm() {
  const { usuario } = useAuth();
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [barberos, setBarberos] = useState<Barbero[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);

  const [servicioId, setServicioId] = useState("");
  const [barberoId, setBarberoId] = useState("");
  const [fecha, setFecha] = useState("");
  const [hora, setHora] = useState("");

  const [horasDisponibles, setHorasDisponibles] = useState<string[]>([]);
  const [cargandoDatos, setCargandoDatos] = useState(true);
  const [consultandoHoras, setConsultandoHoras] = useState(false);
  const [guardando, setGuardando] = useState(false);

  const [mensajeExito, setMensajeExito] = useState("");
  const [mensajeError, setMensajeError] = useState("");

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setCargandoDatos(true);

        const [serviciosData, barberosData, clientesData] = await Promise.all([
          obtenerServicios(),
          obtenerBarberos(),
          obtenerClientes(),
        ]);

        setServicios(serviciosData);
        setBarberos(barberosData.filter((barbero) => barbero.activo));
        setClientes(clientesData);
      } catch (error) {
        console.error("Error cargando datos de agenda:", error);
        setMensajeError("No se pudieron cargar los datos de la agenda.");
      } finally {
        setCargandoDatos(false);
      }
    };

    cargarDatos();
  }, []);

  const clienteTemporal = useMemo(() => {
    if (usuario?.rol === "CLIENTE" && usuario?.correo) {
      const clienteEncontrado = clientes.find(
        (cliente) => cliente.correo.toLowerCase() === usuario.correo.toLowerCase()
      );
      if (clienteEncontrado) return clienteEncontrado.id;
    }

    return clientes.length > 0 ? clientes[0].id : null;
  }, [clientes, usuario]);

  const servicioSeleccionado = useMemo(() => {
    return servicios.find((servicio) => servicio.id === Number(servicioId)) || null;
  }, [servicios, servicioId]);

  const barberoSeleccionado = useMemo(() => {
    return barberos.find((barbero) => barbero.id === Number(barberoId)) || null;
  }, [barberos, barberoId]);

  const fechaFormateada = useMemo(() => {
    if (!fecha) return "";
    const partes = fecha.split("-");
    if (partes.length !== 3) return fecha;
    return `${partes[2]}/${partes[1]}/${partes[0]}`;
  }, [fecha]);

  const esDomingo = useMemo(() => {
    if (!fecha) return false;
    const date = new Date(`${fecha}T00:00:00`);
    return date.getDay() === 0;
  }, [fecha]);

  const limpiarMensajes = () => {
    setMensajeError("");
    setMensajeExito("");
  };

  const limpiarFormulario = () => {
    setServicioId("");
    setBarberoId("");
    setFecha("");
    setHora("");
    setHorasDisponibles([]);
    limpiarMensajes();
  };

  const cargarHoras = async (nuevoBarberoId: string, nuevaFecha: string) => {
    limpiarMensajes();

    if (!nuevoBarberoId || !nuevaFecha) {
      setHorasDisponibles([]);
      setHora("");
      return;
    }

    const fechaTemporal = new Date(`${nuevaFecha}T00:00:00`);
    if (fechaTemporal.getDay() === 0) {
      setHorasDisponibles([]);
      setHora("");
      setMensajeError("Los domingos no hay atención disponible.");
      return;
    }

    try {
      setConsultandoHoras(true);
      const horas = await obtenerHorasDisponibles(Number(nuevoBarberoId), nuevaFecha);
      setHorasDisponibles(horas);
      setHora("");
    } catch (error) {
      console.error("Error cargando horas disponibles:", error);
      setHorasDisponibles([]);
      setMensajeError("No se pudieron cargar las horas disponibles.");
    } finally {
      setConsultandoHoras(false);
    }
  };

  const manejarReservar = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    limpiarMensajes();

    if (!clienteTemporal) {
      setMensajeError("No se encontró un cliente válido para registrar la reserva.");
      return;
    }

    if (!servicioId || !barberoId || !fecha || !hora) {
      setMensajeError("Completa todos los campos para agendar tu cita.");
      return;
    }

    if (esDomingo) {
      setMensajeError("No se pueden agendar citas para domingo.");
      return;
    }

    try {
      setGuardando(true);

      await crearCita({
        dia: fecha,
        hora: hora.length === 5 ? `${hora}:00` : hora,
        cliente: { id: Number(clienteTemporal) },
        barbero: { id: Number(barberoId) },
        servicio: { id: Number(servicioId) },
      });

      setMensajeExito("Tu cita fue agendada correctamente.");
      setServicioId("");
      setBarberoId("");
      setFecha("");
      setHora("");
      setHorasDisponibles([]);
    } catch (error: any) {
      console.error("Error creando cita:", error);

      const data = error?.response?.data;
      const mensaje =
        typeof data === "string"
          ? data
          : data?.message
          ? data.message
          : "No se pudo realizar la reserva.";

      setMensajeError(mensaje);
    } finally {
      setGuardando(false);
    }
  };

  if (cargandoDatos) {
    return (
      <div className="agenda-form-shell">
        <p className="agenda-loading">Cargando agenda...</p>
      </div>
    );
  }

  return (
    <div className="agenda-form-shell">
      <div className="agenda-top">
        <div className="agenda-intro">
          <p className="agenda-mini-tag">Reserva online</p>
          <h3>Agenda tu cita en pocos pasos</h3>
          <p>
            Selecciona tu servicio, elige a tu barbero favorito y agenda el horario que mejor se adapte a ti.
          </p>
        </div>

        <div className="agenda-summary-card">
          <p className="agenda-summary-label">Resumen</p>
          <div className="agenda-summary-item">
            <span>Servicio</span>
            <strong>{servicioSeleccionado?.nombre || "No seleccionado"}</strong>
          </div>
          <div className="agenda-summary-item">
            <span>Barbero</span>
            <strong>{barberoSeleccionado?.nombre || "No seleccionado"}</strong>
          </div>
          <div className="agenda-summary-item">
            <span>Fecha</span>
            <strong>{fechaFormateada || "No seleccionada"}</strong>
          </div>
          <div className="agenda-summary-item">
            <span>Hora</span>
            <strong>{hora || "No seleccionada"}</strong>
          </div>
        </div>
      </div>

      <form className="agenda-form" onSubmit={manejarReservar}>
        <div className="agenda-block">
          <div className="agenda-block-header">
            <p className="agenda-block-tag">Paso 1</p>
            <h4>Selecciona un servicio</h4>
          </div>

          <div className="agenda-service-grid">
            {servicios.map((servicio) => (
              <button
                type="button"
                key={servicio.id}
                className={`agenda-service-card ${
                  servicioId === String(servicio.id) ? "selected" : ""
                }`}
                onClick={() => {
                  limpiarMensajes();
                  setServicioId(String(servicio.id));
                }}
              >
                <h5>{servicio.nombre}</h5>
                <p>{servicio.duracion} minutos</p>
                <span>${servicio.precio.toLocaleString("es-CO")}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="agenda-grid">
          <div className="agenda-field">
            <label>Barbero</label>
            <select
              value={barberoId}
              onChange={async (e) => {
                const value = e.target.value;
                setBarberoId(value);
                await cargarHoras(value, fecha);
              }}
              required
            >
              <option value="">Selecciona un barbero</option>
              {barberos.map((barbero) => (
                <option key={barbero.id} value={barbero.id}>
                  {barbero.nombre} - {barbero.especialidad}
                </option>
              ))}
            </select>
          </div>

          <div className="agenda-field">
            <label>Fecha</label>
            <input
              type="date"
              value={fecha}
              min={new Date().toISOString().split("T")[0]}
              onChange={async (e) => {
                const value = e.target.value;
                setFecha(value);
                await cargarHoras(barberoId, value);
              }}
              required
            />
          </div>
        </div>

        <div className="agenda-block">
          <div className="agenda-block-header">
            <p className="agenda-block-tag">Paso 2</p>
            <h4>Escoge un horario</h4>
          </div>

          {!barberoId || !fecha ? (
            <p className="agenda-helper">
              Selecciona un barbero y una fecha para ver los horarios disponibles.
            </p>
          ) : consultandoHoras ? (
            <p className="agenda-helper">Consultando horarios...</p>
          ) : horasDisponibles.length === 0 ? (
            <p className="agenda-helper warning">
              No encontramos horarios disponibles para ese barbero en la fecha seleccionada.
            </p>
          ) : (
            <div className="agenda-hours">
              {horasDisponibles.map((horaDisponible) => (
                <button
                  type="button"
                  key={horaDisponible}
                  className={`agenda-hour-chip ${
                    hora === horaDisponible ? "selected" : ""
                  }`}
                  onClick={() => {
                    limpiarMensajes();
                    setHora(horaDisponible);
                  }}
                >
                  {horaDisponible.slice(0, 5)}
                </button>
              ))}
            </div>
          )}
        </div>

        {mensajeExito && (
          <p className="agenda-message success">{mensajeExito}</p>
        )}

        {mensajeError && <p className="agenda-message error">{mensajeError}</p>}

        <div className="agenda-actions">
          <button
            type="button"
            className="agenda-clear-btn"
            onClick={limpiarFormulario}
          >
            Limpiar
          </button>

          <button type="submit" className="agenda-submit-btn" disabled={guardando}>
            {guardando ? "Agendando..." : "Agendar cita"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AgendaForm;