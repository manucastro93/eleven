import { createSignal, createEffect } from "solid-js";
import { listarCategorias } from "@/services/categoria.service";

interface Props {
  filtro: {
    search: string;
    categoriaId: number | null;
    page: number;
  };
  setFiltro: (f: any) => void;
}

export default function FiltroProductos(props: Props) {
  const [categorias, setCategorias] = createSignal<{ id: number; nombre: string }[]>([]);

  createEffect(async () => {
    try {
      const data = await listarCategorias();
      setCategorias(data);
    } catch (error) {
      console.error("Error al cargar categorías:", error);
      setCategorias([]);
    }
  });

  return (
    <div class="flex flex-wrap gap-4 mb-6">
      <input
        type="text"
        value={props.filtro.search}
        onInput={(e) =>
          props.setFiltro({
            ...props.filtro,
            search: e.currentTarget.value,
            page: 1,
          })
        }
        placeholder="Buscar por código o nombre"
        class="border border-gray-300 rounded px-3 py-2 w-64"
      />

      <select
        value={props.filtro.categoriaId || ""}
        onInput={(e) =>
          props.setFiltro({
            ...props.filtro,
            categoriaId: e.currentTarget.value
              ? parseInt(e.currentTarget.value)
              : null,
            page: 1,
          })
        }
        class="border border-gray-300 rounded px-3 py-2 w-64"
      >
        <option value="">Todas las categorías</option>
        {categorias().map((cat) => (
          <option value={cat.id}>{cat.nombre}</option>
        ))}
      </select>
    </div>
  );
}
