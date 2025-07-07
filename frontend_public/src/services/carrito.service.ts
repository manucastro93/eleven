import api from '@/services/api';
import type {
  CarritoPayload,
  AgregarProductoPayload,
  ConfirmarCarritoPayload
} from '@/types/carrito.type';

export async function getCarritoActivo(clienteId: number) {
  const response = await api.get(`/carritos/${clienteId}/activo`);
  return response.data;
}

export async function crearCarrito(data: CarritoPayload) {
  const response = await api.post('/carritos', data);
  return response.data;
}

export async function agregarProductoACarrito(data: AgregarProductoPayload) {
  const response = await api.put(`/carritos/${data.carritoId}`, {
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
  const response = await api.delete(`/carritos/${carritoId}/producto/${productoId}`);
  return response.data;
}

export async function confirmarCarrito(id: number, payload: ConfirmarCarritoPayload) {
  const response = await api.post(`/carritos/${id}/confirmar`, payload);
  return response.data;
}
