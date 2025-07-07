import { Request, Response } from 'express';
import { Op } from 'sequelize';
import { models } from '@/config/db';

export const obtenerTiemposPromedioPorEstado = async (req: Request, res: Response) => {
  try {
    const historial = await models.HistorialEstadoPedido.findAll({
      attributes: ['pedidoId', 'estadoPedidoId', 'fechaHoraCambio'],
      order: [['pedidoId', 'ASC'], ['fechaHoraCambio', 'ASC']]
    });

    const estados = {
      pendiente: 1,
      confirmado: 2,
      preparando: 3,
      enviado: 4
    };

    const diferencias: { [key: string]: number[] } = {
      pendiente_a_confirmado: [],
      confirmado_a_preparando: [],
      preparando_a_enviado: []
    };

    const historialPorPedido: { [key: number]: any[] } = {};

    for (const h of historial) {
      if (!historialPorPedido[h.pedidoId]) historialPorPedido[h.pedidoId] = [];
      historialPorPedido[h.pedidoId].push(h);
    }

    for (const pedidoId in historialPorPedido) {
      const estadosPedido = historialPorPedido[pedidoId];
      const getFecha = (estadoId: number) => estadosPedido.find(e => e.estadoPedidoId === estadoId)?.fechaHoraCambio;

      const f1 = getFecha(estados.pendiente);
      const f2 = getFecha(estados.confirmado);
      const f3 = getFecha(estados.preparando);
      const f4 = getFecha(estados.enviado);

      if (f1 && f2) diferencias.pendiente_a_confirmado.push((+new Date(f2) - +new Date(f1)));
      if (f2 && f3) diferencias.confirmado_a_preparando.push((+new Date(f3) - +new Date(f2)));
      if (f3 && f4) diferencias.preparando_a_enviado.push((+new Date(f4) - +new Date(f3)));
    }

    const promedioMs = (arr: number[]) => arr.length ? Math.floor(arr.reduce((a, b) => a + b) / arr.length) : null;
    const formatear = (ms: number | null) => {
      if (!ms) return '-';
      const totalMin = Math.floor(ms / 60000);
      const h = Math.floor(totalMin / 60);
      const m = totalMin % 60;
      return `${h}h ${m}min`;
    };

    res.json({
      pendiente_a_confirmado: formatear(promedioMs(diferencias.pendiente_a_confirmado)),
      confirmado_a_preparando: formatear(promedioMs(diferencias.confirmado_a_preparando)),
      preparando_a_enviado: formatear(promedioMs(diferencias.preparando_a_enviado))
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al calcular tiempos promedio' });
  }
};
