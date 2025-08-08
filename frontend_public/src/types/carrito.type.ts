export interface CarritoPayload {
  clienteId?: number;
  total?: number;
  sesionAnonimaId?: string;
  observaciones?: string;
  estadoEdicion: number;
}

export interface AgregarProductoPayload {
  carritoId: number;
  productoId: number;
  cantidad: number;
  precioUnitario: number;
  observaciones?: string;
}

export type ConfirmarCarritoPayload = {
  telefono: string;
  email: string;
  nombreFantasia: string;
  cuit: string;
  razonSocial: string;
  direccion: string;
  localidad: string;
  provincia: string;
  codigoPostal: string;
  categoriaFiscal?: string;
  formaEnvio: string;
  transporte: string;
  formaPago: string;
  observaciones?: string;
};
