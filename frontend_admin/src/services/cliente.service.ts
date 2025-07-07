import { apiFetch } from "./api";
import type { Cliente } from "@/types/cliente";

export interface ListarClientesParams {
  search?: string;
  page?: number;
  limit?: number;
}

export interface ListarClientesResponse {
  clientes: Cliente[];
  total: number;
  page: number;
  totalPages: number;
}

export async function listarClientes(params: ListarClientesParams = {}): Promise<ListarClientesResponse> {
  const query = new URLSearchParams();

  query.set("search", params.search ?? "");

  const limit = params.limit ?? 20;
  const page = params.page ?? 1;
  const offset = (page - 1) * limit;

  query.set("limit", limit.toString());
  query.set("offset", offset.toString());

  const res = await apiFetch<{ count: number; rows: Cliente[] }>(`/clientes?${query.toString()}`);

  return {
    clientes: res.rows,
    total: res.count,
    page,
    totalPages: Math.ceil(res.count / limit),
  };
}

export async function obtenerClientePorId(id: number): Promise<Cliente> {
  const res = await apiFetch<{ cliente: Cliente }>(`/clientes/${id}`);
  return res.cliente;
}
