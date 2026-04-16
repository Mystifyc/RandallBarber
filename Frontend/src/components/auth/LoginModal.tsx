import { useEffect, useState } from "react";
import { useAuth } from "../../context/Authcontext";
import type { RolUsuario } from "../../types/Usuario";
import "./LoginModal.css";

interface LoginModalProps {
  abierto: boolean;
  onClose: () => void;
}

type AuthMode = "login" | "register";

function LoginModal({ abierto, onClose }: LoginModalProps) {
  const { login, registrarCliente } = useAuth();

  const [modo, setModo] = useState<AuthMode>("login");

  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [rol, setRol] = useState<RolUsuario>("CLIENTE");

  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  const limpiarFormularioCompleto = () => {
    setModo("login");
    setCorreo("");
    setPassword("");
    setRol("CLIENTE");
    setNombre("");
    setTelefono("");
    setConfirmPassword("");
    setError("");
    setCargando(false);
  };

  useEffect(() => {
    if (!abierto) {
      limpiarFormularioCompleto();
    }
  }, [abierto]);

  if (!abierto) return null;

  const handleClose = () => {
    limpiarFormularioCompleto();
    onClose();
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      setCargando(true);

      const ok = await login({ correo, password, rol });

      if (!ok) {
        setError("Correo, contraseña o rol incorrecto.");
        return;
      }

      limpiarFormularioCompleto();
      onClose();
    } catch (err) {
      console.error("Error en login:", err);
      setError("No se pudo iniciar sesión en este momento.");
    } finally {
      setCargando(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!nombre.trim() || !telefono.trim() || !correo.trim() || !password.trim()) {
      setError("Todos los campos son obligatorios.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    try {
      setCargando(true);

      await registrarCliente({
        nombre: nombre.trim(),
        telefono: telefono.trim(),
        correo: correo.trim().toLowerCase(),
        password: password.trim(),
      });

      limpiarFormularioCompleto();
      onClose();
    } catch (err: any) {
      console.error("Error en registro:", err);
      setError(err?.message || "No se pudo registrar el cliente en este momento.");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="rb-modal-overlay" onClick={handleClose}>
      <div className="rb-login-modal" onClick={(e) => e.stopPropagation()}>
        <div className="rb-login-header">
          <div>
            <p className="rb-login-tag">
              {modo === "login" ? "Acceso al sistema" : "Registro de cliente"}
            </p>
            <h2>{modo === "login" ? "Iniciar sesión" : "Crear cuenta"}</h2>
            <p className="rb-login-subtitle">
              {modo === "login"
                ? "Ingresa con tu cuenta para acceder a tu experiencia personalizada."
                : "Crea tu cuenta como cliente para reservar tus citas fácilmente."}
            </p>
          </div>

          <button className="rb-close-btn" onClick={handleClose} type="button">
            ×
          </button>
        </div>

        {modo === "login" ? (
          <form onSubmit={handleLogin} className="rb-login-form">
            <div className="rb-login-field">
              <label htmlFor="rol">Rol</label>
              <select
                id="rol"
                value={rol}
                onChange={(e) => setRol(e.target.value as RolUsuario)}
                disabled={cargando}
              >
                <option value="CLIENTE">Cliente</option>
                <option value="BARBERO">Barbero</option>
                <option value="ADMIN">Administrador</option>
              </select>
            </div>

            <div className="rb-login-field">
              <label htmlFor="correo">Correo</label>
              <input
                id="correo"
                type="email"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                placeholder="correo@ejemplo.com"
                required
                disabled={cargando}
              />
            </div>

            <div className="rb-login-field">
              <label htmlFor="password">Contraseña</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Ingresa tu contraseña"
                required
                disabled={cargando}
              />
            </div>

            {error && <p className="rb-login-error">{error}</p>}

            <button
              type="submit"
              className="rb-login-submit-btn"
              disabled={cargando}
            >
              {cargando ? "Entrando..." : "Entrar"}
            </button>

            <p className="rb-auth-helper">
              ¿No tienes cuenta?{" "}
              <button
                type="button"
                className="rb-auth-link"
                onClick={() => {
                  setError("");
                  setModo("register");
                }}
              >
                Regístrate
              </button>
            </p>
          </form>
        ) : (
          <form onSubmit={handleRegister} className="rb-login-form">
            <div className="rb-login-field">
              <label htmlFor="nombre">Nombre completo</label>
              <input
                id="nombre"
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Tu nombre completo"
                required
                disabled={cargando}
              />
            </div>

            <div className="rb-login-field">
              <label htmlFor="telefono">Teléfono</label>
              <input
                id="telefono"
                type="text"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                placeholder="3001234567"
                required
                disabled={cargando}
              />
            </div>

            <div className="rb-login-field">
              <label htmlFor="correo-registro">Correo</label>
              <input
                id="correo-registro"
                type="email"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                placeholder="correo@ejemplo.com"
                required
                disabled={cargando}
              />
            </div>

            <div className="rb-login-field">
              <label htmlFor="password-registro">Contraseña</label>
              <input
                id="password-registro"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mínimo 6 caracteres"
                required
                disabled={cargando}
              />
            </div>

            <div className="rb-login-field">
              <label htmlFor="confirm-password">Confirmar contraseña</label>
              <input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repite tu contraseña"
                required
                disabled={cargando}
              />
            </div>

            {error && <p className="rb-login-error">{error}</p>}

            <button
              type="submit"
              className="rb-login-submit-btn"
              disabled={cargando}
            >
              {cargando ? "Creando cuenta..." : "Crear cuenta"}
            </button>

            <p className="rb-auth-helper">
              ¿Ya tienes cuenta?{" "}
              <button
                type="button"
                className="rb-auth-link"
                onClick={() => {
                  setError("");
                  setModo("login");
                }}
              >
                Inicia sesión
              </button>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}

export default LoginModal;