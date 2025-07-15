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
        class="keen-slider w-full rounded-xl overflow-hidden"
        style={{ height: "auto" }} // podés reemplazar luego por h-72 md:h-96 si querés
      >
        {banners()!.map((banner) => (
          <div
            class="keen-slider__slide relative w-full h-full"

          >
            <img
  src={`${import.meta.env.VITE_BACKEND_URL}${banner.img}`}
  class="w-full h-full object-contain"
/>

            <div
              style={{
                position: "absolute",
                top: `${banner.textoTop}px`,
                left: `${banner.textoLeft}px`,
                width: `${banner.textoWidth || 50}%`,
                ...parseStyleString(banner.descripcionEstilo),
              }}
              innerHTML={banner.texto}
            />
            <a
              href={banner.botonLink}
              style={{
                position: "absolute",
                top: `${banner.botonTop}px`,
                left: `${banner.botonLeft}px`,
                ...parseStyleString(banner.botonEstilo),
              }}
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
