
import { Request, Response } from 'express';
import * as service from '@/services/notificacion.service';

export async function getNotificaciones(req: Request, res: Response) {
  try {
    const usuarioId = Number(req.query.usuarioId);
    const notificaciones = await service.listarNotificaciones(usuarioId);
    res.json(notificaciones);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ mensaje: error.message });
    } else {
      res.status(400).json({ mensaje: 'Error inesperado', detalle: error });
    }
  }
}

export async function postNotificacion(req: Request, res: Response) {
  try {
    const { titulo, mensaje, usuarioId } = req.body;
    const nueva = await service.crearNotificacion(titulo, mensaje, usuarioId);
    res.status(201).json(nueva);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ mensaje: error.message });
    } else {
      res.status(400).json({ mensaje: 'Error inesperado', detalle: error });
    }
  }
}

export async function putMarcarLeida(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    const noti = await service.marcarComoLeida(id);
    res.json(noti);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ mensaje: error.message });
    } else {
      res.status(400).json({ mensaje: 'Error inesperado', detalle: error });
    }
  }
}
