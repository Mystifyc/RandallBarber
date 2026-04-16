import api from "./axios";

export interface Servicio {
  id: number;
  nombre: string;
  duracion: number;
  precio: number;
}

export interface CrearServicioDto {
  nombre: string;
  duracion: number;
  precio: number;
}

export interface ActualizarServicioDto {
  nombre: string;
  duracion: number;
  precio: number;
}

export const obtenerServicios = async (): Promise<Servicio[]> => {
  const response = await api.get<Servicio[]>("/servicios");
  return response.data;
};

export const obtenerServicioPorId = async (id: number): Promise<Servicio> => {
  const response = await api.get<Servicio>(`/servicios/${id}`);
  return response.data;
};

export const crearServicio = async (servicio: CrearServicioDto): Promise<Servicio> => {
  const response = await api.post<Servicio>("/servicios", servicio);
  return response.data;
};

export const actualizarServicio = async (
  id: number,
  servicio: ActualizarServicioDto
): Promise<Servicio> => {
  const response = await api.put<Servicio>(`/servicios/${id}`, servicio);
  return response.data;
};

export const eliminarServicio = async (id: number): Promise<void> => {
  await api.delete(`/servicios/${id}`);
};