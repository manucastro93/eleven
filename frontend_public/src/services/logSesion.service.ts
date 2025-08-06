import api from './api';

export async function registrarLog(data: any) {
  return (await api.post('/public/logs-sesion', data)).data;
}