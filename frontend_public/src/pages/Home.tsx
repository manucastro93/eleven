// src/pages/Home.tsx
import BannerSlider from "@/components/home/BannerSlider";
import CategoriaScroller from "@/components/home/CategoriaScroller";
import ProductosDestacados from "@/components/home/ProductosDestacados";
import ProductosNuevos from "@/components/home/ProductosNuevos";

export default function Home() {
  return (
    <div class="pb-20"> {/* para que no tape el bottom navbar */}
      <BannerSlider />
      <CategoriaScroller />
      <ProductosDestacados />
      <ProductosNuevos />
    </div>
  );
}
