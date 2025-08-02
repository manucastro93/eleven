import { models } from '@/config/db';
import { Op } from 'sequelize';

export async function buscarDirecciones(localidadId: number, query: string) {
  /*return await models.Direccion.findAll({
    where: {
      localidadId,
      nombre: {
        [Op.like]: `%${query}%`
      }
    },
    limit: 10,
    order: [['nombre', 'ASC']]
  });*/
}