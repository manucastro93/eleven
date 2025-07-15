import { createSignal, For, Show } from "solid-js";
import { TransitionGroup } from "solid-transition-group";

type Toast = {
  id: number;
  message: string;
  type?: "success" | "error" | "info";
};

const [toasts, setToasts] = createSignal<Toast[]>([]);

export function showToast(message: string, type?: Toast["type"]) {
  const id = Date.now();
  setToasts((prev) => [...prev, { id, message, type }]);

  setTimeout(() => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, 3000);
}

export default function ToastManager() {
  return (
    <Show when={toasts().length > 0}>
      <div class="fixed inset-0 z-50 flex items-center justify-center">
        {/* Fondo oscuro semitransparente */}
        <div class="absolute inset-0 bg-black/40 transition-opacity animate-fade-in" />

        {/* Contenedor de toasts */}
        <TransitionGroup name="fade-scale">
          <For each={toasts()}>
            {(toast) => (
              <div
                class={`relative z-10 px-6 py-4 rounded-lg shadow-lg text-white text-center mb-4 transition-all duration-300
                  ${
                    toast.type === "success"
                      ? "bg-green-600"
                      : toast.type === "error"
                      ? "bg-red-600"
                      : "bg-gray-800"
                  }`}
              >
                {toast.message}
              </div>
            )}
          </For>
        </TransitionGroup>

        {/* Animaciones CSS */}
        <style>
          {`
            .fade-scale-enter {
              opacity: 0;
              transform: scale(0.9);
            }
            .fade-scale-enter-active {
              opacity: 1;
              transform: scale(1);
              transition: opacity 200ms ease-out, transform 200ms ease-out;
            }
            .fade-scale-exit {
              opacity: 1;
              transform: scale(1);
            }
            .fade-scale-exit-active {
              opacity: 0;
              transform: scale(0.9);
              transition: opacity 200ms ease-in, transform 200ms ease-in;
            }
          `}
        </style>
      </div>
    </Show>
  );
}
