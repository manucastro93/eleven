import { createSignal, onCleanup, createEffect, JSX } from "solid-js";
import Header from "./Header";
import Footer from "./Footer";
import CarritoDesplegable from "../Carrito/CarritoDesplegable";
import BottomNavbar from "./BottomNavbar";
import ToastContextual from "@/components/ui/ToastContextual";
import type { RouteSectionProps } from "@solidjs/router";
import { useCarrito } from "@/store/carrito";
import { confirmarEdicionPedido } from "@/services";

export default function LayoutPublic(props: RouteSectionProps) {
  const { mostrarCarrito, setMostrarCarrito, modoEdicion, fechaEdicion, finalizarEdicion, pedidoEditandoId, carritoId } = useCarrito();
  const abrirCarrito = () => setMostrarCarrito(true);
  const cerrarCarrito = () => setMostrarCarrito(false);
  const [tiempoRestante, setTiempoRestante] = createSignal<number>(1800);

  // ---- Toast Contextual ----
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
  // --------------------------

  createEffect(() => {
    if (modoEdicion() && fechaEdicion()) {
      const fechaEdicionMs = new Date(fechaEdicion() as string).getTime();
      function actualizarTiempo() {
        const restante = Math.max(0, 1800 - Math.floor((Date.now() - fechaEdicionMs) / 1000));
        setTiempoRestante(restante);
      }
      const interval = setInterval(actualizarTiempo, 1000);
      actualizarTiempo();
      onCleanup(() => clearInterval(interval));
    } else {
      setTiempoRestante(1800);
    }
  });

  createEffect(() => {
    if (modoEdicion() && tiempoRestante() === 0) {
      finalizarEdicion();
      setMostrarCarrito(false);
      showToast("El tiempo de edición expiró, los cambios no fueron guardados.", "warning", 4000);
    }
  });

  async function handleConfirmarEdicion(formData: any) {
    if (tiempoRestante() === 0) {
      showToast("El tiempo de edición expiró.", "error");
      return;
    }
    if (!pedidoEditandoId() || !carritoId()) {
      showToast("No hay pedido o carrito activo.", "error");
      return;
    }

    const payload = { carritoId: carritoId(), ...formData };
    try {
      await confirmarEdicionPedido(pedidoEditandoId()!, payload);
      showToast(
        "Cambios guardados correctamente!",
        "success",
        10000,
        () => window.location.href = "/mis-pedidos"
      );
      setTimeout(() => {
        window.location.href = "/mis-pedidos";
      }, 7000);
    } catch {
      showToast("Error guardando los cambios.", "error", 4000);
    }
  }

  return (
    <div class="flex flex-col min-h-screen">
      <Header onCart={abrirCarrito} />

      <ToastContextual
        visible={toastVisible()}
        mensaje={toastMsg()}
        tipo={toastTipo()}
        onClose={() => {
          setToastVisible(false);
          if (toastOnClose) {
            toastOnClose();
            toastOnClose = null;
          }
        }}
      />

      <CarritoDesplegable
        abierto={mostrarCarrito()}
        onClose={cerrarCarrito}
        modoEdicion={modoEdicion()}
        tiempoRestante={modoEdicion() ? tiempoRestante() : undefined}
        onConfirmarEdicion={modoEdicion() ? handleConfirmarEdicion : undefined}
      />

      <main class="flex-1">{props.children}</main>
      <Footer />
      <BottomNavbar onCart={abrirCarrito} />
    </div>
  );
}
