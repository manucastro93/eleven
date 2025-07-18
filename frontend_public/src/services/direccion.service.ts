import api from '@/axios';

export async function buscarDirecciones(localidadId: number, query: string) {
  const res = await api.get('/direcciones', {
    params: { localidadId, query }
  });
  return res.data;
}