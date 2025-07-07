import { sequelize } from '@/config/db';
import { QueryTypes } from 'sequelize';

export async function resumenMensualComparativo() {
  return await sequelize.query(
    `SELECT
      EXTRACT(MONTH FROM p."createdAt") AS mes,
      EXTRACT(YEAR FROM p."createdAt") AS anio,
      COUNT(p.id) AS pedidos,
      SUM(pp.cantidad) AS productos,
      SUM(pp.cantidad * pr.precio) AS total
    FROM pedidos p
    JOIN pedido_productos pp ON pp.pedidoId = p.id
    JOIN productos pr ON pr.id = pp.productoId
    WHERE p."createdAt" >= date_trunc('month', CURRENT_DATE - INTERVAL '1 month')
    GROUP BY mes, anio
    ORDER BY anio DESC, mes DESC
    LIMIT 2`,
    { type: QueryTypes.SELECT }
  );
}

export async function ventasPorDia(fechaInicio: string, fechaFin: string) {
  return await sequelize.query(
    `SELECT
      DATE(p."createdAt") AS fecha,
      COUNT(p.id) AS pedidos,
      SUM(pp.cantidad) AS productos,
      SUM(pp.cantidad * pr.precio) AS total
    FROM pedidos p
    JOIN pedido_productos pp ON pp.pedidoId = p.id
    JOIN productos pr ON pr.id = pp.productoId
    WHERE p."createdAt" BETWEEN :fechaInicio AND :fechaFin
    GROUP BY fecha
    ORDER BY fecha`,
    {
      replacements: { fechaInicio, fechaFin },
      type: QueryTypes.SELECT
    }
  );
}

export async function topProductosPorValor(limit = 5) {
  return await sequelize.query(
    `SELECT p.nombre, SUM(pp.cantidad * p.precio) AS total
     FROM pedido_productos pp
     JOIN productos p ON p.id = pp.productoId
     GROUP BY p.id
     ORDER BY total DESC
     LIMIT :limit`,
    {
      replacements: { limit },
      type: QueryTypes.SELECT
    }
  );
}

export async function topClientesPorValor(limit = 5) {
  return await sequelize.query(
    `SELECT c.razonSocial, SUM(pp.cantidad * pr.precio) AS total
     FROM pedidos p
     JOIN clientes c ON c.id = p.clienteId
     JOIN pedido_productos pp ON pp.pedidoId = p.id
     JOIN productos pr ON pr.id = pp.productoId
     GROUP BY c.id
     ORDER BY total DESC
     LIMIT :limit`,
    {
      replacements: { limit },
      type: QueryTypes.SELECT
    }
  );
}