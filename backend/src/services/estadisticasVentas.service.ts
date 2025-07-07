import { sequelize } from '@/config/db';
import { QueryTypes } from 'sequelize';

export async function topProductosVendidos(limit: number = 5): Promise<any[]> {
  return sequelize.query(
    `SELECT p.nombre, COUNT(pp.productoId) AS cantidad
     FROM pedido_productos pp
     JOIN productos p ON p.id = pp.productoId
     GROUP BY p.id
     ORDER BY cantidad DESC
     LIMIT :limit`,
    {
      replacements: { limit },
      type: QueryTypes.SELECT
    }
  );
}

export async function topCategoriasVendidas(limit: number = 5): Promise<any[]> {
  return sequelize.query(
    `SELECT c.nombre, COUNT(pp.productoId) AS cantidad
     FROM pedido_productos pp
     JOIN productos p ON p.id = pp.productoId
     JOIN producto_categorias pc ON pc.productoId = p.id
     JOIN categorias c ON c.id = pc.categoriaId
     GROUP BY c.id
     ORDER BY cantidad DESC
     LIMIT :limit`,
    {
      replacements: { limit },
      type: QueryTypes.SELECT
    }
  );
}

export async function topClientes(limit: number = 5): Promise<any[]> {
  return sequelize.query(
    `SELECT c.razonSocial, COUNT(p.id) AS pedidos, SUM(pp.cantidad) AS productos
     FROM pedidos p
     JOIN clientes c ON c.id = p.clienteId
     JOIN pedido_productos pp ON pp.pedidoId = p.id
     GROUP BY c.id
     ORDER BY pedidos DESC
     LIMIT :limit`,
    {
      replacements: { limit },
      type: QueryTypes.SELECT
    }
  );
}

export async function ventasPorLocalidad(): Promise<any[]> {
  return sequelize.query(
    `SELECT l.nombre AS localidad, COUNT(p.id) AS pedidos
     FROM pedidos p
     JOIN clientes c ON c.id = p.clienteId
     JOIN localidades l ON l.id = c.localidadId
     GROUP BY l.nombre
     ORDER BY pedidos DESC`,
    {
      type: QueryTypes.SELECT
    }
  );
}

export async function ventasPorProvincia(): Promise<any[]> {
  return sequelize.query(
    `SELECT pr.nombre AS provincia, COUNT(p.id) AS pedidos
     FROM pedidos p
     JOIN clientes c ON c.id = p.clienteId
     JOIN localidades l ON l.id = c.localidadId
     JOIN provincias pr ON pr.id = l.provinciaId
     GROUP BY pr.nombre
     ORDER BY pedidos DESC`,
    {
      type: QueryTypes.SELECT
    }
  );
}
