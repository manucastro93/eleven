
import { Request, Response } from 'express';
import * as permisoService from '@/services/permiso.service';

export async function getPermisos(req: Request, res: Response) {
  try {
    const permisos = await permisoService.listarPermisos();
    res.json(permisos);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ mensaje: error.message });
    } else {
      res.status(400).json({ mensaje: 'Error inesperado', detalle: error });
    }
  }
}
