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
  limite?: number;
}): Promise<Producto[]> {
  const { data } = await api.get('/public/productos', { params });
  return data;
}

export async function listarProductosRelacionados(
  categoria: string,
  excluir: number
): Promise<Producto[]> {
  const { data } = await api.get('/public/productos/relacionados', {
    params: { categoria, excluir }
  });
  return data;
}

export async function obtenerImagenesProducto(codigo: string): Promise<{ archivo: string; codigo: string; letra: string }[]> {
  const codigoLimpio = codigo.replace(/\D/g, "");

  const { data } = await api.get<string[]>(`/public/productos/${codigoLimpio}/imagenes`);
  return data.map((nombre) => {
    const match = nombre.match(/^(\d+)([a-z])\.\w+$/i);
    return match
      ? { archivo: nombre, codigo: match[1], letra: match[2] }
      : { archivo: nombre, codigo: "", letra: "" };
  });
}
