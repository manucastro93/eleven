import { createResource } from "solid-js";
import { createSlider } from "@/lib/keen-slider-solid";
import { listarBanners } from "@/services/banner.service";
import type { Banner } from "@/types/banner.type";
import "@/index.css"; // donde ya tenés keen-slider importado

function parseStyleString(styleStr: string): Record<string, string> {
  const styles: Record<string, string> = {};
  styleStr
    .split(";")
    .filter((s) => s.trim() !== "")
    .forEach((s) => {
      const [key, value] = s.split(":");
      if (key && value) styles[key.trim()] = value.trim();
    });
  return styles;
}

export default function BannerSlider() {
  const [banners] = createResource(async () => {
    const res = await listarBanners();
    return res.banners;
  });

  const [sliderRef] = createSlider({
    loop: true,
    slides: { perView: 1 }
  });

  return (
    <>
      {banners() && (
<div
  ref={sliderRef}
  class="keen-slider w-full aspect-[2/1] relative overflow-hidden"
>
  {banners()!.map((banner) => (
    <div class="keen-slider__slide relative w-full h-full">
      <img
        src={`${import.meta.env.VITE_BACKEND_URL}${banner.img}`}
        class="w-full h-full object-cover"
      />

      <div
        class="absolute"
        style={`top: ${banner.textoTop}vh; left: ${banner.textoLeft}vw; width: ${banner.textoWidth}vw; z-index: 10; ${banner.descripcionEstilo || ""}`}
        innerHTML={banner.texto}
      />

      <a
        href={banner.botonLink}
        class="absolute"
        style={`top: ${banner.botonTop}vh; left: ${banner.botonLeft}vw; z-index: 10; ${banner.botonEstilo || ""}`}
      >
        {banner.botonTexto}
      </a>
    </div>
  ))}
</div>

      )}
    </>
  );

}
