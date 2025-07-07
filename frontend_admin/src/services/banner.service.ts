import { apiFetch, apiFetchVoid } from "./api";

interface ListarBannersResponse {
  banners: any[]; // después lo tipamos bien con Banner
  totalPages: number;
  totalCount: number;
}

export async function listarBanners(params: {
  search?: string;
  page?: number;
  orderBy?: string;
  orderDir?: "ASC" | "DESC";
  limit?: number;
}): Promise<ListarBannersResponse> {
  const query = new URLSearchParams();

  if (params.search) query.append("search", params.search);
  if (params.page) query.append("page", params.page.toString());
  if (params.orderBy) query.append("orderBy", params.orderBy);
  if (params.orderDir) query.append("orderDir", params.orderDir);
  return apiFetch(`/banners?${query.toString()}`);
}

export async function obtenerBanner(id: number) {
  return apiFetch(`/banners/${id}`);
}

export async function crearBanner(form: any) {
  const formData = new FormData();

  if (form._newFile) {
    formData.append("imagen", form._newFile);
  }

  formData.append("texto", form.texto || "");
  formData.append("descripcionEstilo", form.descripcionEstilo || "");
  formData.append("textoTop", String(form.textoTop || 50));
  formData.append("textoLeft", String(form.textoLeft || 50));
  formData.append("textoWidth", String(form.textoWidth || 50));
  formData.append(
    "backgroundColorTexto",
    form.backgroundColorTexto || "#ffffff"
  );
  formData.append("botonTexto", form.botonTexto || "");
  formData.append("botonEstilo", form.botonEstilo || "");
  formData.append("botonTop", String(form.botonTop || 50));
  formData.append("botonLeft", String(form.botonLeft || 50));
  formData.append("botonLink", form.botonLink || "");
  if (form.fechaDesde) formData.append("fechaDesde", form.fechaDesde);
  if (form.fechaHasta) formData.append("fechaHasta", form.fechaHasta);
  formData.append("activo", form.activo ? "1" : "0");

  const res = await fetch(`${import.meta.env.VITE_API_URL}/banners`, {
    method: "POST",
    credentials: "include",
    body: formData,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || "Error al crear banner");
  }

  return await res.json();
}

export async function actualizarBanner(id: number, data: any) {
  return apiFetch(`/banners/${id}`, {
    method: "PUT",
    body: JSON.stringify({
      ...data,
      fechaDesde: data.fechaDesde || null,
      fechaHasta: data.fechaHasta || null,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export async function eliminarBanner(id: number) {
  return apiFetchVoid(`/banners/${id}`, {
    method: "DELETE",
  });
}

export async function actualizarOrdenBanners(
  listaOrden: { id: number; orden: number }[]
) {
  return apiFetch(`/banners/orden`, {
    method: "PUT",
    body: JSON.stringify(listaOrden),
    headers: {
      "Content-Type": "application/json",
    },
  });
}
