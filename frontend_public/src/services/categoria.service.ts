import api from './api';
import type { Categoria } from '@/types/producto.type';

export async function listarCategorias(): Promise<Categoria[]> {
  const { data } = await api.get('/categorias');
  return data;
}
