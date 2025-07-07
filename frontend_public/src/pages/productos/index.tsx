import { A } from "@solidjs/router";
import { createResource, For } from "solid-js";
import { listarCategorias } from "@/services/categoria.service";
import { slugify } from "@/utils/slugify";
import { log } from "@/utils/log";

export default function PaginaProductos() {
  const [categorias] = createResource(listarCategorias);

  return (
    <section class="px-4 py-6">
      <h1 class="text-2xl font-bold text-gray-800 mb-6">Categorías</h1>
      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        <For each={categorias()?.sort((a, b) => a.orden - b.orden) || []}>
          {(cat) => (
            <A
              href={`/productos/${slugify(cat.nombre)}`}
              onClick={() => log("click_categoria", { categoria: cat.nombre })}
              class="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow transition p-4 text-center text-sm font-medium text-gray-700 cursor-pointer"
            >
              {cat.nombre}
            </A>
          )}
        </For>
      </div>
    </section>
  );
}
