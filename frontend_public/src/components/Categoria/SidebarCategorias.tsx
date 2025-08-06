import { A, useLocation } from "@solidjs/router";
import { createResource, For, Show, createMemo } from "solid-js";
import { listarCategorias } from "@/services/categoria.service";
import type { Categoria } from "@/types/categoria.type";
import { useLogSesion } from "@/hooks/useLogSesion";

export default function SidebarCategorias() {
  const location = useLocation();
  const [categorias] = createResource<Categoria[]>(listarCategorias);
  const logSesion = useLogSesion();

  // Extrae el slug de categoría (siempre está)
  const categoriaActual = createMemo(() => {
    const path = location.pathname;
    const match = path.match(/\/categoria\/([^/]+)/);
    return match ? match[1] : null;
  });

  // Extrae la combinación catSlug/subSlug (si la ruta incluye subcategoría)
  const subcategoriaActual = createMemo(() => {
    const path = location.pathname;
    const match = path.match(/\/categoria\/([^/]+)\/subcategoria\/([^/]+)/);
    return match ? { catSlug: match[1], subSlug: match[2] } : null;
  });

  return (
    <aside class="w-60 shrink-0 pt-2 sticky top-28 h-[calc(100vh-7rem)] overflow-y-auto scroll-elegante hidden md:block border-r border-gray-100 bg-white">
      <h2 class="text-base font-semibold px-4 mb-3 text-black">Categorías</h2>
      <ul class="px-2 pb-4 text-sm font-medium text-black space-y-1">
        <li>
          <A
            href="/categoria/todos"
            class={`block px-3 py-2 rounded transition-all ${
              categoriaActual() === "todos"
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
              const esActiva = () => {
                // activa si la categoría coincide, o si hay una subcategoría activa y la categoría coincide
                if (categoriaActual() === cat.slug) return true;
                if (subcategoriaActual() && subcategoriaActual()?.catSlug === cat.slug) return true;
                return false;
              };

              return (
                <>
                  <li>
                    <A
                      href={`/categoria/${cat.slug}`}
                      class={`block px-3 py-2 rounded transition-all ${
                        esActiva()
                          ? "bg-gray-100 text-black font-semibold"
                          : "hover:bg-gray-50 text-gray-800"
                      }`}
                      onClick={() => {
                        logSesion("click_categoria_sidebar", {
                          categoriaId: cat.id,
                          categoria: cat.nombre,
                          slug: cat.slug,
                        });
                      }}
                    >
                      {cat.nombre}
                    </A>
                  </li>

                  <Show when={esActiva() && cat.subcategorias?.length}>
                    <ul class="ml-4 border-l border-gray-100 pl-3 space-y-1">
                      <For each={cat.subcategorias}>
                        {(sub) => (
                          <li>
                            <A
                              href={`/categoria/${cat.slug}/subcategoria/${sub.slug}`}
                              class={`block px-3 py-1 rounded text-sm transition-all ${
                                subcategoriaActual() &&
                                sub.slug === subcategoriaActual()?.subSlug &&
                                cat.slug === subcategoriaActual()?.catSlug
                                  ? "text-black font-semibold bg-gray-50"
                                  : "text-gray-600 hover:text-black hover:bg-gray-50"
                              }`}
                               onClick={() => {
                                  logSesion("click_subcategoria_sidebar", {
                                    categoriaId: cat.id,
                                    categoria: cat.nombre,
                                    slug: cat.slug,
                                    subcategoriaId: sub.id,
                                    subcategoria: sub.nombre,
                                    subSlug: sub.slug,
                                  });
                                }}
                            >
                              {sub.nombre}
                            </A>
                          </li>
                        )}
                      </For>
                    </ul>
                  </Show>
                </>
              );
            }}
          </For>
        </Show>
      </ul>
    </aside>
  );
}
