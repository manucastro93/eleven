export interface PedidoProducto {
  id: number;
  productoId: number;
  producto?: {
    nombre: string;
    codigo: string;
  };
  cantidad: number;
  precioUnitario: number;
}

export interface HistorialPedido {
  id: number;
  estadoId: number;
  estado?: {
    nombre: string;
  };
  fecha: string;
  observaciones?: string;
}

export interface Pedido {
  id: number;
  clienteId: number;
  cliente?: {
    nombre: string;
  };
  estadoPedidoId: number;
  estadoPedido?: {
    nombre: string;
  };
  fecha: string;
  total: number;
  productos?: PedidoProducto[];
  historial?: HistorialPedido[];
}
