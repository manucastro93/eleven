
import { models } from '@/config/db';

export async function listarMetodosPago() {
  return await models.MetodoPago.findAll({
    order: [['nombre', 'ASC']]
  });
}
