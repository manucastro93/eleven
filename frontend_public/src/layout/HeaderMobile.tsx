import { A } from "@solidjs/router";
import { createSignal, Show } from 'solid-js';
import { useCarrito } from '@/store/carrito';
import MenuCategoriasMobile from '@/components/MenuCategoriasMobile';
import BuscadorExpandible from '@/components/ui/BuscadorExpandible';

export default function HeaderMobile() {
  const [menuAbierto, setMenuAbierto] = createSignal(false);
  const [busquedaAbierta, setBusquedaAbierta] = createSignal(false);
  const { carrito, setMostrarCarrito } = useCarrito();

  const cantidadTotal = () => carrito().reduce((a, p) => a + p.cantidad, 0);

  return (
    <header class="lg:hidden bg-black shadow-md sticky top-0 z-50 border-b border-gray-200">
      {/* Fila superior */}
      <div class="flex items-center justify-between px-2 py-2">
        <A href="/" onClick={() => setMostrarCarrito(false)}>
                <img src="/img/logo.png" alt="Eleven Regalos" class="w-60" />
              </A>

        <div class="flex items-center gap-4">
          {/* Buscar */}
          <button
            onClick={() => setBusquedaAbierta(true)}
            aria-label="Buscar"
          >
            🔍
          </button>

          {/* Carrito */}
          <button onClick={() => setMostrarCarrito(true)} class="relative">
            🛒
            <Show when={cantidadTotal() > 0}>
              <span class="absolute -top-1 -right-2 text-[11px] bg-[#b8860b] text-white px-1.5 rounded-full">
                {cantidadTotal()}
              </span>
            </Show>
          </button>

          {/* Menú ☰ */}
          <button
            onClick={() => setMenuAbierto(!menuAbierto())}
            class="relative w-6 h-6 flex flex-col justify-between items-center"
          >
            <span
              class={`block h-[2px] w-full bg-[#b8860b] transform transition ${
                menuAbierto() ? 'rotate-45 translate-y-[7px]' : ''
              }`}
            />
            <span
              class={`block h-[2px] w-full bg-[#b8860b] transition ${
                menuAbierto() ? 'opacity-0' : ''
              }`}
            />
            <span
              class={`block h-[2px] w-full bg-[#b8860b] transform transition ${
                menuAbierto() ? '-rotate-45 -translate-y-[7px]' : ''
              }`}
            />
          </button>
        </div>
      </div>

      {/* Panel buscador */}
      <Show when={busquedaAbierta()}>
        <BuscadorExpandible onCerrar={() => setBusquedaAbierta(false)} />
      </Show>

      {/* Panel menú */}
      <Show when={menuAbierto()}>
        <MenuCategoriasMobile onClose={() => setMenuAbierto(false)} />
      </Show>
    </header>
  );
}
