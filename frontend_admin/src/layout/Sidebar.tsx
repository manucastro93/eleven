import { useAuth } from "@/store/auth";
import { useNavigate, useLocation } from "@solidjs/router";
import * as LucideIcons from "lucide-solid";
import { onMount } from "solid-js";

export default function Sidebar(props: { sidebarOpen?: boolean; setSidebarOpen?: (open: boolean) => void; }) {
  const { state, clearSession } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const logout = () => {
    clearSession();
    navigate("/login");
  };

  const modulosPermitidos = state.permisos
    .filter((p) => p.acciones.includes("ver"))
    .sort((a, b) => a.orden - b.orden);

  const grupos = Array.from(
    new Set(modulosPermitidos.map((p) => p.grupo || ""))
  );

  onMount(() => {
    if (localStorage.getItem('sidebarCollapsed') === 'true') {
      document.body.classList.add('sidebar-collapsed');
    } else {
      document.body.classList.remove('sidebar-collapsed');
    }
  });

  return (
    <>
      {/* Backdrop en mobile */}
      <div
        class={`fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden transition-opacity duration-300 ${
          props.sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => props.setSidebarOpen && props.setSidebarOpen(false)}
      />

      <aside
        class={`fixed z-40 top-0 left-0 h-full bg-gray-900 text-white p-4 transition-all duration-300 ease-in-out
          ${props.sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0 md:static
          group
        `}
        onMouseEnter={() => {
          if (document.body.classList.contains("sidebar-collapsed")) {
            document.body.classList.add("sidebar-hover");
          }
        }}
        onMouseLeave={() => {
          document.body.classList.remove("sidebar-hover");
        }}
      >
        {/* Botón cerrar en mobile */}
        <button
          class="mb-4 p-2 bg-gray-800 rounded hover:bg-gray-700 w-full text-left md:hidden"
          onClick={() => props.setSidebarOpen && props.setSidebarOpen(false)}
        >
          ✕ Cerrar
        </button>

        <nav class="flex flex-col gap-4">
          {grupos.map((grupo) => (
            <div>
              {grupo && (
                <div
                  class={`uppercase text-xs text-gray-400 mb-1 mt-2 sidebar-label`}
                >
                  {grupo}
                </div>
              )}
              <div class="flex flex-col gap-1">
                {modulosPermitidos
                  .filter((m) => (m.grupo || "") === grupo)
                  .map((modulo) => {
                    const Icon =
                      (LucideIcons as any)[toPascalCase(modulo.icono || "circle")] ||
                      LucideIcons.Circle;

                    const isActive = location.pathname.startsWith(modulo.ruta);

                    return (
                      <a
                        href={modulo.ruta}
                        class={`flex items-center px-2 py-3 rounded hover:bg-gray-800 transition relative group
                          ${isActive ? "bg-gray-800" : ""}
                        `}
                        title={modulo.moduloNombre}
                      >
                        <Icon size={20} class="sidebar-icon text-white" stroke="currentColor" />
                        <span class="sidebar-label ml-2">{modulo.moduloNombre}</span>
                      </a>
                    );
                  })}
              </div>
            </div>
          ))}

          {/* Cerrar sesión */}
          <button
            onClick={logout}
            title="Cerrar sesión"
            class="flex items-center px-2 py-3 rounded hover:bg-gray-800 transition mt-4 text-red-300 text-left w-full"
          >
            <LucideIcons.LogOut size={20} class="sidebar-icon text-red-300" stroke="currentColor" />
            <span class="sidebar-label ml-2">Cerrar sesión</span>
          </button>
        </nav>
      </aside>
    </>
  );
}

function toPascalCase(str: string) {
  return str
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("");
}
