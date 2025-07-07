import { Request, Response } from 'express';
import * as service from '@/services/local.service';

export async function getLocales(req: Request, res: Response) {
  try {
    const data = await service.getLocales();
    res.json(data);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ mensaje: error.message });
    } else {
      res.status(400).json({ mensaje: 'Error inesperado', detalle: error });
    }
  }
}

export async function getLocalPorId(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    const data = await service.getLocalPorId(id);
    res.json(data);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ mensaje: error.message });
    } else {
      res.status(400).json({ mensaje: 'Error inesperado', detalle: error });
    }
  }
}

export async function postLocal(req: Request, res: Response) {
  try {
    const creado = await service.crearLocal(req.body);
    res.status(201).json(creado);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ mensaje: error.message });
    } else {
      res.status(400).json({ mensaje: 'Error inesperado', detalle: error });
    }
  }
}

export async function putLocal(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    const actualizado = await service.actualizarLocal(id, req.body);
    res.json(actualizado);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ mensaje: error.message });
    } else {
      res.status(400).json({ mensaje: 'Error inesperado', detalle: error });
    }
  }
}