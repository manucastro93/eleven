
import { Request, Response } from 'express';
import * as auditoriaService from '@/services/auditoria.service';

export async function getAuditorias(req: Request, res: Response) {
  try {
    const { search = '', limit = 20, offset = 0 } = req.query;
    const resultado = await auditoriaService.listarAuditorias({
      search: String(search),
      limit: Number(limit),
      offset: Number(offset)
    });
    res.json(resultado);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ mensaje: error.message });
    } else {
      res.status(400).json({ mensaje: 'Error inesperado', detalle: error });
    }
  }
}
