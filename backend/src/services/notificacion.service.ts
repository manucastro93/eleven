
import { models } from '@/config/db';

export async function crearNotificacion(titulo: string, mensaje: string, usuarioId?: number) {
  return await models.Notificacion.create({ titulo, mensaje, usuarioId });
}

export async function listarNotificaciones(usuarioId: number) {
  return await models.Notificacion.findAll({
    where: { usuarioId },
    order: [['createdAt', 'DESC']]
  });
}

export async function marcarComoLeida(id: number) {
  const noti = await models.Notificacion.findByPk(id);
  if (!noti) throw new Error('Notificación no encontrada');
  noti.leida = true;
  await noti.save();
  return noti;
}
