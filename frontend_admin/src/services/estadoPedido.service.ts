import { apiFetch } from "./api";
import type { EstadoPedido } from "@/types/estadoPedido";

export async function listarEstadosPedido(): Promise<EstadoPedido[]> {
  const res = await apiFetch<{ estados: EstadoPedido[] }>("/estado-pedido");
  return res.estados;
}
