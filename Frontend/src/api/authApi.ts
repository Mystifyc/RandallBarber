import api from "./axios";
import type { RolUsuario, UsuarioSesion } from "../types/Usuario";

export interface LoginRequest {
  correo: string;
  password: string;
  rol: RolUsuario;
}

export interface LoginResponse {
  id: number;
  nombre: string;
  correo: string;
  rol: RolUsuario;
}

export interface RegisterClienteRequest {
  nombre: string;
  telefono: string;
  correo: string;
  password: string;
}

export const loginUsuario = async (
  data: LoginRequest
): Promise<UsuarioSesion> => {
  const response = await api.post<LoginResponse>("/auth/login", data);

  return {
    id: response.data.id,
    nombre: response.data.nombre,
    correo: response.data.correo,
    rol: response.data.rol,
  };
};

export const registrarCliente = async (
  data: RegisterClienteRequest
): Promise<UsuarioSesion> => {
  const response = await api.post<LoginResponse>("/auth/register/cliente", data);

  return {
    id: response.data.id,
    nombre: response.data.nombre,
    correo: response.data.correo,
    rol: response.data.rol,
  };
};