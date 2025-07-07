
import { Request, Response } from 'express';
import * as metodoEnvioService from '@/services/metodoEnvio.service';

export async function getMetodosEnvio(req: Request, res: Response) {
  try {
    const metodos = await metodoEnvioService.listarMetodosEnvio();
    res.json(metodos);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ mensaje: error.message });
    } else {
      res.status(400).json({ mensaje: 'Error inesperado', detalle: error });
    }
  }
}
