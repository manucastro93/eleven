// src/pages/productos/OfertasDelMes.tsx
import {
  createSignal,
  createEffect,
  For,
  onCleanup,
} from "solid-js";
import { listarProductos } from "@/services/producto.service";
import ProductoCard from "@/components/common/ProductoCard";
import Breadcrumb from "@/components/common/Breadcrumb";

export default function OfertasDelMes() {
  const categoria = "ofertas-del-mes"
  const [productos, setProductos] = createSignal<any[]>([]);
  const [pagina, setPagina] = createSignal(1);
  const [orden, setOrden] = createSignal<string>("precio-asc");
  const [cargando, setCargando] = createSignal(false);
  const [fin, setFin] = createSignal(false);

  let sentinel!: HTMLDivElement;
  let ejecutando = false;

  const cargarProductos = async () => {
    if (ejecutando || cargando() || fin()) return;
    ejecutando = true;
    setCargando(true);

    try {
      const nuevos = await listarProductos({
        categoria,
        pagina: pagina(),
        orden: orden(),
      });

      if (nuevos.length === 0) {
        if (pagina() === 1) setProductos([]);
        setFin(true);
        return;
      }

      setProductos((prev) => [...prev, ...nuevos]);
      setPagina((prev) => prev + 1);
    } catch (err) {
      console.error("❌ Error al cargar productos:", err);
    } finally {
      ejecutando = false;
      setCargando(false);
    }
  };

  // Reset al cambiar orden
  createEffect(() => {
    setProductos([]);
    setPagina(1);
    setFin(false);
    cargarProductos();
  });

  // Scroll infinito
  createEffect(() => {
    if (!sentinel || productos().length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          cargarProductos();
        }
      },
      { threshold: 1 }
    );

    observer.observe(sentinel);
    onCleanup(() => observer.disconnect());
  });

  const handleOrdenChange = (nuevoOrden: string) => {
    setOrden(nuevoOrden);
  };

  return (
    <div class="bg-white px-4 pb-20 max-w-[1440px] mx-auto">
      <section class="pt-6">
        <Breadcrumb
          items={[
            { label: "Inicio", href: "/" },
            { label: "Ofertas del mes" },
          ]}
        />

        <div class="flex justify-between items-center mb-4">
          <h1 class="text-xl font-semibold">⛔ Ofertas del mes</h1>

          <select
            class="text-sm border rounded px-2 py-1"
            value={orden()}
            onChange={(e) => handleOrdenChange(e.currentTarget.value)}
          >
            <option value="precio-asc">Menor precio</option>
            <option value="precio-desc">Mayor precio</option>
            <option value="nombre-desc">Nombre Z → A</option>
            <option value="novedades">Novedades</option>
          </select>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          <For each={productos()}>
            {(prod) => <ProductoCard producto={prod} />}
          </For>
        </div>

        <div ref={(el) => (sentinel = el)} class="h-10" />

        {cargando() && (
          <p class="text-center text-sm text-gray-500 my-4">Cargando más...</p>
        )}
        {fin() && productos().length === 0 && (
          <p class="text-center text-sm mt-8">No hay productos en oferta.</p>
        )}
      </section>
    </div>
  );
}
