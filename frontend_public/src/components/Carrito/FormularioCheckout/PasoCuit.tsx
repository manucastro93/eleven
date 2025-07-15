import { createSignal, Show } from "solid-js";

export default function PasoCuit(props: {
  cuit: () => string;
  setCuit: (value: string) => void;
  razonSocial: () => string;
  setRazonSocial: (value: string) => void;
}) {
  const [errorCuit, setErrorCuit] = createSignal("");

  function buscarRazonSocial(cuit: string) {
    if (cuit.length !== 11) {
      setErrorCuit("El CUIT/CUIL debe tener exactamente 11 dígitos.");
      props.setRazonSocial("");
      return;
    }

    setErrorCuit("");
    // Simulación por ahora. Reemplazar con API de tusfacturas.app
    setTimeout(() => {
      const razon = "Ejemplo S.A."; // reemplazar por el valor real de la API
      props.setRazonSocial(razon);
    }, 500);
  }

  return (
    <div>
      {/* CUIT/CUIL */}
      <label class="block text-sm mb-1">CUIT o CUIL</label>
      <input
        type="text"
        inputmode="numeric"
        maxlength="11"
        value={props.cuit()}
        onInput={(e) => {
          const limpio = e.currentTarget.value.replace(/\D/g, "").slice(0, 11);
          props.setCuit(limpio);
        }}
        onBlur={() => buscarRazonSocial(props.cuit())}
        class="w-full px-3 py-2 border rounded text-sm"
        placeholder="Sin guiones"
      />
      <Show when={errorCuit()}>
        <p class="text-sm text-red-600 mt-1">{errorCuit()}</p>
      </Show>

      {/* Razón social */}
      <div class="mt-3">
        <label class="block text-sm mb-1">Razón social</label>
        <input
          type="text"
          disabled
          class="w-full px-3 py-2 border rounded text-sm bg-gray-100"
          value={props.razonSocial()}
        />
      </div>
    </div>
  );
}
