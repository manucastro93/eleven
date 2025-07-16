import { useParams, useSearchParams } from "@solidjs/router";
import {
  createSignal,
  createEffect,
  For,
  onCleanup,
  Show,
  onMount
} from "solid-js";
import { listarProductos } from "@/services/producto.service";
import ProductoCard from "@/components/common/ProductoCard";
import SidebarCategorias from "@/components/Categoria/SidebarCategorias";
import Breadcrumb from "@/components/common/Breadcrumb";

export default function ProductosPorCategoria() {
  const params = useParams();
  const [searchParams] = useSearchParams();
  const busqueda = () => searchParams.busqueda?.toString().trim() || "";

  const [productos, setProductos] = createSignal<any[]>([]);
  const [pagina, setPagina] = createSignal(1);
  const [orden, setOrden] = createSignal<string>("precio-asc");
  const [cargando, setCargando] = createSignal(false);
  const [fin, setFin] = createSignal(false);
  const [restaurandoScroll, setRestaurandoScroll] = createSignal(false);

  let sentinel!: HTMLDivElement;
  let ejecutando = false;

  const cargarProductos = async (categoria: string) => {
    if (ejecutando || cargando() || fin()) return;

    ejecutando = true;
    setCargando(true);

    try {
      const nuevos = await listarProductos({
        categoria,
        busqueda: busqueda(),
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

  // 🔁 Reactiva al cambiar categoría, orden o texto de búsqueda
  createEffect(() => {
    const categoria = params.categoria?.toLowerCase();
    const ordenActual = orden();
    const termino = busqueda();

if (restaurandoScroll()) return;

  setProductos([]);
  setPagina(1);
  setFin(false);
  cargarProductos(categoria);
  });

  // Scroll infinito
  createEffect(() => {
    if (!sentinel || productos().length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          cargarProductos(params.categoria);
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

  // ✅ Restaurar scroll preciso al volver del detalle
onMount(() => {
  const scrollY = parseInt(sessionStorage.getItem("scrollY") || "0");
  const cantidadEsperada = parseInt(sessionStorage.getItem("cantidadProductos") || "0");

  if (scrollY && cantidadEsperada) {
    setRestaurandoScroll(true);
    let intentos = 0;

    const intentarRestaurar = async () => {
      const productosRenderizados = document.querySelectorAll("[data-producto]").length;
      const alturaOk = document.body.scrollHeight >= scrollY;

      console.log("🔁 intento", intentos, {
        alturaOk,
        productosRenderizados,
        cantidadEsperada,
        scrollHeight: document.body.scrollHeight,
      });

      // 👉 si no hay suficientes productos renderizados, forzamos un fetch extra
      if (productosRenderizados < cantidadEsperada && !cargando() && !fin()) {
        await cargarProductos(params.categoria);
      }

      if ((alturaOk && productosRenderizados >= cantidadEsperada) || intentos > 200) {
        window.scrollTo({ top: scrollY, behavior: "smooth" });
        console.log("✅ restaurado a", scrollY);
        sessionStorage.removeItem("scrollY");
        sessionStorage.removeItem("cantidadProductos");
        setRestaurandoScroll(false);
      } else {
        intentos++;
        setTimeout(() => requestAnimationFrame(intentarRestaurar), 30);
      }
    };

    requestAnimationFrame(intentarRestaurar);
  }
});


  return (
    <div class="bg-white flex px-4 pb-20 gap-6 max-w-[1440px] mx-auto">
      <SidebarCategorias />

      <section class="flex-1">
        <Breadcrumb
          items={[
            { label: "Inicio", href: "/" },
            { label: "Shop", href: "/productos" },
            { label: params.categoria.replace(/-/g, " ") },
          ]}
          separador=">"
        />

        <div class="flex justify-between items-center mb-4">
          <div>
            <h1 class="text-xl font-semibold capitalize">
              {params.categoria.replace(/-/g, " ")}
            </h1>
            <Show when={busqueda()}>
              <p class="text-sm text-gray-500 mt-1">
                Mostrando resultados para:{" "}
                <span class="font-medium">{busqueda()}</span>
              </p>
            </Show>
          </div>

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
            {(prod) => (
              <div data-producto>
                <ProductoCard producto={prod} />
              </div>
            )}
          </For>
        </div>

        <div ref={(el) => (sentinel = el)} class="h-10" />

        {cargando() && (
          <p class="text-center text-sm text-gray-500 my-4">
            Cargando más...
          </p>
        )}
        {fin() && productos().length === 0 && (
          <p class="text-center text-sm mt-8">
            No hay productos que coincidan con esta búsqueda.
          </p>
        )}
      </section>
    </div>
  );
}
