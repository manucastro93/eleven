
import { models } from '@/config/db';
import { Op } from 'sequelize';

interface ListarIPsParams {
  search?: string;
  limit?: number;
  offset?: number;
}

export async function listarIPs({ search = '', limit = 20, offset = 0 }: ListarIPsParams) {
  return models.IP.findAndCountAll({
    where: search
      ? {
          direccion: {
            [Op.like]: `%${search}%`
          }
        }
      : undefined,
    include: [{ model: models.Cliente, as: 'cliente' }],
    limit,
    offset,
    order: [['createdAt', 'DESC']]
  });
}

export async function obtenerIPPorId(id: number) {
  const ip = await models.IP.findByPk(id);
  if (!ip) throw new Error('IP no encontrada.');
  return ip;
}

export async function asociarClienteAIP(ipId: number, clienteId: number) {
  const ip = await models.IP.findByPk(ipId);
  if (!ip) throw new Error('IP no encontrada.');

  ip.clienteId = clienteId;
  await ip.save();
  return ip;
}
