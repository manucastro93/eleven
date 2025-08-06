import { crearSesionAnonima, obtenerSesionActual } from '@/services/sesionAnonima.service';

// Para App (sin esperar el id)
export async function asegurarSesionAnonimaOnly(): Promise<void> {
  try {
    await obtenerSesionActual();
  } catch (e) {
    await crearSesionAnonima();
  }
}

// Para el resto (que necesita el id)
export async function asegurarSesionAnonima(): Promise<string> {
  try {
    const sesion = await obtenerSesionActual();
    return String(sesion.id);
  } catch (e) {
    const sesion = await crearSesionAnonima();
    return String(sesion.id);
  }
}
