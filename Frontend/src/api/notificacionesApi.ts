import api from "./axios";
import type { Notificacion } from "../types/Notificacion";

export const obtenerNotificacionesAdmin = async (): Promise<Notificacion[]> => {
  const response = await api.get<Notificacion[]>("/notificaciones/admin");
  return response.data;
};

export const obtenerNotificacionesNoLeidasAdmin = async (): Promise<
  Notificacion[]
> => {
  const response = await api.get<Notificacion[]>(
    "/notificaciones/admin/no-leidas"
  );
  return response.data;
};

export const marcarNotificacionComoLeida = async (
  id: number
): Promise<Notificacion> => {
  const response = await api.put<Notificacion>(`/notificaciones/${id}/leer`);
  return response.data;
};

export const eliminarNotificacion = async (id: number): Promise<void> => {
  await api.delete(`/notificaciones/${id}`);
};

export const obtenerNotificacionesPorCliente = async (
  clienteId: number
): Promise<Notificacion[]> => {
  const response = await api.get<Notificacion[]>(
    `/notificaciones/cliente/${clienteId}`
  );
  return response.data;

};

export const obtenerNotificacionesPorBarbero = async (
  barberoId: number
): Promise<Notificacion[]> => {
  const response = await api.get<Notificacion[]>(
    `/notificaciones/barbero/${barberoId}`
  );
  return response.data;
};