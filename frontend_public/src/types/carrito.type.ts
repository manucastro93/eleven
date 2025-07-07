export interface CarritoPayload {
  clienteId: number;
  ipId: number;
  total: number;
  observaciones?: string;
}

export interface AgregarProductoPayload {
  carritoId: number;
  productoId: number;
  cantidad: number;
  precioUnitario: number;
  observaciones?: string;
}

export interface ConfirmarCarritoPayload {
  metodoEnvioId: number;
  metodoPagoId: number;
}
