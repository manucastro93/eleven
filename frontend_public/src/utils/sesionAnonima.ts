import { crearSesionAnonima } from '@/services/sesionAnonima.service';

export async function asegurarSesionAnonima(): Promise<number> {
  const cookieNombre = 'uuid_sesion';
  const existente = document.cookie
    .split('; ')
    .find(row => row.startsWith(`${cookieNombre}=`))
    ?.split('=')[1];

  if (existente) {
    const sesionId = Number(localStorage.getItem('sesionId'));
    if (sesionId) return sesionId;
  }

  const sesion = await crearSesionAnonima();

  // Guardar cookie por 1 día
  document.cookie = `${cookieNombre}=${sesion.uuid}; path=/; max-age=86400`;
  localStorage.setItem('sesionId', String(sesion.id));

  return sesion.id;
}
