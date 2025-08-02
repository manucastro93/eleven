import api from './api';

export async function registrarLog(data: any) {
  return (await api.post('/logs-sesion', data)).data;
}