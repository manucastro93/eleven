import { Request, Response } from 'express';
import * as pedidoService from '@/services/public/pedido.service';

export const getPedidosPorIdCliente = async (req: Request, res: Response): Promise<void> => {
  try {
    const { clienteId } = req.params;

    if (!clienteId || isNaN(Number(clienteId))) {
      res.status(400).json({ mensaje: 'clienteId inválido' });
      return;
    }

    const pedidos = await pedidoService.listarPedidosPorCliente(Number(clienteId));

    res.json(pedidos);
  } catch (error) {
    console.error("ERROR en getPedidosPorIdCliente:", error);
    if (error instanceof Error) {
      res.status(400).json({ mensaje: error.message });
    } else {
      res.status(400).json({ mensaje: 'Error inesperado', detalle: error });
    }
  }
};

export const cancelarPedido = async (req: Request, res: Response): Promise<void> => {
  const id = Number(req.params.id);

  if (!id || isNaN(id)) {
    res.status(400).json({ message: 'ID inválido' });
    return;
  }

  try {
    await pedidoService.cancelarPedido(id);
    res.json({ message: 'Pedido cancelado correctamente' });
  } catch (error) {
    if (error instanceof Error) {
        console.error("ERROR en cancelarPedido:", error);
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Error desconocido' });
    }
  }
};
