import { sequelize } from '@/config/db';
import { QueryTypes } from 'sequelize';

export async function promediosGenerales(): Promise<any[]> {
  return sequelize.query(
    `SELECT
      ROUND(COUNT(*) / 30.0, 2) AS promedio_diario,
      ROUND(COUNT(*) / 4.0, 2) AS promedio_semanal,
      COUNT(*) AS promedio_mensual
     FROM pedidos
     WHERE createdAt >= NOW() - INTERVAL 30 DAY`,
    { type: QueryTypes.SELECT }
  );
}

export async function promediosPorProducto(productoId: number): Promise<any[]> {
  return sequelize.query(
    `SELECT
      ROUND(SUM(pp.cantidad)/30.0, 2) AS promedio_diario,
      ROUND(SUM(pp.cantidad)/4.0, 2) AS promedio_semanal,
      SUM(pp.cantidad) AS promedio_mensual
     FROM pedido_productos pp
     JOIN pedidos p ON p.id = pp.pedidoId
     WHERE pp.productoId = :productoId AND p.createdAt >= NOW() - INTERVAL 30 DAY`,
    { replacements: { productoId }, type: QueryTypes.SELECT }
  );
}

export async function promediosPorCliente(clienteId: number): Promise<any[]> {
  return sequelize.query(
    `SELECT
      ROUND(COUNT(*) / 30.0, 2) AS promedio_diario,
      ROUND(COUNT(*) / 4.0, 2) AS promedio_semanal,
      COUNT(*) AS promedio_mensual
     FROM pedidos
     WHERE clienteId = :clienteId AND createdAt >= NOW() - INTERVAL 30 DAY`,
    { replacements: { clienteId }, type: QueryTypes.SELECT }
  );
}

export async function promediosPorCategoria(categoriaId: number): Promise<any[]> {
  return sequelize.query(
    `SELECT
      ROUND(SUM(pp.cantidad)/30.0, 2) AS promedio_diario,
      ROUND(SUM(pp.cantidad)/4.0, 2) AS promedio_semanal,
      SUM(pp.cantidad) AS promedio_mensual
     FROM pedido_productos pp
     JOIN pedidos p ON p.id = pp.pedidoId
     JOIN productos pr ON pr.id = pp.productoId
     JOIN producto_categorias pc ON pc.productoId = pr.id
     WHERE pc.categoriaId = :categoriaId AND p.createdAt >= NOW() - INTERVAL 30 DAY`,
    { replacements: { categoriaId }, type: QueryTypes.SELECT }
  );
}
