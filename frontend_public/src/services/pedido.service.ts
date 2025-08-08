import api from './api';
import type { Pedido, PedidoResumen } from '@/types/pedido.type';

export async function obtenerPedidosPorCliente(clienteId: number): Promise<PedidoResumen[]> {
  const { data } = await api.get(`/public/pedidos/cliente/${clienteId}`);
  console.log(data)
  return data;
}

export async function obtenerPedidosPorIP(): Promise<PedidoResumen[]> {
  const { data } = await api.get('/pedidos/publico');
  return data;
}

export async function obtenerPedido(id: number): Promise<Pedido> {
  const { data } = await api.get(`/public/pedidos/${id}`);
  return data;
}

export async function cancelarPedido(id: number): Promise<void> {
  await api.patch(`/public/pedidos/${id}/cancelar`);
}

export async function obtenerPedidoPorId(pedidoId: number) {
  const res = await api.get(`/public/pedidos/${pedidoId}`);
  return res.data[0];
}

export async function iniciarEdicionPedido(id: number): Promise<Pedido> {
  const { data } = await api.patch(`/public/pedidos/${id}/editar`);
  return data;
}

export async function finalizarEdicionPedido(id: number): Promise<Pedido> {
  const { data } = await api.patch(`/public/pedidos/${id}/finalizar-edicion`);
  return data;
}

export async function confirmarEdicionPedido(
  pedidoId: number,
  data: {
    carritoId: number;
    direccion?: string;
    localidad?: string;
    provincia?: string;
    codigoPostal?: string;
    formaEnvio?: string;
    transporte?: string;
    formaPago?: string;
  }
): Promise<void> {
  await api.put(`/public/pedidos/${pedidoId}/confirmar-edicion`, data);
}
