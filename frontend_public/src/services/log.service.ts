import api from '@/axios';

export async function registrarLog(data: any) {
  return (await api.post('/logs-sesion', data)).data;
}