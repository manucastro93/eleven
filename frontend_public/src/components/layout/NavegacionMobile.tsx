import { createResource, For, Show } from "solid-js";
import { listarCategorias } from "@/services/categoria.service";
import { listarItemsMenu } from "@/services/itemMenu.service";
import { A } from "@solidjs/router";

export default function NavegacionMobile(props: {
  abierto: boolean;
  onClose: () => void;
}) {
  const [categorias] = createResource(listarCategorias);
  const [itemsMenu] = createResource(listarItemsMenu);

  return (
    <Show when={props.abierto}>
      <div class="fixed inset-0 z-50 bg-black bg-opacity-70 flex flex-col">
        {/* Fondo semi-transparente */}
        <div
          class="flex-1"
          onClick={props.onClose}
        />
        {/* Contenido principal */}
        <div class="bg-white p-5 pb-10 max-h-[100vh] overflow-y-auto shadow-xl animate-slideUp">
          <div class="flex justify-between items-center mb-4">
            <span class="font-semibold text-lg">Categorías</span>
            <button onClick={props.onClose} class="text-2xl font-bold">&times;</button>
          </div>
          <ul class="mb-6 space-y-2">
            <For each={categorias()}>
              {cat => (
                <li>
                  <A
                    href={`/categoria/${cat.slug}`}
                    class="block py-2 px-4 rounded hover:bg-acento/20 font-medium text-gray-800"
                    onClick={props.onClose}
                  >
                    {cat.nombre}
                  </A>
                </li>
              )}
            </For>
          </ul>
          {/* Otros ítems de menú */}
          <ul class="space-y-2 border-t pt-4">
            <For each={itemsMenu()?.filter(i => i.activo)}>
              {(item) => {
                const slug = item.slug.toLowerCase();
                const ruta =
                  slug === "info" ? "/info"
                  : slug === "nosotros" ? "/nosotros"
                  : `/item/${item.slug}`;
                return (
                  <li>
                    <A
                      href={ruta}
                      class="block py-2 px-4 rounded hover:bg-acento/20 text-gray-700"
                      onClick={props.onClose}
                    >
                      {item.nombre}
                    </A>
                  </li>
                );
              }}
            </For>
          </ul>
        </div>
      </div>
    </Show>
  );
}
