import { createSignal } from "solid-js";
import Header from "./Header";
import Footer from "./Footer";
import SideCart from "../Carrito/CarritoDesplegable";
import BottomNavbar from "./BottomNavbar";
import Toast from "@/components/ui/Toast";
import type { RouteSectionProps } from "@solidjs/router";

export default function LayoutPublic(props: RouteSectionProps) {
  // Estado para abrir/cerrar el carrito
  const [carritoAbierto, setCarritoAbierto] = createSignal(false);

  const abrirCarrito = () => setCarritoAbierto(true);
  const cerrarCarrito = () => setCarritoAbierto(false);

  const abrirMenu = () => {
    // lógica para menú lateral si lo tenés (opcional)
    console.log("Abrir menú");
  };

  return (
    <div class="flex flex-col min-h-screen">
      <Header onMenu={abrirMenu} onCart={abrirCarrito} />
      <Toast />
      <SideCart abierto={carritoAbierto()} onClose={cerrarCarrito} />

      <main class="flex-1">{props.children}</main>

      <Footer />
      <BottomNavbar onCart={abrirCarrito} />
    </div>
  );
}
