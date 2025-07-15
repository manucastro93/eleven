// src/components/layout/FullMenu.tsx
import { Show, For } from "solid-js";
import { X } from "lucide-solid";
import { useNavigate } from "@solidjs/router";

// Podés reemplazar estas categorías por las reales
const CATEGORIAS_FAKE = [
  { nombre: "REMERAS", path: "/productos/categoria/remeras" },
  { nombre: "BUZOS", path: "/productos/categoria/buzos" },
  { nombre: "PANTALONES", path: "/productos/categoria/pantalones" },
  { nombre: "CAMISAS", path: "/productos/categoria/camisas" },
  { nombre: "ACCESORIOS", path: "/productos/categoria/accesorios" },
];

export default function FullMenu(props: { abierto: boolean; onClose: () => void }) {
  const navigate = useNavigate();

  return (
    <Show when={props.abierto}>
      <div class="fixed inset-0 bg-white z-[9999] flex flex-col p-6">
        {/* Header */}
        <div class="flex justify-between items-center mb-6">
          <div class="text-2xl font-bold">SANTOS</div>
          <button onClick={props.onClose}>
            <X size={24} />
          </button>
        </div>

        {/* Navegación */}
        <nav class="flex flex-col gap-4 text-lg font-medium">
          <For each={CATEGORIAS_FAKE}>
            {(cat) => (
              <button
                onClick={() => {
                  navigate(cat.path);
                  props.onClose();
                }}
                class="text-left"
              >
                {cat.nombre}
              </button>
            )}
          </For>

          <hr class="my-4" />

          <button
            onClick={() => {
              navigate("/contacto");
              props.onClose();
            }}
            class="text-left"
          >
            Contacto
          </button>
        </nav>
      </div>
    </Show>
  );
}
