import { createResource, Show, For, createSignal } from "solid-js";
import { useParams } from "@solidjs/router";
import { obtenerProductoPorSlug } from "@/services/producto.service";
import { useCarrito } from "@/store/carrito";
import ModalGaleria from "@/components/producto/ModalGaleria";
import ProductosRelacionados from "@/components/producto/ProductosRelacionados";
import { mostrarToast } from "@/store/toast";

export default function ProductoDetalle() {
  const params = useParams();
  const [producto] = createResource(() => obtenerProductoPorSlug(params.slug));
  const {
    agregarAlCarrito,
    carrito,
    setCarrito,
    setPasoCarrito,
  } = useCarrito();

  const [zoomActivo, setZoomActivo] = createSignal(false);
  const [zoomIndex, setZoomIndex] = createSignal(0);
  const [cantidad, setCantidad] = createSignal(1);

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
        imagen: codigoLimpio ?? "",
        cantidad: cantidad(),
      });
    }

    localStorage.setItem("carrito", JSON.stringify(carrito()));
    mostrarToast("Producto agregado al carrito");
    //setPasoCarrito("resumen"); // opcional: por si querés que muestre el resumen
  };

  return (
    <Show when={producto()}>
      {(p) => (
        <>
          {/* CONTENIDO PRINCIPAL */}
          <section class="grid grid-cols-1 md:grid-cols-2 gap-8 px-4 py-8 max-w-7xl mx-auto">
            {/* Galería con miniaturas */}
            <div class="flex gap-4">
              {/* Miniaturas scrollables */}
              <Show when={p().imagenes.length > 1}>
                <div class="flex flex-col gap-2 w-20 shrink-0 overflow-y-auto max-h-[500px] scroll-elegante p-1">
                  <For each={p().imagenes}>
                    {(img, i) => (
                      <img
                        src={`${import.meta.env.VITE_BACKEND_URL}${img.url}`}
                        alt={`Miniatura ${i() + 1}`}
                        class={`w-full cursor-pointer object-cover aspect-[4/4] transition ${
                          i() === zoomIndex()
                            ? "ring-2 ring-gray-300 bg-white shadow-sm scale-105"
                            : "opacity-80 hover:opacity-100"
                        }`}
                        onClick={() => setZoomIndex(i())}
                      />
                    )}
                  </For>
                </div>
              </Show>

              {/* Imagen principal */}
              <div class="flex-1">
                <img
                  src={`${import.meta.env.VITE_BACKEND_URL}${p().imagenes[zoomIndex()]?.url}`}
                  alt={p().nombre}
                  class="w-full cursor-zoom-in object-contain aspect-[4/4]"
                  onClick={() => setZoomActivo(true)}
                />
              </div>
            </div>

            {/* Info del producto */}
            <div class="flex flex-col gap-4">
              <div class="text-sm text-gray-500 uppercase tracking-wide">
                {p().categoria?.nombre}
              </div>
              <h1 class="text-2xl font-semibold">{p().nombre}</h1>
              <div class="text-xl font-bold text-gray-900">
                ${p().precio.toLocaleString()}
              </div>

              {/* Selector de cantidad */}
              <div class="flex items-center gap-2 text-sm">
                <span class="text-gray-600">Cantidad:</span>
                <div class="flex items-center border border-gray-300 rounded overflow-hidden">
                  <button
                    type="button"
                    class="px-3 hover:bg-gray-100"
                    onClick={() => setCantidad((c) => Math.max(1, c - 1))}
                  >
                    −
                  </button>
                  <input
                    type="number"
                    min="1"
                    class="no-spin w-12 text-center text-sm py-1 outline-none"
                    value={cantidad()}
                    onInput={(e) =>
                      setCantidad(Math.max(1, Number(e.currentTarget.value)))
                    }
                  />
                  <button
                    type="button"
                    class="px-3 hover:bg-gray-100"
                    onClick={() => setCantidad((c) => c + 1)}
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Botón agregar */}
              <button
                onClick={handleAgregar}
                class="mt-2 py-3 bg-black text-white text-sm rounded-lg font-medium hover:bg-gray-800 transition"
              >
                Agregar al carrito
              </button>

              {/* Descripción */}
              <Show when={p().descripcion}>
                <div class="mt-6 text-sm text-gray-700 whitespace-pre-line leading-relaxed border-t pt-4">
                  {p().descripcion}
                </div>
              </Show>
            </div>
          </section>

          {/* Modal fullscreen */}
          <Show when={zoomActivo()}>
            <ModalGaleria
              imagenes={p().imagenes.map((i) => i.url)}
              indexInicial={zoomIndex()}
              onClose={() => setZoomActivo(false)}
            />
          </Show>

          {/* Productos relacionados */}
          <ProductosRelacionados
            categoriaSlug={p().categoria?.slug}
            productoId={p().id}
          />
        </>
      )}
    </Show>
  );
}
