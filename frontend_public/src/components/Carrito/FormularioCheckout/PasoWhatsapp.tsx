// components/Carrito/FormularioCheckout/PasoWhatsapp.tsx
import { Show, createSignal, type Accessor } from "solid-js";

type Props = {
  telefono: Accessor<string>;
  setTelefono: (val: string) => void;
  codigo: Accessor<string>;
  setCodigo: (val: string) => void;
  verificado: Accessor<boolean>;
  setVerificado: (val: boolean) => void;
  codigoEnviado: Accessor<boolean>;
  setCodigoEnviado: (val: boolean) => void;
};

export default function PasoWhatsapp(props: Props) {
  const [errorTelefono, setErrorTelefono] = createSignal("");
  const [errorCodigo, setErrorCodigo] = createSignal("");

  function enviarCodigo() {
    if (!/^\d{10}$/.test(props.telefono())) {
      setErrorTelefono("Debe tener exactamente 10 números (sin 0 ni 15).");
      return;
    }
    setErrorTelefono("");
    props.setCodigoEnviado(true);
    alert("Código enviado (simulado): 123456");
  }

  function verificarCodigo() {
    if (props.codigo() !== "123456") {
      setErrorCodigo("Código incorrecto");
      return;
    }
    setErrorCodigo("");
    props.setVerificado(true);
  }

  return (
    <div>
      <label class="block text-sm font-semibold mb-1">WhatsApp (sin 0 ni 15)</label>
      <input
        type="tel"
        inputmode="numeric"
        maxlength="10"
        disabled={props.verificado()}
        value={props.telefono()}
        class="w-full px-3 py-2 border rounded text-sm"
        placeholder="Ej: 1130544702 o 3512345678"
        onInput={(e) => {
          const limpio = e.currentTarget.value.replace(/\D/g, "").slice(0, 10);
          props.setTelefono(limpio);
        }}
      />
      <Show when={errorTelefono()}>
        <p class="text-sm text-red-600 mt-1">{errorTelefono()}</p>
      </Show>

      <Show when={!props.verificado()}>
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

      <Show when={props.codigoEnviado() && !props.verificado()}>
        <div class="mt-4">
          <label class="block text-sm font-semibold mb-1">Código recibido</label>
          <input
            type="text"
            maxlength="6"
            class="w-full px-3 py-2 border rounded text-sm"
            placeholder="Ingresá el código"
            value={props.codigo()}
            onInput={(e) =>
              props.setCodigo(e.currentTarget.value.replace(/\D/g, "").slice(0, 6))
            }
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
    </div>
  );
}
