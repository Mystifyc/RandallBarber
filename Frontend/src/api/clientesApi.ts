import api from "./axios";

export interface Cliente {
  id: number;
  nombre: string;
  telefono: string;
  correo: string;
}

export interface CrearClienteDto {
  nombre: string;
  telefono: string;
  correo: string;
}

export interface ActualizarClienteDto {
  nombre: string;
  telefono: string;
  correo: string;
}

export const obtenerClientes = async (): Promise<Cliente[]> => {
  const response = await api.get<Cliente[]>("/clientes");
  return response.data;
};

export const obtenerClientePorId = async (id: number): Promise<Cliente> => {
  const response = await api.get<Cliente>(`/clientes/${id}`);
  return response.data;
};

export const crearCliente = async (cliente: CrearClienteDto): Promise<Cliente> => {
  const response = await api.post<Cliente>("/clientes", cliente);
  return response.data;
};

export const actualizarCliente = async (
  id: number,
  cliente: ActualizarClienteDto
): Promise<Cliente> => {
  const response = await api.put<Cliente>(`/clientes/${id}`, cliente);
  return response.data;
};

export const eliminarCliente = async (id: number): Promise<void> => {
  await api.delete(`/clientes/${id}`);
};