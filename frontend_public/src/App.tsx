import { Router, Route } from "@solidjs/router";
import { onMount } from "solid-js";
import Home from "@/pages/Home";
import Contacto from "@/pages/Contacto";
import LayoutPublic from "@/components/layout/LayoutPublic";
import ProductosPorCategoria from "@/pages/productos/categoria/[categoria]";
import ProductoDetalle from "@/pages/productos/detalle/[slug]";
import PaginaProductos from "@/pages/productos";
import PaginaOfertas from "@/pages/OfertasDelMes";
import PaginaNuevosIngresos from "@/pages/NuevosIngresos";
import PaginaInfo from "@/pages/Info";
import PaginaNosotros from "@/pages/Nosotros";
import PaginaMisPedidos from "@/pages/MisPedidos";
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
          <Route path="/categoria/:categoria" component={ProductosPorCategoria} />
          <Route path="/productos/detalle/:slug" component={ProductoDetalle} />
          <Route path="/ofertas-del-mes" component={PaginaOfertas} />
          <Route path="/nuevos-ingresos" component={PaginaNuevosIngresos} />
          <Route path="/info" component={PaginaInfo} />
          <Route path="/nosotros" component={PaginaNosotros} />
          <Route path="/mis-pedidos" component={PaginaMisPedidos} />
          <Route path="/productos" component={PaginaProductos} />
          <Route path="/contacto" component={Contacto} />
        </Route>
      </Router>
    </CarritoProvider>
  );
}
