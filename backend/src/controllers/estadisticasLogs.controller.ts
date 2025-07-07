
import { Request, Response } from 'express';
import * as stats from '@/services/estadisticasLogs.service';

export async function getTerminosMasBuscados(req: Request, res: Response) {
  try {
    const top = await stats.terminosMasBuscados();
    res.json(top);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ mensaje: error.message });
    } else {
      res.status(400).json({ mensaje: 'Error inesperado', detalle: error });
    }
  }
}

export async function getProductosMasCliqueados(req: Request, res: Response) {
  try {
    const top = await stats.productosMasCliqueados();
    res.json(top);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ mensaje: error.message });
    } else {
      res.status(400).json({ mensaje: 'Error inesperado', detalle: error });
    }
  }
}

export async function getCategoriasMasNavegadas(req: Request, res: Response) {
  try {
    const top = await stats.categoriasMasNavegadas();
    res.json(top);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ mensaje: error.message });
    } else {
      res.status(400).json({ mensaje: 'Error inesperado', detalle: error });
    }
  }
}

export async function getPaginasMasVisitadas(req: Request, res: Response) {
  try {
    const top = await stats.paginasMasVisitadas();
    res.json(top);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ mensaje: error.message });
    } else {
      res.status(400).json({ mensaje: 'Error inesperado', detalle: error });
    }
  }
}
