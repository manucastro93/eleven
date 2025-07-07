import { Request, Response } from 'express';
import * as service from '@/services/logSesion.service';
import { RequestWithSesionAnonima } from '@/types/RequestWithSesionAnonima';

interface LogSesionData {
  sesionAnonimaId: string;
  url: string;
  accion: string;
  tiempoEnPagina: number;
  timestamp: Date;
  referrer: string;
  extraData?: object | null;
}

export async function getLogsPorSesion(req: Request, res: Response) {
  try {
    const { sesionId } = req.params;
    const logs = await service.obtenerLogsPorSesion(sesionId);
    res.json(logs);
  } catch (error) {
    res.status(400).json({
      mensaje: error instanceof Error ? error.message : 'Error inesperado',
      detalle: error
    });
  }
}

export async function postLogsSesion(req: Request, res: Response) {
  try {
    const logs = req.body as LogSesionData[];
    const creados = await service.registrarLogsSesionMasivo(logs);
    res.status(201).json(creados);
  } catch (error) {
    res.status(400).json({
      mensaje: error instanceof Error ? error.message : 'Error inesperado',
      detalle: error
    });
  }
}

export async function postLogSesion(req: RequestWithSesionAnonima, res: Response) {
  try {
    const { url, accion, tiempoEnPagina, timestamp, referrer, extraData } = req.body;

    const log = await service.registrarLogSesion({
      sesionAnonimaId: req.sesionAnonimaId!,
      url,
      accion,
      tiempoEnPagina,
      timestamp: timestamp ? new Date(timestamp) : new Date(),
      referrer,
      extraData
    });

    res.status(201).json(log);
  } catch (error) {
    res.status(400).json({
      mensaje: error instanceof Error ? error.message : 'Error inesperado',
      detalle: error
    });
  }
}