import { Component, onMount, createEffect } from "solid-js";
//import ProductoCard from "@/components/ProductoCard";
import { initSwiper } from "@/utils/initSwiper";
import { useCarrito } from "@/store/carrito";
import Swiper from "swiper";
import type { Producto } from "@/types/producto.type";

interface Props {
  titulo: string;
  productos: Producto[];
  variante?: "default" | "novedades" | "relacionados";
}

const SliderProductos: Component<Props> = ({
  titulo,
  productos,
  variante = "default"
}) => {
  const { mostrarCarrito } = useCarrito();
  let swiperRef: HTMLDivElement | undefined;
  let swiperInstance: Swiper;

  onMount(() => {
    if (swiperRef) {
      swiperInstance = initSwiper(swiperRef);
    }
  });

  createEffect(() => {
    if (!swiperInstance) return;
    if (mostrarCarrito()) {
      swiperInstance.autoplay?.stop();
    } else {
      swiperInstance.autoplay?.start();
    }
  });

  return (
    <section class="mt-10 px-4 relative">
      <h3
        class={`text-xl font-semibold mb-4 ${
          variante === "novedades" ? "text-gray-800" : "text-[#d4af37]"
        }`}
      >
        {titulo}
      </h3>

      <div class="swiper overflow-visible px-1 md:px-0" ref={swiperRef}>
        <div class="swiper-wrapper">
          {productos.map((prod) => (
            <div
              class={`swiper-slide flex justify-center md:justify-start cursor-pointer ${
                variante === "novedades" ? "pt-4 pb-8" : ""
              }`}
            >
              <div class="w-[75vw] sm:w-[200px] md:w-[230px]">
                {/*<ProductoCard {...prod} />*/}
              </div>
            </div>
          ))}
        </div>

        <div class="swiper-button-prev custom-swiper-btn hidden sm:flex">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="w-6 h-6 text-dorado"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </div>
        <div class="swiper-button-next custom-swiper-btn hidden sm:flex">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="w-6 h-6 text-dorado"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </div>

        <div class="swiper-pagination mt-4" />
      </div>
    </section>
  );
};

export default SliderProductos;
