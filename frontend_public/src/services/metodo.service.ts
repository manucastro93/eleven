import api from '@/axios';

export async function getMetodosEnvio() {
  return (await api.get('/metodos-envio')).data;
}

export async function getMetodosPago() {
  return (await api.get('/metodos-pago')).data;
}