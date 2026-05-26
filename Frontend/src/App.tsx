import "./App.css";
import AgendaForm from "./components/AgendaForm";

function App() {
  return (
    <div className="app">
      {/* NAVBAR */}
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

        <button
          className="nav-button"
          onClick={() => {
            const section = document.getElementById("agenda");
            section?.scrollIntoView({ behavior: "smooth" });
          }}
        >
          Reservar
        </button>
      </header>

      {/* HERO */}
      <section className="hero" id="inicio">
        <div className="hero-text">
          <p className="tag">Estilo, precisión y confianza</p>
          <h1>Tu barbería de confianza para verte al máximo nivel</h1>
          <p className="hero-description">
            En RandallBarber transformamos tu estilo con cortes modernos,
            atención personalizada y una experiencia cómoda desde que llegas
            hasta que sales.
          </p>

          <div className="hero-buttons">
            <button
              className="btn-primary"
              onClick={() => {
                const section = document.getElementById("agenda");
                section?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              Agendar cita
            </button>

            <button
              className="btn-secondary"
              onClick={() => {
                const section = document.getElementById("servicios");
                section?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              Ver servicios
            </button>
          </div>
        </div>

        <div className="hero-image">
          <div className="image-card">
            <span>Espacio para imagen principal</span>
          </div>
        </div>
      </section>

      {/* SERVICIOS */}
      <section className="section" id="servicios">
        <div className="section-header">
          <p className="section-tag">Servicios</p>
          <h2>Lo que ofrecemos</h2>
          <p>
            Puedes cambiar estos servicios, precios y descripciones después.
          </p>
        </div>

        <div className="cards">
          <article className="card">
            <h3>Corte clásico</h3>
            <p>Un corte limpio y profesional, ideal para cualquier ocasión.</p>
            <span>$20.000</span>
          </article>

          <article className="card">
            <h3>Barba</h3>
            <p>Perfilado y arreglo de barba con acabado preciso y elegante.</p>
            <span>$15.000</span>
          </article>

          <article className="card">
            <h3>Corte + barba</h3>
            <p>El combo perfecto para renovar tu imagen en una sola sesión.</p>
            <span>$30.000</span>
          </article>

          <article className="card">
            <h3>Servicio premium</h3>
            <p>Atención completa con detalles extra para una mejor experiencia.</p>
            <span>$40.000</span>
          </article>
        </div>
      </section>

      {/* BARBEROS */}
      <section className="section alt-section" id="barberos">
        <div className="section-header">
          <p className="section-tag">Equipo</p>
          <h2>Nuestros barberos</h2>
          <p>Luego aquí puedes poner fotos reales, nombres reales y especialidades.</p>
        </div>

        <div className="barbers">
          <article className="barber-card">
            <div className="barber-photo">Foto</div>
            <h3>Juan</h3>
            <p>Especialista en cortes clásicos</p>
          </article>

          <article className="barber-card">
            <div className="barber-photo">Foto</div>
            <h3>David</h3>
            <p>Especialista en fades y estilos modernos</p>
          </article>

          <article className="barber-card">
            <div className="barber-photo">Foto</div>
            <h3>Andrés</h3>
            <p>Especialista en barba y perfilado</p>
          </article>
        </div>
      </section>

      {/* AGENDA */}
<section className="section agenda-section" id="agenda">
  <div className="section-header">
    <p className="section-tag">Agenda</p>
    <h2>Reserva tu espacio</h2>
    <p>
      Selecciona tu servicio, tu barbero, la fecha y la hora disponible
      para confirmar tu cita.
    </p>
  </div>

  <AgendaForm />
</section>

      {/* CONTACTO */}
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

      {/* FOOTER */}
      <footer className="footer">
        <h3>RandallBarber</h3>
        <p>Diseñado para ofrecer estilo, comodidad y personalidad.</p>
        <small>© 2026 RandallBarber. Todos los derechos reservados.</small>
      </footer>
    </div>
  );
}

export default App;