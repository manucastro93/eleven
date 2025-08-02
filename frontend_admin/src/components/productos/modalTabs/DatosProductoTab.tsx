import { createSignal, onMount, For, createEffect } from "solid-js";
import type { Producto } from "@/types/producto";
import { listarItemsMenu } from "@/services/itemMenu.service";
import type { ItemMenu } from "@/types/itemMenu";
import { formatearPrecio } from "@/utils/formato";
import { actualizarItemsMenuProducto, obtenerProductoPorId } from "@/services/producto.service";
import { showToast } from "@/components/ui/ToastManager";

export default function DatosProductoTab(props: { producto: Producto; setProducto: (p: Producto) => void }) {
  const [activo, setActivo] = createSignal(props.producto.activo);
  const [itemsMenuDisponibles, setItemsMenuDisponibles] = createSignal<ItemMenu[]>([]);
  const [itemsMenuSeleccionados, setItemsMenuSeleccionados] = createSignal<number[]>(
    props.producto.itemsMenu?.map((item) => item.id) || []
  );

  onMount(async () => {
    const items = await listarItemsMenu();
    const filtrados = items.filter(
      (i) =>
        !["info", "nosotros"].includes(i.nombre.trim().toLowerCase())
    );
    setItemsMenuDisponibles(filtrados);
  });

  const handleToggleItemMenu = (id: number) => {
    const actual = itemsMenuSeleccionados();
    setItemsMenuSeleccionados(
      actual.includes(id)
        ? actual.filter((itemId) => itemId !== id)
        : [...actual, id]
    );
  };

  const handleGuardar = async () => {
    try {
      await actualizarItemsMenuProducto(
        props.producto.id,
        itemsMenuSeleccionados()
      );

      const actualizado = await obtenerProductoPorId(props.producto.id);
      props.setProducto(actualizado);

      showToast("Producto actualizado correctamente", "success");
    } catch (err) {
      console.error("❌ Error al guardar ítems de menú:", err);
      showToast("Error al guardar cambios", "error");
    }
  };

  return (
    <>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-600">Código</label>
          <div class="mt-1 text-gray-800">{props.producto.codigo}</div>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-600">Nombre</label>
          <div class="mt-1 text-gray-800">{props.producto.nombre}</div>
        </div>

        <div class="md:col-span-2">
          <label class="block text-sm font-medium text-gray-600">Descripción</label>
          <div class="mt-1 text-gray-800">{props.producto.descripcion}</div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-600">Precio</label>
          <div class="mt-1 text-gray-800">{formatearPrecio(props.producto.precio)}</div>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-600">Stock</label>
          <div class="mt-1 text-gray-800">{props.producto.stock}</div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-600">Categoría principal</label>
          <div class="mt-1 text-gray-800">
            {props.producto.categoria?.nombre || "-"}
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-600">Subcategoría</label>
          <div class="mt-1 text-gray-800">
            {props.producto.subcategoria?.nombre || "-"}
          </div>
        </div>

        <div class="md:col-span-2">
        <label class="block text-sm font-medium text-gray-600 mb-1">
          Ítems de menú vinculados
        </label>
        <div class="border rounded p-2 max-h-40 overflow-y-auto bg-white shadow-sm">
          <For each={itemsMenuDisponibles()}>
            {(item) => (
              <label class="flex items-center space-x-2 py-1">
                <input
                  type="checkbox"
                  checked={itemsMenuSeleccionados().includes(item.id)}
                  onChange={() => handleToggleItemMenu(item.id)}
                  class="text-blue-600 h-4 w-4 rounded"
                />
                <span class="text-gray-800 text-sm">{item.nombre}</span>
              </label>
            )}
          </For>
        </div>
      </div>

        <div>
          <label class="block text-sm font-medium text-gray-600">Estado</label>
          <div class="mt-2">
            <label class="inline-flex items-center">
              <input
                type="checkbox"
                class="form-checkbox h-5 w-5 text-blue-600"
                checked={activo()}
                onChange={(e) => setActivo(e.currentTarget.checked)}
              />
              <span class="ml-2 text-gray-800">
                {activo() ? "Activo" : "Inactivo"}
              </span>
            </label>
          </div>
        </div>
      </div>

      <div class="flex justify-end mt-6">
        <button
          onClick={handleGuardar}
          class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          Guardar
        </button>
      </div>
    </>
  );
}
