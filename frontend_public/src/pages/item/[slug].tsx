import { useParams } from "@solidjs/router";
import { createResource, For, Show } from "solid-js";
import { obtenerItemMenuConProductos } from "@/services/itemMenu.service";
import ProductCard from "@/components/common/ProductoCard";

export default function ItemMenuPage() {
  const params = useParams();

  // 👇 Esto asegura que se actualiza cuando cambia el slug en la URL
  const [item] = createResource(() => params.slug, obtenerItemMenuConProductos);

  return (
    <div class="max-w-6xl mx-auto px-4 py-6">
      <Show when={item()} fallback={<p>Cargando...</p>}>
        {(item) => (
          <>
            <h1 class="text-2xl font-bold mb-6">{item().nombre}</h1>
            <Show
                when={item().productos.length > 0}
                fallback={<p class="text-gray-500">No hay productos disponibles para esta sección.</p>}
                >
                <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    <For each={item().productos}>
                    {(prod) => <ProductCard producto={prod} />}
                    </For>
                </div>
                </Show>
          </>
        )}
      </Show>
    </div>
  );
}
