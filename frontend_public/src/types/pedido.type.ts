import type { Cliente } from './cliente.type';
import type { Producto } from './producto.type';

export interface PedidoResumen {
  id: number;
  estadoPedidoId: number;
  metodoEnvioId: number;
  metodoPagoId: number;
  total: number;
  observaciones?: string;
  createdAt: string;
  cliente: Cliente;
}

export interface PedidoProducto {
  productoId: number;
  cantidad: number;
  observaciones?: string;
  producto: Producto;
}

export interface Pedido {
  id: number;
  cliente: Cliente;
  productos: PedidoProducto[];
  estadoPedidoId: number;
  metodoEnvioId: number;
  metodoPagoId: number;
  observaciones?: string;
  total: number;
  createdAt: string;
}
