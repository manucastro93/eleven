
import { models } from '@/config/db';

export async function listarModulos() {
  return await models.Modulo.findAll({
    order: [['nombre', 'ASC']]
  });
}
