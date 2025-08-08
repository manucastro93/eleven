import api from './api';
import type {
  CarritoPayload,
  AgregarProductoPayload,
  ConfirmarCarritoPayload
} from '@/types/carrito.type';
import type { Pedido } from "@/types/pedido.type";

export async function getCarritoActivo(clienteId: number) {
  const response = await api.get(`/public/carritos/${clienteId}/activo`);
  return response.data;
}

export async function crearCarrito(data: CarritoPayload) {
  const response = await api.post('/public/carritos', data);
  return response.data;
}

export async function agregarProductoACarrito(data: AgregarProductoPayload) {
  const response = await api.post(`/public/carritos/${data.carritoId}`, {
    productos: [
      {
        productoId: data.productoId,
        cantidad: data.cantidad,
        precioUnitario: data.precioUnitario,
        observaciones: data.observaciones || null
      }
    ]
  });
  return response.data;
}

export async function eliminarProductoDeCarrito(carritoId: number, productoId: number) {
  const response = await api.delete(`/public/carritos/${carritoId}/producto/${productoId}`);
  return response.data;
}

export async function confirmarCarrito(carritoId: number, payload: ConfirmarCarritoPayload) {
  const response = await api.post(`/public/carritos/${carritoId}/confirmar`, payload);
  return response.data;
}

export async function getCarritoActivoPorSesion(sesionAnonimaId: string) {
  const response = await api.get(`/public/carritos/sesion/${sesionAnonimaId}/activo`);
  return response.data;
}

export async function actualizarCantidadProductoCarrito(
  carritoId: number,
  productoId: number,
  cantidad: number,
  observaciones: string
) {
  const response = await api.put(`/public/carritos/${carritoId}/productos/${productoId}`, {
    cantidad, observaciones
  });
  return response.data;
}

export async function actualizarObservacionesEnCarrito(  carritoId: number,
  productoId: number,
  cantidad: number,
  observaciones: string
) {
  const response = await api.put(`/public/carritos/${carritoId}/productos/${productoId}`, {
    observaciones, cantidad
  });
  return response.data;
}

export async function actualizarObservacionesGeneralEnCarrito(carritoId: number, observaciones: string) {
  const response = await api.put(`/public/carritos/${carritoId}/observaciones-general`, { observaciones });
  return response.data;
}

export async function duplicarPedidoACarrito(pedido: Pedido, clienteId: number) {
  // 1. Borra el carrito actual local
  localStorage.removeItem('carrito');
  localStorage.removeItem('carritoId');

  // 2. Crear carrito con clienteId
  const resCarrito = await api.post('/public/carritos', {
    clienteId,
    observaciones: pedido.observaciones ?? "",
    total: 0
  });
  const carritoId = resCarrito.data.id;

  // 3. Agregá todos los productos
  for (const prod of pedido.productos) {
    await api.post(`/public/carritos/${carritoId}`, {
      productos: [{
        carritoId,
        productoId: prod.producto.id,
        cantidad: prod.cantidad,
        precioUnitario: prod.precio,
        observaciones: prod.observaciones,
      }]
    });
  }

  // 4. Traé el carrito actualizado del backend
  const carritoRes = await api.get(`/public/carritos/${carritoId}`);
  const carritoServer = carritoRes.data;

  // 5. Mapear productos reales del backend a formato local
  const itemsCarrito = carritoRes.data.items.map((item: any) => ({
    id: item.producto.id,
    nombre: item.producto.nombre,
    codigo: item.producto.codigo,
    precio: Number(item.precioUnitario),
    cantidad: item.cantidad,
    imagen: item.producto.imagen || "",
    observaciones: item.observaciones ?? "",
    slug: item.producto.slug || "",
  }));

  localStorage.setItem('carrito', JSON.stringify(itemsCarrito));
  localStorage.setItem('carritoId', carritoId);

  return itemsCarrito;

  return carritoId;
}

export async function obtenerEstadoEdicionCarrito(carritoId: number): Promise<{ estadoEdicion: boolean; fechaEdicion: string | null; }> {
  const { data } = await api.get(`/public/carritos/${carritoId}/estado-edicion`);
  return data;
}

export async function finalizarEdicionCarrito(carritoId: number): Promise<void> {
  await api.patch(`/public/carritos/${carritoId}/finalizar-edicion`);
}