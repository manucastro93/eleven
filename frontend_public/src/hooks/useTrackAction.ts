// src/hooks/useTrackAction.ts
import { useLogSesion } from "@/hooks/useLogSesion";

type ExtraData = Record<string, any>;

export function useTrackAction(defaultUrl?: string) {
  const logSesion = useLogSesion();

  /**
   * Loguea una acción y ejecuta la función si se pasa.
   * Ej: para onClick, onSubmit, etc.
   */
  return async (
    accion: string,
    extraData?: ExtraData,
    cb?: () => void | Promise<void>
  ) => {
    await logSesion(accion, extraData, { url: defaultUrl });
    if (cb) await cb();
  };
}
