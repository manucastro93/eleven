import { For, createResource, onCleanup, onMount } from "solid-js";
import ProductoCard from "@/components/common/ProductoCard";
import { listarProductos } from "@/services/producto.service";

export default function ProductosNuevos() {
  const [productos] = createResource(() =>
    listarProductos({ orden: "fecha_creacion-desc", pagina: 1 })
  );

  let sliderRef: HTMLDivElement | undefined;
  let intervalId: number | undefined;
  const scrollByAmount = 300;
  const scrollDelay = 3000;

  const scrollLeft = () => {
    sliderRef?.scrollBy({ left: -scrollByAmount, behavior: "smooth" });
  };

  const scrollRight = () => {
    sliderRef?.scrollBy({ left: scrollByAmount, behavior: "smooth" });
  };

  const startAutoScroll = () => {
    stopAutoScroll();
    intervalId = setInterval(() => {
      if (!sliderRef) return;

      sliderRef.scrollBy({ left: scrollByAmount, behavior: "smooth" });

      // si pasamos la mitad, reiniciamos al inicio (en la misma posición visual)
      if (
        sliderRef.scrollLeft >= sliderRef.scrollWidth / 2
      ) {
        sliderRef.scrollLeft = 0;
      }
    }, scrollDelay);
  };

  const stopAutoScroll = () => {
    if (intervalId) clearInterval(intervalId);
  };

  onMount(() => {
    const el = sliderRef!;
    startAutoScroll();

    let scrollTimeout: ReturnType<typeof setTimeout>;

    const pause = () => stopAutoScroll();
    const resume = () => startAutoScroll();

    el.addEventListener("mouseenter", pause);
    el.addEventListener("mouseleave", resume);
    el.addEventListener("scroll", () => {
      stopAutoScroll();
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        startAutoScroll();
      }, 2000);
    });

    onCleanup(() => {
      stopAutoScroll();
      el.removeEventListener("mouseenter", pause);
      el.removeEventListener("mouseleave", resume);
    });
  });

  return (
    <section class="mt-10 px-4 relative">
      <h2 class="text-lg font-semibold mb-4">Novedades</h2>

      <button
        onClick={scrollLeft}
        class="absolute left-0 top-[50%] -translate-y-1/2 z-10 bg-white/80 hover:bg-white shadow p-2 rounded-full hidden md:flex"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button
        onClick={scrollRight}
        class="absolute right-0 top-[50%] -translate-y-1/2 z-10 bg-white/80 hover:bg-white shadow p-2 rounded-full hidden md:flex"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Slider */}
      <div
        ref={sliderRef}
        class="flex gap-4 overflow-x-auto no-scrollbar scroll-smooth pb-2"
      >
        <For each={productos()?.concat(productos() ?? [])}>
          {(producto) => (
            <div class="flex-shrink-0 w-72">
              <ProductoCard producto={producto} />
            </div>
          )}
        </For>
      </div>
    </section>
  );
}
