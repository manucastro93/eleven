import { crearSesionAnonima, obtenerSesionActual, vincularSesionAnonimaACliente } from '@/services/sesionAnonima.service';
import { obtenerClienteDeLocalStorage } from './localStorage';

// Para App (sin esperar el id)
export async function asegurarSesionAnonimaOnly(): Promise<void> {
  try {
    await obtenerSesionActual();
    const clienteId = obtenerClienteDeLocalStorage();
    if(clienteId?.id)
      await vincularSesionAnonimaACliente(clienteId?.id);
  } catch (e) {
      console.log("asegurarSesionAnonimaOnly crear")
      await crearSesionAnonima();
  }
}

// Para el resto (que necesita el id)
export async function asegurarSesionAnonima(): Promise<string> {
  try {
    const sesion = await obtenerSesionActual();
    const clienteId = obtenerClienteDeLocalStorage();
    if(clienteId?.id)
      await vincularSesionAnonimaACliente(clienteId?.id);
    return String(sesion.id);
  } catch (e) {
      const sesion = await crearSesionAnonima();
      const clienteId = obtenerClienteDeLocalStorage();
      if(clienteId?.id)
        await vincularSesionAnonimaACliente(clienteId?.id);
      return String(sesion.id);
  }
}
