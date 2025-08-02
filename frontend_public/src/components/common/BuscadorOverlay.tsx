import { createSignal, createResource, Show, For, createEffect } from "solid-js";
import { X, Search as SearchIcon } from "lucide-solid";
import { useNavigate } from "@solidjs/router";
import { listarProductos } from "@/services/producto.service";
import type { Producto } from "@/types/producto.type";
import { formatearPrecio } from "@/utils/formato";
import { ImagenConExtensiones } from "../shared/ImagenConExtensiones";

export default function BuscadorOverlay(props: { onClose: () => void }) {
  const navigate = useNavigate();
  const [texto, setTexto] = createSignal("");
  const [busqueda, setBusqueda] = createSignal("");

  // 🔁 DEBUG: ver cada cambio de texto
  createEffect(() => {
    console.log("📝 texto() cambió:", texto());
  });

  // 🔁 Debounce: espera 300ms desde que se deja de tipear
  createEffect(() => {
    const t = texto().trim();
    console.log("⏳ Debounce preparando búsqueda:", t);
    const timeout = setTimeout(() => {
      if (t.length === 0) return;
      console.log("🚀 setBusqueda:", t);
      setBusqueda(t);
    }, 300);
    return () => clearTimeout(timeout);
  });

  // 🔍 Buscar productos según texto
  const [productos] = createResource(busqueda, async (t) => {
    console.log("🔁 Llamando listarProductos con:", t);
    const res = await listarProductos({ busqueda: t, pagina: 1, limite: 10 });
    console.log("📦 Respuesta:", res);
    return res;
  });

  return (
    <div class="fixed top-0 left-0 w-[500px] max-w-full h-full bg-white z-50 px-4 py-6 overflow-auto border-r shadow-xl">
      <div class="flex items-center justify-between mb-4">
        <button onClick={props.onClose}>
          <X size={24} />
        </button>
      </div>

      <div class="flex items-center border border-gray-300 rounded-full px-4 py-2 shadow-sm mb-6">
        <input
          type="text"
          placeholder="¿Qué estás buscando?"
          class="flex-1 outline-none text-sm placeholder-gray-500"
          value={texto()}
          onInput={(e) => {
            console.log("⌨️ Input:", e.currentTarget.value);
            setTexto(e.currentTarget.value);
          }}
          autofocus
        />
        <SearchIcon size={18} class="text-gray-500" />
      </div>

      <Show
        when={productos()}
        fallback={<p class="text-sm text-gray-500">Escribí para buscar productos...</p>}
      >
        <Show
          when={productos()?.length}
          fallback={<p class="text-sm text-gray-500">No se encontraron productos.</p>}
        >
          <ul class="bg-white shadow-md rounded-md overflow-hidden">
            <For each={productos()?.slice(0, 6)}>
              {(p: Producto) => (
                <li
                  class="flex gap-3 cursor-pointer hover:bg-gray-100 p-3 border-b last:border-b-0"
                  onClick={() => {
                    navigate(`/productos/detalle/${p.slug}`);
                    props.onClose(); // ✅ cerrar overlay
                  }}
                >
                  <img
                    src={p.imagen}
                    alt={p.nombre || "Producto"}
                    class="h-20 w-20 object-cover rounded"
                    loading="lazy"
                  />
                  <div class="flex flex-col justify-center">
                    <span class="text-sm text-gray-800 uppercase tracking-wide leading-tight">
                      {p.nombre} ({p.codigo})
                    </span>
                    <span class="text-sm text-gray-600 leading-tight">
                      {formatearPrecio(p.precio)}
                    </span>
                  </div>
                </li>
              )}
            </For>
          </ul>

          <div class="mt-6">
            <button
              class="w-full border border-black rounded py-3 text-sm font-medium tracking-wide uppercase hover:bg-black hover:text-white transition"
              onClick={() => {
                navigate(`/categoria/todos?busqueda=${encodeURIComponent(texto())}`);
                props.onClose();
              }}
            >
              VER TODOS LOS RESULTADOS
            </button>
          </div>
        </Show>
      </Show>
    </div>
  );
}
