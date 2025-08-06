import { Show } from "solid-js";
import { actualizarClienteEnLocalStorage } from "@/utils/localStorage";

// Recibe las signals y setters como props, igual que el resto del flujo
export default function PasoDatosEmpresa(props: {
  cuit: () => string;
  setCuit: (v: string) => void;
  razonSocial: () => string;
  setRazonSocial: (v: string) => void;
  nombreFantasia: () => string;
  setNombreFantasia: (v: string) => void;
  email: () => string;
  setEmail: (v: string) => void;
  telefono: () => string;
  setTelefono: (v: string) => void;
  errorCuit?: () => string;
}) {
  return (
    <div class="space-y-6">
      {/* Fila: CUIT - Razón social - Nombre de fantasía */}
      <div class="grid grid-cols-1 md:grid-cols-8 gap-4 items-end">
        {/* CUIT */}
        <div class="md:col-span-2">
          <label class="block text-sm mb-1">CUIT</label>
          <input
            type="text"
            inputmode="numeric"
            maxlength="11"
            class="w-full px-3 py-2 border border-gray-300 rounded text-xs"
            value={props.cuit()}
            onInput={(e) => props.setCuit(e.currentTarget.value.replace(/\D/g, "").slice(0, 11))}
            placeholder="Sólo números"
          />
          <Show when={props.errorCuit && props.errorCuit()}>
            <p class="text-xs text-red-600 mt-1">{props.errorCuit?.()}</p>
          </Show>
        </div>
        {/* Razón social */}
        <div class="md:col-span-3">
          <label class="block text-sm mb-1">Razón social</label>
          <input
            type="text"
            disabled
            class="w-full px-3 py-2 border border-gray-300 rounded text-xs bg-gray-100"
            value={props.razonSocial()}
          />
        </div>
        {/* Nombre de fantasía */}
        <div class="md:col-span-3">
          <label class="block text-sm mb-1">Nombre de fantasía</label>
          <input
            type="text"
            class="w-full px-3 py-2 border border-gray-300 rounded text-xs"
            value={props.nombreFantasia()}
            onInput={(e) => props.setNombreFantasia(e.currentTarget.value)}
          />
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-6 gap-4">
        {/* Email */}
        <div class="md:col-span-6">
          <label class="block text-sm mb-1">Email</label>
          <input
              type="email"
              class="w-full px-3 py-2 border border-gray-300 rounded text-xs"
              value={props.email()}
              onInput={(e) => {
                props.setEmail(e.currentTarget.value);
                actualizarClienteEnLocalStorage("email", e.currentTarget.value);
              }}
            />
        </div>
      </div>
    </div>
  );
}
