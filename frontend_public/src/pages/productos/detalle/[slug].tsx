import { useParams, useNavigate } from "@solidjs/router";
import { Component, createResource, Show, createSignal, onMount } from "solid-js";
import SliderProductos from "@/components/SliderProductos";
import { useCarrito } from "@/store/carrito";
import { formatearPrecio } from "@/utils/formato";
import { mostrarToast } from "@/store/toast";
import { log } from "@/utils/log";
import { obtenerProductoPorSlug, listarProductos } from "@/services/producto.service";

const ProductoDetalle: Component = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [producto] = createResource(() => params.slug, obtenerProductoPorSlug);
  const [relacionados] = createResource(() => listarProductos({ pagina: 1 }));
  const { agregarAlCarrito } = useCarrito();
  const [cantidad, setCantidad] = createSignal(1);

  onMount(() => {
    log("visita_producto", { slug: params.slug });
  });

  return (
    <main class="px-4 py-10 max-w-5xl mx-auto">
      <Show when={producto()} fallback={<p>Cargando...</p>}>
        <>
          <button
            onClick={() => {
              const scroll = sessionStorage.getItem("productos-scroll");
              history.back();
              setTimeout(() => scroll && window.scrollTo(0, parseInt(scroll)), 300);
            }}
            class="text-sm text-gray-500 hover:underline mb-6 block"
          >
            ← Volver
          </button>

          <div class="grid md:grid-cols-2 gap-10">
            <div class="bg-white rounded-xl shadow p-4">
              <img src={producto()!.imagenes?.[0]?.url || "/img/default.jpg"} alt={producto()!.nombre} class="w-full h-auto object-contain" />
            </div>

            <div>
              <h1 class="text-3xl font-bold text-[#1e1e1e] mb-4">{producto()!.nombre}</h1>
              <p class="text-lg text-gray-600 mb-6">{producto()!.descripcion}</p>
              <p class="text-2xl font-semibold text-[#b8860b] mb-4">{formatearPrecio(producto()!.precio)}</p>

              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-1">Cantidad</label>
                <div class="flex items-center border border-gray-300 rounded-md overflow-hidden w-fit">
                  <button type="button" class="px-2 text-gray-700 hover:bg-gray-200" onClick={() => setCantidad(Math.max(1, cantidad() - 1))}>−</button>
                  <input type="number" min="1" value={cantidad()} onInput={(e) => setCantidad(Math.max(1, Number(e.currentTarget.value)))} class="w-12 text-center text-sm px-1 py-1 no-spin focus:outline-none" />
                  <button type="button" class="px-2 text-gray-700 hover:bg-gray-200" onClick={() => setCantidad(cantidad() + 1)}>+</button>
                </div>
              </div>

              <button
                class="bg-[#b8860b] hover:bg-[#d4af37] text-white px-6 py-2 rounded font-semibold"
                onClick={() => {
                  agregarAlCarrito({
                    id: producto()!.id,
                    nombre: producto()!.nombre,
                    precio: producto()!.precio,
                    cantidad: cantidad(),
                    imagen: producto()!.imagenes?.[0]?.url || ""
                  });
                  mostrarToast("Producto agregado al carrito");
                  log("agregar_al_carrito", { slug: params.slug, cantidad: cantidad() });
                }}
              >
                Agregar al carrito
              </button>
            </div>
          </div>

          <Show when={relacionados()?.length}>
            <section class="mt-20">
              <SliderProductos
                titulo="Productos relacionados"
                productos={relacionados()!.filter(p => p.id !== producto()?.id).slice(0, 6)}
                variante="relacionados"
              />
            </section>
          </Show>
        </>
      </Show>
    </main>
  );
};

export default ProductoDetalle;
