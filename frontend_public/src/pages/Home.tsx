import { Component, onMount, createResource } from 'solid-js';
import CategoriasHome from '@/components/CategoriasHome';
import SliderProductos from '@/components/SliderProductos';
import BannerSlider from '@/components/BannerSlider';
import { log } from '@/utils/log';
import { listarProductos } from '@/services/producto.service';

const Home: Component = () => {
  const [novedades] = createResource(() => listarProductos({ orden: 'fecha-desc', pagina: 1 }));
  const [destacados] = createResource(() => listarProductos({ orden: 'destacado', pagina: 1 }));

  onMount(() => {
    log('visita_home');
  });

  return (
    <main class="bg-[#f5f3f0] text-[#1e1e1e] min-h-screen">
      <BannerSlider />
      <section class="bg-white rounded-2xl shadow-[0_-4px_6px_rgba(0,0,0,0.1),0_4px_6px_rgba(0,0,0,0.1)] py-8 px-4 md:px-8 lg:px-16 mt-5">
        <h2 class="text-2xl font-semibold text-[#b8860b] mb-4">Novedades</h2>
        <SliderProductos titulo="" productos={novedades() || []} variante="novedades" />
      </section>
      <section class="px-4 md:px-8 lg:px-16 pt-8">
        <CategoriasHome />
      </section>
      <section class="mt-12 px-4 md:px-8 lg:px-16">
        <h2 class="text-2xl font-semibold text-[#b8860b] mb-4">Productos Destacados</h2>
        <SliderProductos titulo="" productos={destacados() || []} />
      </section>
    </main>
  );
};

export default Home;
