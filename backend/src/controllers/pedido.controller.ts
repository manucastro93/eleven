import { Request, Response } from 'express';
import * as pedidoService from '@/services/pedido.service';

export const getPedidosAdmin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { clienteId, estadoPedidoId, localId, desde, hasta, limit = 20, offset = 0 } = req.query;
    const result = await pedidoService.listarPedidos({
      clienteId: clienteId ? Number(clienteId) : undefined,
      estadoPedidoId: estadoPedidoId ? Number(estadoPedidoId) : undefined,
      localId: localId ? Number(localId) : undefined,
      desde: typeof desde === 'string' ? desde : undefined,
      hasta: typeof hasta === 'string' ? hasta : undefined,
      limit: Number(limit),
      offset: Number(offset)
    });

    res.json(result);  // No retornamos res, solo lo usamos para enviar la respuesta
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ mensaje: error.message });
    } else {
      res.status(400).json({ mensaje: 'Error inesperado', detalle: error });
    }
  }
};

/*export const postPedido = async (req: Request, res: Response): Promise<void> => {
  try {
    const pedidoData = req.body;
    const nuevoPedido = await pedidoService.crearPedido(pedidoData);
    res.status(201).json(nuevoPedido);  // Nuevamente, solo enviamos la respuesta sin devolver res
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Error desconocido' });
    }
  }
};

export const getPedidosClientePorIP = async (req: Request, res: Response): Promise<void> => {
  try {
    const ip = req.ip;  // Obtener la IP de la solicitud

    // Validamos si la IP es de tipo string
    if (!ip || typeof ip !== 'string') {
      res.status(400).json({ message: 'IP no válida' });  // Solo ejecutamos, no retornamos res
      return; // Aquí es donde terminamos la función
    }

    const pedidos = await pedidoService.obtenerPedidosPorIP(ip);
    res.status(200).json(pedidos);  // Enviar respuesta con los pedidos
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Error desconocido' });
    }
  }
};
*/
export const getPedidosPorClienteId = async (req: Request, res: Response): Promise<void> => {
  try {
    const { clienteId } = req.params;
    const clienteIdNumber = Number(clienteId); // Convertir clienteId a número
    if (isNaN(clienteIdNumber)) {
      res.status(400).json({ message: 'clienteId no válido' });
    }

    const pedidos = await pedidoService.obtenerPedidosPorClienteId(clienteIdNumber);
    res.status(200).json(pedidos);  // Enviar la respuesta
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Error desconocido' });
    }
  }
};

export const getPedidoPorId = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const pedidoId = Number(id);
    if (isNaN(pedidoId)) {
      res.status(400).json({ message: 'ID de pedido no válido' });
      return;
    }

    const pedido = await pedidoService.obtenerPedidoPorId(pedidoId);
    if (!pedido) {
      res.status(404).json({ message: 'Pedido no encontrado' });
      return;
    }
    res.status(200).json(pedido);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Error desconocido' });
    }
  }
};

export const putPedidoCliente = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const pedidoId = Number(id); // Convertir id a número
    if (isNaN(pedidoId)) {
      res.status(400).json({ message: 'ID de pedido no válido' });
    }

    const pedidoData = req.body;
    const pedidoActualizado = await pedidoService.actualizarPedidoCliente(pedidoId, pedidoData);
    res.status(200).json(pedidoActualizado);  // No retornamos res, solo lo usamos
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Error desconocido' });
    }
  }
};

export const putCancelarPedidoCliente = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const pedidoId = Number(id); // Convertir id a número
    if (isNaN(pedidoId)) {
      res.status(400).json({ message: 'ID de pedido no válido' });
    }

    await pedidoService.cancelarPedidoCliente(pedidoId);
    res.status(200).json({ message: 'Pedido cancelado correctamente' });  // No retornamos res, solo lo usamos
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Error desconocido' });
    }
  }
};

export const putEstadoPedido = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const pedidoId = Number(id); // Convertir id a número
    const { estado } = req.body;
    if (isNaN(pedidoId)) {
      res.status(400).json({ message: 'ID de pedido no válido' });
    }

    const estadoActualizado = await pedidoService.actualizarEstadoPedido(pedidoId, estado);
    res.status(200).json(estadoActualizado);  // No retornamos res, solo lo usamos
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Error desconocido' });
    }
  }
};
/*
export const actualizarProductoPedido = async (req: Request, res: Response): Promise<void> => {
  try {
    const pedidoId = Number(req.params.pedidoId);
    const productoId = Number(req.params.productoId);
    const { cantidad, observaciones } = req.body;

    if (!cantidad || cantidad < 1) {
      res.status(400).json({ message: 'La cantidad debe ser mayor a cero' });
      return;
    }

    // 1. Chequear existencia y estado
    const pedido = await pedidoService.obtenerPedidoPorId(pedidoId);
    if (!pedido) {
      res.status(404).json({ message: 'Pedido no encontrado' });
      return;
    }
    if (pedido.estadoPedidoId !== 1) { // 1 = pendiente (ajustá el valor según tu sistema)
      res.status(409).json({ message: 'No se puede editar un pedido que ya está en proceso o entregado' });
      return;
    }

    // 2. Actualizar producto, validando stock/precio
    await pedidoService.actualizarProductoPedido(pedidoId, productoId, cantidad, observaciones);

    res.status(200).json({ message: 'Producto del pedido actualizado' });
  } catch (error: any) {
    const mensaje = error instanceof Error ? error.message : 'Error desconocido';
    if (mensaje.includes('Stock insuficiente') || mensaje.includes('Producto no encontrado') || mensaje.includes('precio')) {
      res.status(409).json({ message: mensaje });
    } else {
      res.status(500).json({ message: mensaje });
    }
  }
};

export const agregarProductoAPedido = async (req: Request, res: Response): Promise<void> => {
  try {
    const pedidoId = Number(req.params.pedidoId);
    const { productoId, cantidad, observaciones } = req.body;

    if (!productoId || !cantidad || cantidad < 1) {
      res.status(400).json({ message: 'Faltan datos obligatorios: productoId y cantidad' });
      return;
    }

    const pedido = await pedidoService.obtenerPedidoPorId(pedidoId);
    if (!pedido) {
      res.status(404).json({ message: 'Pedido no encontrado' });
      return;
    }
    if (pedido.estadoPedidoId !== 1) {
      res.status(409).json({ message: 'No se puede editar un pedido que ya está en proceso o entregado' });
      return;
    }

    await pedidoService.agregarProductoAPedido(pedidoId, productoId, cantidad, observaciones);

    res.status(200).json({ message: 'Producto agregado al pedido' });
  } catch (error: any) {
    const mensaje = error instanceof Error ? error.message : 'Error desconocido';
    if (mensaje.includes('Stock insuficiente') || mensaje.includes('Producto no encontrado') || mensaje.includes('precio')) {
      res.status(409).json({ message: mensaje });
    } else {
      res.status(500).json({ message: mensaje });
    }
  }
};

export const eliminarProductoDePedido = async (req: Request, res: Response): Promise<void> => {
  try {
    const pedidoId = Number(req.params.pedidoId);
    const productoId = Number(req.params.productoId);

    const pedido = await pedidoService.obtenerPedidoPorId(pedidoId);
    if (!pedido) {
      res.status(404).json({ message: 'Pedido no encontrado' });
      return;
    }
    if (pedido.estadoPedidoId !== 1) {
      res.status(409).json({ message: 'No se puede editar un pedido que ya está en proceso o entregado' });
      return;
    }

    await pedidoService.eliminarProductoDePedido(pedidoId, productoId);

    res.status(200).json({ message: 'Producto eliminado del pedido' });
  } catch (error: any) {
    const mensaje = error instanceof Error ? error.message : 'Error desconocido';
    if (mensaje.includes('Producto no encontrado')) {
      res.status(404).json({ message: mensaje });
    } else {
      res.status(500).json({ message: mensaje });
    }
  }
};

export const duplicarPedidoACarrito = async (req: Request, res: Response): Promise<void> => {
  try {
    const pedidoId = Number(req.params.pedidoId);
    // Recuperá el clienteId desde el body o mejor, del token si usás auth
    const { clienteId } = req.body;
    if (!clienteId) {
      res.status(400).json({ message: 'Falta el clienteId para duplicar el pedido' });
      return;
    }

    const resultado = await pedidoService.duplicarPedidoACarrito(pedidoId, clienteId);

    // resultado puede tener un formato tipo:
    // { carritoId, productosAgregados, productosSinStock: [{ productoId, motivo }] }
    res.status(201).json(resultado);
  } catch (error: any) {
    res.status(500).json({ message: error instanceof Error ? error.message : 'Error desconocido' });
  }
};*/