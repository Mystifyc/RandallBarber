export type RolUsuario = "CLIENTE" | "BARBERO" | "ADMIN";

export interface UsuarioSesion {
  id: number;
  nombre: string;
  correo: string;
  rol: RolUsuario;
}