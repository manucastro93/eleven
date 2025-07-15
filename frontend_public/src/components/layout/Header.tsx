// ✅ Header.tsx
import { Show, createSignal, createEffect } from "solid-js";
import { Search, User, ShoppingBag } from "lucide-solid";
import { useNavigate } from "@solidjs/router";
import TextoPromoSlider from "@/components/common/TextoPromoSlider";
import BuscadorOverlay from "@/components/common/BuscadorOverlay";
import NavegacionDesktop from "@/components/layout/NavegacionDesktop";
import { useCarrito, versionCarrito } from "@/store/carrito";

export let promoRef: HTMLDivElement | undefined;
export let headerRef: HTMLDivElement | undefined;
export let navRef: HTMLDivElement | undefined;

export default function Header(props: { onCart: () => void }) {
  const navigate = useNavigate();
  const [buscarVisible, setBuscarVisible] = createSignal(false);
  const { carrito } = useCarrito();
  const [animarCarrito, setAnimarCarrito] = createSignal(false);

  createEffect(() => {
    document.body.style.overflow = buscarVisible() ? "hidden" : "auto";
  });

  createEffect(() => {
    versionCarrito();
    setAnimarCarrito(true);
    const timeout = setTimeout(() => setAnimarCarrito(false), 300);
    return () => clearTimeout(timeout);
  });

  const cantidadItems = () =>
    carrito().reduce((acc, item) => acc + item.cantidad, 0);

  return (
    <>
      <Show when={buscarVisible()}>
        <BuscadorOverlay onClose={() => setBuscarVisible(false)} />
      </Show>

      <TextoPromoSlider ref={(el: any) => (promoRef = el as HTMLDivElement)} />

      <header class="sticky top-0 z-40 bg-black text-white shadow-sm">
        <div
          ref={(el) => (headerRef = el as HTMLDivElement)}
          class="flex items-center justify-between px-4 py-5 max-w-7xl mx-auto"
        >
          <button onClick={() => setBuscarVisible(true)}>
            <Search size={24} />
          </button>

          <div onClick={() => navigate("/")} class="cursor-pointer">
            <img src="/img/logo.png" alt="Eleven Regalos" class="h-18" />
          </div>

          <div class="flex gap-4 items-center">
            <button onClick={() => navigate("/mis-pedidos")}> <User size={24} /> </button>
            <button onClick={props.onCart} class="relative">
              <ShoppingBag size={24} class={animarCarrito() ? "animate-bounce" : ""} />
              <Show when={cantidadItems() > 0}>
                <span class="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1 min-w-[1rem] text-center">
                  {cantidadItems()}
                </span>
              </Show>
            </button>
          </div>
        </div>
      </header>

      <NavegacionDesktop refNav={(el) => (navRef = el as HTMLDivElement)} />
    </>
  );
}
