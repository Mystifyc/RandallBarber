export type TipoNotificacion =
  | "CITA_CREADA"
  | "CITA_ACTUALIZADA"
  | "CITA_ELIMINADA"
  | "CITA_CANCELADA"
  | "CITA_CONFIRMADA"
  | "CITA_MODIFICADA"
  | "RECORDATORIO";

export interface Notificacion {
  id: number;
  titulo: string;
  mensaje: string;
  tipo: TipoNotificacion | string;
  leida: boolean;
  fechaCreacion: string;
  rolDestino: "ADMIN" | "CLIENTE" | "BARBERO" | string;
}