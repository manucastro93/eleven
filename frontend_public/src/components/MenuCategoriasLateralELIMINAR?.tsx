import { useLocation, useNavigate } from "@solidjs/router";
import { createMemo, createResource, For } from "solid-js";
import { listarCategorias } from "@/services/categoria.service";
import { slugify } from "@/utils/slugify";
import { log } from "@/utils/log";

export default function MenuCategoriasLateral() {
  const location = useLocation();
  const navigate = useNavigate();

  const slugActual = createMemo(() =>
    location.pathname.replace("/productos/categoria/", "")
  );

  const [categorias] = createResource(listarCategorias);

  const handleIrACategoria = (slug: string) => {
    log("click_categoria_lateral", { categoria: slug });
    const params = new URLSearchParams(location.search);
    params.set("page", "1");
    navigate(`/productos/categoria/${slug}?${params.toString()}`);
  };

  return (
    <aside class="hidden lg:block w-64 pr-4">
      <ul class="space-y-2 bg-white rounded-md shadow-sm px-2 py-3 overflow-y-auto max-h-[calc(100vh-150px)] custom-scroll">
        <li>
          <button
            onClick={() => handleIrACategoria("todos")}
            class={`block w-full text-left px-3 py-2 rounded text-sm font-medium ${
              slugActual() === "todos"
                ? "bg-[#b8860b] text-white"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            Ver todos
          </button>
        </li>
        <For each={categorias()?.sort((a, b) => a.orden - b.orden) || []}>
          {(cat) => {
            const slug = slugify(cat.nombre);
            const activo = slugActual() === slug;
            return (
              <li>
                <button
                  onClick={() => handleIrACategoria(slug)}
                  class={`block w-full text-left px-3 py-2 rounded text-sm font-medium ${
                    activo
                      ? "bg-[#b8860b] text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {cat.nombre}
                </button>
              </li>
            );
          }}
        </For>
      </ul>
    </aside>
  );
}
