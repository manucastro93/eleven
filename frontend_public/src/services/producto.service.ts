import api from './api';
import type { Producto } from '@/types/producto.type';

export async function obtenerProductos(): Promise<Producto[]> {
  const { data } = await api.get('/public/productos');
  return data;
}

export async function obtenerProductoPorSlug(slug: string): Promise<Producto> {
  const { data } = await api.get(`/public/productos/slug/${slug}`);
  return data;
}

export async function listarProductos(params: {
  categoria?: string;
  busqueda?: string;
  orden?: string;
  pagina?: number;
}): Promise<Producto[]> {
  const { data } = await api.get('/public/productos', { params });
  return data;
}
