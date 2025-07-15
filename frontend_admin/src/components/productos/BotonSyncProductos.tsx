import { createSignal, onMount } from "solid-js";
import io from "socket.io-client";
import { sincronizarProductosDesdeDux } from "@/services/producto.service";

export default function BotonSyncProductos(props: { onFinalizado?: (ok: boolean) => void }) {
  const [progresoSync, setProgresoSync] = createSignal(0);
  const [syncEnCurso, setSyncEnCurso] = createSignal(false);

  onMount(() => {
    const socket = io(import.meta.env.VITE_SOCKET_URL);

    socket.on("sync:progreso", (data: any) => {
      setProgresoSync(data.porcentaje ?? 0);
    });

    socket.on("connect", () => {
      console.log("✅ WebSocket conectado");
    });
  });

  async function iniciarSincronizacion() {
    setSyncEnCurso(true);
    setProgresoSync(0);
    try {
      await sincronizarProductosDesdeDux();
      props.onFinalizado?.(true);
    } catch (error) {
      console.error("❌ Error al sincronizar productos:", error);
      props.onFinalizado?.(false);
    } finally {
      setSyncEnCurso(false);
    }
  }

  return (
    <button
      class="relative w-[200px] h-10 border rounded overflow-hidden bg-blue-500 text-sm font-semibold ml-auto mb-4"
      disabled={syncEnCurso()}
      onClick={iniciarSincronizacion}
    >
      <div
        class="absolute top-0 left-0 h-full bg-green-500 transition-all duration-200"
        style={{
          width: `${progresoSync()}%`,
          opacity: syncEnCurso() ? 0.6 : 0,
        }}
      />
      <span class="relative z-10 text-white">
        {syncEnCurso() ? `Sincronizando... ${progresoSync().toFixed(0)}%` : "Sincronizar productos"}
      </span>
    </button>
  );
}
