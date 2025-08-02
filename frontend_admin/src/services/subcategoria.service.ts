import { apiFetch } from "./api";
import type { Subcategoria } from "@/types/subcategoria";

export async function listarSubcategorias(categoriaId?: number): Promise<Subcategoria[]> {
  const query = categoriaId ? `?categoriaId=${categoriaId}` : "";
  return apiFetch<Subcategoria[]>(`/subcategorias${query}`);
}
