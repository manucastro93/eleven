import { createSignal, Show } from "solid-js";
import { X } from "lucide-solid";

export default function FormPaso2(props: { onVolver: () => void }) {
  const [telefono, setTelefono] = createSignal("");
  const [codigo, setCodigo] = createSignal("");
  const [codigoEnviado, setCodigoEnviado] = createSignal(false);
  const [verificado, setVerificado] = createSignal(false);
  const [errorTelefono, setErrorTelefono] = createSignal("");
  const [errorCodigo, setErrorCodigo] = createSignal("");
  const [cuit, setCuit] = createSignal("");

  function enviarCodigo() {
    if (!/^\d{10}$/.test(telefono())) {
      setErrorTelefono("Debe tener exactamente 10 dígitos (sin 0 ni 15).");
      return;
    }
    setErrorTelefono("");
    setCodigoEnviado(true);
    alert("Código enviado (simulado): 123456");
  }

  function verificarCodigo() {
    if (codigo() !== "123456") {
      setErrorCodigo("Código incorrecto");
      return;
    }
    setErrorCodigo("");
    setVerificado(true);
  }

  return (
    <div class="p-5 space-y-6">

      {/* WhatsApp */}
      <div>
        <label class="block text-sm font-semibold mb-1">WhatsApp (sin 0 ni 15)</label>
        <input
          type="tel"
          inputmode="numeric"
          maxlength="10"
          disabled={verificado()}
          value={telefono()}
          class="w-full px-3 py-2 border rounded text-sm"
          placeholder="Ej: 3512345678"
          onInput={(e) => {
            const limpio = e.currentTarget.value.replace(/\D/g, "").slice(0, 10);
            setTelefono(limpio);
          }}
        />
        <Show when={errorTelefono()}>
          <p class="text-sm text-red-600 mt-1">{errorTelefono()}</p>
        </Show>

        <Show when={!verificado()}>
          <p class="text-gray-500 text-xs mt-1">
            Ingresá tu WhatsApp. Te enviaremos un código a tu celular para que lo valides.
          </p>
          <button
            class="mt-3 bg-black text-white px-4 py-2 rounded text-sm"
            onClick={enviarCodigo}
          >
            Enviar código
          </button>
        </Show>
      </div>

      {/* Código verificación */}
      <Show when={codigoEnviado() && !verificado()}>
        <div>
          <label class="block text-sm font-semibold mb-1">Código recibido</label>
          <input
            type="text"
            maxlength="6"
            class="w-full px-3 py-2 border rounded text-sm"
            placeholder="Ingresá el código"
            value={codigo()}
            onInput={(e) => setCodigo(e.currentTarget.value.replace(/\D/g, "").slice(0, 6))}
          />
          <Show when={errorCodigo()}>
            <p class="text-sm text-red-600 mt-1">{errorCodigo()}</p>
          </Show>

          <button
            class="mt-3 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm"
            onClick={verificarCodigo}
          >
            Verificar código
          </button>
        </div>
      </Show>

      {/* Próximos campos: solo si está verificado */}
      <Show when={verificado()}>
        <div class="space-y-4 pt-4 border-t">
          {/* Mail */}
          <div>
            <label class="block text-sm mb-1">Email</label>
            <input type="email" class="w-full px-3 py-2 border rounded text-sm" />
          </div>

          {/* Nombre fantasía */}
          <div>
            <label class="block text-sm mb-1">Nombre de fantasía</label>
            <input type="text" class="w-full px-3 py-2 border rounded text-sm" />
          </div>

          {/* CUIT/CUIL */}
          <div>
            <label class="block text-sm mb-1">CUIT o CUIL</label>
            <input
              type="text"
              inputmode="numeric"
              maxlength="11"
              value={cuit()}
              onInput={(e) => {
                const limpio = e.currentTarget.value.replace(/\D/g, "").slice(0, 11);
                setCuit(limpio);
              }}
              onBlur={() => {
                if (cuit().length !== 11) {
                  alert("El CUIT/CUIL debe tener exactamente 11 dígitos.");
                  return;
                }
                console.log("Buscar razón social para:", cuit());
              }}
              class="w-full px-3 py-2 border rounded text-sm"
              placeholder="Sin guiones"
            />
          </div>

          {/* Razón social */}
          <div>
            <label class="block text-sm mb-1">Razón social</label>
            <input type="text" disabled class="w-full px-3 py-2 border rounded text-sm bg-gray-100" value="(a completar)" />
          </div>

          {/* Dirección */}
          <div>
            <label class="block text-sm mb-1">Dirección</label>
            <input type="text" class="w-full px-3 py-2 border rounded text-sm" placeholder="Autocompletado Google Maps" />
          </div>

          {/* Localidad y Provincia */}
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm mb-1">Localidad</label>
              <input type="text" disabled class="w-full px-3 py-2 border rounded text-sm bg-gray-100" value="(auto)" />
            </div>
            <div>
              <label class="block text-sm mb-1">Provincia</label>
              <input type="text" disabled class="w-full px-3 py-2 border rounded text-sm bg-gray-100" value="(auto)" />
            </div>
          </div>

          {/* Transporte deseado */}
          <div>
            <label class="block text-sm mb-1">Transporte deseado</label>
            <input type="text" class="w-full px-3 py-2 border rounded text-sm" placeholder="Escribí el nombre del transporte" />
          </div>

          <button class="mt-4 bg-black text-white px-4 py-2 rounded text-sm w-full">Enviar pedido</button>
        </div>
      </Show>
    </div>
  );
}
