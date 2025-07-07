export interface EstadoPedido {
  id: number;
  nombre: string;
  orden: number;
  estadoEdicion: boolean;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
}