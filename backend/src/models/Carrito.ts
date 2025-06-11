import { CarritoProducto } from './CarritoProducto';

export interface Carrito {
  id: number;
  clienteId: number;
  productos: CarritoProducto[];
  creadoEn: Date;
}
