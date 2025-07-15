// src/components/layout/Layout.tsx
import { JSX, children, createSignal } from "solid-js";
import Header from "./Header";
import BottomNavbar from "./BottomNavbar";
import SideCart from "../Carrito/SideCart";
import FullMenu from "./FullMenu";

export default function Layout(props: { children: JSX.Element }) {
  const c = children(() => props.children);
  const [menuAbierto, setMenuAbierto] = createSignal(false);
  const [cartAbierto, setCartAbierto] = createSignal(false);

  return (
    <div class="min-h-screen flex flex-col bg-[#f8f8f8] text-black">
      <Header onMenu={() => setMenuAbierto(true)} onCart={() => setCartAbierto(true)} />
      <main class="flex-1">{c()}</main>
      <BottomNavbar onCart={() => setCartAbierto(true)} />
      <SideCart abierto={cartAbierto()} onClose={() => setCartAbierto(false)} />
      <FullMenu abierto={menuAbierto()} onClose={() => setMenuAbierto(false)} />
    </div>
  );
}
