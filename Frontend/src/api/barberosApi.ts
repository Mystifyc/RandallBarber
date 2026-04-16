import api from "./axios";

export interface Barbero {
  id: number;
  nombre: string;
  telefono: string;
  especialidad: string;
  activo: boolean;
}

export interface CrearBarberoDto {
  nombre: string;
  telefono: string;
  especialidad: string;
  activo: boolean;
}

export interface ActualizarBarberoDto {
  nombre: string;
  telefono: string;
  especialidad: string;
  activo: boolean;
}

export const obtenerBarberos = async (): Promise<Barbero[]> => {
  const response = await api.get<Barbero[]>("/barberos");
  return response.data;
};

export const obtenerBarberoPorId = async (id: number): Promise<Barbero> => {
  const response = await api.get<Barbero>(`/barberos/${id}`);
  return response.data;
};

export const crearBarbero = async (barbero: CrearBarberoDto): Promise<Barbero> => {
  const response = await api.post<Barbero>("/barberos", barbero);
  return response.data;
};

export const actualizarBarbero = async (
  id: number,
  barbero: ActualizarBarberoDto
): Promise<Barbero> => {
  const response = await api.put<Barbero>(`/barberos/${id}`, barbero);
  return response.data;
};

export const eliminarBarbero = async (id: number): Promise<void> => {
  await api.delete(`/barberos/${id}`);
};