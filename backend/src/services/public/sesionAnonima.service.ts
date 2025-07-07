import { SesionAnonima } from '@/models/SesionAnonima';

export async function crearSesionAnonima(id: string, ip: string, userAgent: string, expiracion: Date) {
  return SesionAnonima.create({
    id,
    ip,
    userAgent,
    fecha: new Date(),
    expiracion
  });
}

export async function vincularSesionConCliente(sesionId: string, clienteId: number) {
  const sesion = await SesionAnonima.findByPk(sesionId);
  if (!sesion) throw new Error('Sesión no encontrada');
  return sesion.update({ clienteId });
}

export async function obtenerSesionPorId(sesionId: string) {
  return SesionAnonima.findByPk(sesionId);
}

export async function listarSesionesDeCliente(clienteId: number) {
  return SesionAnonima.findAll({
    where: { clienteId },
    order: [['fecha', 'DESC']]
  });
}