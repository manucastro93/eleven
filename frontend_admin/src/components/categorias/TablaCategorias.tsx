import { createSignal, createEffect, For, Show } from "solid-js";
import {
  listarCategoriasAdmin,
  actualizarOrdenCategorias,
  actualizarDestacadaCategoria,
} from "@/services/categoria.service";
import type { Categoria } from "@/types/categoria";

interface Props {
  filtro: {
    search: string;
    page: number;
    orderBy: string;
    orderDir: "ASC" | "DESC";
  };
  setFiltro: (f: any) => void;
  onCategoriaClick?: (categoria: Categoria) => void;
  reload?: number;
}

export default function TablaCategorias(props: Props) {
  const [categoriasRaw, setCategoriasRaw] = createSignal<{
    categorias: Categoria[];
    totalPages: number;
    totalCount: number;
  } | null>(null);

  const fetchCategorias = async () => {
    const res = await listarCategoriasAdmin({ ...props.filtro, limit: 100 });
    setCategoriasRaw(res);
  };

  // 🔥 Efecto claro y preciso para fetch inicial y refresco automático:
  createEffect(() => {
    const filtro = props.filtro;
    const reload = props.reload;
    fetchCategorias();
  });

  const moverCategoria = async (index: number, delta: number) => {
    const lista = [...(categoriasRaw()?.categorias || [])];

    const newIndex = index + delta;
    if (newIndex < 0 || newIndex >= lista.length) return;

    const [moved] = lista.splice(index, 1);
    lista.splice(newIndex, 0, moved);

    lista.forEach((cat, i) => {
      cat.orden = i;
    });

    try {
      await actualizarOrdenCategorias(
        lista.map((cat) => ({ id: cat.id, orden: cat.orden }))
      );
      setCategoriasRaw({ ...categoriasRaw()!, categorias: lista });
    } catch (err) {
      console.error("Error al actualizar orden", err);
    }
  };

  const handleActualizarDestacada = async (id: number, nuevaDestacada: boolean) => {
    try {
      await actualizarDestacadaCategoria(id, nuevaDestacada);
      const lista = [...(categoriasRaw()?.categorias || [])];
      const cat = lista.find((c) => c.id === id);
      if (cat) {
        cat.destacada = nuevaDestacada;
        setCategoriasRaw({ ...categoriasRaw()!, categorias: lista });
      }
    } catch (err) {
      console.error("Error al actualizar destacada", err);
    }
  };

  const cambiarOrden = (columna: string) => {
    if (props.filtro.orderBy === columna) {
      props.setFiltro({
        ...props.filtro,
        orderDir: props.filtro.orderDir === "ASC" ? "DESC" : "ASC",
        page: 1,
      });
    } else {
      props.setFiltro({
        ...props.filtro,
        orderBy: columna,
        orderDir: "ASC",
        page: 1,
      });
    }
  };

  const iconoOrden = (columna: string) => {
    if (props.filtro.orderBy !== columna) return "";
    return props.filtro.orderDir === "ASC" ? "▲" : "▼";
  };

  return (
    <div class="mt-6 border rounded-lg overflow-x-auto">
      <table class="w-full text-left border-collapse">
        <thead class="bg-gray-100 text-gray-600 text-sm">
          <tr>
            <th class="px-4 py-2 border-b">Imagen</th>
            <th
              class="px-4 py-2 border-b cursor-pointer select-none"
              onClick={() => cambiarOrden("nombre")}
            >
              Nombre {iconoOrden("nombre")}
            </th>
            <th
              class="px-4 py-2 border-b cursor-pointer select-none text-center"
              onClick={() => cambiarOrden("orden")}
            >
              Orden {iconoOrden("orden")}
            </th>
          </tr>
        </thead>
        <tbody>
          <Show
            when={categoriasRaw()}
            fallback={
              <tr>
                <td colspan="3" class="px-4 py-4 text-center text-gray-500">
                  Cargando categorías...
                </td>
              </tr>
            }
          >
            <For each={categoriasRaw()?.categorias || []}>
              {(cat, i) => (
                <tr
                  class={`${
                    i() % 2 === 0 ? "bg-white" : "bg-gray-50"
                  } hover:bg-gray-100`}
                >
                  <td class="px-4 py-2 border-b w-20">
                    <Show when={cat.imagenUrl}>
                      <img
                        src={cat.imagenUrl}
                        alt={cat.nombre}
                        class="w-12 h-12 object-cover rounded"
                        loading="lazy"
                      />
                    </Show>
                  </td>
                  <td
                    class="px-4 py-2 border-b cursor-pointer"
                    onClick={() => props.onCategoriaClick?.(cat)}
                  >
                    {cat.nombre}
                  </td>
                  <td class="px-4 py-2 border-b text-center">
                    <div class="flex flex-col items-center gap-1">
                      <div class="flex justify-center gap-1">
                        <Show when={i() > 0}>
                          <button
                            onClick={() => moverCategoria(i(), -1)}
                            class="bg-gray-200 text-white text-base px-3 py-2 rounded"
                            title="Mover arriba"
                          >
                            ⬆️
                          </button>
                        </Show>
                        <Show
                          when={i() < (categoriasRaw()?.categorias.length || 0) - 1}
                        >
                          <button
                            onClick={() => moverCategoria(i(), 1)}
                            class="bg-gray-200 text-white text-base px-3 py-2 rounded"
                            title="Mover abajo"
                          >
                            ⬇️
                          </button>
                        </Show>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </For>
          </Show>
        </tbody>
      </table>
    </div>
  );
}
