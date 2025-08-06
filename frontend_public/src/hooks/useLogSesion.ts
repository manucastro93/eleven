import { registrarLog } from '@/services/logSesion.service';
import { startTime } from '@/utils/log';

export function useLogSesion() {
  return async (
    accion: string,
    extraData?: any,
    opts?: { url?: string; tiempoEnPagina?: number; referrer?: string }
  ) => {
    let tiempoEnPaginaFinal = opts?.tiempoEnPagina;
    if (typeof tiempoEnPaginaFinal !== "number") {
      tiempoEnPaginaFinal = Math.round((Date.now() - startTime) / 1000);
    }
    try {
      await registrarLog({
        url: opts?.url || window.location.pathname,
        accion,
        tiempoEnPagina: tiempoEnPaginaFinal,
        referrer: opts?.referrer || document.referrer,
        extraData,
      });
    } catch (err) {
      if (import.meta.env.DEV) console.error("Error registrando log sesión", err);
    }
  };
}
