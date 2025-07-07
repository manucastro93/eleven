import { A, useLocation } from "@solidjs/router";
import { For, createResource } from "solid-js";
import { listarCategorias } from "@/services/categoria.service";
import { slugify } from "@/utils/slugify";
import { log } from "@/utils/log";

export default function MenuCategoriasMobile(props: { onClose?: () => void }) {
  const location = useLocation();
  const [categorias] = createResource(listarCategorias);

  return (
    <div class="bg-white border-t border-gray-200 px-4 pt-3 pb-4 max-h-[60vh] overflow-y-auto rounded shadow-sm custom-scroll">
      <For each={categorias()?.sort((a, b) => a.orden - b.orden) || []}>
        {(cat) => {
          const slug = slugify(cat.nombre);
          const activo = location.pathname === `/productos/categoria/${slug}`;
          return (
            <A
              href={`/productos/categoria/${slug}`}
              onClick={() => {
                log("click_categoria_mobile", { categoria: slug });
                props.onClose?.();
              }}
              class={`block px-3 py-2 rounded text-sm font-medium ${
                activo
                  ? "bg-[#b8860b] text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              {cat.nombre}
            </A>
          );
        }}
      </For>
    </div>
  );
}
