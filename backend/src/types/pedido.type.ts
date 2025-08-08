// src/types/pedido.type.ts

export type PedidoProducto = {
  productoId: number;
  cantidad: number;
  precio: number;
  observaciones?: string;
  producto: {
    id: number;
    nombre: string;
    descripcion: string;
    codigo: string;
    precio: number;
    slug: string;
    activo: boolean;
    imagenes: {
      id: number;
      url: string;
      orden: number;
    }[];
    categoria: {
      id: number;
      nombre: string;
      slug: string;
      orden: number;
    };
  };
};

export type PedidoResumen = {
  id: number;
  clienteId: number;
  total: number;
  estadoPedidoId: number;
  estadoEdicion: boolean;
  fechaEdicion?: Date | null;
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
  createdAt: string;
  productos: PedidoProducto[];
};
