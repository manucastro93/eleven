import { createSignal } from "solid-js";
import type { Producto } from "@/types/producto";

export default function DatosProductoTab(props: { producto: Producto }) {
  const [activo, setActivo] = createSignal(props.producto.activo);

  const handleGuardar = () => {
    console.log("Guardar activo:", activo());
    // TODO: llamada API
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
          <div class="mt-1 text-gray-800">${props.producto.precio}</div>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-600">Stock</label>
          <div class="mt-1 text-gray-800">{props.producto.stock}</div>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-600">Categoría</label>
          <div class="mt-1 text-gray-800">
            {props.producto.categoria?.nombre || "-"}
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
