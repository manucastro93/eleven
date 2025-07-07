import { createSignal } from "solid-js";
import { actualizarImagenCategoria } from "@/services/categoria.service";

export default function DatosCategoriaTab(props: { categoria: any; onImagenActualizada?: () => void }) {
  const [imagenUrl, setImagenUrl] = createSignal(props.categoria.imagenUrl || "");
  const [imagenFile, setImagenFile] = createSignal<File | null>(null);
  const [loading, setLoading] = createSignal(false);

  const handleImagenChange = (e: Event) => {
    const target = e.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      const file = target.files[0];
      setImagenFile(file);
      setImagenUrl(URL.createObjectURL(file));
    }
  };

  const handleGuardarImagen = async () => {
    if (!imagenFile()) return;
    setLoading(true);
    try {
      await actualizarImagenCategoria(props.categoria.id, imagenFile()!);
      // 🔥 Refrescá el listado después de subir
      if (typeof props.onImagenActualizada === "function") {
        props.onImagenActualizada(); // Llama el refetch en el padre
      }
    } catch (err) {
      alert("Error al subir la imagen");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div class="flex flex-col gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-600">Nombre</label>
          <div class="mt-1 text-gray-800">{props.categoria.nombre}</div>
        </div>
      <label class="font-semibold">Imagen de la Categoría</label>
      <div class="flex items-center gap-4">
        <div>
          {imagenUrl() ? (
            <img
              src={imagenUrl()}
              alt="Imagen categoría"
              class="w-32 h-32 object-cover rounded shadow"
            />
          ) : (
            <div class="w-32 h-32 bg-gray-100 flex items-center justify-center rounded text-gray-400">
              Sin imagen
            </div>
          )}
        </div>
        <input
          type="file"
          accept="image/*"
          onChange={handleImagenChange}
          class="block"
        />
        <button
          onClick={handleGuardarImagen}
          disabled={loading() || !imagenFile()}
          class="bg-blue-600 text-white px-3 py-2 rounded ml-2"
        >
          {loading() ? "Guardando..." : "Guardar imagen"}
        </button>
      </div>
    </div>
  );
}