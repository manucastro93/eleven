import { createSignal } from "solid-js";

const [mensaje, setMensaje] = createSignal<string | null>(null);
const [visible, setVisible] = createSignal(false);

export function mostrarToast(texto: string) {
  setMensaje(texto);
  setVisible(true);

  setTimeout(() => {
    setVisible(false);
    setTimeout(() => setMensaje(null), 300); // esperar animación de salida
  }, 2000);
}

export const toastMensaje = mensaje;
export const toastVisible = visible;
