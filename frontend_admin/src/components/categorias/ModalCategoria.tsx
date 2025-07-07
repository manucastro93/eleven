import { createSignal } from "solid-js";
import DatosCategoriaTab from "./modalTabs/DatosCategoriaTab";

type Tab = "datos";

export default function ModalCategoria(props: { categoria: any; onClose: () => void; onImagenActualizada?: () => void }) {
  const [tab, setTab] = createSignal<Tab>("datos");

  return (
    <>
      <div class="fixed inset-0 bg-black/50 z-40" onClick={props.onClose} />
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="bg-white rounded-lg shadow-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto relative">
          {/* HEADER */}
          <div class="flex justify-between items-center p-4 border-b sticky top-0 bg-white z-10">
            <h3 class="text-xl font-semibold">Categoría: {props.categoria.nombre}</h3>
            <button
              onClick={props.onClose}
              class="text-gray-500 hover:text-gray-700 text-2xl"
            >
              ×
            </button>
          </div>

          {/* TABS */}
          <div class="flex border-b px-4 sticky top-[56px] bg-white z-10">
            <button
              onClick={() => setTab("datos")}
              class={`py-2 px-4 -mb-px border-b-2 ${
                tab() === "datos"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-600 hover:text-blue-600"
              }`}
            >
              Datos de la Categoría
            </button>
          </div>

          {/* CONTENT */}
          <div class="p-6">
            {tab() === "datos" && <DatosCategoriaTab categoria={props.categoria} onImagenActualizada={props.onImagenActualizada} />}
          </div>
        </div>
      </div>
    </>
  );
}
