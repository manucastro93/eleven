import { createSignal, createEffect, For, Show } from "solid-js";
import { listarItemsMenu, actualizarOrdenItemsMenu } from "@/services/itemMenu.service";
import type { ItemMenu } from "@/types/itemMenu";

interface Props {
    filtro: {
        search: string;
        page: number;
        orderBy: string;
        orderDir: "ASC" | "DESC";
    };
    setFiltro: (f: any) => void;
    onItemClick?: (item: ItemMenu) => void;
    reload?: number;
}

export default function TablaItemsMenu(props: Props) {
    const [itemsRaw, setItemsRaw] = createSignal<ItemMenu[]>([]);

    const fetchItems = async () => {
        const res = await listarItemsMenu(); // aún sin filtros reales
        const ordenados = res.sort((a, b) => a.orden - b.orden);
        setItemsRaw(ordenados);
    };

    createEffect(() => {
        props.filtro;
        props.reload;
        fetchItems();
    });

    const moverItem = async (index: number, delta: number) => {
        const lista = [...itemsRaw()];
        const newIndex = index + delta;
        if (newIndex < 0 || newIndex >= lista.length) return;

        const [movido] = lista.splice(index, 1);
        lista.splice(newIndex, 0, movido);

        const actualizados = lista.map((item, i) => ({
            id: item.id,
            orden: i + 1
        }));

        try {
            await actualizarOrdenItemsMenu(actualizados);
            setItemsRaw(lista.map((item, i) => ({ ...item, orden: i + 1 })));
        } catch (err) {
            console.error("Error al reordenar items", err);
        }
    };

    const cambiarOrden = (col: string) => {
        if (props.filtro.orderBy === col) {
            props.setFiltro({
                ...props.filtro,
                orderDir: props.filtro.orderDir === "ASC" ? "DESC" : "ASC",
                page: 1,
            });
        } else {
            props.setFiltro({ ...props.filtro, orderBy: col, orderDir: "ASC" });
        }
    };

    const iconoOrden = (col: string) =>
        props.filtro.orderBy !== col ? "" : props.filtro.orderDir === "ASC" ? "▲" : "▼";

    return (
        <div class="mt-6 border rounded-lg overflow-x-auto">
            <table class="w-full text-left border-collapse">
                <thead class="bg-gray-100 text-gray-600 text-sm">
                    <tr>
                        <th
                            class="px-4 py-2 border-b cursor-pointer select-none"
                            onClick={() => cambiarOrden("nombre")}
                        >
                            Nombre {iconoOrden("nombre")}
                        </th>
                        <th
                            class="px-4 py-2 border-b cursor-pointer select-none text-center"
                            onClick={() => cambiarOrden("orden")}
                        >
                            Orden {iconoOrden("orden")}
                        </th>
                        <th class="px-4 py-2 border-b text-center">Activo</th>
                        <th class="px-4 py-2 border-b text-center">Mover</th>
                    </tr>
                </thead>
                <tbody>
                    <Show
                        when={itemsRaw()}
                        fallback={
                            <tr>
                                <td colspan="4" class="px-4 py-4 text-center text-gray-500">
                                    Cargando ítems...
                                </td>
                            </tr>
                        }
                    >
                        <For each={itemsRaw()}>
                        {(item, i) => (
                            <tr
                            class={`cursor-pointer border-t hover:bg-gray-50 ${!item.activo ? "opacity-50" : ""}`}
                            onClick={() => props.onItemClick?.(item)}
                            >
                            <td class="px-4 py-2 border-b">{item.nombre}</td>
                            <td class="px-4 py-2 border-b text-center">{item.orden}</td>
                            <td class="px-4 py-2 border-b text-center">
                                {item.activo ? "✅" : "⛔"}
                            </td>
                            <td class="px-4 py-2 border-b text-center">
                                <div class="flex justify-center gap-1">
                                <Show when={i() > 0}>
                                    <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        moverItem(i(), -1);
                                    }}
                                    class="bg-gray-200 text-white text-base px-3 py-2 rounded"
                                    title="Mover arriba"
                                    >
                                    ⬆️
                                    </button>
                                </Show>
                                <Show when={i() < itemsRaw().length - 1}>
                                    <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        moverItem(i(), 1);
                                    }}
                                    class="bg-gray-200 text-white text-base px-3 py-2 rounded"
                                    title="Mover abajo"
                                    >
                                    ⬇️
                                    </button>
                                </Show>
                                </div>
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
