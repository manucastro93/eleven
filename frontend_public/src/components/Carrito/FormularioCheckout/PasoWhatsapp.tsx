import { Show, createSignal, onCleanup } from "solid-js";
import { enviarCodigoWhatsapp, verificarCodigoWhatsapp } from "@/services/whatsapp.service";
import { obtenerClienteDeLocalStorage, guardarClienteEnLocalStorage } from "@/utils/localStorage";
import type { ClienteFormulario } from "@/types/cliente.type";

type Props = {
  telefono: () => string;
  setTelefono: (val: string) => void;
  codigo: () => string;
  setCodigo: (val: string) => void;
  verificado: () => boolean;
  setVerificado: (val: boolean) => void;
  codigoEnviado: () => boolean;
  setCodigoEnviado: (val: boolean) => void;
};

export default function PasoWhatsapp(props: Props) {
  const [errorTelefono, setErrorTelefono] = createSignal("");
  const [errorCodigo, setErrorCodigo] = createSignal("");
  const [verificando, setVerificando] = createSignal<"none" | "enviando" | "validando">("none");
  const [cooldown, setCooldown] = createSignal(0); // segundos restantes para reenviar
  let cooldownTimer: number | undefined;

  onCleanup(() => {
    if (cooldownTimer) clearInterval(cooldownTimer);
  });

  async function enviarCodigo() {
    if (!/^\d{10}$/.test(props.telefono())) {
      setErrorTelefono("Debe tener exactamente 10 números (sin 0 ni 15).");
      return;
    }
    setErrorTelefono("");
    setVerificando("enviando");
    try {
      await enviarCodigoWhatsapp(`+549${props.telefono()}`);
      props.setCodigoEnviado(true);
      iniciarCooldown(30);
    } catch (err) {
      console.error(err);
      setErrorTelefono("No se pudo enviar el código. Intentá más tarde.");
    } finally {
      setVerificando("none");
    }
  }

  async function verificarCodigo() {
    setVerificando("validando");
    try {
      const res = await verificarCodigoWhatsapp(`+549${props.telefono()}`, props.codigo());
      if (res.success) {
        props.setVerificado(true);
        setErrorCodigo("");
        // Actualiza el objeto cliente guardando el teléfono (whatsapp)
        let cliente = obtenerClienteDeLocalStorage() || {} as ClienteFormulario;
        cliente.telefono = props.telefono();
        cliente.whatsappVerificado = true;
        guardarClienteEnLocalStorage(cliente);
      } else {
        setErrorCodigo("Código incorrecto");
      }
    } catch (err) {
      console.error(err);
      setErrorCodigo("Error al verificar el código.");
    } finally {
      setVerificando("none");
    }
  }

  // Si cambia el teléfono, resetea el código
  function handleTelefonoInput(e: Event) {
    const limpio = (e.currentTarget as HTMLInputElement).value.replace(/\D/g, "").slice(0, 10);
    props.setTelefono(limpio);
    props.setCodigo(""); // limpia el código si cambia el teléfono
  }

  function iniciarCooldown(segundos: number) {
    setCooldown(segundos);
    if (cooldownTimer) clearInterval(cooldownTimer);
    cooldownTimer = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(cooldownTimer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000) as unknown as number;
  }

  return (
    <div>
      <label class="block text-sm font-semibold mb-1">WhatsApp (sin 0 ni 15)</label>
      <input
        type="tel"
        inputmode="numeric"
        maxlength={10}
        disabled={props.verificado() || verificando() !== "none"}
        value={props.telefono()}
        class="w-full px-3 py-2 border border-gray-300 rounded text-xs"
        placeholder="Ej: 1130544702 o 3512345678"
        onInput={handleTelefonoInput}
      />
      <Show when={errorTelefono()}>
        <p class="text-sm text-red-600 mt-1">{errorTelefono()}</p>
      </Show>

      <Show when={!props.verificado()}>
        <p class="text-gray-500 text-xs mt-1">
          Ingresá tu número de WhatsApp. Te enviaremos un código para verificar que esté bien escrito y seas vos.
        </p>
        <Show when={!props.codigoEnviado()}>
          <button
            class="mt-3 bg-black text-white px-4 py-2 rounded text-sm"
            onClick={enviarCodigo}
            disabled={verificando() !== "none"}
          >
            {verificando() === "enviando" ? "Enviando..." : "Enviar código"}
          </button>
        </Show>
        <Show when={props.codigoEnviado()}>
          <button
            class="mt-3 bg-black text-white px-4 py-2 rounded text-sm"
            onClick={enviarCodigo}
            disabled={verificando() !== "none" || cooldown() > 0}
          >
            {cooldown() > 0
              ? `Reenviar en ${cooldown()}s`
              : (verificando() === "enviando" ? "Enviando..." : "Reenviar código")}
          </button>
        </Show>
      </Show>


      <Show when={props.codigoEnviado() && !props.verificado()}>
        <div class="mt-4">
          <label class="block text-sm font-semibold mb-1">Código recibido</label>
          <input
            type="text"
            maxlength={6}
            disabled={verificando() === "validando"}
            class="w-full px-3 py-2 border rounded text-sm"
            placeholder="Ingresá el código"
            value={props.codigo()}
            onInput={(e) =>
              props.setCodigo((e.currentTarget as HTMLInputElement).value.replace(/\D/g, "").slice(0, 6))
            }
          />
          <Show when={errorCodigo()}>
            <p class="text-sm text-red-600 mt-1">{errorCodigo()}</p>
          </Show>
        <p class="text-gray-500 text-xs mt-1">
          Ingresá el código que recibiste en tu Whatsapp y presioná el botón verde "Verificar código"
        </p>
          <button
            class="mt-3 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm"
            onClick={verificarCodigo}
            disabled={verificando() !== "none"}
          >
            {verificando() === "validando" ? "Verificando..." : "Verificar código"}
          </button>
        </div>
      </Show>
    </div>
  );
}
