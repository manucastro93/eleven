import { Request, Response } from 'express';
import { buscarDirecciones } from '@/services/direccion.service';

export async function getDirecciones(req: Request, res: Response) {
  try {
    const localidadId = Number(req.query.localidadId);
    const query = String(req.query.query || '');

    if (!localidadId || query.length < 2) {
      return res.status(400).json({ mensaje: 'Datos insuficientes para buscar direcciones' });
    }

    const resultados = await buscarDirecciones(localidadId, query);
    res.json(resultados);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ mensaje: error.message });
    } else {
      res.status(400).json({ mensaje: 'Error inesperado', detalle: error });
    }
  }
}