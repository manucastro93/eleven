import { createResource, Show, For, createSignal, onMount, createEffect } from "solid-js";
import { useParams, useNavigate } from "@solidjs/router";
import { obtenerProductoPorSlug, obtenerImagenesProducto } from "@/services/producto.service";
import { useCarrito } from "@/store/carrito";
import ModalGaleria from "@/components/producto/ModalGaleria";
import ProductosRelacionados from "@/components/producto/ProductosRelacionados";
import { mostrarToast } from "@/store/toast";
import { ImagenConExtensiones } from "@/components/shared/ImagenConExtensiones";
import { formatearPrecio } from "@/utils/formato";
import Breadcrumb from "@/components/common/Breadcrumb";

export default function ProductoDetalle() {
  const params = useParams();
  const navigate = useNavigate();

  const fetchProducto = () => obtenerProductoPorSlug(params.slug);
  const [producto, { refetch }] = createResource(fetchProducto);

  const { agregarAlCarrito, carrito, setCarrito } = useCarrito();

  const [zoomActivo, setZoomActivo] = createSignal(false);
  const [zoomIndex, setZoomIndex] = createSignal(0);
  const [cantidad, setCantidad] = createSignal(1);

const [imagenes, { refetch: refetchImagenes }] = createResource(async () => {
  const p = await fetchProducto();
  if (!p) return [];
  return await obtenerImagenesProducto(p.codigo);
});


  const handleAgregar = () => {
    const p = producto();
    if (!p) return;

    const existentes = carrito();
    const index = existentes.findIndex((item) => item.id === p.id);
    const codigoLimpio = p.codigo.replace(/\D/g, "");

    if (index >= 0) {
      const actualizados = [...existentes];
      actualizados[index].cantidad += cantidad();
      setCarrito(actualizados);
    } else {
      agregarAlCarrito({
        id: p.id,
        nombre: p.nombre,
        precio: p.precio,
        codigo: p.codigo,
        imagen: codigoLimpio,
        cantidad: cantidad(),
      });
    }

    localStorage.setItem("carrito", JSON.stringify(carrito()));
    mostrarToast("Producto agregado al carrito");
  };

  createEffect(() => {
    params.slug;
    refetch();
    refetchImagenes();
    setZoomIndex(0); // resetea al cambiar producto
  });

  return (
    <Show when={producto()}>
      {(p) => (
        <>
          <div class="px-4 pt-4 max-w-7xl mx-auto text-sm text-gray-600">
            <Breadcrumb
              items={[
                { label: "Inicio", href: "/" },
                { label: "Shop", href: "/categoria/todos" },
                { label: p().categoria?.nombre || "Categoría", href: `/categoria/${p().categoria?.slug}` },
                { label: `${p().nombre} (${p().codigo})` }
              ]}
              separador=">"
            />
          </div>
          <section class="grid grid-cols-1 md:grid-cols-2 gap-8 px-4 py-8 max-w-7xl mx-auto">
            <div class="flex gap-4">
              <Show when={imagenes() && imagenes()!.length > 1}>
                <div class="flex flex-col gap-2 w-20 shrink-0 overflow-y-auto max-h-[500px] scroll-elegante p-1">
                  <For each={imagenes()}>
                    {(img, i) => (
                      <div onClick={() => setZoomIndex(i())}>
                        <ImagenConExtensiones
                          codigo={img.codigo}
                          letra={img.letra}
                          class={`w-full cursor-pointer object-cover aspect-[4/4] transition ${i() === zoomIndex()
                            ? "ring-2 ring-gray-300 bg-white shadow-sm scale-105"
                            : "opacity-80 hover:opacity-100"
                            }`}
                        />
                      </div>
                    )}
                  </For>
                </div>
              </Show>

              <div class="flex-1">
  {
    (() => {
      const lista = imagenes();
      if (!lista || lista.length === 0) return null;
      const actual = lista[zoomIndex()];
      return (
        <div onClick={() => setZoomActivo(true)}>
          <img
            src={`${import.meta.env.VITE_BACKEND_URL}/uploads/productos/${actual.archivo}`}
            alt="Producto"
            loading="lazy"
            class="w-full cursor-zoom-in object-contain aspect-[4/4]"
          />
        </div>
      );
    })()
  }
</div>


            </div>

            <div class="flex flex-col gap-4">
              <div class="text-sm text-gray-500 uppercase tracking-wide">
                {p().categoria?.nombre}
              </div>
              <h1 class="text-2xl font-semibold">{p().nombre} ({p().codigo})</h1>
              <div class="text-xl font-bold text-gray-900">
                {formatearPrecio(p().precio)}
              </div>

              <div class="flex items-center gap-2 text-sm">
                <span class="text-gray-600">Cantidad:</span>
                <div class="flex items-center border border-gray-300 rounded overflow-hidden">
                  <button type="button" class="px-3 hover:bg-gray-100" onClick={() => setCantidad((c) => Math.max(1, c - 1))}>−</button>
                  <input
                    type="number"
                    min="1"
                    class="no-spin w-12 text-center text-sm py-1 outline-none"
                    value={cantidad()}
                    onInput={(e) => setCantidad(Math.max(1, Number(e.currentTarget.value)))}
                  />
                  <button type="button" class="px-3 hover:bg-gray-100" onClick={() => setCantidad((c) => c + 1)}>+</button>
                </div>
              </div>

              <button
                onClick={handleAgregar}
                class="mt-2 py-3 bg-black text-white text-sm rounded-lg font-medium hover:bg-gray-800 transition"
              >
                Agregar al carrito
              </button>

              <Show when={p().descripcion}>
                <div class="mt-6 text-sm text-gray-700 whitespace-pre-line leading-relaxed border-t pt-4">
                  {p().descripcion}
                </div>
              </Show>
            </div>
          </section>

          <Show when={zoomActivo()}>
            <ModalGaleria
              imagenes={imagenes() || []}
              indexInicial={zoomIndex()}
              onClose={() => setZoomActivo(false)}
            />
          </Show>

          <ProductosRelacionados
            categoriaSlug={p().categoria?.slug}
            productoId={p().id}
          />
        </>
      )}
    </Show>
  );
}
