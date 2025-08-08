import { For, Show } from "solid-js";
import { A } from "@solidjs/router";
import { useCarrito } from "@/store/carrito";
import { formatearPrecio } from "@/utils/formato";
import { actualizarObservacionesGeneralEnCarrito } from "@/services/carrito.service"

export default function PasoResumen(props: {
  onSiguiente: () => void;
  modoEdicion?: boolean;
  tiempoRestante?: number;
  onConfirmarEdicion?: (formData: any) => void;
  pedidoEditando?: any;
}) {
  const {
    carrito,
    setCarrito,
    total,
    quitarDelCarrito,
    setPasoCarrito,
    observacionesGeneral,
    setObservacionesGeneral,
    actualizarCantidadEnCarrito,
    actualizarObservacionesEnCarrito,
    pedidoEditandoId,
    carritoId
  } = useCarrito();

  const actualizarObservacionesItem = async (id: number, cantidad: number, observaciones: string) => {
    try {
      await actualizarObservacionesEnCarrito(id, cantidad, observaciones);
      const actualizados = carrito().map((item) =>
        item.id === id ? { ...item, observaciones } : item
      );
      setCarrito(actualizados);
    } catch (error) {
      console.error("Error actualizando observaciones en backend:", error);
    }
  };

  const actualizarCantidadItem = async (id: number, cantidad: number, observaciones: string) => {
    try {
      await actualizarCantidadEnCarrito(id, cantidad, observaciones);
      const actualizados = carrito().map((item) =>
        item.id === id ? { ...item, cantidad } : item
      );
      setCarrito(actualizados);
    } catch (error) {
      console.error("Error actualizando cantidad en backend:", error);
    }
  };

  const actualizarObservacionGeneral = async (observaciones: string) => {
    setObservacionesGeneral(observaciones);
    //const carritoId = localStorage.getItem("carritoId");
    if (carritoId) {
      try {
        await actualizarObservacionesGeneralEnCarrito(Number(carritoId()), observaciones);
      } catch (err) {
        console.error("Error actualizando observaciones general en backend:", err);
      }
    }
  };

  function formatearTiempo(segundos: number) {
    const min = Math.floor(segundos / 60).toString().padStart(2, "0");
    const sec = (segundos % 60).toString().padStart(2, "0");
    return `${min}:${sec}`;
  }

  return (
    <>
      <Show when={props.modoEdicion}>
        <div class="mb-3 p-3 bg-yellow-100 border-l-4 border-yellow-400 rounded">
          <span class="font-semibold text-yellow-800">
            Estás editando el pedido #{pedidoEditandoId() ?? ""}
          </span>
          <Show when={typeof props.tiempoRestante === "number"}>
            <span class="ml-2 text-yellow-700 text-sm">
              <p>Ahora podés agregar, quitar productos navegando por la web. Al final del pedido también vas a poder modificar la forma de entrega, o de envío, etc.</p>
              <p>Tenés 30 minutos para hacer las modificaciones que quieras. Si pasado este tiempo no confirmas los cambios, el pedido se enviará sin cambios automáticamente.</p>
              <p>Tiempo restante: {formatearTiempo(props.tiempoRestante!)}.</p>
            </span>
          </Show>
        </div>
      </Show>
      <Show when={carrito().length > 0} fallback={<p class="p-5 text-sm text-gray-500">El carrito está vacío.</p>}>
        <div class="flex flex-col h-full">
          {/* Lista de productos */}
          <div class="flex-1 overflow-y-auto px-5 pt-5 space-y-5">
            <For each={carrito()}>
              {(item) => (
                <div class="flex flex-col sm:flex-row sm:items-center gap-4 border-b pb-4">
                  <A
                    href={`/productos/detalle/${item.slug}`}
                    class="block"
                    tabIndex={-1}
                  >
                    <img
                      src={item.imagen}
                      alt={item.nombre || "Producto"}
                      class="w-20 h-20 object-contain bg-white rounded"
                      loading="lazy"
                    />
                  </A>
                  <div class="flex-1 text-sm space-y-2">
                    <div class="flex justify-between items-start">
                      <A
                        href={`/productos/detalle/${item.slug}`}
                        class="font-medium hover:underline"
                      >
                        {item.nombre} ({item.codigo})
                      </A>
                      <button
                        onClick={() => quitarDelCarrito(item.id)}
                        class="text-red-500 text-xs"
                      >
                        Quitar
                      </button>
                    </div>

                    <div class="flex flex-wrap items-center gap-3 text-gray-600">
                      {/* Contador */}
                      <div class="flex items-center border border-gray-300 rounded overflow-hidden">
                        <button
                          type="button"
                          class="px-3 hover:bg-gray-100"
                          onClick={() =>
                            actualizarCantidadItem(item.id, Math.max(1, item.cantidad - 1), item.observaciones || "")
                          }
                        >
                          −
                        </button>
                        <input
                          type="number"
                          min="1"
                          class="no-spin w-10 text-center text-sm py-1 outline-none"
                          value={item.cantidad}
                          onInput={(e) => {
                            const cantidad = Math.max(1, Number(e.currentTarget.value));
                            actualizarCantidadItem(item.id, cantidad, "");
                          }}
                        />
                        <button
                          type="button"
                          class="px-3 hover:bg-gray-100"
                          onClick={() => actualizarCantidadItem(item.id, item.cantidad + 1, item.observaciones || "")}
                        >
                          +
                        </button>
                      </div>

                      <span class="text-sm">
                        x {formatearPrecio(item.precio)} ={" "}
                        <span class="font-semibold text-[#1e1e1e]">
                          {formatearPrecio(item.precio * item.cantidad)}
                        </span>
                      </span>
                    </div>

                    {/* observaciones */}
                    <input
                      type="text"
                      placeholder="observaciones sobre este producto"
                      value={item.observaciones || ""}
                      onInput={(e) => (item.observaciones = e.currentTarget.value)}
                      onBlur={(e) => actualizarObservacionesItem(item.id, item.cantidad, e.currentTarget.value)}
                      class="w-full px-3 py-2 rounded border border-gray-300 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:[#979797] transition-shadow"
                    />
                  </div>
                </div>
              )}
            </For>

            {/* observaciones general */}
            <textarea
              placeholder="observaciones general del pedido (opcional)"
              value={observacionesGeneral()}
              onInput={(e) => setObservacionesGeneral(e.currentTarget.value)}
              onBlur={async (e) => {
                await actualizarObservacionGeneral(e.currentTarget.value);
              }}
              class="w-full px-3 py-2 rounded border border-gray-300 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:[#979797] transition-shadow resize-none"
              rows={2}
            />
          </div>

          {/* Footer fijo */}
          <div class="border-t px-5 py-4 bg-white sticky bottom-0 z-10">
            <div class="flex justify-between items-center text-lg mb-2">
              <span class="text-gray-700 font-semibold">💰 Total del pedido:</span>
              <span class="text-lg font-bold text-[#000000] tracking-wide">
                {formatearPrecio(total())} + IVA
              </span>
            </div>
            <button
              onClick={props.onSiguiente}
              class="mt-2 bg-[#000000] hover:bg-[#979797] text-white font-semibold py-2 px-4 rounded w-full transition"
            >
              Finalizar pedido
            </button>
          </div>
        </div>
      </Show>
    </>
  );
}
