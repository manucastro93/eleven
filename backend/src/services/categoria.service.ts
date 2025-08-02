import { Categoria } from "@/models/Categoria";
import { Subcategoria } from "@/models/Subcategoria";
import { Op } from "sequelize";

export async function listarCategorias() {
  return await Categoria.findAll({
    include: [
      {
        model: Subcategoria,
        as: "subcategorias",
        attributes: ["id", "nombre", "slug"],
        required: false,
      },
    ],
    order: [
      ["orden", "ASC"],
      [{ model: Subcategoria, as: "subcategorias" }, "orden", "ASC"],
    ],
  });
}

export async function obtenerCategoriaPorId(id: number) {
  return await Categoria.findByPk(id);
}

export async function crearCategoria(data: {
  nombre: string;
  descripcion?: string;
  slug?: string;
  orden?: number;
  destacada?: boolean;
}) {
  return await Categoria.create({
    nombre: data.nombre,
    descripcion: data.descripcion ?? "",
    slug: data.slug ?? "",
    orden: data.orden ?? 0,
    destacada: data.destacada ?? false
  });
}

export async function actualizarCategoria(id: number, nombre: string) {
  const categoria = await Categoria.findByPk(id);
  if (!categoria) throw new Error("Categoría no encontrada");

  categoria.nombre = nombre;
  await categoria.save();

  return categoria;
}

export async function eliminarCategoria(id: number) {
  const categoria = await Categoria.findByPk(id);
  if (!categoria) throw new Error("Categoría no encontrada");

  await categoria.destroy();
}

export async function listarCategoriasAdmin(params: {
  search?: string;
  page?: number;
  orderBy?: string;
  orderDir?: "ASC" | "DESC";
  limit?: number;
}) {
  const page = params.page ?? 1;
  const limit = params.limit ?? 20;
  const offset = (page - 1) * limit;

  const where: any = {};
  if (params.search) {
    where.nombre = { [Op.like]: `%${params.search}%` };
  }

  const { rows, count } = await Categoria.findAndCountAll({
    where,
    order: [[params.orderBy || "nombre", params.orderDir || "ASC"]],
    limit,
    offset,
  });

  return {
    categorias: rows,
    totalCount: count,
    totalPages: Math.ceil(count / limit),
  };
}

export async function actualizarOrdenCategorias(lista: { id: number; orden: number }[]) {
  for (const item of lista) {
    await Categoria.update(
      { orden: item.orden },
      { where: { id: item.id } }
    );
  }
}

export async function actualizarDestacadaCategoria(id: number, destacada: boolean) {
  const categoria = await Categoria.findByPk(id);
  if (!categoria) throw new Error("Categoría no encontrada");

  categoria.destacada = destacada;
  await categoria.save();

  return categoria;
}

export async function actualizarImagenCategoria(id: number, imagenUrl: string) {
  const categoria = await Categoria.findByPk(id);
  if (!categoria) throw new Error("Categoría no encontrada");

  categoria.imagenUrl = imagenUrl;
  await categoria.save();

  return categoria;
}