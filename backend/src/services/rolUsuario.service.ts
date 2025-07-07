
import { models } from '@/config/db';

export async function listarRolesUsuario() {
  return await models.RolUsuario.findAll({
    order: [['nombre', 'ASC']]
  });
}
