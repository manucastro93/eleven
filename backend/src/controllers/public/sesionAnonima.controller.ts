import { Request, Response } from 'express';
import { crearSesionAnonima, vincularSesionConCliente, obtenerSesionPorId } from '@/services/public/sesionAnonima.service';
import { v4 as uuidv4 } from 'uuid';

export async function getSesionActual(req: Request, res: Response) {
  const sesionId = req.cookies.clienteAnonimoId;
  if (!sesionId) return res.status(404).json({ mensaje: 'Sesión no encontrada' });

  try {
    const sesion = await obtenerSesionPorId(sesionId);
    if (!sesion) return res.status(404).json({ mensaje: 'Sesión no registrada' });
    res.json(sesion);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener sesión', error });
  }
}

export async function postVincularSesion(req: Request, res: Response) {
  const sesionId = req.cookies.clienteAnonimoId;
  const { clienteId } = req.body;

  if (!sesionId || !clienteId) {
    return res.status(400).json({ mensaje: 'Faltan datos requeridos' });
  }

  try {
    await vincularSesionConCliente(sesionId, clienteId);
    res.json({ mensaje: 'Sesión vinculada correctamente' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al vincular sesión', error });
  }
}

export async function postCrearSesionAnonima(req: Request, res: Response) {
  const id = uuidv4();
  const ip = req.ip;
  const userAgent = req.headers['user-agent'] || '';
  const expiracion = new Date(Date.now() + 1000 * 60 * 60 * 24); // 1 día

  try {
    if (!req.ip) return res.status(400).json({ mensaje: 'No se pudo obtener IP' });
    const ip = req.ip;

    const sesion = await crearSesionAnonima(id, ip, userAgent, expiracion);
    res.cookie('clienteAnonimoId', id, {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 24,
    });
    res.json({ id: sesion.id, uuid: id });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al crear sesión', error });
  }
}