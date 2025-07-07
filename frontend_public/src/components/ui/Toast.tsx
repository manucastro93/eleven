import { Show } from "solid-js";
import { toastMensaje, toastVisible } from "@/store/toast";

export default function Toast() {
  return (
    <Show when={toastMensaje()}>
      <div
        class="fixed z-[9999] px-4 py-2 md:px-8 md:py-4 rounded-full shadow-lg flex justify-center items-center text-sm md:text-base transition-all duration-300 bg-green-500 text-white w-[calc(100%-2rem)] max-w-sm mx-auto text-center"
        classList={{
          "opacity-100 scale-100": toastVisible(),
          "opacity-0 scale-90": !toastVisible(),
          "top-[40%] left-1/2 translate-x-[-50%]": true,
        }}
      >
        🛒 {toastMensaje()}
      </div>
    </Show>
  );
}
