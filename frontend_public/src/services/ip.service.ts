import api from './api';

export async function getIP(id: number) {
  return (await api.get(`/ips/${id}`)).data;
}