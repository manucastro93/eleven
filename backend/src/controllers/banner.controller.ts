import { Request, Response, RequestHandler } from 'express';
import * as bannerService from '@/services/banner.service';

export const obtenerBanners: RequestHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const { search, limit, offset } = req.query;
    const result = await bannerService.listarBanners({
      search: search as string,
      limit: Number(limit) || 20,
      offset: Number(offset) || 0
    });
    res.status(200).json(result);  // No retornamos el Response, solo lo usamos para enviar la respuesta
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Error desconocido' });
    }
  }
};

export const obtenerBannerPorId: RequestHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const banner = await bannerService.obtenerBannerPorId(Number(id));
    if (!banner) {
      res.status(404).json({ message: 'Banner no encontrado' });
      return;
    }
    res.status(200).json(banner);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Error desconocido' });
    }
  }
};

export const crearBanner: RequestHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      texto,
      descripcionEstilo,
      textoTop,
      textoLeft,
      textoWidth,
      backgroundColorTexto,
      botonTexto,
      botonEstilo,
      botonTop,
      botonLeft,
      botonLink,
      fechaDesde,
      fechaHasta,
      activo
    } = req.body;
    
    const imgFilename = req.file ? `/uploads/banners/${req.file.filename}` : '';
    console.log("nombre: ", imgFilename)
    const bannerData = {
      img: imgFilename,
      texto,
      descripcionEstilo,
      textoTop,
      textoLeft,
      textoWidth,
      backgroundColorTexto,
      botonTexto,
      botonEstilo,
      botonTop,
      botonLeft,
      botonLink,
      fechaDesde,
      fechaHasta,
      activo: activo === '1'
    };
console.log("banner data: ", bannerData)
    const nuevoBanner = await bannerService.crearBanner(bannerData);
    
    res.status(201).json(nuevoBanner);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Error desconocido' });
    }
  }
};

export const actualizarBanner: RequestHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const bannerData = req.body;
    const bannerActualizado = await bannerService.actualizarBanner(Number(id), bannerData);
    res.status(200).json(bannerActualizado);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Error desconocido' });
    }
  }
};

export const eliminarBanner: RequestHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await bannerService.eliminarBanner(Number(id));
    res.status(200).json({ message: 'Banner eliminado correctamente' });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Error desconocido' });
    }
  }
};

export const actualizarOrdenBanners: RequestHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const listaOrden = req.body as { id: number; orden: number }[];

    await bannerService.actualizarOrdenBanners(listaOrden);

    res.status(200).json({ message: 'Orden actualizado correctamente' });
  } catch (error: unknown) {
    console.error('Error en actualizarOrdenBanners', error); // 💥
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Error desconocido' });
    }
  }
};

