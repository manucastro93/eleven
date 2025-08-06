import { createSignal, Show, For, createResource } from "solid-js";
import type { PedidoResumen } from "@/types/pedido.type";
import { obtenerPedidosPorCliente } from "@/services/pedido.service";
import { formatearPrecio } from "@/utils/formato";
import ModalDetallePedido from "@/components/MisPedidos/ModalDetallePedido";
import { obtenerClienteDeLocalStorage } from "@/utils/localStorage";

// Utilidad para formatear la fecha
function formatearFecha(fecha: string): string {
  const d = new Date(fecha);
  return `${d.getDate().toString().padStart(2, "0")}/${(d.getMonth() + 1)
    .toString()
    .padStart(2, "0")}/${d.getFullYear()}`;
}

const ESTADO_PEDIDO_NOMBRE: Record<number, string> = {
  1: "Pendiente",
  2: "Preparando",
  3: "Finalizado",
  4: "Rechazado",
  5: "Cancelado"
};

// Mapeo de colores de estado de pedido
const getColor = (estadoId: number) => {
  switch (estadoId) {
    case 1: return "bg-blue-100";
    case 2: return "bg-yellow-100";
    case 3: return "bg-green-100";
    case 5: return "bg-red-100";
    default: return "bg-gray-100";
  }
};

export default function MisPedidos() {
  const [pedidoSeleccionado, setPedidoSeleccionado] = createSignal<number | null>(null);
  const cliente = obtenerClienteDeLocalStorage();

  // Si no hay cliente logueado, mostrar mensaje
  if (!cliente?.id) {
    return (
      <div class="max-w-2xl mx-auto py-16 text-center text-red-600">
        Tenés que iniciar sesión para ver tus pedidos.
      </div>
    );
  }

  const [pedidos] = createResource<PedidoResumen[], number | false>(
    () => cliente.id ?? false,
    (id) => id ? obtenerPedidosPorCliente(id) : Promise.resolve([])
  );

  return (
    <div class="max-w-4xl mx-auto px-4 py-8">
      <h1 class="text-2xl font-bold mb-6">Mis pedidos</h1>

      <Show when={pedidos.loading}>
        <div class="text-center text-gray-500 py-10">Cargando pedidos...</div>
      </Show>

      <Show when={pedidos.error}>
        <div class="text-center text-red-500 py-10">Ocurrió un error al cargar los pedidos.</div>
      </Show>

      <Show when={pedidos() && pedidos()!.length > 0} fallback={
        <Show when={!pedidos.loading && !pedidos.error}>
          <div class="text-center text-gray-500 py-10">No tenés pedidos todavía.</div>
        </Show>
      }>
        <For each={pedidos()}>
          {(pedido) => (
            <div
              class={`rounded shadow p-4 mb-4 cursor-pointer transition ${getColor(pedido.estadoPedidoId)}`}
              onClick={() => setPedidoSeleccionado(pedido.id)}
            >
              <div class="flex justify-between">
                <div>
                  <p class="font-semibold">Pedido #{pedido.id}</p>
                  <p class="text-sm mt-1">
                    <span class="font-bold">Estado:</span>{" "}
                    {ESTADO_PEDIDO_NOMBRE[pedido.estadoPedidoId] ?? "Desconocido"}
                  </p>
                  <p class="text-sm text-gray-600">Fecha: {formatearFecha(pedido.createdAt)}</p>
                </div>
                <div class="text-right">
                  <p class="font-semibold text-sm">Total: {formatearPrecio(pedido.total)}</p>
                </div>
              </div>
            </div>
          )}
        </For>
      </Show>

      <Show when={pedidoSeleccionado()}>
        <ModalDetallePedido
          pedido={pedidos()?.find((p) => p.id === pedidoSeleccionado())!}
          onClose={() => setPedidoSeleccionado(null)}
        />
      </Show>
    </div>
  );
}
