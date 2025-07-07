import { For, Show } from "solid-js";
import { useCarrito } from "@/store/carrito";
import { formatearPrecio } from "@/utils/formato";

export default function Paso1Resumen() {
  const {
    carrito,
    setCarrito,
    total,
    quitarDelCarrito,
    setPasoCarrito,
    comentarioGeneral,
    setComentarioGeneral,
  } = useCarrito();

  const actualizarComentarioItem = (id: number, comentario: string) => {
    const actualizados = carrito().map((item) =>
      item.id === id ? { ...item, comentario } : item
    );
    setCarrito(actualizados);
    localStorage.setItem("carrito", JSON.stringify(actualizados));
  };

  const actualizarCantidadItem = (id: number, cantidad: number) => {
    const actualizados = carrito().map((item) =>
      item.id === id ? { ...item, cantidad } : item
    );
    setCarrito(actualizados);
    localStorage.setItem("carrito", JSON.stringify(actualizados));
  };

  return (
    <Show
      when={carrito().length > 0}
      fallback={<p class="p-4 text-sm">El carrito está vacío.</p>}
    >
      <div class="space-y-4 p-4">
        <div>
          <For each={carrito()}>
            {(item) => (
              <div class="flex flex-col sm:flex-row sm:items-center gap-4 border-b border-gray-200 py-4">
                <img
                  src={item.imagen || "/img/productos/prod1.png"}
                  alt={item.nombre}
                  class="w-24 h-24 object-cover rounded mx-auto sm:mx-0"
                />

                <div class="flex-1 text-sm space-y-2 w-full">
                  <div class="flex justify-between items-start">
                    <div class="font-medium">{item.nombre}</div>
                    <button
                      class="text-red-500 text-xs"
                      onClick={() => quitarDelCarrito(item.id)}
                    >
                      Quitar
                    </button>
                  </div>

                  <div class="flex flex-wrap items-center gap-3 text-gray-600">
                    <div class="flex items-center border border-gray-300 rounded-md overflow-hidden">
                      <button
                        type="button"
                        class="px-3 text-gray-700 hover:bg-gray-200"
                        onClick={() =>
                          actualizarCantidadItem(
                            item.id,
                            Math.max(1, item.cantidad - 1)
                          )
                        }
                      >
                        −
                      </button>
                      <input
                        type="number"
                        min="1"
                        class="w-12 text-center text-sm px-1 py-1 no-spin focus:outline-none"
                        value={item.cantidad}
                        onInput={(e) => {
                          const cantidad = Math.max(
                            1,
                            Number(e.currentTarget.value)
                          );
                          actualizarCantidadItem(item.id, cantidad);
                        }}
                      />
                      <button
                        type="button"
                        class="px-3 text-gray-700 hover:bg-gray-200"
                        onClick={() =>
                          actualizarCantidadItem(item.id, item.cantidad + 1)
                        }
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

                  <input
                    type="text"
                    placeholder="Comentario sobre este producto"
                    value={item.comentario || ""}
                    onInput={(e) => (item.comentario = e.currentTarget.value)}
                    onBlur={(e) =>
                      actualizarComentarioItem(item.id, e.currentTarget.value)
                    }
                    class="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-600 transition-shadow"
                  />
                </div>
              </div>
            )}
          </For>

          <div>
            <textarea
              placeholder="Comentario general del pedido (opcional)"
              value={comentarioGeneral()}
              onInput={(e) => setComentarioGeneral(e.currentTarget.value)}
              class="w-full mt-4 px-3 py-2 rounded-lg border border-gray-300 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-600 transition-shadow resize-none"
              rows={2}
            />
          </div>
        </div>
        <div class="border-t pt-4 mt-4 sticky bottom-0 bg-white z-10">
          <div class="flex justify-between items-center text-base">
            <span class="text-gray-700 font-semibold flex items-center gap-2">
              💰 Total a pagar:
            </span>
            <span class="text-xl font-bold text-[#b8860b] tracking-wide">
              {formatearPrecio(total())}
            </span>
          </div>
          <div>
            <button
              onClick={() => setPasoCarrito(2)}
              class="mt-4 bg-[#b8860b] hover:bg-[#a07408] text-white font-semibold py-2 px-4 rounded w-full transition"
            >
              Finalizar pedido
            </button>
          </div>
        </div>
      </div>
    </Show>
  );
}
