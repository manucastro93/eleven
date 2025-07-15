import { For, Show } from "solid-js";
import { useCarrito } from "@/store/carrito";
import { formatearPrecio } from "@/utils/formato";

export default function PasoResumen() {
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
    <Show when={carrito().length > 0} fallback={<p class="p-5 text-sm text-gray-500">El carrito está vacío.</p>}>
      <div class="flex flex-col h-full">
        {/* Lista de productos */}
        <div class="flex-1 overflow-y-auto px-5 pt-5 space-y-5">
          <For each={carrito()}>
            {(item) => (
              <div class="flex flex-col sm:flex-row sm:items-center gap-4 border-b pb-4">
                <img
                  src={item.imagen || "/img/productos/prod1.png"}
                  alt={item.nombre}
                  class="w-20 h-20 object-cover rounded"
                />

                <div class="flex-1 text-sm space-y-2">
                  <div class="flex justify-between items-start">
                    <div class="font-medium">{item.nombre}</div>
                    <button onClick={() => quitarDelCarrito(item.id)} class="text-red-500 text-xs">
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
                          actualizarCantidadItem(item.id, Math.max(1, item.cantidad - 1))
                        }
                      >
                        −
                      </button>
                      <input
                        type="number"
                        min="1"
                        class="w-10 text-center text-sm py-1 no-spin outline-none"
                        value={item.cantidad}
                        onInput={(e) => {
                          const cantidad = Math.max(1, Number(e.currentTarget.value));
                          actualizarCantidadItem(item.id, cantidad);
                        }}
                      />
                      <button
                        type="button"
                        class="px-3 hover:bg-gray-100"
                        onClick={() => actualizarCantidadItem(item.id, item.cantidad + 1)}
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

                  {/* Comentario */}
                  <input
                    type="text"
                    placeholder="Comentario sobre este producto"
                    value={item.comentario || ""}
                    onInput={(e) => (item.comentario = e.currentTarget.value)}
                    onBlur={(e) => actualizarComentarioItem(item.id, e.currentTarget.value)}
                    class="w-full px-3 py-2 rounded border border-gray-300 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-600 transition-shadow"
                  />
                </div>
              </div>
            )}
          </For>

          {/* Comentario general */}
          <textarea
            placeholder="Comentario general del pedido (opcional)"
            value={comentarioGeneral()}
            onInput={(e) => setComentarioGeneral(e.currentTarget.value)}
            class="w-full px-3 py-2 rounded border border-gray-300 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-600 transition-shadow resize-none"
            rows={2}
          />
        </div>

        {/* Footer fijo */}
        <div class="border-t px-5 py-4 bg-white sticky bottom-0 z-10">
          <div class="flex justify-between items-center text-sm mb-2">
            <span class="text-gray-700 font-semibold">💰 Total a pagar:</span>
            <span class="text-lg font-bold text-[#b8860b] tracking-wide">
              {formatearPrecio(total())}
            </span>
          </div>
          <button
            onClick={() => setPasoCarrito(2)}
            class="mt-2 bg-[#b8860b] hover:bg-[#a07408] text-white font-semibold py-2 px-4 rounded w-full transition"
          >
            Finalizar pedido
          </button>
        </div>
      </div>
    </Show>
  );
}
