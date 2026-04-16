import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import type { RolUsuario, UsuarioSesion } from "../types/Usuario";
import { loginUsuario, registrarCliente as registrarClienteApi } from "../api/authApi";

interface LoginData {
  correo: string;
  password: string;
  rol: RolUsuario;
}

interface AuthContextType {
  usuario: UsuarioSesion | null;
  login: (data: LoginData) => Promise<boolean>;
  logout: () => void;
  registrarCliente: (data: {
    nombre: string;
    telefono: string;
    correo: string;
    password: string;
  }) => Promise<boolean>;
}


const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = "randallbarber_usuario";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<UsuarioSesion | null>(null);

  useEffect(() => {
    const guardado = localStorage.getItem(STORAGE_KEY);

    if (!guardado) return;

    try {
      const usuarioGuardado: UsuarioSesion = JSON.parse(guardado);
      setUsuario(usuarioGuardado);
    } catch (error) {
      console.error("Error leyendo sesión guardada:", error);
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  const login = async ({
    correo,
    password,
    rol,
  }: LoginData): Promise<boolean> => {
    try {
      const usuarioSesion = await loginUsuario({
        correo,
        password,
        rol,
      });

      setUsuario(usuarioSesion);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(usuarioSesion));
      return true;
    } catch (error) {
      console.error("Error en login:", error);
      return false;
    }
  };

  const logout = () => {
    setUsuario(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  const registrarCliente = async ({
    nombre,
    telefono,
    correo,
    password,
  }: {
    nombre: string;
    telefono: string;
    correo: string;
    password: string;
  }): Promise<boolean> => {
    try {
      const usuarioSesion = await registrarClienteApi({
        nombre,
        telefono,
        correo,
        password,
      });

      setUsuario(usuarioSesion);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(usuarioSesion));
      return true;
    } catch (error: any) {
      console.error("Error en registro:", error);

      const data = error?.response?.data;
      const mensaje =
        typeof data === "string"
          ? data
          : data?.message
          ? data.message
          : "No se pudo completar el registro.";

      throw new Error(mensaje);
    }
  };

  return (
    <AuthContext.Provider value={{ usuario, login, registrarCliente, logout }}>      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth debe usarse dentro de AuthProvider");
  }

  return context;
}