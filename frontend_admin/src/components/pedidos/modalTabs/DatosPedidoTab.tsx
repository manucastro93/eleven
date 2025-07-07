import type { Pedido } from "@/types/pedido";
import { formatearPrecio } from "@/utils/formato";
import { formatearFechaCorta } from "@/utils/formato";

export default function DatosPedidoTab(props: { pedido: Pedido }) {
  return (
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label class="block text-sm font-medium text-gray-600">Cliente</label>
        <div class="mt-1 text-gray-800">{props.pedido.cliente?.nombre}</div>
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-600">Fecha</label>
        <div class="mt-1 text-gray-800">
          {formatearFechaCorta(props.pedido.fecha)}
        </div>
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-600">Estado</label>
        <div class="mt-1 text-gray-800">
          {props.pedido.estadoPedido?.nombre}
        </div>
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-600">Total</label>
        <div class="mt-1 text-gray-800">
          {formatearPrecio(props.pedido.total)}
        </div>
      </div>
    </div>
  );
}
