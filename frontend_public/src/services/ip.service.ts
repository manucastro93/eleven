import api from '@/axios';

export async function getIP(id: number) {
  return (await api.get(`/ips/${id}`)).data;
}