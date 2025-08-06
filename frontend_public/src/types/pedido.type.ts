import type { Cliente } from './cliente.type';
import type { Producto } from './producto.type';

export interface PedidoProducto {
  productoId: number;
  cantidad: number;
  precio: number;
  producto: Producto;
  observaciones: string;
}

export interface PedidoResumen {
  id: number;
  estadoPedidoId: number;
  estadoEdicion: boolean;
  formaEnvio: string;
  transporte?: string;
  formaPago: string;
  telefono: string;
  email: string;
  nombreFantasia: string;
  cuit: string;
  categoriaFiscal: string;
  razonSocial: string;
  direccion: string;
  localidad: string;
  provincia: string;
  codigoPostal: string;
  observaciones?: string | null;
  total: number;
  createdAt: string;
  productos: PedidoProducto[];
}

export interface Pedido {
  id: number;
  // cliente?: Cliente; // solo si hacés include, si no, sacalo
  productos: PedidoProducto[];
  estadoPedidoId: number;
  estadoEdicion: boolean;
  formaEnvio: string;
  transporte?: string;
  formaPago: string;
  telefono: string;
  email: string;
  nombreFantasia: string;
  cuit: string;
  categoriaFiscal: string;
  razonSocial: string;
  direccion: string;
  localidad: string;
  provincia: string;
  codigoPostal: string;
  observaciones?: string | null;
  total: number;
  createdAt: string;
}

