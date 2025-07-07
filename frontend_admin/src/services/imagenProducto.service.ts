import { apiFetch, apiFetchVoid } from "./api";
const API_URL = import.meta.env.VITE_API_URL || "";

export async function subirImagenes(productoId: number, files: FileList | File[]) {
  const formData = new FormData();

  Array.from(files).forEach((file) => {
    formData.append("imagenes", file);
  });

  const res = await fetch(`${API_URL}/productos/${productoId}/imagenes`, {
    method: "POST",
    credentials: "include",
    body: formData, // ⚠️ NO poner Content-Type
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || "Error al subir imagenes");
  }

  return await res.json();
}

export async function eliminarImagen(imagenId: number) {
  console.log("Eliminando imagen", imagenId);

  return apiFetchVoid(`/productos/imagen/${imagenId}`, {
    method: "DELETE",
  });
}

export async function actualizarOrdenImagenes(productoId: number, ordenIds: number[]) {
  console.log("Actualizando orden imágenes", ordenIds);

  return apiFetchVoid(`/productos/${productoId}/imagenes`, {
    method: "PUT",
    body: JSON.stringify(ordenIds),
    headers: {
      "Content-Type": "application/json",
    },
  });
}
