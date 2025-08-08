import { createSignal, onMount } from "solid-js";
import { useParams } from "@solidjs/router";
import { formatearPrecio } from "@/utils/formato";
import { obtenerPedidoPorId } from "@/services/pedido.service";
import type { Pedido } from "@/types/pedido.type";

export default function PedidoImprimir() {
  const params = useParams();
  const [pedido, setPedido] = createSignal<Pedido | null>(null);

  onMount(async () => {
    // Traer datos del pedido
    const data = await obtenerPedidoPorId(Number(params.id));
    setPedido(data);

    // Esperar a que renderice y luego imprimir
    setTimeout(() => window.print(), 300);
  });

  return (
    <div class="p-8 text-sm">
      {pedido() ? (
        <>
          <h1 class="text-lg font-bold mb-4">
            Detalle del pedido #{pedido()!.id}
          </h1>

          {/* Datos del cliente */}
          <div class="mb-6">
            <p><strong>CUIT:</strong> {pedido()!.cuit}</p>
            <p><strong>Razón social:</strong> {pedido()!.razonSocial}</p>
            <p><strong>Dirección:</strong> {pedido()!.direccion}</p>
            <p><strong>Teléfono:</strong> {pedido()!.telefono}</p>
            <p><strong>Email:</strong> {pedido()!.email}</p>
          </div>

          {/* Productos */}
          <table class="w-full border text-xs">
            <thead>
              <tr>
                <th class="border px-2 py-1 text-left">Producto</th>
                <th class="border px-2 py-1 text-center">Cant.</th>
                <th class="border px-2 py-1 text-right">Precio unit.</th>
                <th class="border px-2 py-1 text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {pedido()!.productos.map((prod) => (
                <tr>
                  <td class="border px-2 py-1">{prod.producto.nombre}</td>
                  <td class="border px-2 py-1 text-center">{prod.cantidad}</td>
                  <td class="border px-2 py-1 text-right">
                    {formatearPrecio(prod.precio)}
                  </td>
                  <td class="border px-2 py-1 text-right">
                    {formatearPrecio(prod.precio * prod.cantidad)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <p class="mt-4 font-semibold">
            Total: {formatearPrecio(pedido()!.total)}
          </p>
        </>
      ) : (
        <p>Cargando pedido...</p>
      )}
    </div>
  );
}
