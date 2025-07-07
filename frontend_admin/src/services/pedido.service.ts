import { apiFetch } from "./api";
import type { Pedido } from "@/types/pedido";

export interface ListarPedidosParams {
  search?: string;
  clienteId?: number | null;
  estadoId?: number | null;
  page?: number;
  limit?: number;
  orderBy?: string;
  orderDir?: "ASC" | "DESC";
}

export interface ListarPedidosResponse {
  pedidos: Pedido[];
  total: number;
  page: number;
  totalPages: number;
}

export async function listarPedidos(params: ListarPedidosParams): Promise<ListarPedidosResponse> {
  const query = new URLSearchParams();

  query.set("search", params.search ?? "");

  const limit = params.limit ?? 20;
  const page = params.page ?? 1;
  const offset = (page - 1) * limit;

  query.set("limit", limit.toString());
  query.set("offset", offset.toString());

  if (params.clienteId) query.set("clienteId", params.clienteId.toString());
  if (params.estadoId) query.set("estadoId", params.estadoId.toString());
  if (params.orderBy) query.set("orderBy", params.orderBy);
  if (params.orderDir) query.set("orderDir", params.orderDir);

  const res = await apiFetch<{ count: number; rows: Pedido[] }>(`/pedidos?${query.toString()}`);

  return {
    pedidos: res.rows,
    total: res.count,
    page,
    totalPages: Math.ceil(res.count / limit),
  };
}

export async function obtenerPedidoPorId(id: number): Promise<Pedido> {
  const res = await apiFetch<{ pedido: Pedido }>(`/pedidos/${id}`);
  return res.pedido;
}
