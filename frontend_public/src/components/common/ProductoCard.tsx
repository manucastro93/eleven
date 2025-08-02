import { createSignal, createResource, Show } from "solid-js";
import { useNavigate } from "@solidjs/router";
import type { Producto } from "@/types/producto.type";
import { formatearPrecio } from "@/utils/formato";
import { useCarrito } from "@/store/carrito";
import { mostrarToast } from "@/store/toast";

export default function ProductoCard(props: { producto: Producto }) {
  const navigate = useNavigate();
  const { agregarAlCarrito, carrito, setCarrito } = useCarrito();

  const { id, nombre,imagen, slug, precio, codigo } = props.producto;
  const codigoLimpio = codigo.replace(/\D/g, "");
  const [cantidad, setCantidad] = createSignal(1);

  const handleAgregar = () => {
    const existentes = carrito();
    const index = existentes.findIndex((item) => item.id === id);

    if (index >= 0) {
      const actualizados = [...existentes];
      actualizados[index].cantidad += cantidad();
      setCarrito(actualizados);
    } else {
      agregarAlCarrito({
        id,
        nombre,
        precio,
        codigo,
        imagen,
        cantidad: cantidad(),
        slug,
      });
    }

    localStorage.setItem("carrito", JSON.stringify(carrito()));
    mostrarToast("Producto agregado al carrito");
  };

  return (
    <div class="cursor-pointer text-sm p-2 rounded-lg hover:shadow-sm transition">
      <div
        onClick={async () => {
          const scrollActual = window.scrollY;
          const cantidad = document.querySelectorAll("[data-producto]").length;

          sessionStorage.setItem("scrollY", scrollActual.toString());
          sessionStorage.setItem("cantidadProductos", cantidad.toString());
          await new Promise((r) => setTimeout(r, 50));
          navigate(`/productos/detalle/${slug}`);
        }}
      >
        <div class="w-full aspect-[4/5] bg-white rounded overflow-hidden">
          <Show
            when={imagen}
            fallback={
              <img
                src="/img/no-image.png"
                alt="Sin imagen"
                class="w-full h-full object-contain"
              />
            }
          >
            <img
              src={imagen}
              alt={nombre}
              class="w-full h-full object-contain"
              loading="lazy"
              draggable={false}
  onDragStart={e => e.preventDefault()}
            />
          </Show>
        </div>

        <p class="mt-1 line-clamp-2 text-xs">{nombre} ({codigo})</p>
        <p class="font-semibold mt-0.5">{formatearPrecio(precio)}</p>
      </div>

      {/* Cantidad + botón */}
      <div class="mt-2 flex items-center gap-2">
        <div class="flex items-center border border-gray-300 rounded overflow-hidden">
          <button
            type="button"
            class="px-3 py-1 text-gray-700 hover:bg-gray-100"
            onClick={() => setCantidad((c) => Math.max(1, c - 1))}
          >
            −
          </button>
          <input
            type="number"
            min="1"
            class="no-spin w-12 text-center text-sm py-1 outline-none border-l border-r border-gray-200"
            value={cantidad()}
            onInput={(e) => {
              const val = Math.max(1, Number(e.currentTarget.value));
              setCantidad(val);
            }}
          />
          <button
            type="button"
            class="px-3 py-1 text-gray-700 hover:bg-gray-100"
            onClick={() => setCantidad((c) => c + 1)}
          >
            +
          </button>
        </div>

        <button
          onClick={handleAgregar}
          class="flex-1 py-1 bg-black text-white text-sm rounded font-medium hover:bg-gray-800 transition"
        >
          Agregar
        </button>
      </div>
    </div>
  );
}
