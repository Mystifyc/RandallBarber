import api from "./axios";

export interface ReferenciaEntidad {
  id: number;
}

export interface Cita {
  id: number;
  dia: string;
  hora: string;
  cliente: ReferenciaEntidad;
  barbero: ReferenciaEntidad;
  servicio: ReferenciaEntidad;
}

export interface CrearCitaDto {
  dia: string;
  hora: string;
  cliente: ReferenciaEntidad;
  barbero: ReferenciaEntidad;
  servicio: ReferenciaEntidad;
}

export interface ActualizarCitaDto {
  dia: string;
  hora: string;
  cliente: ReferenciaEntidad;
  barbero: ReferenciaEntidad;
  servicio: ReferenciaEntidad;
}

export const obtenerCitas = async (): Promise<Cita[]> => {
  const response = await api.get<Cita[]>("/citas");
  return response.data;
};

export const obtenerCitaPorId = async (id: number): Promise<Cita> => {
  const response = await api.get<Cita>(`/citas/${id}`);
  return response.data;
};

export const crearCita = async (cita: CrearCitaDto): Promise<Cita> => {
  const response = await api.post<Cita>("/citas", cita);
  return response.data;
};

export const actualizarCita = async (
  id: number,
  cita: ActualizarCitaDto
): Promise<Cita> => {
  const response = await api.put<Cita>(`/citas/${id}`, cita);
  return response.data;
};

export const eliminarCita = async (id: number): Promise<void> => {
  await api.delete(`/citas/${id}`);
};

export const obtenerHorasDisponibles = async (
  barberoId: number,
  dia: string
): Promise<string[]> => {
  const response = await api.get<string[]>("/citas/disponibles", {
    params: {
      barberoId,
      dia,
    },
  });
  return response.data;
};