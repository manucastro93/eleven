import { Show } from "solid-js";
import { toastMensaje, toastVisible } from "@/store/toast";
import { CheckCircle } from "lucide-solid";

export default function Toast() {
  return (
    <Show when={toastMensaje()}>
      <div
        class="fixed top-70 left-1/2 z-[9999] flex items-center gap-3 p-4 pr-5 bg-white text-gray-800 rounded-xl shadow-lg border border-gray-200 transition-all duration-300 transform -translate-x-1/2"
        classList={{
          "opacity-100 scale-100": toastVisible(),
          "opacity-0 scale-95 pointer-events-none": !toastVisible(),
        }}
      >
        <div class="text-green-600">
          <CheckCircle size={20} />
        </div>
        <span class="text-sm font-medium">{toastMensaje()}</span>
      </div>
    </Show>
  );
}
