import { createResource, For, Show } from "solid-js";
import { listarClientes } from "@/services/cliente.service";

interface Props {
  filtro: {
    search: string;
    page: number;
    orderBy: string;
    orderDir: "ASC" | "DESC";
  };
  setFiltro: (f: any) => void;
  onClienteClick?: (cliente: any) => void;
}

export default function TablaClientes(props: Props) {
  const [clientes] = createResource(
    () => props.filtro,
    async (filtro) => {
      const res = await listarClientes({
        search: filtro.search,
        page: filtro.page,
        limit: 20,
      });
      return res;
    }
  );

  const cambiarPagina = (nuevaPage: number) => {
    if (
      nuevaPage >= 1 &&
      nuevaPage <= (clientes()?.totalPages || 1) &&
      nuevaPage !== props.filtro.page
    ) {
      props.setFiltro({
        ...props.filtro,
        page: nuevaPage,
      });
    }
  };

  return (
    <div class="mt-6 border rounded-lg overflow-x-auto">
      <table class="w-full text-left border-collapse">
        <thead class="bg-gray-100 text-gray-600 text-sm">
          <tr>
            <th class="px-4 py-2 border-b">Nombre</th>
            <th class="px-4 py-2 border-b">CUIT</th>
            <th class="px-4 py-2 border-b">Email</th>
            <th class="px-4 py-2 border-b">Teléfono</th>
          </tr>
        </thead>
        <tbody>
          <Show
            when={clientes()}
            fallback={
              <tr>
                <td colspan="4" class="px-4 py-4 text-center text-gray-500">
                  Cargando clientes...
                </td>
              </tr>
            }
          >
            <For each={clientes()?.clientes || []}>
              {(cli, i) => (
                <tr
                  class={`${
                    i() % 2 === 0 ? "bg-white" : "bg-gray-50"
                  } hover:bg-gray-100 cursor-pointer`}
                  onClick={() => props.onClienteClick?.(cli)}
                >
                  <td class="px-4 py-2 border-b">{cli.nombre}</td>
                  <td class="px-4 py-2 border-b">{cli.cuit}</td>
                  <td class="px-4 py-2 border-b">{cli.email}</td>
                  <td class="px-4 py-2 border-b">{cli.telefono}</td>
                </tr>
              )}
            </For>
          </Show>
        </tbody>
      </table>

      <Show when={clientes()}>
        <div class="flex justify-center mt-6 gap-1 flex-wrap">
          {(() => {
            const totalPages = clientes()?.totalPages || 1;
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
