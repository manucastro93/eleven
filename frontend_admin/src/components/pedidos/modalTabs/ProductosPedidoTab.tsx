import type { Pedido } from "@/types/pedido";
import { formatearPrecio } from "@/utils/formato";

export default function ProductosPedidoTab(props: { pedido: Pedido }) {
  const productos = props.pedido.productos || [];

  return (
    <div class="overflow-x-auto">
      <table class="w-full text-left border-collapse">
        <thead class="bg-gray-100 text-gray-600 text-sm">
          <tr>
            <th class="px-4 py-2 border-b">Producto</th>
            <th class="px-4 py-2 border-b">Cantidad</th>
            <th class="px-4 py-2 border-b">Precio Unitario</th>
            <th class="px-4 py-2 border-b">Subtotal</th>
          </tr>
        </thead>
        <tbody>
          {productos.map((item) => (
            <tr>
              <td class="px-4 py-2 border-b">{item.producto?.nombre}</td>
              <td class="px-4 py-2 border-b">{item.cantidad}</td>
              <td class="px-4 py-2 border-b">
                {formatearPrecio(item.precioUnitario)}
              </td>
              <td class="px-4 py-2 border-b">
                {formatearPrecio(item.precioUnitario * item.cantidad)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {productos.length === 0 && (
        <p class="text-gray-500 mt-4">No hay productos en este pedido.</p>
      )}
    </div>
  );
}
