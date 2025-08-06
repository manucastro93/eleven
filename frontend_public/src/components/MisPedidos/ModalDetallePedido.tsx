import { Show, For, createSignal } from "solid-js";
import type { Pedido } from "@/types/pedido.type";
import { formatearPrecio } from "@/utils/formato";
import { cancelarPedido } from "@/services/pedido.service";
import { duplicarPedidoACarrito } from "@/services/carrito.service";
import { obtenerClienteDeLocalStorage } from "@/utils/localStorage";
import { useCarrito } from "@/store/carrito";
import ToastContextual from "@/components/ui/ToastContextual";

export default function ModalDetallePedido(props: {
  pedido: Pedido;
  onClose: () => void;
  onCancelar?: (id: number) => void;
  onEditar?: (id: number) => void;
  onDuplicar?: (id: number) => void;
}) {
  const { pedido, onClose, onCancelar, onEditar, onDuplicar } = props;
  const [toastVisible, setToastVisible] = createSignal(false);
  const [toastMsg, setToastMsg] = createSignal("");
  const [toastTipo, setToastTipo] = createSignal<"success" | "error" | "warning" | "info" | "loading">("info");
  const [showConfirm, setShowConfirm] = createSignal(false);
  const { setMostrarCarrito, setCarrito } = useCarrito();

  function showToast(msg: string, tipo: "success" | "error" | "warning" | "info" | "loading" = "info", duration = 2500) {
    setToastMsg(msg);
    setToastTipo(tipo);
    setToastVisible(false);
    setTimeout(() => {
      setToastVisible(true);
      setTimeout(() => setToastVisible(false), duration);
    }, 0);
  }

  const handleDuplicar = async () => {
    try {
      showToast("Duplicando pedido...", "loading");
      const cliente = obtenerClienteDeLocalStorage();
      const itemsCarrito = await duplicarPedidoACarrito(pedido, cliente?.id ?? 0);
      setCarrito(itemsCarrito);
      showToast("Pedido duplicado en el carrito.", "success", 1800);
      onClose();
      setMostrarCarrito(true);
    } catch (e) {
      showToast("No se pudo duplicar el pedido.", "error", 1800);
    }
  };

  const handleCancelar = async () => {
    setShowConfirm(false);
    try {
      await cancelarPedido(pedido.id);
      onCancelar?.(pedido.id);
      showToast("Pedido cancelado correctamente.", "success", 2000);
      setTimeout(() => window.location.reload(), 1500);
    } catch (e) {
      showToast("No se pudo cancelar el pedido.", "error", 2000);
    }
  };

  const handleEditar = () => onEditar?.(pedido.id);

  return (
    <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div class="bg-white max-w-2xl w-full rounded-lg shadow-lg overflow-hidden">
        {/* Header */}
        <div class="flex justify-between items-center p-4 border-b">
          <h2 class="text-lg font-semibold">Detalle del pedido #{pedido.id}</h2>
          <button onClick={onClose} class="text-gray-500 hover:text-black">✕</button>
        </div>
        {/* Productos */}
        <div class="p-4 max-h-[60vh] overflow-y-auto">
          <table class="w-full text-sm">
            <thead>
              <tr class="border-b text-left">
                <th class="py-2">Producto</th>
                <th class="py-2 text-center">Cant.</th>
                <th class="py-2 text-right">Precio unit.</th>
                <th class="py-2 text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              <For each={pedido.productos}>
                {(prod) => (
                  <tr class="border-b last:border-0">
                    <td class="flex gap-2 items-center py-2">
                      <img
                        src={prod.producto.imagen}
                        alt={prod.producto.nombre}
                        class="w-12 h-12 object-cover rounded "
                      />
                      <span>{prod.producto.nombre}</span>
                    </td>
                    <td class="text-center">{prod.cantidad}</td>
                    <td class="text-right">{formatearPrecio(prod.precio)}</td>
                    <td class="text-right font-medium">
                      {formatearPrecio(prod.precio * prod.cantidad)}
                    </td>
                  </tr>
                )}
              </For>
            </tbody>
          </table>
        </div>
        {/* Footer */}
        <div class="border-t p-4 flex justify-between items-center bg-gray-50">
          <p class="font-semibold text-lg">Total: {formatearPrecio(pedido.total)}</p>
          <div class="flex gap-2">
            {/* Mostrar solo Cancelar si estadoEdicion === 1 y estadoPedidoId === 1 */}
            <Show when={pedido.estadoPedidoId === 1 && pedido.estadoEdicion === true}>
              <button
                onClick={() => setShowConfirm(true)}
                class="bg-red-600 hover:bg-red-700 text-white text-sm px-3 py-1 rounded"
              >
                Cancelar
              </button>
            </Show>

            {/* Mostrar todos los botones si estadoEdicion === 0 y estadoPedidoId === 1 */}
            <Show when={pedido.estadoPedidoId === 1 && pedido.estadoEdicion === false}>
              <>
                <button
                  onClick={() => setShowConfirm(true)}
                  class="bg-red-600 hover:bg-red-700 text-white text-sm px-3 py-1 rounded"
                >
                  Cancelar pedido
                </button>
                <button
                  onClick={handleEditar}
                  class="bg-yellow-500 hover:bg-yellow-600 text-white text-sm px-3 py-1 rounded"
                >
                  Editar
                </button>
                <button
                  onClick={handleDuplicar}
                  class="bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-1 rounded"
                >
                  Duplicar
                </button>
              </>
            </Show>

          </div>
        </div>
      </div>
      <ToastContextual
        mensaje={toastMsg()}
        tipo={toastTipo()}
        visible={toastVisible()}
        onClose={() => setToastVisible(false)}
      />
      {/* Confirmación para cancelar */}
      <Show when={showConfirm()}>
        <div class="fixed inset-0 bg-black/40 flex items-center justify-center z-60">
          <div class="bg-white p-6 rounded-lg shadow-lg min-w-[300px] flex flex-col gap-4 items-center">
            <span class="text-lg font-medium text-gray-800">¿Seguro que querés cancelar el pedido?</span>
            <div class="flex gap-3 mt-2">
              <button
                onClick={handleCancelar}
                class="bg-red-600 hover:bg-red-700 text-white px-4 py-1 rounded"
              >
                Cancelar pedido
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                class="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-1 rounded"
              >
                No
              </button>
            </div>
          </div>
        </div>
      </Show>
    </div>
  );
}
