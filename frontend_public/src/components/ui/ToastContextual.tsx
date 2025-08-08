import { Show, JSX } from "solid-js";

export default function ToastContextual(props: {
  visible: boolean;
  mensaje: string | JSX.Element;
  tipo: string;
  onClose?: () => void;
}) {
  return (
    <Show when={props.visible}>
      <div
        class="
          fixed left-1/2 top-1/2 z-[9999]
          flex flex-col items-center gap-3
          bg-white text-gray-800
          rounded-2xl shadow-2xl border border-gray-300
          transition-all duration-300
          transform -translate-x-1/2 -translate-y-1/2
          min-w-[320px] max-w-[90vw] p-7
          animate-fade-in
        "
      >
        <div class="text-l mb-1">
          {props.tipo === "success" && "✅"}
          {props.tipo === "error" && "❌"}
          {props.tipo === "warning" && "⚠️"}
          {props.tipo === "info" && "ℹ️"}
          {props.tipo === "loading" && (
            <svg class="animate-spin h-9 w-9 text-blue-600" fill="none" viewBox="0 0 24 24">
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              />
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              />
            </svg>
          )}
        </div>
        <span class="text-lg font-semibold text-center">{props.mensaje}</span>
        {props.tipo !== "loading" && props.onClose && (
            <button
              class="mt-2 bg-black text-white rounded-lg px-4 py-1 text-xs hover:bg-gray-900"
              onClick={props.onClose}
            >
              Aceptar
            </button>
        )}
      </div>
    </Show>
  );
}
