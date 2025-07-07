import type { Producto } from "@/types/producto";
import { createSignal, For } from "solid-js";
import { subirImagenes, eliminarImagen, actualizarOrdenImagenes } from "@/services/imagenProducto.service";

export default function ImagenesTab(props: { producto: Producto }) {
  const [imagenes, setImagenes] = createSignal(props.producto.imagenes || []);

  const handleAgregarImagen = async (e: Event) => {
    const files = (e.target as HTMLInputElement).files;
    if (!files || files.length === 0) return;

    try {
      const res = await subirImagenes(props.producto.id, files);

      if (res?.imagenes) {
        setImagenes([...imagenes(), ...res.imagenes]);
      }
    } catch (err) {
      console.error("Error al subir imágenes", err);
      alert("Error al subir imágenes");
    }
  };

  const handleEliminarImagen = async (id: number) => {
    if (!confirm("¿Eliminar esta imagen?")) return;

    try {
      await eliminarImagen(id);
      setImagenes(imagenes().filter((img) => img.id !== id));
    } catch (err) {
      console.error("Error al eliminar imagen", err);
      alert("Error al eliminar imagen");
    }
  };


  const moverImagen = async (index: number, delta: number) => {
    const imgs = [...imagenes()];
    const newIndex = index + delta;

    if (newIndex < 0 || newIndex >= imgs.length) return;

    const [moved] = imgs.splice(index, 1);
    imgs.splice(newIndex, 0, moved);

    // Actualizar orden local
    const updated = imgs.map((img, i) => ({ ...img, orden: i }));

    try {
      await actualizarOrdenImagenes(props.producto.id, updated.map((img) => img.id));
      setImagenes(updated);
    } catch (err) {
      console.error("Error al actualizar orden", err);
      alert("Error al actualizar orden de imágenes");
    }
  };

  return (
    <div>
      <div class="flex justify-between items-center mb-4">
        <h4 class="text-lg font-semibold text-gray-700">Imágenes</h4>
        <label class="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          + Agregar imágenes
          <input
            type="file"
            accept="image/*"
            multiple
            class="hidden"
            onChange={handleAgregarImagen}
          />
        </label>
      </div>

      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        <For each={[...imagenes()].sort((a, b) => a.orden - b.orden)}>
          {(img, i) => (
            <div class="p-7 relative group border rounded overflow-hidden">
              <img
                src={`${img.url}`}
                alt={`Imagen ${i() + 1}`}
                class="object-cover w-full h-40"
              />
              <div class="absolute top-1 right-1 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition">
                <button
                  onClick={() => moverImagen(i(), -1)}
                  class="bg-gray-800 text-white text-xs p-1 rounded"
                  title="Mover arriba"
                >
                  ⬆️
                </button>
                <button
                  onClick={() => moverImagen(i(), 1)}
                  class="bg-gray-800 text-white text-xs p-1 rounded"
                  title="Mover abajo"
                >
                  ⬇️
                </button>
                <button
                  onClick={() => handleEliminarImagen(img.id)}
                  class="bg-red-500 text-white text-xs p-1 rounded"
                  title="Eliminar"
                >
                  ❌
                </button>
              </div>
              <div class="absolute bottom-0 left-0 bg-black/50 text-white text-xs px-2 py-1">
                Orden: {img.orden}
              </div>
            </div>
          )}
        </For>
      </div>

      {imagenes().length === 0 && (
        <p class="text-gray-500 mt-4">No hay imágenes cargadas.</p>
      )}
    </div>
  );
}
