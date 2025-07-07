
import { models } from '@/config/db';

export async function listarHistorialCliente(clienteId: number) {
  return await models.HistorialCliente.findAll({
    where: { clienteId },
    include: [
      { model: models.IP, attributes: ['id', 'direccion'] },
      { model: models.UsuarioAdmin, attributes: ['id', 'nombre', 'email'] }
    ],
    order: [['createdAt', 'DESC']]
  });
}
