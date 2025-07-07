
import { Request, Response } from 'express';
import * as metodoPagoService from '@/services/metodoPago.service';

export async function getMetodosPago(req: Request, res: Response) {
  try {
    const metodos = await metodoPagoService.listarMetodosPago();
    res.json(metodos);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ mensaje: error.message });
    } else {
      res.status(400).json({ mensaje: 'Error inesperado', detalle: error });
    }
  }
}
