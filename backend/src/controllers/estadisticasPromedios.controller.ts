import { Request, Response } from 'express';
import * as service from '@/services/estadisticasPromedios.service';

export async function getPromediosGenerales(req: Request, res: Response) {
  try {
    const data = await service.promediosGenerales();
    res.json(data[0]);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ mensaje: error.message });
    } else {
      res.status(400).json({ mensaje: 'Error inesperado', detalle: error });
    }
  }
}

export async function getPromediosProducto(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    const data = await service.promediosPorProducto(id);
    res.json(data[0]);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ mensaje: error.message });
    } else {
      res.status(400).json({ mensaje: 'Error inesperado', detalle: error });
    }
  }
}

export async function getPromediosCliente(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    const data = await service.promediosPorCliente(id);
    res.json(data[0]);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ mensaje: error.message });
    } else {
      res.status(400).json({ mensaje: 'Error inesperado', detalle: error });
    }
  }
}

export async function getPromediosCategoria(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    const data = await service.promediosPorCategoria(id);
    res.json(data[0]);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ mensaje: error.message });
    } else {
      res.status(400).json({ mensaje: 'Error inesperado', detalle: error });
    }
  }
}