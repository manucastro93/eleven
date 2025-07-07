import { createResource, createSignal, For, Show } from "solid-js";
import { listarBanners, actualizarOrdenBanners } from "@/services/banner.service";

interface Props {
    filtro: {
        search: string;
        page: number;
        orderBy: string;
        orderDir: "ASC" | "DESC";
    };
    setFiltro: (f: any) => void;
    onBannerClick?: (banner: any) => void;
}

export default function TablaBanners(props: Props) {
    const [bannersRaw, setBannersRaw] = createSignal<{
        banners: any[];
        totalPages: number;
        totalCount: number;
    } | null>(null);

    createResource(
        () => props.filtro,
        async (filtro) => {
            const res = await listarBanners({ ...filtro, limit: 100 });
            setBannersRaw(res);
            return res;
        }
    );

    const moverBanner = async (index: number, delta: number) => {
        const lista = [...(bannersRaw()?.banners || [])];

        const newIndex = index + delta;
        if (newIndex < 0 || newIndex >= lista.length) return;

        const [moved] = lista.splice(index, 1);
        lista.splice(newIndex, 0, moved);

        lista.forEach((b, i) => {
            b.orden = i;
        });

        try {
            await actualizarOrdenBanners(
            lista
                .map((cat, i) => ({ id: Number(cat.id), orden: i }))
                .filter(({ id }) => !!id && !isNaN(id))
            );

            // Actualizo en memoria
            setBannersRaw({
                ...bannersRaw()!,
                banners: lista,
            });
        } catch (err) {
            console.error("Error al actualizar orden", err);
        }
    };

    const cambiarOrden = (columna: string) => {
        if (props.filtro.orderBy === columna) {
            props.setFiltro({
                ...props.filtro,
                orderDir: props.filtro.orderDir === "ASC" ? "DESC" : "ASC",
                page: 1,
            });
        } else {
            props.setFiltro({
                ...props.filtro,
                orderBy: columna,
                orderDir: "ASC",
                page: 1,
            });
        }
    };

    const iconoOrden = (columna: string) => {
        if (props.filtro.orderBy !== columna) return "";
        return props.filtro.orderDir === "ASC" ? "▲" : "▼";
    };

    return (
        <div class="mt-6 border rounded-lg overflow-x-auto">
            <table class="w-full text-left border-collapse">
                <thead class="bg-gray-100 text-gray-600 text-sm">
                    <tr>
                        <th class="px-4 py-2 border-b">Imagen</th>
                        <th
                            class="px-4 py-2 border-b cursor-pointer select-none"
                            onClick={() => cambiarOrden("texto")}
                        >
                            Texto {iconoOrden("texto")}
                        </th>
                        <th class="px-4 py-2 border-b text-center">Orden</th>
                        <th class="px-4 py-2 border-b text-center">Activo</th>
                    </tr>
                </thead>
                <tbody>
                    <Show
                        when={bannersRaw()}
                        fallback={
                            <tr>
                                <td colspan="4" class="px-4 py-4 text-center text-gray-500">
                                    Cargando banners...
                                </td>
                            </tr>
                        }
                    >
                        <For each={bannersRaw()?.banners || []}>
                            {(banner, i) => (
                                <tr
                                    class={`${i() % 2 === 0 ? "bg-white" : "bg-gray-50"
                                        } hover:bg-gray-100`}
                                >
                                    <td
                                        class="px-4 py-2 border-b cursor-pointer"
                                        onClick={() => props.onBannerClick?.(banner)}
                                    >
                                        <img
                                            src={banner.img || "/img/no-image.png"}
                                            alt="Img"
                                            class="h-12 w-24 object-cover rounded"
                                        />
                                    </td>

                                    <td
                                        class="px-4 py-2 border-b cursor-pointer"
                                        onClick={() => props.onBannerClick?.(banner)}
                                    >
                                        {banner.texto}
                                    </td>

                                    <td class="px-4 py-2 border-b text-center">
                                        <div class="flex flex-col items-center gap-1">
                                            <div class="flex justify-center gap-1">
                                                <Show when={i() > 0}>
                                                    <button
                                                        onClick={() => moverBanner(i(), -1)}
                                                        class="bg-gray-200 text-white text-base px-3 py-2 rounded"
                                                        title="Mover arriba"
                                                    >
                                                        ⬆️
                                                    </button>
                                                </Show>
                                                <Show
                                                    when={
                                                        i() <
                                                        (bannersRaw()?.banners.length || 0) - 1
                                                    }
                                                >
                                                    <button
                                                        onClick={() => moverBanner(i(), 1)}
                                                        class="bg-gray-200 text-white text-base px-3 py-2 rounded"
                                                        title="Mover abajo"
                                                    >
                                                        ⬇️
                                                    </button>
                                                </Show>
                                            </div>
                                        </div>
                                    </td>

                                    <td class="px-4 py-2 border-b text-center">
                                        {banner.activo ? "✅" : "❌"}
                                    </td>
                                </tr>
                            )}
                        </For>
                    </Show>
                </tbody>
            </table>
        </div>
    );
}
