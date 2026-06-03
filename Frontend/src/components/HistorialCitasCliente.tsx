import { useEffect, useState } from "react";
import {
  obtenerHistorialCitasCliente,
  type HistorialCitaCliente,
} from "../api/citasApi";
import { useAuth } from "../context/Authcontext";

function HistorialCitasCliente() {
  const { usuario } = useAuth();

  const [historial, setHistorial] = useState<HistorialCitaCliente[]>([]);
  const [cargando, setCargando] = useState(true);
  const [mensajeError, setMensajeError] = useState("");

  useEffect(() => {
    const cargarHistorial = async () => {
      if (!usuario || usuario.rol !== "CLIENTE") {
        setCargando(false);
        return;
      }

      try {
        setCargando(true);
        setMensajeError("");

        const data = await obtenerHistorialCitasCliente(usuario.id);
        setHistorial(data);
      } catch (error) {
        console.error("Error cargando historial de citas:", error);
        setMensajeError("No se pudo cargar el historial de citas.");
      } finally {
        setCargando(false);
      }
    };

    cargarHistorial();
  }, [usuario]);

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

  if (mensajeError) {
    return (
      <div className="historial-card">
        <p className="historial-error">{mensajeError}</p>
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
      <div className="historial-table-wrapper">
        <table className="historial-table">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Hora</th>
              <th>Servicio</th>
              <th>Estado</th>
            </tr>
          </thead>

          <tbody>
            {historial.map((cita) => (
              <tr key={cita.id}>
                <td>{formatearFecha(cita.dia)}</td>
                <td>{formatearHora(cita.hora)}</td>
                <td>{cita.servicio}</td>
                <td>
                  <span
                    className={`historial-status ${
                      cita.estado === "ACTIVA" ? "active" : "cancelled"
                    }`}
                  >
                    {cita.estado}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default HistorialCitasCliente;
