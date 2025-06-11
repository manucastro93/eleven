import { PedidoProducto } from './PedidoProducto';

export interface Pedido {
  id: number;
  clienteId: number;
  productos: PedidoProducto[];
  total: number;
  estadoId: number;
  fecha: Date;
}
