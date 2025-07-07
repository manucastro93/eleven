import { Router, Route } from "@solidjs/router";
import { onMount } from "solid-js";
import Home from "@/pages/Home";
import Contacto from "@/pages/Contacto";
import LayoutPublic from "@/layout/LayoutPublic";
import ProductosPorCategoria from "@/pages/productos/categoria/[categoria]";
import ProductoDetalle from "@/pages/productos/detalle/[slug]";
import PaginaProductos from "@/pages/productos";
import { CarritoProvider } from './store/carrito';
import { asegurarSesionAnonima } from "@/utils/sesionAnonima";

export default function App() {
  onMount(() => {
    asegurarSesionAnonima().catch((err) => {
      console.error("Error creando sesión anónima:", err);
    });
  });

  return (
    <CarritoProvider>
      <Router>
        <Route path="/" component={LayoutPublic}>
          <Route path="/" component={Home} />
          <Route path="/productos/categoria/:categoria" component={ProductosPorCategoria} />
          <Route path="/productos/detalle/:id" component={ProductoDetalle} />
          <Route path="/productos" component={PaginaProductos} />
          <Route path="/contacto" component={Contacto} />
        </Route>
      </Router>
    </CarritoProvider>
  );
}
