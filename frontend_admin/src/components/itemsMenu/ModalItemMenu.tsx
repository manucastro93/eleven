import { createSignal } from "solid-js";
import type { ItemMenu } from "@/types/itemMenu";
import { editarItemMenu, crearItemMenu } from "@/services/itemMenu.service";

export default function ModalItemMenu(props: {
  item: ItemMenu;
  onClose: () => void;
  onActualizado: () => void;
}) {
  const [nombre, setNombre] = createSignal(props.item.nombre);
  const [icono, setIcono] = createSignal(props.item.icono ?? "");
  const [activo, setActivo] = createSignal(props.item.activo ?? true);
  const [guardando, setGuardando] = createSignal(false);

  const handleGuardar = async () => {
    setGuardando(true);

    const data = {
      nombre: nombre(),
      icono: icono(),
      activo: activo()
    };

    try {
      if (props.item.id) {
        await editarItemMenu(props.item.id, data);
      } else {
        await crearItemMenu(data);
      }

      props.onActualizado();
      props.onClose();
    } catch (err) {
      console.error("Error al guardar ítem:", err);
    } finally {
      setGuardando(false);
    }
  };

  return (
    <>
      <div class="fixed inset-0 bg-black/50 z-40" onClick={props.onClose} />
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto relative">
          <div class="flex justify-between items-center p-4 border-b sticky top-0 bg-white z-10">
            <h3 class="text-xl font-semibold">
              {props.item.id ? "Editar ítem del menú" : "Nuevo ítem del menú"}
            </h3>
            <button
              onClick={props.onClose}
              class="text-gray-500 hover:text-gray-700 text-2xl"
            >
              ×
            </button>
          </div>

          <div class="p-6 space-y-4">
            <div>
              <label class="block text-sm font-medium mb-1">Nombre</label>
              <input
                value={nombre()}
                onInput={(e) => setNombre(e.currentTarget.value)}
                class="w-full border rounded px-3 py-2"
              />
            </div>

            <label class="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={activo()}
                onChange={(e) => setActivo(e.currentTarget.checked)}
              />
              Activo
            </label>

            <div class="flex justify-end gap-2 pt-6">
              <button onClick={props.onClose} class="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">
                Cancelar
              </button>
              <button
                onClick={handleGuardar}
                class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                disabled={guardando()}
              >
                {guardando() ? "Guardando..." : "Guardar"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
