import { createSignal, createResource, Show, For } from "solid-js";
import { X, Search as SearchIcon } from "lucide-solid";
import { useNavigate } from "@solidjs/router";
import { listarProductos } from "@/services/producto.service";
import type { Producto } from "@/types/producto.type";
import { formatearPrecio } from "@/utils/formato";

export default function BuscadorOverlay(props: { onClose: () => void }) {
  const navigate = useNavigate();
  const [texto, setTexto] = createSignal("");
  const [productos] = createResource(texto, (t) =>
    listarProductos({ busqueda: t, pagina: 1, limite: 10 })
  );

  return (
    <div class="fixed top-0 left-0 w-[500px] max-w-full h-full bg-white z-50 px-4 py-6 overflow-auto border-r shadow-xl">
      {/* Header cierre */}
      <div class="flex items-center justify-between mb-4">
        <button onClick={props.onClose}>
          <X size={24} />
        </button>
      </div>

      {/* Input */}
      <div class="flex items-center border border-gray-300 rounded-full px-4 py-2 shadow-sm mb-6">
        <input
          type="text"
          placeholder="¿Qué estás buscando?"
          class="flex-1 outline-none text-sm placeholder-gray-500"
          onInput={(e) => setTexto(e.currentTarget.value)}
          autofocus
        />
        <SearchIcon size={18} class="text-gray-500" />
      </div>

      {/* Resultados */}
      <Show when={productos()}>
        <ul class="bg-white shadow-md rounded-md overflow-hidden">
          <For each={productos()?.slice(0, 6)}>
            {(p: Producto) => (
              <li
                class="flex gap-3 cursor-pointer hover:bg-gray-100 p-3 border-b last:border-b-0"
                onClick={() => navigate(`/producto/${p.slug}`)}
              >
                <img
                  src={p.imagenes?.[0]?.url || "/img/placeholder.jpg"}
                  alt={p.nombre}
                  class="w-16 h-16 object-cover rounded"
                />
                <div class="flex flex-col justify-center">
                  <span class="text-sm text-gray-800 uppercase tracking-wide leading-tight">
                    {p.nombre}
                  </span>
                  <span class="text-sm text-gray-600 leading-tight">
                    {formatearPrecio(p.precio)}
                  </span>
                </div>
              </li>
            )}
          </For>
        </ul>
      </Show>

      {/* Botón ver todos */}
      <Show when={productos()?.length}>
        <div class="mt-6">
          <button
            class="w-full border border-black rounded py-3 text-sm font-medium tracking-wide uppercase hover:bg-black hover:text-white transition"
            onClick={() => {
              navigate(`/buscar?texto=${texto()}`);
              props.onClose();
            }}
          >
            VER TODOS LOS RESULTADOS
          </button>
        </div>
      </Show>
    </div>
  );
}
