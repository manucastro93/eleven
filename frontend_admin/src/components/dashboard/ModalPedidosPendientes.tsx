import { For } from "solid-js";
import type { PedidoDashboard } from "@/types/pedido";

export default function ModalPedidosPendientes(props: {
  pedidos: PedidoDashboard[];
  onClose: () => void;
  onVerDetalle: (pedido: PedidoDashboard) => void;
}) {
  return (
    <>
      <div class="fixed inset-0 bg-black/40 z-40" onClick={props.onClose} />
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="bg-white rounded-2xl shadow-xl max-w-3xl w-full max-h-[85vh] overflow-y-auto">
          <div class="flex justify-between items-center p-4 border-b sticky top-0 bg-white z-10">
            <h2 class="text-xl font-semibold">Pedidos Pendientes</h2>
            <button class="text-gray-500 hover:text-gray-700" onClick={props.onClose}>
              ✕
            </button>
          </div>

          <div class="p-4">
            <table class="w-full text-sm">
              <thead>
                <tr class="text-left text-gray-500 border-b">
                  <th class="py-2">ID</th>
                  <th>Cliente</th>
                  <th>Fecha</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                <For each={props.pedidos}>
                  {(p) => {
                    const intensidad = Math.min((p.diasDemora ?? 0) / 20, 1); // máx 1
                    const bgColor = `rgba(239, 68, 68, ${intensidad.toFixed(2)})`; // red-500 dinámico
                    return (
                      <tr
                        class="border-b last:border-none cursor-pointer transition-colors"
                        style={{
                            background: intensidad > 0 ? bgColor : "transparent",
                            color: intensidad > 0.6 ? "#7f1d1d" : "inherit",
                            "font-weight": intensidad > 0.6 ? "600" : "normal",
                            }}
                        onClick={() => props.onVerDetalle(p)}
                      >
                        <td class="py-2">{p.id}</td>
                        <td>{p.cliente}</td>
                        <td>{p.fecha}</td>
                        <td class="capitalize">{p.estado}</td>
                      </tr>
                    );
                  }}
                </For>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
