import { A, useLocation } from "@solidjs/router";
import { createResource, For, Show, createMemo, createEffect } from "solid-js";
import { listarCategorias } from "@/services/categoria.service";
import type { Categoria } from "@/types/categoria.type";

export default function SidebarCategorias() {
  const location = useLocation();
  const [categorias] = createResource<Categoria[]>(listarCategorias);

  const categoriaActual = createMemo(() => {
    const match = location.pathname.match(/\/categoria\/([^/]+)/);
    return match ? match[1] : null;
  });
  createEffect(() => {
  });

  return (
    <aside class="w-60 shrink-0 pt-2 sticky top-28 h-[calc(100vh-7rem)] overflow-y-auto scroll-elegante hidden md:block border-r border-gray-100 bg-white">
      <h2 class="text-base font-semibold px-4 mb-3 text-black">Categorías</h2>

      <ul class="px-2 pb-4 text-sm font-medium text-black space-y-1">
        <li>
          <A
            href="/categoria/todos"
            class={`block px-3 py-2 rounded transition-all ${categoriaActual() === "todos"
                ? "bg-gray-100 text-black font-semibold"
                : "hover:bg-gray-50 text-gray-800"
              }`}
          >
            Ver todos
          </A>
        </li>

        <Show when={categorias()}>
          <For each={categorias()}>
            {(cat) => {
              const activa = categoriaActual() === cat.slug;
              return (
                <li>
                  <A
                    href={`/categoria/${cat.slug}`}
                    class={`block px-3 py-2 rounded transition-all ${categoriaActual() === cat.slug
                        ? "bg-gray-100 text-black font-semibold"
                        : "hover:bg-gray-50 text-gray-800"
                      }`}
                  >
                    {cat.nombre}
                  </A>
                </li>
              );
            }}
          </For>
        </Show>
      </ul>
    </aside>
  );
}
