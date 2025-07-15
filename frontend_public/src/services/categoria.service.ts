import api from './api';
import type { Categoria } from '@/types/categoria.type';

export async function listarCategorias(): Promise<Categoria[]> {
  const { data } = await api.get('/categorias');
  return data;
}
