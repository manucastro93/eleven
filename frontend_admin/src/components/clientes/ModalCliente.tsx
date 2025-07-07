import type { Cliente } from "@/types/cliente";

export default function ModalCliente(props: { cliente: Cliente; onClose: () => void }) {
  return (
    <>
      <div class="fixed inset-0 bg-black/50 z-40" onClick={props.onClose} />
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="bg-white rounded-lg shadow-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto relative">
          <div class="flex justify-between items-center p-4 border-b sticky top-0 bg-white z-10">
            <h3 class="text-xl font-semibold">Cliente: {props.cliente.nombre}</h3>
            <button
              onClick={props.onClose}
              class="text-gray-500 hover:text-gray-700 text-2xl"
            >
              ×
            </button>
          </div>

          <div class="p-6 space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-600">CUIT</label>
              <div class="mt-1 text-gray-800">{props.cliente.cuit || "-"}</div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-600">Email</label>
              <div class="mt-1 text-gray-800">{props.cliente.email || "-"}</div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-600">Teléfono</label>
              <div class="mt-1 text-gray-800">{props.cliente.telefono || "-"}</div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-600">Dirección</label>
              <div class="mt-1 text-gray-800">{props.cliente.direccion || "-"}</div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-600">Categoría Fiscal</label>
              <div class="mt-1 text-gray-800">{props.cliente.categoriaFiscal || "-"}</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
