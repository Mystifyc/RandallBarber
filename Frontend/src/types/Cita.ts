export interface CitaRequest {
  dia: string;
  hora: string;
  servicio: {
    id: number;
  };
  cliente: {
    id: number;
  };
  barbero: {
    id: number;
  };
}