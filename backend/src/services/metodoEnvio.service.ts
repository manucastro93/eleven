
import { models } from '@/config/db';

export async function listarMetodosEnvio() {
  return await models.MetodoEnvio.findAll({
    order: [['nombre', 'ASC']]
  });
}
