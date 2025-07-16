import { Request, Response } from "express";
import * as mensajeService from "@/services/mensajeInformativo.service";

export async function getMensajes(req: Request, res: Response) {
  try {
    const mensajes = await mensajeService.listarMensajesPublicos();
    res.json(mensajes);
  } catch (error) {
    res.status(400).json({ mensaje: "Error al obtener mensajes", detalle: error });
  }
}

export async function getMensajesAdmin(req: Request, res: Response) {
  try {
    const mensajes = await mensajeService.listarMensajesAdmin();
    res.json(mensajes);
  } catch (error) {
    res.status(400).json({ mensaje: "Error al obtener mensajes admin", detalle: error });
  }
}

export async function postMensaje(req: Request, res: Response) {
  try {
    const { mensaje, activo } = req.body;
    const nuevo = await mensajeService.crearMensaje({ mensaje, activo });
    res.json(nuevo);
  } catch (error) {
    res.status(400).json({ mensaje: "Error al crear mensaje", detalle: error });
  }
}

export async function putMensaje(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    const { mensaje, activo, orden } = req.body;
    const actualizado = await mensajeService.actualizarMensaje(id, { mensaje, activo, orden });
    res.json(actualizado);
  } catch (error) {
    res.status(400).json({ mensaje: "Error al actualizar mensaje", detalle: error });
  }
}

export async function deleteMensaje(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    await mensajeService.eliminarMensaje(id);
    res.json({ mensaje: "Mensaje eliminado correctamente" });
  } catch (error) {
    res.status(400).json({ mensaje: "Error al eliminar mensaje", detalle: error });
  }
}
