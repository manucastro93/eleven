import { createSignal, JSX } from "solid-js";

export function useToastContextual() {
  const [toastVisible, setToastVisible] = createSignal(false);
  const [toastMsg, setToastMsg] = createSignal<string | JSX.Element>("");
  const [toastTipo, setToastTipo] = createSignal<"success" | "error" | "warning" | "info" | "loading">("info");

  let toastTimeout: ReturnType<typeof setTimeout>;
  let toastOnClose: (() => void) | null = null;

  function showToast(
    msg: string | JSX.Element,
    tipo: "success" | "error" | "warning" | "info" | "loading" = "info",
    duration = 2500,
    onClose?: () => void
  ) {
    setToastMsg(msg);
    setToastTipo(tipo);
    setToastVisible(false);

    if (toastTimeout) clearTimeout(toastTimeout);
    toastOnClose = onClose || null;

    setTimeout(() => {
      setToastVisible(true);
      toastTimeout = setTimeout(() => {
        setToastVisible(false);
        if (toastOnClose) {
          toastOnClose();
          toastOnClose = null;
        }
      }, duration);
    }, 0);
  }

  function handleClose() {
    setToastVisible(false);
    if (toastOnClose) {
      toastOnClose();
      toastOnClose = null;
    }
  }

  return {
    toastVisible,
    toastMsg,
    toastTipo,
    showToast,
    handleClose
  };
}
