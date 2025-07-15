import { createSignal, Show } from "solid-js";
import { A } from "@solidjs/router";
import { useCarrito } from "@/store/carrito";
import { mostrarToast } from "@/store/toast";
import { formatearPrecio } from "@/utils/formato";
import { log } from "@/utils/log";
import type { Producto } from "@/types/producto.type";

export default function ProductoCard(p: Producto) {
  const { agregarAlCarrito } = useCarrito();
  const [cantidad, setCantidad] = createSignal(1);
  const codigoLimpio = p.codigo.replace(/\D/g, "");
  const handleAgregar = () => {
    agregarAlCarrito({
      id: p.id,
      nombre: p.nombre,
      precio: p.precio,
      cantidad: cantidad(),
      imagen: codigoLimpio || ""
    });
    mostrarToast("Producto agregado al carrito");
    log("agregar_al_carrito_card", { id: p.id, nombre: p.nombre, cantidad: cantidad() });
  };

  const handleClickProducto = () => {
    log("click_producto_card", { id: p.id, nombre: p.nombre, slug: p.slug });
  };

  return (
    <div class="bg-[#fafafafa] rounded-xl shadow-md overflow-hidden transition hover:shadow-lg hover:-translate-y-1 duration-200">
      <A
        href={`/productos/detalle/${p.slug}`}
        class="block cursor-pointer"
        onClick={handleClickProducto}
      >
        <div class="relative">
          <img
            src={p.imagenes?.[0]?.url || "/img/default.jpg"}
            alt={p.nombre}
            class="w-full h-48 object-contain p-4 bg-white"
          />
          {p.nuevo && (
            <span class="absolute top-2 left-2 bg-[#b8860b] text-white text-xs px-2 py-1 rounded uppercase tracking-wide">
              Nuevo
            </span>
          )}
        </div>
        <div class="p-3 text-center">
          <h4 class="text-sm font-medium text-[#1e1e1e] truncate">{p.nombre}</h4>
          <p class="mt-1 text-lg font-semibold text-[#b8860b]">
            {formatearPrecio(p.precio)}
          </p>
        </div>
      </A>
      <div class="pb-4 flex flex-col items-center gap-2 relative">
        <div class="flex items-center gap-2">
          <button
            type="button"
            class="bg-gray-200 hover:bg-gray-300 rounded-full w-6 h-6 text-sm flex items-center justify-center"
            onClick={() => setCantidad((prev) => Math.max(1, prev - 1))}
          >
            –
          </button>
          <input
            type="number"
            min="1"
            value={cantidad()}
            onInput={(e) => setCantidad(Number(e.currentTarget.value))}
            class="w-12 text-center border border-gray-300 rounded px-1 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-[#b8860b]"
          />
          <button
            type="button"
            class="bg-gray-200 hover:bg-gray-300 rounded-full w-6 h-6 text-sm flex items-center justify-center"
            onClick={() => setCantidad((prev) => prev + 1)}
          >
            +
          </button>
        </div>

        <button
          onClick={handleAgregar}
          class="bg-[#b8860b] hover:bg-yellow-700 text-white text-sm px-4 py-2 rounded"
        >
          Agregar al carrito
        </button>
      </div>
    </div>
  );
}
