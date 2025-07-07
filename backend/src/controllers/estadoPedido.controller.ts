
import { Request, Response } from 'express';
import * as estadoService from '@/services/estadoPedido.service';

export async function getEstadosPedido(req: Request, res: Response) {
  try {
    const estados = await estadoService.listarEstadosPedido();
    res.json(estados);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ mensaje: error.message });
    } else {
      res.status(400).json({ mensaje: 'Error inesperado', detalle: error });
    }
  }
}
