import api from './api';

export async function crearSesionAnonima(): Promise<{ id: number; uuid: string }> {
  const { data } = await api.post('/public/sesion-anonima');
  return data;
}
