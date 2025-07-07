
import { models } from '@/config/db';
import { Op } from 'sequelize';

interface AuditoriaData {
  usuarioId: number;
  moduloId: number;
  accion: string;
  recursoId?: number | null;
  datosAntes?: object | null;
  datosDespues?: object | null;
  extraData?: object | null;
}


export async function registrarAuditoria({
  usuarioId,
  moduloId,
  accion,
  recursoId = null,
  datosAntes = null,
  datosDespues = null,
  extraData = null
}: AuditoriaData) {
  return await models.Auditoria.create({
    usuarioId,
    moduloId,
    accion,
    recursoId,
    datosAntes,
    datosDespues,
    extraData
  });
}

export async function listarAuditorias({ search = '', limit = 20, offset = 0 }) {
  return await models.Auditoria.findAndCountAll({
    include: [
      { model: models.UsuarioAdmin, attributes: ['id', 'nombre', 'email'] },
      { model: models.Modulo, attributes: ['id', 'nombre'] }
    ],
    where: search
      ? {
          [Op.or]: [
            { accion: { [Op.iLike]: `%${search}%` } },
            { '$UsuarioAdmin.nombre$': { [Op.iLike]: `%${search}%` } },
            { '$Modulo.nombre$': { [Op.iLike]: `%${search}%` } }
          ]
        }
      : undefined,
    order: [['createdAt', 'DESC']],
    limit,
    offset
  });
}
