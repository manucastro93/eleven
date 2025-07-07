
import { Request, Response } from 'express';
import * as moduloService from '@/services/modulo.service';

export async function getModulos(req: Request, res: Response) {
  try {
    const modulos = await moduloService.listarModulos();
    res.json(modulos);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ mensaje: error.message });
    } else {
      res.status(400).json({ mensaje: 'Error inesperado', detalle: error });
    }
  }
}
