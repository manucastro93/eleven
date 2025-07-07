import { sequelize } from '@/config/db';
import { QueryTypes } from 'sequelize';

export async function terminosMasBuscados(limit: number = 10): Promise<any[]> {
  return sequelize.query(
    `SELECT texto, COUNT(*) AS cantidad
     FROM logs_sesion
     WHERE tipo = 'busqueda'
     GROUP BY texto
     ORDER BY cantidad DESC
     LIMIT :limit`,
    {
      replacements: { limit },
      type: QueryTypes.SELECT
    }
  );
}

export async function productosMasCliqueados(limit: number = 10): Promise<any[]> {
  return sequelize.query(
    `SELECT texto AS producto, COUNT(*) AS clics
     FROM logs_sesion
     WHERE tipo = 'click-producto'
     GROUP BY texto
     ORDER BY clics DESC
     LIMIT :limit`,
    {
      replacements: { limit },
      type: QueryTypes.SELECT
    }
  );
}

export async function categoriasMasNavegadas(limit: number = 10): Promise<any[]> {
  return sequelize.query(
    `SELECT texto AS categoria, COUNT(*) AS visitas
     FROM logs_sesion
     WHERE tipo = 'ver-categoria'
     GROUP BY texto
     ORDER BY visitas DESC
     LIMIT :limit`,
    {
      replacements: { limit },
      type: QueryTypes.SELECT
    }
  );
}

export async function paginasMasVisitadas(limit: number = 10): Promise<any[]> {
  return sequelize.query(
    `SELECT texto AS ruta, COUNT(*) AS visitas
     FROM logs_sesion
     WHERE tipo = 'visita'
     GROUP BY texto
     ORDER BY visitas DESC
     LIMIT :limit`,
    {
      replacements: { limit },
      type: QueryTypes.SELECT
    }
  );
}
