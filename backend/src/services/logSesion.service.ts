import { models } from '@/config/db';
import { Op } from 'sequelize';

interface FiltroLog {
  sesionAnonimaId?: string;
  tipo?: string;
  desde?: string;
  hasta?: string;
  limit?: number;
  offset?: number;
}

interface LogSesionData {
  sesionAnonimaId: string;
  url: string;
  accion: string;
  tiempoEnPagina: number;
  timestamp: Date;
  referrer: string;
  extraData?: object | null;
}

export async function listarLogs({
  sesionAnonimaId,
  tipo,
  desde,
  hasta,
  limit = 20,
  offset = 0
}: FiltroLog) {
  const where: any = {};

  if (sesionAnonimaId) where.sesionAnonimaId = sesionAnonimaId;
  if (tipo) where.accion = tipo;
  if (desde || hasta) {
    where.timestamp = {};
    if (desde) where.timestamp[Op.gte] = new Date(desde);
    if (hasta) where.timestamp[Op.lte] = new Date(hasta);
  }

  return models.LogSesion.findAndCountAll({
    where,
    limit,
    offset,
    order: [['timestamp', 'DESC']],
    include: [{ model: models.SesionAnonima, as: 'sesion' }]
  });
}

export async function registrarLogSesion(data: LogSesionData) {
  return await models.LogSesion.create(data);
}

export async function obtenerLogsPorSesion(sesionAnonimaId: string) {
  return await models.LogSesion.findAll({
    where: { sesionAnonimaId },
    order: [['timestamp', 'ASC']]
  });
}

export async function registrarLogsSesionMasivo(logs: LogSesionData[]) {
  if (!logs.length) return [];
  return await models.LogSesion.bulkCreate(logs, {
    validate: true,
    returning: true 
  });
}