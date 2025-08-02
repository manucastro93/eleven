import { Show, For } from "solid-js";

export default function PasoDireccion(props: {
  direccion: () => string;
  setDireccion: (v: string) => void;
  localidad: () => string;
  setLocalidad: (v: string) => void;
  provincia: () => string;
  setProvincia: (v: string) => void;
  codigoPostal?: () => string;
  setCodigoPostal?: (v: string) => void;
  inputDireccion: () => string;
  setInputDireccion: (v: string) => void;
  sugerencias: () => any[];
  mostrarSugerencias: () => boolean;
  setMostrarSugerencias: (v: boolean) => void;
  errorDireccion: () => boolean;
  handleInput: (v: string) => void;
  handleSelect: (dir: any) => void;
}) {
  return (
    <div class="space-y-4">
      {/* Dirección */}
      <div>
        <label class="block text-sm mb-1">Dirección</label>
        <input
          type="text"
          autocomplete="new-password"
          name="direccion_fake"
          class="w-full px-3 py-2 border border-gray-300 rounded text-xs"
          placeholder="Ej: Av. Colón 1234"
          value={props.inputDireccion()}
          onInput={(e) => props.handleInput(e.currentTarget.value)}
        />
        <Show when={props.errorDireccion()}>
          <p class="text-red-600 text-xs mt-1">
            Seleccioná una dirección válida con altura.
          </p>
        </Show>
        <Show when={props.mostrarSugerencias() && props.sugerencias().length}>
          <ul class="z-50 border bg-white rounded text-sm max-h-40 overflow-y-auto shadow">
            <For each={props.sugerencias()}>
              {(dir) => (
                <li
                  class="p-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => props.handleSelect(dir)}
                >
                  {dir.descripcion}
                </li>
              )}
            </For>
          </ul>
        </Show>
      </div>

      {/* Localidad y provincia */}
      <div class="grid grid-cols-12 gap-4">
        {/* Provincia */}
        <div class="col-span-5">
          <label class="block text-sm mb-1">Provincia</label>
          <input
            type="text"
            readOnly
            class="w-full px-3 py-2 border border-gray-300 rounded text-xs bg-gray-100"
            value={props.provincia()}
          />
        </div>
        {/* Localidad */}
        <div class="col-span-5">
          <label class="block text-sm mb-1">Localidad</label>
          <input
            type="text"
            readOnly
            class="w-full px-3 py-2 border border-gray-300 rounded text-xs bg-gray-100"
            value={props.localidad()}
          />
        </div>
        {/* Código Postal */}
        <Show when={props.codigoPostal}>
          <div class="col-span-2">
            <label class="block text-sm mb-1">CP</label>
            <input
              type="text"
              readOnly
              class="w-full px-3 py-2 border border-gray-300 rounded text-xs bg-gray-100"
              value={props.codigoPostal?.() || ""}
            />
          </div>
        </Show>
      </div>
    </div>
  );
}
