import { createSignal } from "solid-js";
import Header from "./Header";
import Footer from "./Footer";
import SideCart from "../Carrito/CarritoDesplegable";
import BottomNavbar from "./BottomNavbar";
import Toast from "@/components/ui/Toast";
import type { RouteSectionProps } from "@solidjs/router";
import { useCarrito } from "@/store/carrito";

export default function LayoutPublic(props: RouteSectionProps) {
  const { mostrarCarrito, setMostrarCarrito } = useCarrito();

  const abrirCarrito = () => setMostrarCarrito(true);
  const cerrarCarrito = () => setMostrarCarrito(false);

  const abrirMenu = () => {
    // lógica para menú lateral si lo tenés (opcional)
    console.log("Abrir menú");
  };

  return (
    <div class="flex flex-col min-h-screen">
      <Header onMenu={abrirMenu} onCart={abrirCarrito} />
      <Toast />
      <SideCart abierto={mostrarCarrito()} onClose={cerrarCarrito} />
      <main class="flex-1">{props.children}</main>
      <Footer />
      <BottomNavbar onCart={abrirCarrito} />
    </div>
  );
}

