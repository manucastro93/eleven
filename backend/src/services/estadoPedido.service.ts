
import { models } from '@/config/db';

export async function listarEstadosPedido() {
  return await models.EstadoPedido.findAll({
    order: [['orden', 'ASC']]
  });
}

export async function obtenerEstadoPorNombre(nombre: string) {
  const estado = await models.EstadoPedido.findOne({ where: { nombre } });
  if (!estado) throw new Error(`EstadoPedido "${nombre}" no encontrado.`);
  return estado;
}
