import { Request, Response } from 'express';
import * as service from '@/services/ip.service';

export async function getIPs(req: Request, res: Response) {
  try {
    const { search = '', limit = 20, offset = 0 } = req.query;
    const result = await service.listarIPs({
      search: String(search),
      limit: Number(limit),
      offset: Number(offset)
    });
    res.json(result);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ mensaje: error.message });
    } else {
      res.status(400).json({ mensaje: 'Error inesperado', detalle: error });
    }
  }
}