import { Request, Response } from 'express';
import * as stats from '@/services/estadisticasAvanzadas.service';

export async function getResumenMensualComparativo(req: Request, res: Response) {
  try {
    const data = await stats.resumenMensualComparativo();
    res.json(data);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ mensaje: error.message });
    } else {
      res.status(400).json({ mensaje: 'Error inesperado', detalle: error });
    }
  }
}

export async function getVentasPorDia(req: Request, res: Response) {
  try {
    const { fechaInicio, fechaFin } = req.query;
    const data = await stats.ventasPorDia(fechaInicio as string, fechaFin as string);
    res.json(data);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ mensaje: error.message });
    } else {
      res.status(400).json({ mensaje: 'Error inesperado', detalle: error });
    }
  }
}

export async function getTopProductosPorValor(req: Request, res: Response) {
  try {
    const data = await stats.topProductosPorValor();
    res.json(data);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ mensaje: error.message });
    } else {
      res.status(400).json({ mensaje: 'Error inesperado', detalle: error });
    }
  }
}

export async function getTopClientesPorValor(req: Request, res: Response) {
  try {
    const data = await stats.topClientesPorValor();
    res.json(data);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ mensaje: error.message });
    } else {
      res.status(400).json({ mensaje: 'Error inesperado', detalle: error });
    }
  }
}