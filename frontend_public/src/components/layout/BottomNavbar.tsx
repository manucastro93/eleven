// src/components/layout/BottomNavbar.tsx
import { useNavigate, useLocation } from "@solidjs/router";
import { Home, Menu, Search, User, ShoppingBag } from "lucide-solid";
import { Show } from "solid-js";

export default function BottomNavbar(props: { onCart: () => void }) {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => location.pathname.startsWith(path);

  return (
    <nav class="fixed bottom-0 left-0 right-0 bg-white border-t shadow-md z-50 md:hidden">
      <div class="flex justify-around items-center h-14 text-sm text-gray-600">
        <button onClick={() => navigate("/")} class={isActive("/") ? "text-black" : ""}>
          <div class="flex flex-col items-center">
            <Home size={20} />
            <span class="text-[10px] mt-1">Inicio</span>
          </div>
        </button>

        <button onClick={() => navigate("/categorias")} class={isActive("/categorias") ? "text-black" : ""}>
          <div class="flex flex-col items-center">
            <Menu size={20} />
            <span class="text-[10px] mt-1">Categorías</span>
          </div>
        </button>

        <button onClick={() => navigate("/buscar")} class={isActive("/buscar") ? "text-black" : ""}>
          <div class="flex flex-col items-center">
            <Search size={20} />
            <span class="text-[10px] mt-1">Buscar</span>
          </div>
        </button>

        <button onClick={() => navigate("/perfil")} class={isActive("/perfil") ? "text-black" : ""}>
          <div class="flex flex-col items-center">
            <User size={20} />
            <span class="text-[10px] mt-1">Perfil</span>
          </div>
        </button>

        <button onClick={props.onCart}>
          <div class="flex flex-col items-center">
            <ShoppingBag size={20} />
            <span class="text-[10px] mt-1">Carrito</span>
          </div>
        </button>
      </div>
    </nav>
  );
}
