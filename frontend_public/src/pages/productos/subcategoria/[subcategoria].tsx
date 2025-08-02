import { useParams, useSearchParams } from "@solidjs/router";
import {
    createSignal,
    createEffect,
    For,
    onCleanup,
    Show,
    onMount,
    createResource,
    createMemo
} from "solid-js";
import { listarProductos } from "@/services/producto.service";
import ProductoCard from "@/components/common/ProductoCard";
import SidebarCategorias from "@/components/Categoria/SidebarCategorias";
import Breadcrumb from "@/components/common/Breadcrumb";
import { listarCategorias } from "@/services/categoria.service";
import type { Categoria } from "@/types/categoria.type";

export default function ProductosPorSubcategoria() {
    const params = useParams(); // ⬅️ usa subcategoria
    const [searchParams] = useSearchParams();
    const busqueda = () => searchParams.busqueda?.toString().trim() || "";
    const [categorias] = createResource<Categoria[]>(listarCategorias);
    const [productos, setProductos] = createSignal<any[]>([]);
    const [pagina, setPagina] = createSignal(1);
    const [orden, setOrden] = createSignal<string>("-");
    const [cargando, setCargando] = createSignal(false);
    const [fin, setFin] = createSignal(false);
    const [restaurandoScroll, setRestaurandoScroll] = createSignal(false);

    let sentinel!: HTMLDivElement;
    let ejecutando = false;

    const cargarProductos = async (categoria:string, subcategoria: string) => {
        if (ejecutando || cargando() || fin()) return;
        ejecutando = true;
        setCargando(true);

        try {
            const nuevos = await listarProductos({
                categoria,
                subcategoria, // ⬅️ usa subcategoria en lugar de categoria
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

    const categoriaDeSub = createMemo(() => {
        const subSlug = params.subcategoria;
        const todas = categorias();
        if (!subSlug || !todas) return null;

        for (const cat of todas) {
            const match = cat.subcategorias?.find((s) => s.slug === subSlug);
            if (match) return { nombre: cat.nombre, slug: cat.slug };
        }

        return null;
        });

    createEffect(() => {
        const categoria = params.categoria?.toLowerCase();
        const subcategoria = params.subcategoria?.toLowerCase();
        const ordenActual = orden();
        const termino = busqueda();

        if (restaurandoScroll()) return;

        setProductos([]);
        setPagina(1);
        setFin(false);
        cargarProductos(categoria, subcategoria);
    });

    createEffect(() => {
        if (!sentinel || productos().length === 0) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    cargarProductos(params.categoria, params.subcategoria);
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

    onMount(() => {
        const scrollY = parseInt(sessionStorage.getItem("scrollY") || "0");
        const cantidadEsperada = parseInt(sessionStorage.getItem("cantidadProductos") || "0");

        if (scrollY && cantidadEsperada) {
            setRestaurandoScroll(true);
            let intentos = 0;

            const intentarRestaurar = async () => {
                const productosRenderizados = document.querySelectorAll("[data-producto]").length;
                const alturaOk = document.body.scrollHeight >= scrollY;

                if (productosRenderizados < cantidadEsperada && !cargando() && !fin()) {
                    await cargarProductos(params.cateogria, params.subcategoria);
                }

                if ((alturaOk && productosRenderizados >= cantidadEsperada) || intentos > 200) {
                    window.scrollTo({ top: scrollY, behavior: "smooth" });
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
                        ...(categoriaDeSub()
                        ? [{ label: categoriaDeSub()!.nombre, href: `/categoria/${categoriaDeSub()!.slug}` }]
                        : []),
                        { label: params.subcategoria.replace(/-/g, " ") },
                    ]}
                    separador=">"
                    />

                <div class="flex justify-between items-center mb-4">
                    <div>
                        <h1 class="text-xl font-semibold capitalize">
                            {params.subcategoria.replace(/-/g, " ")}
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
                        <option value="-">Ordenar por</option>
                        <option value="precio-asc">Menor precio</option>
                        <option value="precio-desc">Mayor precio</option>
                        <option value="nombre-asc">Nombre A → Z</option>
                        <option value="nombre-desc">Nombre Z → A</option>
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
