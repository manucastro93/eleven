import type { Pedido } from "@/types/pedido";
import { formatearFechaHora } from "@/utils/formato";

export default function HistorialPedidoTab(props: { pedido: Pedido }) {
  const historial = props.pedido.historial || [];

  return (
    <div class="overflow-x-auto">
      <table class="w-full text-left border-collapse">
        <thead class="bg-gray-100 text-gray-600 text-sm">
          <tr>
            <th class="px-4 py-2 border-b">Estado</th>
            <th class="px-4 py-2 border-b">Fecha</th>
            <th class="px-4 py-2 border-b">Observaciones</th>
          </tr>
        </thead>
        <tbody>
          {historial.map((h) => (
            <tr>
              <td class="px-4 py-2 border-b">{h.estado?.nombre}</td>
              <td class="px-4 py-2 border-b">{formatearFechaHora(h.fecha)}</td>
              <td class="px-4 py-2 border-b">{h.observaciones || "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {historial.length === 0 && (
        <p class="text-gray-500 mt-4">No hay historial de cambios.</p>
      )}
    </div>
  );
}
