import { Request, Response } from "express";
import * as pedidoService from "@/services/public/pedido.service";
//import * as pedidoService from '@/services/pedido.service';

export const getPedidosPorIdCliente = async (req: Request,res: Response): Promise<void> => {
  try {
    const { clienteId } = req.params;

    if (!clienteId || isNaN(Number(clienteId))) {
      res.status(400).json({ mensaje: "clienteId inválido" });
      return;
    }

    const pedidos = await pedidoService.listarPedidosPorCliente(
      Number(clienteId)
    );

    res.json(pedidos);
  } catch (error) {
    console.error("ERROR en getPedidosPorIdCliente:", error);
    if (error instanceof Error) {
      res.status(400).json({ mensaje: error.message });
    } else {
      res.status(400).json({ mensaje: "Error inesperado", detalle: error });
    }
  }
};

export const cancelarPedido = async (
  req: Request,
  res: Response
): Promise<void> => {
  const id = Number(req.params.id);

  if (!id || isNaN(id)) {
    res.status(400).json({ message: "ID inválido" });
    return;
  }

  try {
    await pedidoService.cancelarPedido(id);
    res.json({ message: "Pedido cancelado correctamente" });
  } catch (error) {
    if (error instanceof Error) {
      console.error("ERROR en cancelarPedido:", error);
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: "Error desconocido" });
    }
  }
};

export const getPedidoPorId = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { pedidoId } = req.params;
    const pedido = await pedidoService.obtenerPedidoPorId(Number(pedidoId));
    if (!pedido) {
      res.status(404).json({ message: "Pedido no encontrado" });
      return;
    }
    res.status(200).json(pedido);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: "Error desconocido" });
    }
  }
};

export const iniciarEdicionPedido = async (req: Request,res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (!id || isNaN(Number(id))) {
      res.status(400).json({ mensaje: "ID inválido" });
      return;
    }

    // Setea estadoEdicion en true y fechaEdicion en NOW()
    await pedidoService.iniciarEdicionPedido(Number(id));
    // Trae el pedido actualizado
    const pedido = await pedidoService.obtenerPedidoPorId(Number(id));

    res.status(200).json(pedido);
  } catch (error) {
    console.error("ERROR en iniciarEdicionPedido:", error);
    if (error instanceof Error) {
      res.status(400).json({ mensaje: error.message });
    } else {
      res.status(400).json({ mensaje: "Error inesperado", detalle: error });
    }
  }
};

export const finalizarEdicionPedido = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    if (!id || isNaN(Number(id))) {
      res.status(400).json({ mensaje: "ID inválido" });
      return;
    }

    // Setea estadoEdicion en false y fechaEdicion en null
    await pedidoService.actualizarEstadoEdicion(Number(id), false, null);
    const pedido = await pedidoService.obtenerPedidoPorId(Number(id));

    res.status(200).json(pedido);
  } catch (error) {
    console.error("ERROR en finalizarEdicionPedido:", error);
    if (error instanceof Error) {
      res.status(400).json({ mensaje: error.message });
    } else {
      res.status(400).json({ mensaje: "Error inesperado", detalle: error });
    }
  }
};

export const duplicarPedidoACarrito = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const pedidoId = Number(req.params.pedidoId);
    // Recuperá el clienteId desde el body o mejor, del token si usás auth
    const { clienteId } = req.body;
    if (!clienteId) {
      res
        .status(400)
        .json({ message: "Falta el clienteId para duplicar el pedido" });
      return;
    }

    const resultado = await pedidoService.duplicarPedidoACarrito(
      pedidoId,
      clienteId
    );

    // resultado puede tener un formato tipo:
    // { carritoId, productosAgregados, productosSinStock: [{ productoId, motivo }] }
    res.status(201).json(resultado);
  } catch (error: any) {
    res
      .status(500)
      .json({
        message: error instanceof Error ? error.message : "Error desconocido",
      });
  }
};

export const confirmarEdicionPedido = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    // destructurá los campos del body
    const {
      carritoId,
      direccion,
      localidad,
      provincia,
      codigoPostal,
      formaEnvio,
      transporte,
      formaPago,
    } = req.body;

    if (!id || isNaN(Number(id))) {
      res.status(400).json({ mensaje: 'ID de pedido inválido' });
      return;
    }
    if (!carritoId || isNaN(Number(carritoId))) {
      res.status(400).json({ mensaje: 'carritoId inválido' });
      return;
    }

    await pedidoService.confirmarEdicionPedido(Number(id), {
      carritoId: Number(carritoId),
      direccion,
      localidad,
      provincia,
      codigoPostal,
      formaEnvio,
      transporte,
      formaPago,
    });

    res.status(200).json({ mensaje: "Pedido actualizado correctamente" });
  } catch (error) {
    console.error("ERROR en confirmarEdicionPedido:", error);
    if (error instanceof Error) {
      res.status(500).json({ mensaje: error.message });
    } else {
      res.status(500).json({ mensaje: 'Error inesperado', detalle: error });
    }
  }
};
