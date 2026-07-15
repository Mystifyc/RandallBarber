import api from "./axios";

export interface ReferenciaEntidad {
  id: number;
}

export interface Cita {
  id: number;
  dia: string;
  hora: string;
  estado?: string;
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

export interface HistorialCitaCliente {
  id: number;
  dia: string;
  hora: string;
  servicio: string;
  estado: string;
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

export const obtenerHistorialCitasCliente = async (
  clienteId: number
): Promise<HistorialCitaCliente[]> => {
  const response = await api.get<HistorialCitaCliente[]>(
    `/citas/cliente/${clienteId}/historial`
  );

  return response.data;
};

export interface FiltrosCitas {
  clienteId?: number;
  barberoId?: number;
  dia?: string;
}

export const filtrarCitas = async (
  filtros: FiltrosCitas
): Promise<Cita[]> => {
  const response = await api.get<Cita[]>("/citas/filtrar", {
    params: filtros,
    headers: {
      "X-Rol-Usuario": "ADMIN",
    },
  });

  return response.data;
};

export const obtenerCitasCanceladas = async (): Promise<Cita[]> => {
  const response = await api.get<Cita[]>("/citas/canceladas", {
    headers: {
      "X-Rol-Usuario": "ADMIN",
    },
  });

  return response.data;
};

export const obtenerHistorialCitasBarbero = async (
  barberoId: number
): Promise<Cita[]> => {
  const response = await api.get<Cita[]>(
    `/citas/barbero/${barberoId}/historial`,
    {
      headers: {
        "X-Rol-Usuario": "BARBERO",
        "X-Usuario-Id": String(barberoId),
      },
    }
  );

  return response.data;
};

export const obtenerCitasActivasCliente = async (
  clienteId: number
): Promise<Cita[]> => {
  const response = await api.get<Cita[]>(
    `/citas/cliente/${clienteId}/activas`,
    {
      headers: {
        "X-Rol-Usuario": "CLIENTE",
        "X-Usuario-Id": String(clienteId),
      },
    }
  );

  return response.data;
};