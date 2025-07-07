import { createSignal, Show, For, createEffect } from "solid-js";

interface Props {
  value: string;
  onChange: (v: string) => void;
}

const opciones = [
  { label: "Nombre A-Z", value: "nombre-asc" },
  { label: "Nombre Z-A", value: "nombre-desc" },
  { label: "Precio menor", value: "precio-asc" },
  { label: "Precio mayor", value: "precio-desc" },
];

export default function SelectOrden(props: Props) {
  const [abierto, setAbierto] = createSignal(false);
  const [localValue, setLocalValue] = createSignal(props.value);

  // Sincronizamos localValue si cambia desde fuera
  createEffect(() => {
    setLocalValue(props.value);
  });

  const selectedLabel = () =>
    opciones.find((opt) => opt.value === localValue())?.label ?? "";

  const handleSelect = (v: string) => {
    setLocalValue(v);
    props.onChange(v);
    setAbierto(false);
  };

  return (
    <div class="relative w-full sm:w-1/2 text-sm z-10">
      <button
        type="button"
        onClick={() => setAbierto(!abierto())}
        class="bg-[#fafafa] w-full border border-gray-300 px-4 py-2 rounded-md shadow-sm flex justify-between items-center focus:outline-none focus:ring-2 focus:ring-[#b8860b]"
      >
        <span class="text-gray-800">{selectedLabel()}</span>
        <svg
          class="w-4 h-4 text-gray-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <Show when={abierto()}>
        <ul class="absolute mt-1 w-full bg-[#fafafa] border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
          <For each={opciones}>
            {(opt) => (
              <li
                class={`px-4 py-2 cursor-pointer hover:bg-[#f5f3f0] ${
                  opt.value === localValue()
                    ? "bg-[#b8860b]/10 text-[#b8860b] font-semibold"
                    : ""
                }`}
                onClick={() => handleSelect(opt.value)}
              >
                {opt.label}
              </li>
            )}
          </For>
        </ul>
      </Show>
    </div>
  );
}
