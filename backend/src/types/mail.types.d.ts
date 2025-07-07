
export interface DatosMailPedidoNuevo {
  destinatario: string;
  pedidoId: number;
}

export interface DatosMailEstadoActualizado {
  destinatario: string;
  pedidoId: number;
  nuevoEstado: string;
}
