
import { Request, Response } from 'express';
import * as stats from '@/services/estadisticasVentas.service';

export async function getTopProductos(req: Request, res: Response) {
  try {
    const top = await stats.topProductosVendidos();
    res.json(top);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ mensaje: error.message });
    } else {
      res.status(400).json({ mensaje: 'Error inesperado', detalle: error });
    }
  }
}

export async function getTopCategorias(req: Request, res: Response) {
  try {
    const top = await stats.topCategoriasVendidas();
    res.json(top);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ mensaje: error.message });
    } else {
      res.status(400).json({ mensaje: 'Error inesperado', detalle: error });
    }
  }
}

export async function getTopClientes(req: Request, res: Response) {
  try {
    const top = await stats.topClientes();
    res.json(top);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ mensaje: error.message });
    } else {
      res.status(400).json({ mensaje: 'Error inesperado', detalle: error });
    }
  }
}

export async function getVentasPorLocalidad(req: Request, res: Response) {
  try {
    const data = await stats.ventasPorLocalidad();
    res.json(data);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ mensaje: error.message });
    } else {
      res.status(400).json({ mensaje: 'Error inesperado', detalle: error });
    }
  }
}

export async function getVentasPorProvincia(req: Request, res: Response) {
  try {
    const data = await stats.ventasPorProvincia();
    res.json(data);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ mensaje: error.message });
    } else {
      res.status(400).json({ mensaje: 'Error inesperado', detalle: error });
    }
  }
}
