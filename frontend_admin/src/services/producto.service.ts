import { apiFetch, apiFetchVoid } from "./api";
import type { Producto } from "@/types/producto";

export interface ListarProductosParams {
  search?: string;
  categoriaId?: number | null;
  page?: number;
  limit?: number;
}

export interface ListarProductosResponse {
  productos: Producto[];
  total: number;
  page: number;
  totalPages: number;
}

export async function listarProductos(params: ListarProductosParams): Promise<ListarProductosResponse> {
  const query = new URLSearchParams();

  query.set("search", params.search ?? "");

  const limit = params.limit ?? 20;
  const page = params.page ?? 1;
  const offset = (page - 1) * limit;

  query.set("limit", limit.toString());
  query.set("offset", offset.toString());

  if (params.categoriaId) query.set("categoriaId", params.categoriaId.toString());

  const res = await apiFetch<{ count: number; rows: Producto[] }>(`/productos?${query.toString()}`);

  return {
    productos: res.rows,
    total: res.count,
    page,
    totalPages: Math.ceil(res.count / limit),
  };
}

export async function sincronizarProductosDesdeDux(): Promise<void> {
  await apiFetchVoid("/productos/sync-dux", {
    method: "POST"
  });
}