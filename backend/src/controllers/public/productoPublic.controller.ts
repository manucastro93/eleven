import { Request, Response } from 'express';
import * as productoPublicService from '@/services/public/productoPublic.service';

export async function getProductosPublic(req: Request, res: Response) {
  try {
    const { categoria, busqueda, orden, pagina } = req.query;

    const productos = await productoPublicService.listarProductosPublicos({
      categoria: categoria?.toString(),
      busqueda: busqueda?.toString(),
      orden: orden?.toString(),
      pagina: parseInt(pagina?.toString() || '1'),
    });

    res.json(productos);
  } catch (error) {
    console.error('Error al obtener productos públicos', error);
    res.status(500).json({ mensaje: 'Error al obtener productos públicos' });
  }
}
