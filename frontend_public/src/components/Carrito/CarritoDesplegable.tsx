import { Show, createSignal } from "solid-js";
import { X } from "lucide-solid";
import PasoResumen from "./PasoResumen";
import FormPaso2 from "./FormularioCheckout/FormPaso2";

export default function CarritoDesplegable(props: { abierto: boolean; onClose: () => void }) {
  const [paso, setPaso] = createSignal<1 | 2>(1);

  return (
    <Show when={props.abierto}>
      {/* Fondo oscuro */}
      <div class="fixed inset-0 bg-black/40 z-[9998]" onClick={props.onClose} />

      {/* Panel lateral */}
      <div class="fixed top-0 right-0 w-[600px] max-w-full h-full bg-white z-[9999] shadow-lg flex flex-col">
        {/* Header */}
        <div class="flex justify-between items-center px-5 py-4 border-b">
          <h2 class="text-lg font-medium tracking-wide uppercase">
            {paso() === 1 ? "Pedido" : "Tus datos"}
          </h2>
          <button onClick={props.onClose}>
            <X size={22} />
          </button>
        </div>

        {/* Contenido */}
        <div class="flex-1 overflow-y-auto">
          <Show when={paso() === 1}>
            <PasoResumen onSiguiente={() => setPaso(2)} />
          </Show>
          <Show when={paso() === 2}>
            <FormPaso2 onVolver={() => setPaso(1)} />
          </Show>
        </div>
      </div>
    </Show>
  );
}
