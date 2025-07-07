import { Request, Response } from 'express';
import * as carritoService from '@/services/carrito.service';

export const getCarritos = async (req: Request, res: Response): Promise<void> => {
  try {
    const { clienteId, estadoEdicion, desde, hasta, limit = 20, offset = 0 } = req.query;
    const result = await carritoService.listarCarritos({
      clienteId: clienteId ? Number(clienteId) : undefined,
      estadoEdicion: estadoEdicion ? Number(estadoEdicion) : 1,
      desde: typeof desde === 'string' ? desde : undefined,
      hasta: typeof hasta === 'string' ? hasta : undefined,
      limit: Number(limit),
      offset: Number(offset)
    });
    res.json(result);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ mensaje: error.message });
    } else {
      res.status(400).json({ mensaje: 'Error inesperado', detalle: error });
    }
  }
};

export const getCarritoActivo = async (req: Request, res: Response): Promise<void> => {
  try {
    const { clienteId } = req.params;
    const carrito = await carritoService.obtenerCarritoActivo(Number(clienteId));
    if (!carrito) {
      res.status(404).json({ mensaje: 'Carrito no encontrado' });
      return;
    }
    res.json(carrito);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Error desconocido' });
    }
  }
};

export const postCarrito = async (req: Request, res: Response): Promise<void> => {
  try {
    const data = req.body;
    const nuevoCarrito = await carritoService.crearCarrito(data);
    res.status(201).json(nuevoCarrito);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Error desconocido' });
    }
  }
};

export const putCarrito = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = Number(req.params.id);
    const data = req.body;
    const carritoActualizado = await carritoService.actualizarCarrito(id, data);
    res.json(carritoActualizado);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Error desconocido' });
    }
  }
};

export const deleteProductoCarrito = async (req: Request, res: Response): Promise<void> => {
  try {
    const carritoId = Number(req.params.carritoId);
    const productoId = Number(req.params.productoId);
    await carritoService.eliminarProductoDeCarrito(carritoId, productoId);
    res.json({ message: 'Producto eliminado del carrito' });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Error desconocido' });
    }
  }
};

export const deleteCarrito = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = Number(req.params.id);
    await carritoService.eliminarCarrito(id);
    res.json({ message: 'Carrito eliminado correctamente' });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Error desconocido' });
    }
  }
};

export const confirmarCarrito = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = Number(req.params.id);
    const { metodoEnvioId, metodoPagoId } = req.body;

    if (!metodoEnvioId || !metodoPagoId) {
      res.status(400).json({ message: 'Faltan método de envío o pago' });
      return;
    }

    const pedido = await carritoService.confirmarCarrito(id, metodoEnvioId, metodoPagoId);
    res.status(200).json(pedido);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Error desconocido' });
    }
  }
};
