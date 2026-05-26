import API_BASE_URL from "./axios";
import type { Barbero } from "../types/Barbero";
import type { Servicio } from "../types/Servicio";
import type { CitaRequest } from "../types/Cita";

export async function obtenerServicios(): Promise<Servicio[]> {
  const response = await fetch(`${API_BASE_URL}/servicio`);

  if (!response.ok) {
    throw new Error("No se pudieron cargar los servicios");
  }

  return response.json();
}

export async function obtenerBarberosActivos(): Promise<Barbero[]> {
  const response = await fetch(`${API_BASE_URL}/barberos/activos`);

  if (!response.ok) {
    throw new Error("No se pudieron cargar los barberos");
  }

  return response.json();
}

export async function obtenerHorasDisponibles(
  barberoId: number,
  dia: string
): Promise<string[]> {
  const response = await fetch(
    `${API_BASE_URL}/citas/disponibles?barberoId=${barberoId}&dia=${dia}`
  );

  if (!response.ok) {
    throw new Error("No se pudieron cargar los horarios disponibles");
  }

  return response.json();
}

export async function crearCita(cita: CitaRequest) {
  const response = await fetch(`${API_BASE_URL}/citas`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(cita),
  });

  if (!response.ok) {
    throw new Error("No se pudo agendar la cita");
  }

  return response.json();
}