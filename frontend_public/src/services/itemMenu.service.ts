import api from './api';
import type { ItemMenu } from '@/types/itemMenu.type';
import type { Producto } from "@/types/producto.type";

export async function listarItemsMenu(): Promise<ItemMenu[]> {
  const { data } = await api.get('/items-menu');
  return data;
}

export interface ItemMenuConProductos extends ItemMenu {
  productos: Producto[];
}

export async function obtenerItemMenuConProductos(slug: string): Promise<ItemMenuConProductos> {
  const { data } = await api.get(`/public/items-menu/${slug}`);
  return data;
}
