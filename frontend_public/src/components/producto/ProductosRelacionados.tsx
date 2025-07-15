import { For, createResource, onMount, onCleanup } from "solid-js";
import { listarProductosRelacionados } from "@/services/producto.service";
import ProductoCard from "@/components/common/ProductoCard";
import type { Producto } from "@/types/producto.type";

export default function ProductosRelacionados(props: { categoriaSlug: string; productoId: number }) {
  const [productos] = createResource<Producto[]>(() =>
    listarProductosRelacionados(props.categoriaSlug, props.productoId)
  );

  let sliderRef: HTMLDivElement | undefined;
  let intervalId: number | undefined;

  const scrollByAmount = 300;

  const scrollLeft = () => sliderRef?.scrollBy({ left: -scrollByAmount, behavior: "smooth" });
  const scrollRight = () => sliderRef?.scrollBy({ left: scrollByAmount, behavior: "smooth" });

  const startAutoScroll = () => {
    stopAutoScroll();
    intervalId = setInterval(() => {
      if (!sliderRef) return;
      sliderRef.scrollBy({ left: scrollByAmount, behavior: "smooth" });
      if (sliderRef.scrollLeft >= sliderRef.scrollWidth / 2) {
        sliderRef.scrollLeft = 0;
      }
    }, 4000);
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
    <section class="mt-16 px-4 relative">
      <h2 class="text-xl font-semibold mb-4 text-center">Productos similares</h2>

      <button onClick={scrollLeft} class="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white shadow p-2 rounded-full hidden md:flex">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button onClick={scrollRight} class="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white shadow p-2 rounded-full hidden md:flex">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>

      <div ref={sliderRef} class="flex gap-4 overflow-x-auto no-scrollbar scroll-smooth pb-2">
        <For each={productos()}>
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
