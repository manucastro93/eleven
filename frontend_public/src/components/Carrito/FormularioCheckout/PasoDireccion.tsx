import { createSignal, Show, onMount } from "solid-js";

export default function PasoDireccion(props: {
  direccion: () => string;
  setDireccion: (value: string) => void;
  localidad: () => string;
  setLocalidad: (value: string) => void;
  provincia: () => string;
  setProvincia: (value: string) => void;
}) {
  return (
    <div class="space-y-4">
      {/* Dirección */}
      <div>
        <label class="block text-sm mb-1">Dirección</label>
        <input
          type="text"
          class="w-full px-3 py-2 border rounded text-sm"
          placeholder="Ej: Av. Colón 1234"
          value={props.direccion()}
          onInput={(e) => {
            const val = e.currentTarget.value;
            props.setDireccion(val);
            if (val.toLowerCase().includes("cordoba")) {
              props.setLocalidad("Córdoba");
              props.setProvincia("Córdoba");
            } else {
              props.setLocalidad("Buenos Aires");
              props.setProvincia("Buenos Aires");
            }
          }}
        />
      </div>

      {/* Localidad y provincia */}
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-sm mb-1">Localidad</label>
          <input
            type="text"
            disabled
            class="w-full px-3 py-2 border rounded text-sm bg-gray-100"
            value={props.localidad()}
          />
        </div>
        <div>
          <label class="block text-sm mb-1">Provincia</label>
          <input
            type="text"
            disabled
            class="w-full px-3 py-2 border rounded text-sm bg-gray-100"
            value={props.provincia()}
          />
        </div>
      </div>
    </div>
  );
}
