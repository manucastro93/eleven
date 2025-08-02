import api from './api';
import { ClienteDux } from '@/types/clienteDux.type';

export async function buscarClienteDuxPorCuit(cuit: string): Promise<ClienteDux | null> {
  try {
    const { data } = await api.get<{ encontrado: boolean, cliente: ClienteDux }>(
      `/public/clientesDux/buscar?cuit=${cuit}`
    );
    if (data.encontrado && data.cliente) return data.cliente;
    return null;
  } catch (err: any) {
    return null;
  }
}
