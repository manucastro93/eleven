import { apiFetch } from "./api";
import { Categoria } from "@/types/categoria";
const API_URL = import.meta.env.VITE_API_URL || "";

export async function listarCategorias(): Promise<Categoria[]> {
  return apiFetch<Categoria[]>("/categorias");
}

export async function listarCategoriasAdmin(params: any): Promise<{
  categorias: Categoria[];
  totalPages: number;
  totalCount: number;
}> {
  const query = new URLSearchParams(params).toString();
  return apiFetch(`/categorias/admin/categorias?${query}`);
}

export async function actualizarOrdenCategorias(ids: { id: number; orden: number }[]) {
  return apiFetch(`/categorias/admin/categorias/orden`, {
    method: "PUT",
    body: JSON.stringify({ ids }),
    headers: { "Content-Type": "application/json" },
  });
}

export async function actualizarDestacadaCategoria(id: number, destacada: boolean) {
  return apiFetch(`/categorias/admin/categorias/${id}/destacada`, {
    method: "PUT",
    body: JSON.stringify({ destacada }),
    headers: { "Content-Type": "application/json" },
  });
}

export async function actualizarImagenCategoria(id: number, imagenFile: File) {
  const formData = new FormData();
  formData.append("imagen", imagenFile);

  const res = await fetch(`${API_URL}/categorias/admin/categorias/${id}/imagen`, {
    method: "PUT",
    credentials: "include",
    body: formData,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || "Error al subir imagen");
  }

  return await res.json();
}


