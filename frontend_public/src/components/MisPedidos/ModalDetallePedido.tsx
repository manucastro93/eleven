import { createSignal, Show, For } from "solid-js";
import type { Pedido } from "@/types/pedido.type";
import { formatearPrecio } from "@/utils/formato";

export default function ModalDetallePedido(props: {
  pedido: Pedido;
  onClose: () => void;
  onCancelar?: (id: number) => void;
  onEditar?: (id: number) => void;
  onDuplicar?: (id: number) => void;
}) {
  const { pedido, onClose, onCancelar, onEditar, onDuplicar } = props;

  const puedeCancelar = pedido.estadoPedidoId === 1;
  const puedeEditar = pedido.estadoPedidoId === 1;
  const puedeDuplicar = true;

  return (
    <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div class="bg-white max-w-2xl w-full rounded-lg shadow-lg overflow-hidden">
        {/* Header */}
        <div class="flex justify-between items-center p-4 border-b">
          <h2 class="text-lg font-semibold">Detalle del pedido #{pedido.id}</h2>
          <button onClick={onClose} class="text-gray-500 hover:text-black">✕</button>
        </div>

        {/* Productos */}
        <div class="p-4 space-y-4 max-h-[60vh] overflow-y-auto">
          <For each={pedido.productos}>
            {(prod) => (
              <div class="flex gap-4 items-center">
                <img
                  src={prod.producto.imagenes[0]?.url || "/img/productos/default.png"}
                  alt={prod.producto.nombre}
                  class="w-16 h-16 object-cover rounded"
                />
                <div>
                  <p class="font-semibold">{prod.producto.nombre}</p>
                  <p class="text-sm text-gray-600">Cantidad: {prod.cantidad}</p>
                  <p class="text-sm">Precio: {formatearPrecio(prod.producto.precio)}</p>
                </div>
              </div>
            )}
          </For>
        </div>

        {/* Footer */}
        <div class="border-t p-4 flex justify-between items-center">
          <p class="font-semibold">Total: {formatearPrecio(pedido.total)}</p>

          <div class="flex gap-2">
            <Show when={puedeCancelar}>
              <button
                onClick={() => onCancelar?.(pedido.id)}
                class="bg-red-600 hover:bg-red-700 text-white text-sm px-3 py-1 rounded"
              >
                Cancelar
              </button>
            </Show>

            <Show when={puedeEditar}>
              <button
                onClick={() => onEditar?.(pedido.id)}
                class="bg-yellow-500 hover:bg-yellow-600 text-white text-sm px-3 py-1 rounded"
              >
                Editar
              </button>
            </Show>

            <Show when={puedeDuplicar}>
              <button
                onClick={() => onDuplicar?.(pedido.id)}
                class="bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-1 rounded"
              >
                Duplicar
              </button>
            </Show>
          </div>
        </div>
      </div>
    </div>
  );
}
