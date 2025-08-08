import { Show, For, createSignal } from "solid-js";
import type { Pedido } from "@/types/pedido.type";
import { formatearPrecio } from "@/utils/formato";
import { cancelarPedido } from "@/services/pedido.service";
import { duplicarPedidoACarrito } from "@/services/carrito.service";
import { obtenerClienteDeLocalStorage } from "@/utils/localStorage";
import { useCarrito } from "@/store/carrito";
import ToastContextual from "@/components/ui/ToastContextual";
import { iniciarEdicionPedido } from "@/store/edicionPedido";
import { Truck, Package, CreditCard, Phone, Mail, Building2, BadgeDollarSign, FileText, MapPin, LocateFixed, Map, Hash } from "lucide-solid";
import { useToastContextual } from "@/hooks/useToastContextual";

export default function ModalDetallePedido(props: {
  pedido: Pedido;
  onClose: () => void;
  onCancelar?: (id: number) => void;
  onEditar?: (id: number) => void;
  onDuplicar?: (id: number) => void;
}) {
  const { pedido, onClose, onCancelar, onEditar, onDuplicar } = props;
  const [showConfirm, setShowConfirm] = createSignal(false);
  const { setMostrarCarrito, setCarrito, inicializarCarrito, modoEdicion, setPedidoEditandoId } = useCarrito();
  const { toastVisible, toastMsg, toastTipo, showToast, handleClose } = useToastContextual();

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

  const handleEditar = async () => {
    showToast("Habilitando edición del pedido...", "loading", 2500);
    setPedidoEditandoId(pedido.id);
    await iniciarEdicionPedido(pedido.id);
    inicializarCarrito();
    setMostrarCarrito(true);
    onClose();
  };

  const handleImprimir = () => {
    window.print();
  };

  function InfoItem(props: {
    icon: any,
    label: string,
    value: string | number | null | undefined,
    full?: boolean,
    color?: string
    noWrap?: boolean
  }) {
    return (
      <div class={`${props.full ? 'sm:col-span-2 lg:col-span-3' : ''}`}>
        <div class="flex items-center gap-2 mb-1">
          <props.icon class={`w-4 h-4 ${props.color || 'text-gray-500'}`} />
          <span class="text-xs uppercase tracking-wide text-gray-500">{props.label}</span>
        </div>
        <p class={`text-sm font-medium text-gray-800 leading-snug ${props.noWrap ? 'whitespace-nowrap' : 'break-words'}`}>
          {props.value || '-'}
        </p>
      </div>
    );
  }

  return (
    <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div class="bg-white max-w-2xl w-full rounded-lg shadow-lg overflow-hidden max-h-[90vh] flex flex-col print-area">
        {/* Header */}
        <div class="flex justify-between items-center p-4 border-b">
          <h2 class="text-lg font-semibold">Detalle del pedido #{pedido.id}</h2>
          <button onClick={onClose} class="text-gray-500 hover:text-black">✕</button>
        </div>
        {/* Datos del cliente / pedido */}
        <div class="p-4 border-b bg-gray-50">
          <div class="bg-white rounded-xl shadow p-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <InfoItem icon={Hash} color="text-orange-500" label="CUIT" value={pedido.cuit} />
            <InfoItem icon={FileText} color="text-gray-500" label="Razón social" value={pedido.razonSocial} />
            <InfoItem icon={Building2} color="text-gray-500" label="Nombre fantasía" value={pedido.nombreFantasia} />
            <InfoItem icon={MapPin} color="text-red-500" label="Dirección" value={pedido.direccion} full />
            <InfoItem icon={CreditCard} color="text-green-500" label="Forma de pago" value={pedido.formaPago} />
            <InfoItem icon={Package} color="text-blue-500" label="Forma de envío" value={pedido.formaEnvio} />
            <InfoItem icon={Truck} color="text-blue-500" label="Transporte" value={pedido.transporte} />
            <InfoItem icon={Phone} color="text-purple-500" label="Teléfono" value={pedido.telefono} />
            <InfoItem icon={Mail} color="text-purple-500" label="Email" value={pedido.email} noWrap />
          </div>
        </div>

        {/* Productos */}
        <div class="p-2 max-h-[60vh] overflow-y-auto productos-scroll">
          <table class="w-full text-sm">
            <thead>
              <tr class="border-b text-left">
                <th class="py-2"></th>
                <th class="py-2"></th>
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
                    <td class="text-center">{prod.observaciones}</td>
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
        <div class="border-t p-4 flex justify-between items-center bg-gray-50 print-total">
          <p class="font-semibold text-lg">Total: {formatearPrecio(pedido.total)}</p>
          <div class="flex gap-2">
            {/* Si está en edición, solo mostrá "Cancelar" */}
            <Show when={modoEdicion() && pedido.estadoPedidoId === 1}>
              <button
                onClick={() => setShowConfirm(true)}
                class="bg-red-600 hover:bg-red-700 text-white text-sm px-3 py-1 rounded"
              >
                Cancelar pedido
              </button>
            </Show>

            {/* Si NO está en edición y está pendiente, mostrá todos los botones */}
            <Show when={!modoEdicion() && pedido.estadoPedidoId === 1}>
              <>
                <button
                  onClick={() => setShowConfirm(true)}
                  class="bg-red-600 hover:bg-red-700 text-white text-sm px-3 py-1 rounded no-print"
                >
                  Cancelar pedido
                </button>
                <button
                  onClick={handleEditar}
                  class="bg-yellow-500 hover:bg-yellow-600 text-white text-sm px-3 py-1 rounded no-print"
                >
                  Editar
                </button>
                <button
                  onClick={handleDuplicar}
                  class="bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-1 rounded no-print"
                >
                  Duplicar
                </button>
                <button
                  onClick={handleImprimir}
                  class="bg-gray-700 hover:bg-gray-800 text-white text-sm px-3 py-1 rounded no-print"
                >
                  Imprimir
                </button>
              </>
            </Show>
          </div>
        </div>
      </div>
      
      <ToastContextual
        visible={toastVisible()}
        mensaje={toastMsg()}
        tipo={toastTipo()}
        onClose={handleClose}
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
