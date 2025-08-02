import api from './api';

export async function enviarCodigoWhatsapp(numero: string): Promise<{ success: boolean }> {
  const { data } = await api.post('/whatsapp/enviar-codigo', { numero });
  return data;
}

export async function verificarCodigoWhatsapp(numero: string, codigo: string): Promise<{ success: boolean }> {
  const { data } = await api.post('/whatsapp/validar-codigo', { numero, codigo });
  return data;
}
