import { createSignal } from "solid-js";
import type { Pedido } from "@/types/pedido";
import DatosPedidoTab from "./modalTabs/DatosPedidoTab";
import ProductosPedidoTab from "./modalTabs/ProductosPedidoTab";
import HistorialPedidoTab from "./modalTabs/HistorialPedidoTab";

type Tab = "datos" | "productos" | "historial";

export default function ModalPedido(props: { pedido: Pedido; onClose: () => void }) {
  const [tab, setTab] = createSignal<Tab>("datos");

  return (
    <>
      <div class="fixed inset-0 bg-black/50 z-40" onClick={props.onClose} />
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="bg-white rounded-lg shadow-lg max-w-5xl w-full max-h-[90vh] overflow-y-auto relative">
          {/* HEADER */}
          <div class="flex justify-between items-center p-4 border-b sticky top-0 bg-white z-10">
            <h3 class="text-xl font-semibold">Pedido Nº {props.pedido.id}</h3>
            <button
              onClick={props.onClose}
              class="text-gray-500 hover:text-gray-700 text-2xl"
            >
              ×
            </button>
          </div>

          {/* TABS */}
          <div class="flex border-b px-4 sticky top-[56px] bg-white z-10">
            {[
              { key: "datos", label: "Datos del Pedido" },
              { key: "productos", label: "Productos" },
              { key: "historial", label: "Historial" },
            ].map((t) => (
              <button
                onClick={() => setTab(t.key as Tab)}
                class={`py-2 px-4 -mb-px border-b-2 ${
                  tab() === t.key
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-600 hover:text-blue-600"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* CONTENT */}
          <div class="p-6">
            {tab() === "datos" && <DatosPedidoTab pedido={props.pedido} />}
            {tab() === "productos" && <ProductosPedidoTab pedido={props.pedido} />}
            {tab() === "historial" && <HistorialPedidoTab pedido={props.pedido} />}
          </div>
        </div>
      </div>
    </>
  );
}
