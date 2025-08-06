import api from './api';
import type { ClienteFormulario, Cliente } from '@/types/cliente.type';

export async function crearCliente(data: Cliente): Promise<Cliente> {
  const response = await api.post('/clientes', data);
  return response.data;
}

export async function buscarClientePorCuit(cuitOCuil: string): Promise<Cliente | null> {
  try {
    const response = await api.get(`/clientes/cuit/${cuitOCuil}`);
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 404) return null;
    throw error;
  }
}
