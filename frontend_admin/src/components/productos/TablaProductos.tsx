import { createResource, For, Show } from "solid-js";
import { listarProductos } from "@/services/producto.service";
import { formatearPrecio } from "@/utils/formato";
import { ImagenConExtensiones } from "@/components/shared/ImagenConExtensiones";

interface Props {
  filtro: {
    search: string;
    categoriaId: number | null;
    page: number;
    orderBy: string;
    orderDir: "ASC" | "DESC";
  };
  setFiltro: (f: any) => void;
  onProductoClick?: (producto: any) => void;
}

export default function TablaProductos(props: Props) {
  const [productos] = createResource(
    () => props.filtro,
    async (filtro) => {
      const res = await listarProductos({ ...filtro, limit: 20 });
      return res;
    }
  );

  const cambiarPagina = (nuevaPage: number) => {
    if (
      nuevaPage >= 1 &&
      nuevaPage <= (productos()?.totalPages || 1) &&
      nuevaPage !== props.filtro.page
    ) {
      props.setFiltro({
        ...props.filtro,
        page: nuevaPage,
      });
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
              onClick={() => cambiarOrden("codigo")}
            >
              Código {iconoOrden("codigo")}
            </th>
            <th
              class="px-4 py-2 border-b cursor-pointer select-none"
              onClick={() => cambiarOrden("nombre")}
            >
              Nombre {iconoOrden("nombre")}
            </th>
            <th
              class="px-4 py-2 border-b cursor-pointer select-none"
              onClick={() => cambiarOrden("categoria.nombre")}
            >
              Categoría {iconoOrden("categoria.nombre")}
            </th>
            <th
              class="px-4 py-2 border-b cursor-pointer select-none"
              onClick={() => cambiarOrden("categoria.nombre")}
            >
              Sub Categoría {iconoOrden("subcategoria.nombre")}
            </th>
            <th
              class="px-4 py-2 border-b cursor-pointer select-none"
              onClick={() => cambiarOrden("precio")}
            >
              Precio {iconoOrden("precio")}
            </th>
            <th
              class="px-4 py-2 border-b cursor-pointer select-none"
              onClick={() => cambiarOrden("stock")}
            >
              Stock {iconoOrden("stock")}
            </th>
          </tr>
        </thead>
        <tbody>
          <Show
            when={productos()}
            fallback={
              <tr>
                <td colspan="6" class="px-4 py-4 text-center text-gray-500">
                  Cargando productos...
                </td>
              </tr>
            }
          >
            <For each={productos()?.productos || []}>
              {(prod, i) => (
                <tr
                  class={`${
                    i() % 2 === 0 ? "bg-white" : "bg-gray-50"
                  } hover:bg-gray-100 cursor-pointer`}
                  onClick={() => props.onProductoClick?.(prod)}
                >
                  <td class="px-4 py-2 border-b">    
                    <img
                      src={prod.imagen}
                      alt="Producto"
                      class="h-20 w-20 object-cover rounded"
                    />
                  </td>
                  <td class="px-4 py-2 border-b">{prod.codigo}</td>
                  <td class="px-4 py-2 border-b">{prod.nombre}</td>
                  <td class="px-4 py-2 border-b">{prod.categoria?.nombre}</td>
                  <td class="px-4 py-2 border-b">{prod.subcategoria?.nombre}</td>
                  <td class="px-4 py-2 border-b">{formatearPrecio(prod.precio)}</td>
                  <td class="px-4 py-2 border-b">{prod.stock}</td>
                  
                </tr>
              )}
            </For>
          </Show>
        </tbody>
      </table>

      {/* PAGINACIÓN COMPACTA PRO */}
      <Show when={productos()}>
        <div class="flex justify-center mt-6 gap-1 flex-wrap">
          {(() => {
            const totalPages = productos()?.totalPages || 1;
            const currentPage = props.filtro.page;
            const maxButtons = 5; // cantidad de botones visibles

            let start = Math.max(1, currentPage - Math.floor(maxButtons / 2));
            let end = start + maxButtons - 1;

            if (end > totalPages) {
              end = totalPages;
              start = Math.max(1, end - maxButtons + 1);
            }

            return (
              <>
                {/* Botón primera */}
                <button
                  onClick={() => cambiarPagina(1)}
                  disabled={currentPage === 1}
                  class={`px-3 py-1 border rounded ${
                    currentPage === 1
                      ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                      : "bg-white text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  «
                </button>

                {/* Botón anterior */}
                <button
                  onClick={() => cambiarPagina(currentPage - 1)}
                  disabled={currentPage === 1}
                  class={`px-3 py-1 border rounded ${
                    currentPage === 1
                      ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                      : "bg-white text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  ‹
                </button>

                {/* Páginas numeradas */}
                {Array.from(
                  { length: end - start + 1 },
                  (_, i) => start + i
                ).map((page) => (
                  <button
                    onClick={() => cambiarPagina(page)}
                    class={`px-3 py-1 border rounded ${
                      page === currentPage
                        ? "bg-gray-800 text-white"
                        : "bg-white text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {page}
                  </button>
                ))}

                {/* Botón siguiente */}
                <button
                  onClick={() => cambiarPagina(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  class={`px-3 py-1 border rounded ${
                    currentPage === totalPages
                      ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                      : "bg-white text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  ›
                </button>

                {/* Botón última */}
                <button
                  onClick={() => cambiarPagina(totalPages)}
                  disabled={currentPage === totalPages}
                  class={`px-3 py-1 border rounded ${
                    currentPage === totalPages
                      ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                      : "bg-white text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  »
                </button>
              </>
            );
          })()}
        </div>
      </Show>
    </div>
  );
}
