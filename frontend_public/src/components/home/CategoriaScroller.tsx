import { For, createResource, onMount, onCleanup } from "solid-js";
import { useNavigate } from "@solidjs/router";
import { listarCategorias } from "@/services/categoria.service";
import type { Categoria } from "@/types/categoria.type";

export default function CategoriaScroller() {
  const navigate = useNavigate();
  const [categorias] = createResource<Categoria[]>(listarCategorias);

  let sliderRef: HTMLDivElement | undefined;
  let intervalId: number | undefined;
  let isDown = false;
  let startX = 0;
  let scrollLeft = 0;

  const scrollByAmount = 200;
  const scrollDelay = 4000;

  const startAutoScroll = () => {
    stopAutoScroll();
    intervalId = setInterval(() => {
      if (!sliderRef) return;
      if (
        sliderRef.scrollLeft + sliderRef.clientWidth >=
        sliderRef.scrollWidth - 5
      ) {
        sliderRef.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        sliderRef.scrollBy({ left: scrollByAmount, behavior: "smooth" });
      }
    }, scrollDelay);
  };

  const stopAutoScroll = () => {
    if (intervalId) clearInterval(intervalId);
  };

  onMount(() => {
    const el = sliderRef!;
    startAutoScroll();

    // hover o scroll manual pausa
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

    // 💥 Scroll por arrastre
    const onMouseDown = (e: MouseEvent) => {
      isDown = true;
      el.classList.add("cursor-grabbing");
      startX = e.pageX - el.offsetLeft;
      scrollLeft = el.scrollLeft;
    };

    const onMouseLeave = () => {
      isDown = false;
      el.classList.remove("cursor-grabbing");
    };

    const onMouseUp = () => {
      isDown = false;
      el.classList.remove("cursor-grabbing");
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - el.offsetLeft;
      const walk = (x - startX) * 1.5; // scroll speed
      el.scrollLeft = scrollLeft - walk;
    };

    el.addEventListener("mousedown", onMouseDown);
    el.addEventListener("mouseleave", onMouseLeave);
    el.addEventListener("mouseup", onMouseUp);
    el.addEventListener("mousemove", onMouseMove);

    onCleanup(() => {
      stopAutoScroll();
      el.removeEventListener("mouseenter", pause);
      el.removeEventListener("mouseleave", resume);
      el.removeEventListener("mousedown", onMouseDown);
      el.removeEventListener("mouseleave", onMouseLeave);
      el.removeEventListener("mouseup", onMouseUp);
      el.removeEventListener("mousemove", onMouseMove);
    });
  });

  return (
    <section class="mt-8 px-4">
      <div
        ref={(el) => (sliderRef = el)}
        class="flex gap-6 overflow-x-auto no-scrollbar scroll-smooth pb-4 cursor-grab"
      >
        <For each={categorias()}>
          {(cat) => (
            <button
              onClick={() => navigate(`/categoria/${cat.slug}`)}
              class="flex-shrink-0 w-24 md:w-44 flex flex-col items-center text-xs md:text-sm select-none"
            >
              <img
                src={
                  cat.imagenUrl
                    ? `${import.meta.env.VITE_BACKEND_URL}${cat.imagenUrl}`
                    : "/placeholder.jpg"
                }
                alt={cat.nombre}
                class="w-20 h-20 md:w-36 md:h-36 object-cover rounded-full shadow"
                draggable={false}
                onDragStart={e => e.preventDefault()}
              />
              <span class="mt-2 font-semibold text-center text-xs md:text-sm">{cat.nombre}</span>
            </button>
          )}
        </For>
      </div>
    </section>
  );
}
