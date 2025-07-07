import {
  onMount,
  onCleanup,
  createSignal,
  createEffect,
  createMemo,
  Show
} from 'solid-js';
import { useParams, useSearchParams } from '@solidjs/router';
import ProductoCard from '@/components/ProductoCard';
import MenuCategoriasLateral from '@/components/MenuCategoriasLateral';
import MenuCategoriasMobile from '@/components/MenuCategoriasMobile';
import SelectOrden from '@/components/ui/SelectOrden';
import { productosStore, setProductosStore } from '@/store/productosStore';
import { useScrollRestore } from '@/hooks/useScrollRestore';
import { log } from '@/utils/log';
import { slugify } from '@/utils/slugify';
import { listarProductos } from '@/services/producto.service';
import { listarCategorias } from '@/services/categoria.service';

export default function ProductosPorCategoria() {
  const params = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  useScrollRestore('scroll_productos');

  const categoriaSlug = createMemo(() => params.categoria || 'todos');
  const [categoriasDisponibles, setCategoriasDisponibles] = createSignal<string[]>([]);

  onMount(async () => {
    const cats = await listarCategorias();
    setCategoriasDisponibles(cats.map((c) => c.nombre));
  });

  const categoriaReal = () => {
    if (categoriaSlug() === 'todos') return undefined;
    return categoriasDisponibles().find((cat) => slugify(cat) === slugify(categoriaSlug()));
  };

  const busqueda = createMemo(() =>
    Array.isArray(searchParams.q) ? searchParams.q[0] : searchParams.q || ''
  );

  const orden = createMemo(() =>
    Array.isArray(searchParams.orden) ? searchParams.orden[0] : searchParams.orden || 'nombre-asc'
  );

  const [loading, setLoading] = createSignal(false);
  const [hayMas, setHayMas] = createSignal(true);

  const cargarProductos = async () => {
    if (loading() || !hayMas()) return;
    setLoading(true);

    const nuevos = await listarProductos({
      categoria: categoriaSlug(),
      busqueda: busqueda().toString(),
      orden: orden().toString(),
      pagina: productosStore.paginaActual
    });

    if (nuevos.length === 0) {
      setHayMas(false);
    } else {
      setProductosStore('productos', (prev) => [...prev, ...nuevos]);
      setProductosStore('paginaActual', (prev) => prev + 1);
    }

    setLoading(false);
  };

  const handleScroll = () => {
    const scrollBottom =
      window.innerHeight + window.scrollY >= document.body.scrollHeight - 300;
    if (scrollBottom) {
      cargarProductos();
      log('scroll_bottom', { pagina: productosStore.paginaActual });
    }
  };

  onMount(() => {
    log('visita_productos_categoria', {
      categoria: categoriaSlug(),
      busqueda: busqueda(),
      orden: orden()
    });
    window.addEventListener('scroll', handleScroll);
  });

  onCleanup(() => {
    window.removeEventListener('scroll', handleScroll);
  });

  createEffect(() => {
    const cat = categoriaSlug();
    const q = busqueda().toString();
    const o = orden().toString();

    const coincide =
      productosStore.filtros.categoria === cat &&
      productosStore.filtros.busqueda === q &&
      productosStore.filtros.orden === o;

    if (!coincide) {
      setProductosStore({
        filtros: { categoria: cat, busqueda: q, orden: o },
        productos: [],
        paginaActual: 1,
        scrollY: 0
      });
      setHayMas(true);
      window.scrollTo(0, 0);
      cargarProductos();
    }
  });

  const setBusqueda = (valor: string) => {
    setSearchParams({ ...searchParams, q: valor, page: '1' });
  };

  const setOrden = (valor: string) => {
    log('cambio_orden', { orden: valor });
    setSearchParams({ ...searchParams, orden: valor, page: '1' });
  };

  if (categoriaSlug() !== 'todos' && !categoriaReal()) {
    return <div class="p-8 text-center text-gray-600">Categoría no encontrada</div>;
  }

  return (
    <div class="bg-[#f5f3f0] flex flex-col lg:flex-row px-4 py-6 gap-6">
      <section class="flex-1">
        <h1 class="text-2xl font-bold text-gray-800 mb-4">
          {categoriaReal() ?? 'Todos los productos'}
        </h1>

        <div class="flex flex-col sm:flex-row gap-4 mb-4">
          <input
            type="text"
            placeholder="Buscar productos..."
            class="bg-[#fafafa] border border-gray-300 px-4 py-2 rounded-md shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-[#b8860b] w-full sm:w-1/2"
            value={busqueda()}
            onInput={(e) => {
              const valor = e.currentTarget.value;
              setBusqueda(valor);
              log('busqueda_productos', { valor });
            }}
          />
          <SelectOrden value={orden().toString()} onChange={setOrden} />
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
          {productosStore.productos.map((p) => (
            <ProductoCard {...p} />
          ))}
        </div>

        <Show when={productosStore.productos.length > 0 && !hayMas() && !loading()}>
          <div class="mt-10 flex justify-center">
            <div class="bg-yellow-100 border border-yellow-300 text-yellow-800 text-sm px-4 py-2 rounded-full shadow-sm animate-pulse select-none">
              🎉 Ya viste todos los productos disponibles
            </div>
          </div>
        </Show>

        <Show when={loading()}>
          <div class="mt-10 flex justify-center text-[#b8860b] text-sm">
            <div class="animate-spin rounded-full h-5 w-5 border-2 border-current border-t-transparent mr-2" />
            Cargando más productos...
          </div>
        </Show>
      </section>
    </div>
  );
}