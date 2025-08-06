import { Request, Response } from 'express';
import * as carritoService from '@/services/public/carrito.service';

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

export const getCarritoActivoPorSesion = async (req: Request, res: Response) => {
  try {
    const { sesionAnonimaId } = req.params;
    if (!sesionAnonimaId)
      return res.status(400).json({ message: "Falta sesionAnonimaId" });

    const carrito = await carritoService.obtenerCarritoActivoPorSesion(sesionAnonimaId);
    if (!carrito)
      return res.status(404).json({ message: "Carrito no encontrado" });

    res.json(carrito);
  } catch (error) {
    console.error("Error al obtener carrito activo por sesión:", error);
    res.status(500).json({ message: "Error al obtener carrito activo por sesión" });
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
    console.error(error);
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Error desconocido' });
    }
  }
};

export const getCarritoPorId = async (req: Request, res: Response): Promise<void> => {
  try {
    const { carritoId } = req.params;
    const carrito = await carritoService.obtenerCarritoPorId(Number(carritoId));
    if (!carrito) {
      res.status(404).json({ mensaje: 'Carrito no encontrado' });
      return;
    }
    res.json(carrito);
  } catch (error) {
    console.error(error);
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

export const agregarProductoACarrito = async (req: Request, res: Response): Promise<void> => {
  try {
    const carritoId = Number(req.params.carritoId);
    const productos = req.body.productos;

    if (!productos || !Array.isArray(productos) || productos.length === 0) {
      res.status(400).json({ message: 'No hay productos en el body' });
      return;
    }

    const { productoId, cantidad, observaciones } = productos[0];

    // El precio lo toma siempre del backend, no del frontend
    await carritoService.agregarProductoACarrito(
      carritoId,
      productoId,
      cantidad,
      0, // ignora precio del front
      observaciones
    );

    res.status(200).json({ message: 'Producto agregado al carrito' });

  } catch (error: any) {
    const mensaje = error instanceof Error ? error.message : 'Error desconocido';

    // Si el mensaje menciona stock o precio, 409 Conflict (para UX)
    if (mensaje.includes('Stock insuficiente') || mensaje.includes('Producto no encontrado')) {
      res.status(409).json({ message: mensaje });
    } else {
      res.status(500).json({ message: mensaje });
    }
  }
};

export const actualizarCantidadProductoCarrito = async (req: Request, res: Response): Promise<void> => {
  try {
    const carritoId = Number(req.params.carritoId);
    const productoId = Number(req.params.productoId);
    const { cantidad, observaciones } = req.body;

    if (!cantidad || cantidad < 1) {
      res.status(400).json({ message: 'La cantidad debe ser mayor a cero' });
      return;
    }

    // Lógica: se actualiza como si fuese un agregarProducto, siempre valida stock y precio
    await carritoService.agregarProductoACarrito(
      carritoId,
      productoId,
      cantidad,
      0, // precio ignorado, se toma desde BD
      observaciones
    );

    res.status(200).json({ message: 'Cantidad de producto actualizada' });

  } catch (error: any) {
    const mensaje = error instanceof Error ? error.message : 'Error desconocido';

    if (mensaje.includes('Stock insuficiente') || mensaje.includes('Producto no encontrado')) {
      res.status(409).json({ message: mensaje });
    } else {
      res.status(500).json({ message: mensaje });
    }
  }
};

export const eliminarProductoDeCarrito = async (req: Request, res: Response): Promise<void> => {
  try {
    const carritoId = Number(req.params.carritoId);
    const productoId = Number(req.params.productoId);

    await carritoService.eliminarProductoDeCarrito(carritoId, productoId);

    res.status(200).json({ message: 'Producto eliminado del carrito' });
  } catch (error: any) {
    const mensaje = error instanceof Error ? error.message : 'Error desconocido';

    if (mensaje.includes('Carrito no encontrado') || mensaje.includes('Producto no encontrado')) {
      res.status(404).json({ message: mensaje });
    } else {
      res.status(500).json({ message: mensaje });
    }
  }
};

export const confirmarCarrito = async (req: Request, res: Response): Promise<void> => {
  try {
    const carritoId = Number(req.params.carritoId);
    const {
      transporte,
      formaEnvio,
      formaPago,
      telefono,
      email,
      nombreFantasia,
      cuit,
      razonSocial,
      direccion,
      localidad,
      provincia,
      codigoPostal,
      categoriaFiscal
    } = req.body;

    const pedido = await carritoService.confirmarCarrito(carritoId, {
      transporte,
      formaEnvio,
      formaPago,
      telefono,
      email,
      nombreFantasia,
      cuit,
      razonSocial,
      direccion,
      localidad,
      provincia,
      codigoPostal,
      categoriaFiscal
    });

    res.status(200).json(pedido);

  } catch (error: any) {
    console.error(error);
    const mensaje = error instanceof Error ? error.message : 'Error desconocido';

    if (mensaje.includes('Stock insuficiente') || mensaje.includes('ha cambiado')) {
      res.status(409).json({ message: mensaje });
    } else if (mensaje.includes('Carrito no encontrado')) {
      res.status(404).json({ message: mensaje });
    } else {
      res.status(500).json({ message: mensaje });
    }
  }
};

export const actualizarObservacioneseneral = async (req: Request, res: Response): Promise<void> => {
  try {
    const carritoId = Number(req.params.carritoId);
    const { observaciones } = req.body;

    if (!observaciones || typeof observaciones !== "string") {
      res.status(400).json({ message: "Falta el comentario." });
      return;
    }

    const actualizado = await carritoService.actualizarObservacionesGeneral(carritoId, observaciones);

    if (!actualizado) {
      res.status(404).json({ message: "Carrito no encontrado." });
      return;
    }

    res.status(200).json({ message: "Comentario general actualizado correctamente." });
  } catch (error: any) {
    console.error("Error actualizando comentario general:", error);
    res.status(500).json({ message: error instanceof Error ? error.message : "Error inesperado" });
  }
};
