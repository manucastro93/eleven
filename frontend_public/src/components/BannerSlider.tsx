import { onMount, createEffect } from "solid-js";
import Swiper from "swiper";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import { useCarrito } from "@/store/carrito";

interface Banner {
  img: string;
  texto: string;
  botonTexto?: string;
  botonLink?: string;
  descripcionEstilo?: string;
  botonEstilo?: string;
}

const banners: Banner[] = [
  {
    img: "/img/banners/banner1.png",
    texto: "Novedades en mates",
    botonTexto: "Ver Todo",
    botonLink: "/mates",
    descripcionEstilo: "text-white",
    botonEstilo: "bg-[#b8860b] hover:bg-[#d4af37]",
  },
  {
    img: "/img/banners/banner2.png",
    texto: "Se viene el día del padre",
    botonTexto: "Ver Todo",
    botonLink: "/diadelpadre",
    descripcionEstilo: "text-black",
    botonEstilo: "bg-[#e8a57c] hover:bg-[#d69e5e]",
  },
  {
    img: "/img/banners/banner3.png",
    texto: "Nuevos ingresos",
    botonTexto: "¡Mirá lo nuevo!",
    botonLink: "/novedades",
    descripcionEstilo: "text-white",
    botonEstilo: "bg-[#b8860b] hover:bg-[#d4af37]",
  },
];

export default function BannerSlider() {
  const { mostrarCarrito } = useCarrito();
  let swiperInstance: Swiper;

  onMount(() => {
    swiperInstance = new Swiper(".swiper-banner", {
      modules: [Autoplay],
      loop: true,
      autoplay: {
        delay: 4000,
        disableOnInteraction: false,
      },
      speed: 900,
      effect: "slide",
    });
  });

  createEffect(() => {
    if (swiperInstance) {
      if (mostrarCarrito()) {
        swiperInstance.autoplay?.stop();
      } else {
        swiperInstance.autoplay?.start();
      }
    }
  });

  return (
    <div class="swiper-banner relative aspect-[16/9] md:aspect-[21/9] overflow-hidden">
      <div class="swiper-wrapper">
        {banners.map((b) => (
          <div class="swiper-slide relative w-full h-full">
            <img
              src={b.img}
              class="absolute inset-0 w-full h-full object-cover"
              alt={b.texto}
            />
            <div class="absolute inset-0 flex flex-col items-center justify-center text-center px-4 z-10">
              <h2
                class={`text-2xl md:text-4xl font-semibold mb-4 opacity-0 animate-fade-in-up ${b.descripcionEstilo}`}
                style="animation-delay: 0.3s"
              >
                {b.texto}
              </h2>
              {b.botonTexto && b.botonLink && (
                <a
                  href={b.botonLink}
                  class={`text-white px-6 py-2 rounded-full font-semibold opacity-0 animate-fade-in-up transition duration-300 cursor-pointer ${b.botonEstilo}`}
                  style="animation-delay: 0.5s"
                >
                  {b.botonTexto}
                </a>
              )}
            </div>
            <div class="absolute inset-0 bg-black/20 z-0" />
          </div>
        ))}
      </div>
    </div>
  );
}
