import { createEffect } from "solid-js";
import { Router, Route, Navigate } from "@solidjs/router";
import DashboardPage from "@/pages/dashboard";
import ProductosPage from "@/pages/productos";
import CategoriasPage from "@/pages/categorias";
import ClientesPage from "@/pages/clientes";
import PedidosPage from "@/pages/pedidos";
import BannersPage from "@/pages/banners";
import LoginPage from "@/pages/login";
import ItemsMenuPage from "@/pages/itemsMenu";

import RutaProtegida from "@/components/RutaProtegida";
import { AuthProvider, useAuth } from "@/store/auth";
import { intentarRecuperarSesion } from "@/services/auth.service";

function AppRoutes() {
  const auth = useAuth();

  createEffect(() => {
    intentarRecuperarSesion()
      .then((sesion) => {
        if (sesion) {
          auth.setSession(sesion.usuario, sesion.accessToken, sesion.permisos);
        } else {
          auth.clearSession();
        }
      })
      .catch((err) => {
        console.error("Error en intento de refresh:", err);
        auth.clearSession();
      })
      .finally(() => {
        auth.setLoading(false);
      });
  });

  return (
    <>
      {auth.loading() ? (
        <div class="p-10">Cargando...</div>
      ) : (
        <Router>
          <Route path="/login" component={LoginPage} />
          
          <Route
            path="/dashboard"
            component={() => (
              <RutaProtegida>
                <DashboardPage />
              </RutaProtegida>
            )}
          />

          <Route
            path="/productos"
            component={() => (
              <RutaProtegida>
                <ProductosPage />
              </RutaProtegida>
            )}
          />

          <Route
            path="/categorias"
            component={() => (
              <RutaProtegida>
                <CategoriasPage />
              </RutaProtegida>
            )}
          />

          <Route
            path="/clientes"
            component={() => (
              <RutaProtegida>
                <ClientesPage />
              </RutaProtegida>
            )}
          />

          <Route
            path="/pedidos"
            component={() => (
              <RutaProtegida>
                <PedidosPage />
              </RutaProtegida>
            )}
          />

          <Route
            path="/menu"
            component={() => (
              <RutaProtegida>
                <ItemsMenuPage />
              </RutaProtegida>
            )}
          />

          <Route
            path="/banners"
            component={() => (
              <RutaProtegida>
                <BannersPage />
              </RutaProtegida>
            )}
          />

          <Route
            path="/"
            component={() => (
              <Navigate href={auth.state.accessToken ? "/dashboard" : "/login"} />
            )}
          />
        </Router>
      )}
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}
