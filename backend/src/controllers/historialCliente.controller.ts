
import { Request, Response } from 'express';
import * as historialService from '@/services/historialCliente.service';

export async function getHistorialCliente(req: Request, res: Response) {
  try {
    const clienteId = Number(req.params.clienteId);
    const historial = await historialService.listarHistorialCliente(clienteId);
    res.json(historial);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ mensaje: error.message });
    } else {
      res.status(400).json({ mensaje: 'Error inesperado', detalle: error });
    }
  }
}
