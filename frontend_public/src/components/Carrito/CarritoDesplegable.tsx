import { X } from "lucide-solid";
import PasoResumen from "./PasoResumen";
import FormPaso2 from "./FormularioCheckout/FormPaso2";
import { createSignal } from "solid-js";

export default function CarritoDesplegable(props: { abierto: boolean; onClose: () => void }) {
  const [paso, setPaso] = createSignal<1 | 2>(1);

  // Montado SIEMPRE: sólo controlás visibilidad y animación con clases
  return (
    <>
      {/* Fondo oscuro animado */}
      <div
        class={`fixed inset-0 z-[9998] bg-black/40 transition-opacity duration-300 ${
          props.abierto ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={props.abierto ? props.onClose : undefined}
      />

      {/* Panel lateral animado */}
      <div
        class={`fixed top-0 right-0 w-[600px] max-w-full h-full bg-white z-[9999] shadow-lg flex flex-col
        transition-transform duration-300 ease-in-out
        ${props.abierto ? "translate-x-0" : "translate-x-full"}
        `}
        style="will-change: transform;"
      >
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
          {paso() === 1 ? (
            <PasoResumen onSiguiente={() => setPaso(2)} />
          ) : (
            <FormPaso2 onVolver={() => setPaso(1)} />
          )}
        </div>
      </div>
    </>
  );
}
