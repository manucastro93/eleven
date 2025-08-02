import { apiFetch } from "./api";
import type { ItemMenu } from "@/types/itemMenu";

const API_URL = import.meta.env.VITE_API_URL || "";

export async function listarItemsMenu(): Promise<ItemMenu[]> {
  return apiFetch<ItemMenu[]>("/items-menu");
}

export async function crearItemMenu(data: {
  nombre: string;
  icono?: string;
  activo?: boolean;
}): Promise<ItemMenu> {
  return apiFetch<ItemMenu>("/items-menu", {
    method: "POST",
    body: JSON.stringify(data),
    headers: { "Content-Type": "application/json" },
  });
}

export async function editarItemMenu(id: number, data: Partial<ItemMenu>): Promise<ItemMenu> {
  return apiFetch<ItemMenu>(`/items-menu/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
    headers: { "Content-Type": "application/json" },
  });
}

export async function eliminarItemMenu(id: number): Promise<void> {
  return apiFetch<void>(`/items-menu/${id}`, {
    method: "DELETE",
  });
}

export async function actualizarOrdenItemsMenu(items: { id: number; orden: number }[]) {
  return apiFetch(`/items-menu/orden`, {
    method: "PUT",
    body: JSON.stringify(items),
    headers: { "Content-Type": "application/json" },
  });
}


