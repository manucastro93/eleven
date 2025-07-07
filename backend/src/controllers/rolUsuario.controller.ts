
import { Request, Response } from 'express';
import * as rolService from '@/services/rolUsuario.service';

export async function getRolesUsuario(req: Request, res: Response) {
  try {
    const roles = await rolService.listarRolesUsuario();
    res.json(roles);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ mensaje: error.message });
    } else {
      res.status(400).json({ mensaje: 'Error inesperado', detalle: error });
    }
  }
}
