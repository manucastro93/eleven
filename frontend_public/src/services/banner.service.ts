import api from './api';
import type { Banner } from '@/types/banner.type';

export async function listarBanners(): Promise<{ banners: Banner[]; total: number }> {
  const { data } = await api.get('/banners');
  return data;
}
