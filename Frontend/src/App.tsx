import { useEffect, useState } from "react";
import "./App.css";
import LoginModal from "./components/auth/LoginModal";
import DashboardLayout from "./components/dashboard/DashboardLayout";
import { useAuth } from "./context/Authcontext";
import AgendaForm from "./components/AgendaForm";
import { obtenerBarberos, type Barbero } from "./api/barberosApi";
import { obtenerServicios, type Servicio } from "./api/serviciosApi";
import heroBarber from "./assets/hero-barber.png";
import barberoJuan from "./assets/barbero-juan.png";
import barberoCarlos from "./assets/barbero-carlos.png";
import barberoMateo from "./assets/barbero-mateo.png";
import servicioCorte from "./assets/servicio-corte.jpg";
import servicioFade from "./assets/servicio-fade.jpg";
import servicioBarba from "./assets/servicio-barba.jpg";
import servicioCombo from "./assets/servicio-combo.png";

function App() {
  const [mostrarLogin, setMostrarLogin] = useState(false);
  const { usuario, logout } = useAuth();
  const [barberos, setBarberos] = useState<Barbero[]>([]);
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [cargandoLanding, setCargandoLanding] = useState(true);

  const abrirLogin = () => setMostrarLogin(true);
  const cerrarLogin = () => setMostrarLogin(false);

  const imagenesBarberos: Record<string, string> = {
    "Juan Estilo": barberoJuan,
    "Carlos Blade": barberoCarlos,
    "Mateo Fresh": barberoMateo,
  };

  const imagenesServicios: Record<string, string> = {
    "Corte clásico": servicioCorte,
    "Fade premium": servicioFade,
    "Arreglo de barba": servicioBarba,
    "Corte + barba": servicioCombo,
  };

  useEffect(() => {
    const cargarDatosLanding = async () => {
      try {
        const [barberosData, serviciosData] = await Promise.all([
          obtenerBarberos(),
          obtenerServicios(),
        ]);

        setBarberos(barberosData);
        setServicios(serviciosData);
      } catch (error) {
        console.error("Error cargando datos de la landing:", error);
      } finally {
        setCargandoLanding(false);
      }
    };

    cargarDatosLanding();
  }, []);

  if (usuario?.rol === "ADMIN" || usuario?.rol === "BARBERO") {
    return <DashboardLayout />;
  }

  return (
    <div className="app">
      <LoginModal abierto={mostrarLogin} onClose={cerrarLogin} />

      <header className="navbar">
        <div className="logo">
          <span className="logo-main">Randall</span>
          <span className="logo-accent">Barber</span>
        </div>

        <nav className="nav-links">
          <a href="#inicio">Inicio</a>
          <a href="#servicios">Servicios</a>
          <a href="#barberos">Barberos</a>
          <a href="#agenda">Agenda</a>
          <a href="#contacto">Contacto</a>
        </nav>

        {!usuario ? (
          <button className="nav-button" onClick={abrirLogin}>
            Iniciar sesión
          </button>
        ) : (
          <div className="user-actions">
            <div className="client-session-box">
              <div className="client-session-info">
                <span className="client-session-label">Sesión activa</span>
                <span className="client-session-name">{usuario.nombre}</span>
              </div>

              <button className="client-logout-btn" onClick={logout}>
                Cerrar Sesión
              </button>
            </div>
          </div>
        )}
      </header>

      <section className="hero" id="inicio">
        <div className="hero-text">
          <p className="tag">Estilo, precisión y confianza</p>
          <h1>Tu barbería de confianza para verte al máximo nivel</h1>
          <p className="hero-description">
            En RandallBarber elevamos tu imagen con cortes modernos, atención personalizada
            y una experiencia pensada para que te sientas cómodo, seguro y con estilo.
          </p>

          <div className="hero-buttons">
            <a href="#agenda" className="btn-primary">
              Agendar cita
            </a>
            <a href="#servicios" className="btn-secondary">
              Ver servicios
            </a>
          </div>
        </div>  

        <div className="hero-image">
          <div className="image-card">
            <img src={heroBarber} alt="Barbero principal RandallBarber" className="hero-img" />          </div>
        </div>
      </section>

      <section className="section" id="servicios">
        <div className="section-header">
          <p className="section-tag">Servicios</p>
          <h2>Lo que ofrecemos</h2>
          <p>
            Descubre nuestros servicios pensados para resaltar tu estilo y tu mejor versión.
          </p>
        </div>

        <div className="cards">
          {cargandoLanding ? (
            <p>Cargando servicios...</p>
          ) : servicios.length > 0 ? (
            servicios.map((servicio) => (
              <article className="card" key={servicio.id}>
                <img
                  src={imagenesServicios[servicio.nombre]}
                  alt={servicio.nombre}
                  className="service-img"
                />
                <h3>{servicio.nombre}</h3>
                <p>Duración estimada: {servicio.duracion} minutos.</p>
                <span>${servicio.precio.toLocaleString("es-CO")}</span>
              </article>
            ))
          ) : (
            <div className="empty-state-box">
              <h3>Sin servicios disponibles</h3>
              <p>Muy pronto estaremos publicando nuevos servicios para ti.</p>
            </div>
          )}
        </div>
      </section>

      <section className="section alt-section" id="barberos">
        <div className="section-header">
          <p className="section-tag">Equipo</p>
          <h2>Nuestros barberos</h2>
          <p>
            Conoce a nuestro equipo de profesionales y elige el estilo que mejor va contigo.
          </p>
        </div>

        <div className="barbers">
          {cargandoLanding ? (
            <p>Cargando barberos...</p>
          ) : barberos.length > 0 ? (
            barberos
              .filter((barbero) => barbero.activo)
              .map((barbero) => (
                <article className="barber-card" key={barbero.id}>
                  <div className="barber-photo">
                    <img
                      src={imagenesBarberos[barbero.nombre]}
                      alt={barbero.nombre}
                      className="barber-photo-img"
                    />
                  </div>
                  <h3>{barbero.nombre}</h3>
                  <p>{barbero.especialidad}</p>
                </article>
              ))
          ) : (
            <div className="empty-state-box">
              <h3>Sin barberos disponibles</h3>
              <p>En este momento no hay barberos activos para mostrar.</p>
            </div>
          )}
        </div>
      </section>

      <section className="section" id="agenda">
        <div className="section-header">
          <p className="section-tag">Agenda</p>
          <h2>Reserva tu espacio</h2>
          <p>
            Elige tu servicio, tu barbero favorito, la fecha y la hora que más
            te convenga.
          </p>
        </div>

        {usuario ? (
          <AgendaForm />
        ) : (
          <div className="login-required-box">
            <h3>Inicia sesión para agendar tu cita</h3>
            <p>
              Para reservar un turno necesitas iniciar sesión como cliente dentro de la plataforma.
            </p>
            <button className="btn-primary" onClick={abrirLogin}>
              Iniciar sesión
            </button>
          </div>
        )}
      </section>

      <section className="section alt-section" id="contacto">
        <div className="section-header">
          <p className="section-tag">Contacto</p>
          <h2>Encuéntranos</h2>
        </div>

        <div className="contact-grid">
          <div className="contact-card">
            <h3>Ubicación</h3>
            <p>Medellín, Colombia</p>
          </div>

          <div className="contact-card">
            <h3>Horario</h3>
            <p>Lunes a sábado: 9:00 AM - 8:00 PM</p>
          </div>

          <div className="contact-card">
            <h3>Teléfono</h3>
            <p>+57 300 000 0000</p>
          </div>
        </div>
      </section>

      <footer className="footer">
        <h3>RandallBarber</h3>
        <p>Diseñado para ofrecer estilo, comodidad y personalidad.</p>
        <small>© 2026 RandallBarber. Todos los derechos reservados.</small>
      </footer>
    </div>
  );
}

export default App;