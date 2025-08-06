import api from './api';
import type { Pedido, PedidoResumen } from '@/types/pedido.type';

export async function obtenerPedidosPorCliente(clienteId: number): Promise<PedidoResumen[]> {
  const { data } = await api.get(`/public/pedidos/${clienteId}`);
  return data;
}

export async function obtenerPedidosPorIP(): Promise<PedidoResumen[]> {
  const { data } = await api.get('/pedidos/publico');
  return data;
}

export async function obtenerPedido(id: number): Promise<Pedido> {
  const { data } = await api.get(`/pedidos/${id}`);
  return data;
}

export async function cancelarPedido(id: number): Promise<void> {
  await api.patch(`/public/pedidos/${id}/cancelar`);
}
