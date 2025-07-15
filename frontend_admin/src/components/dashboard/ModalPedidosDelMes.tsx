import { For, Show } from "solid-js";
import type { PedidoDashboard } from "@/types/pedido";
import { formatearPrecio } from "@/utils/formato";

export default function ModalPedidosDelMes(props: {
  pedidos: PedidoDashboard[];
  onClose: () => void;
  onVerDetalle: (pedido: PedidoDashboard) => void;
}) {
  const estados = ["pendiente", "en_proceso", "entregado"];

  const pedidosPorEstado = (estado: string) =>
    props.pedidos.filter((p) => p.estado === estado);

  const calcularTotal = (pedidos: PedidoDashboard[]) =>
    pedidos.reduce((acc, p) => acc + p.total, 0);

  const totalGeneral = calcularTotal(props.pedidos);

  return (
    <>
      <div class="fixed inset-0 bg-black/40 z-40" onClick={props.onClose} />
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[85vh] overflow-y-auto">
          {/* HEADER */}
          <div class="flex justify-between items-center p-4 border-b sticky top-0 bg-white z-10">
            <h2 class="text-xl font-semibold">Pedidos del mes</h2>
            <button class="text-gray-500 hover:text-gray-700" onClick={props.onClose}>
              ✕
            </button>
          </div>

          <div class="p-4 space-y-6">
            <For each={estados}>
              {(estado) => {
                const pedidos = pedidosPorEstado(estado);
                if (pedidos.length === 0) return null;

                return (
                  <div class="space-y-2">
                    <h3 class="text-lg font-semibold capitalize">{estado.replace("_", " ")}</h3>

                    <div class="overflow-x-auto border rounded-lg">
                      <table class="w-full text-sm">
                        <thead class="bg-gray-100">
                          <tr class="text-left text-gray-600">
                            <th class="py-2 px-3">ID</th>
                            <th class="py-2 px-3">Cliente</th>
                            <th class="py-2 px-3">Fecha</th>
                            <th class="py-2 px-3">Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          <For each={pedidos}>
                            {(p) => (
                              <tr
                                class="hover:bg-gray-50 cursor-pointer"
                                onClick={() => props.onVerDetalle(p)}
                              >
                                <td class="py-2 px-3">{p.id}</td>
                                <td class="py-2 px-3">{p.cliente}</td>
                                <td class="py-2 px-3">{p.fecha}</td>
                                <td class="py-2 px-3">{formatearPrecio(p.total)}</td>
                              </tr>
                            )}
                          </For>
                        </tbody>
                      </table>
                    </div>

                    <div class="text-right text-sm text-gray-600">
                      Total {estado.replace("_", " ")}: {formatearPrecio(calcularTotal(pedidos))}
                    </div>
                  </div>
                );
              }}
            </For>

            <div class="text-right font-semibold text-md">
              Total general: {formatearPrecio(totalGeneral)}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
