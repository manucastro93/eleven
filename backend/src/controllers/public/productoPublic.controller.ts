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

export async function getProductoPorSlug(req: Request, res: Response) {
  try {
    const { slug } = req.params;
    if (!slug) return res.status(400).json({ mensaje: 'Falta el slug' });

    const producto = await productoPublicService.obtenerProductoPorSlug(slug);
    if (!producto) return res.status(404).json({ mensaje: 'Producto no encontrado' });

    res.json(producto);
  } catch (error) {
    console.error('Error al obtener producto por slug', error);
    res.status(500).json({ mensaje: 'Error al obtener producto por slug' });
  }
}

export async function getProductosRelacionados(req: Request, res: Response) {
  try {
    const categoria = req.query.categoria?.toString();
    const excluir = parseInt(req.query.excluir?.toString() || '');

    if (!categoria || isNaN(excluir)) {
      return res.status(400).json({ mensaje: 'Faltan parámetros: categoria y excluir' });
    }

    const productos = await productoPublicService.listarProductosRelacionadosBackend(categoria, excluir);
    res.json(productos);
  } catch (error) {
    console.error('Error al obtener productos relacionados', error);
    res.status(500).json({ mensaje: 'Error al obtener productos relacionados' });
  }
}
