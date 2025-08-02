import { Request, Response } from 'express';
import * as itemMenuService from '@/services/itemMenu.service';
import slugify from "slugify";

export async function listarItemsMenu(req: Request, res: Response) {
  try {
    const items = await itemMenuService.listarItems();
    res.json(items);
  } catch (error) {
    console.error("Error en listarItemsMenu:", error);
    res.status(400).json({ mensaje: 'Error al listar items del menú', detalle: error });
  }
}

export async function crearItemMenu(req: Request, res: Response) {
  try {
    const { nombre, activo = true, icono } = req.body;

    const nuevo = await itemMenuService.crearItem({ nombre, activo, icono });
    res.status(201).json(nuevo);
  } catch (error) {
    res.status(400).json({ mensaje: "Error al crear item del menú", detalle: error });
  }
}

export async function eliminarItemMenu(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    await itemMenuService.eliminarItem(id);
    res.json({ mensaje: 'Item eliminado' });
  } catch (error) {
    res.status(400).json({ mensaje: 'Error al eliminar item del menú', detalle: error });
  }
}

export async function editarItemMenu(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    const { nombre, activo, icono } = req.body;
    const slug = slugify(nombre, { lower: true, strict: true });
    const itemActualizado = await itemMenuService.editarItem(id, {
      nombre,
      slug,
      activo,
      icono
    });

    res.json(itemActualizado);
  } catch (error) {
    res.status(400).json({ mensaje: 'Error al editar item del menú', detalle: error });
  }
}

export async function putOrdenItemsMenu(req: Request, res: Response) {
  try {
    const items = req.body;
    if (!Array.isArray(items)) {
      return res.status(400).json({ mensaje: "Formato inválido" });
    }

    await itemMenuService.actualizarOrdenItems(items);
    res.json({ mensaje: "Orden actualizado" });
  } catch (error: any) {
    console.error("🔥 Error crudo en putOrdenItemsMenu:", error);
    res.status(400).json({
      mensaje: "Error al actualizar orden",
      detalle: error?.message || "Error desconocido",
    });
  }
}

