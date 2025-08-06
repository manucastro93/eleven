import api from './api';

export async function crearSesionAnonima(): Promise<{ id: number; uuid: string }> {
  const { data } = await api.post('/public/sesion-anonima');
  return data;
}

export async function obtenerSesionActual(): Promise<{ id: number; uuid: string }> {
  const { data } = await api.get('/public/sesion-anonima');
  return data;
}

export async function vincularSesionAnonimaACliente(clienteId: number) {
  console.log("envia cliente id a vincular: ",clienteId)
  const { data } = await api.post('/public/sesion-anonima/vincular-cliente', { clienteId });
  return data;
}