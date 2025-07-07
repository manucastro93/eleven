import { createResource, For, Show } from "solid-js";
import { listarPedidos } from "@/services/pedido.service";
import { formatearPrecio } from "@/utils/formato";
import { formatearFechaCorta } from "@/utils/formato";

interface Props {
  filtro: {
    search: string;
    clienteId: number | null;
    estadoId: number | null;
    page: number;
    orderBy: string;
    orderDir: "ASC" | "DESC";
  };
  setFiltro: (f: any) => void;
  onPedidoClick?: (pedido: any) => void;
}

export default function TablaPedidos(props: Props) {
  const [pedidos] = createResource(
    () => props.filtro,
    async (filtro) => {
      const res = await listarPedidos({ ...filtro, limit: 20 });
      return res;
    }
  );

  const cambiarPagina = (nuevaPage: number) => {
    if (
      nuevaPage >= 1 &&
      nuevaPage <= (pedidos()?.totalPages || 1) &&
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
            <th
              class="px-4 py-2 border-b cursor-pointer select-none"
              onClick={() => cambiarOrden("id")}
            >
              Nº Pedido {iconoOrden("id")}
            </th>
            <th
              class="px-4 py-2 border-b cursor-pointer select-none"
              onClick={() => cambiarOrden("cliente.nombre")}
            >
              Cliente {iconoOrden("cliente.nombre")}
            </th>
            <th
              class="px-4 py-2 border-b cursor-pointer select-none"
              onClick={() => cambiarOrden("fecha")}
            >
              Fecha {iconoOrden("fecha")}
            </th>
            <th
              class="px-4 py-2 border-b cursor-pointer select-none"
              onClick={() => cambiarOrden("estadoPedido.nombre")}
            >
              Estado {iconoOrden("estadoPedido.nombre")}
            </th>
            <th
              class="px-4 py-2 border-b cursor-pointer select-none"
              onClick={() => cambiarOrden("total")}
            >
              Total {iconoOrden("total")}
            </th>
          </tr>
        </thead>
        <tbody>
          <Show
            when={pedidos()}
            fallback={
              <tr>
                <td colspan="5" class="px-4 py-4 text-center text-gray-500">
                  Cargando pedidos...
                </td>
              </tr>
            }
          >
            <For each={pedidos()?.pedidos || []}>
              {(pedido, i) => (
                <tr
                  class={`${
                    i() % 2 === 0 ? "bg-white" : "bg-gray-50"
                  } hover:bg-gray-100 cursor-pointer`}
                  onClick={() => props.onPedidoClick?.(pedido)}
                >
                  <td class="px-4 py-2 border-b">{pedido.id}</td>
                  <td class="px-4 py-2 border-b">{pedido.cliente?.nombre}</td>
                  <td class="px-4 py-2 border-b">
                    {formatearFechaCorta(pedido.fecha)}
                  </td>
                  <td class="px-4 py-2 border-b">
                    {pedido.estadoPedido?.nombre}
                  </td>
                  <td class="px-4 py-2 border-b">
                    {formatearPrecio(pedido.total)}
                  </td>
                </tr>
              )}
            </For>
          </Show>
        </tbody>
      </table>

      <Show when={pedidos()}>
        <div class="flex justify-center mt-6 gap-1 flex-wrap">
          {(() => {
            const totalPages = pedidos()?.totalPages || 1;
            const currentPage = props.filtro.page;
            const maxButtons = 5;

            let start = Math.max(1, currentPage - Math.floor(maxButtons / 2));
            let end = start + maxButtons - 1;

            if (end > totalPages) {
              end = totalPages;
              start = Math.max(1, end - maxButtons + 1);
            }

            return (
              <>
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
