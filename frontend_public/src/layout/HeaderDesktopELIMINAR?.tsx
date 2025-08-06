import { A } from "@solidjs/router";
import { createEffect, createSignal } from "solid-js";
import { useCarrito } from "@/store/carrito";
import { formatearPrecio } from "@/utils/formato";

export default function HeaderDesktop() {
  const { carrito, setMostrarCarrito, total } = useCarrito();
  const [resaltado, setResaltado] = createSignal(false);

  createEffect(() => {
    if (carrito().length > 0) {
      setResaltado(true);
      setTimeout(() => setResaltado(false), 500);
    }
  });

  return (
    <header class="fixed top-0 left-0 w-full z-50 bg-black h-[100px] px-6 shadow flex items-center justify-between">
      <A href="/" onClick={() => setMostrarCarrito(false)}>
        <img src="/img/logo.png" alt="Eleven Regalos" class="h-20" />
      </A>

      <div class="flex items-center gap-6">
        <button
          onClick={() => setMostrarCarrito(true)}
          class={`relative flex items-center justify-center transition-all duration-300 ${
            resaltado() ? "animate-bump" : ""
          }`}
        >
          {/* Ícono */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="w-8 h-8 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.5 6h13m-9 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm6 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2z"
            />
          </svg>

          {/* Texto */}
          <span class="ml-2 text-sm text-white">
            ({carrito().length}) - {formatearPrecio(total())}
          </span>
        </button>
      </div>
    </header>
  );
}
