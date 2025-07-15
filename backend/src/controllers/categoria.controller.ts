import { Request, Response } from "express";
import * as categoriaService from "@/services/categoria.service";
import sharp from "sharp";

export async function getCategorias(req: Request, res: Response) {
  try {
    const categorias = await categoriaService.listarCategorias();
    res.json(categorias);
  } catch (error) {
    res.status(400).json({ mensaje: "Error al obtener categorías", detalle: error });
  }
}

export async function getCategoriaPorId(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    const categoria = await categoriaService.obtenerCategoriaPorId(id);
    if (!categoria) return res.status(404).json({ mensaje: "Categoría no encontrada" });
    res.json(categoria);
  } catch (error) {
    res.status(400).json({ mensaje: "Error al obtener categoría", detalle: error });
  }
}

export async function postCategoria(req: Request, res: Response) {
  try {
    const { nombre, descripcion, slug, orden, destacada } = req.body;
    const categoria = await categoriaService.crearCategoria({
      nombre,
      descripcion,
      slug,
      orden,
      destacada
    });
    res.json(categoria);
  } catch (error) {
    res.status(400).json({ mensaje: "Error al crear categoría", detalle: error });
  }
}

export async function putCategoria(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    const { nombre } = req.body;
    const categoria = await categoriaService.actualizarCategoria(id, nombre);
    res.json(categoria);
  } catch (error) {
    res.status(400).json({ mensaje: "Error al actualizar categoría", detalle: error });
  }
}

export async function deleteCategoria(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    await categoriaService.eliminarCategoria(id);
    res.json({ mensaje: "Categoría eliminada correctamente" });
  } catch (error) {
    res.status(400).json({ mensaje: "Error al eliminar categoría", detalle: error });
  }
}

export async function getCategoriasAdmin(req: Request, res: Response) {
  try {
    const result = await categoriaService.listarCategoriasAdmin({
      search: String(req.query.search || ""),
      page: Number(req.query.page || 1),
      orderBy: String(req.query.orderBy || "nombre"),
      orderDir: (req.query.orderDir as "ASC" | "DESC") || "ASC",
      limit: Number(req.query.limit || 20),
    });

    res.json(result);
  } catch (error) {
    console.error("Error en getCategoriasAdmin:", error);
    res.status(500).json({ message: "Error al obtener categorías" });
  }
}

export async function putOrdenCategorias(req: Request, res: Response) {
  try {
    const lista: { id: number; orden: number }[] = req.body.ids;

    await categoriaService.actualizarOrdenCategorias(lista);

    res.json({ message: "Orden actualizado" });
  } catch (err) {
    console.error("Error en putOrdenCategorias:", err);
    res.status(500).json({ message: "Error al actualizar orden" });
  }
}

export async function putDestacadaCategoria(req: Request, res: Response) {
  try {
    const result = await categoriaService.actualizarDestacadaCategoria(
      Number(req.params.id),
      req.body.destacada
    );

    res.json(result);
  } catch (error) {
    console.error("Error en putDestacadaCategoria:", error);
    res.status(500).json({ message: "Error al actualizar destacada" });
  }
}

export async function putImagenCategoria(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    const file = req.file;

    if (!file) {
      return res.status(400).json({ mensaje: "No se envió archivo de imagen" });
    }

    // Obtener la categoría
    const categoria = await categoriaService.obtenerCategoriaPorId(id);
    if (!categoria) {
      return res.status(404).json({ mensaje: "Categoría no encontrada" });
    }
    const slug = categoria.slug || `cat_${id}`;

    // Procesar la imagen con sharp
    const bufferProcesado = await sharp(file.buffer)
      .resize(600, 600, { fit: "cover" }) // o fit: "contain" si querés fondo blanco
      .jpeg({ quality: 80 }) // o .png({ quality: 80 })
      .toBuffer();

    // Guardar en disco (ejemplo, pero podría ser S3/Cloudinary)
    const fs = await import("fs/promises");
    const fileName = `${slug}.jpg`;
    const filePath = `uploads/categorias/${fileName}`;

    await fs.writeFile(filePath, bufferProcesado);

    const url = `/uploads/categorias/${fileName}`;

    // Actualizá la categoría en la DB
    await categoriaService.actualizarImagenCategoria(id, url);

    res.json({ mensaje: "Imagen actualizada", imagenUrl: url });
  } catch (error) {
    res.status(400).json({ mensaje: "Error al actualizar imagen", detalle: error });
  }
}