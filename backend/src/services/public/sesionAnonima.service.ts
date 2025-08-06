import { SesionAnonima } from '@/models/SesionAnonima';
import { Carrito } from '@/models/Carrito';
import { Op } from 'sequelize';
import { mergearCarritosClienteYAnonimo } from '@/utils/mergeCarritos';

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
  // 1. Actualizar la sesión anónima
  const sesion = await SesionAnonima.findByPk(sesionId);
  if (!sesion) throw new Error('Sesión no encontrada');
  await sesion.update({ clienteId });

  // 2. Actualizar todos los carritos anónimos activos de esta sesión (sin cliente) a ese cliente
  await Carrito.update(
    { clienteId },
    {
      where: {
        sesionAnonimaId: sesionId,
        clienteId: { [Op.is]: null },
        estadoEdicion: 1 // activo
      }
    }
  );

  // 3. Merge si el cliente ya tenía carrito activo
  const resultadoMerge = await mergearCarritosClienteYAnonimo(clienteId, sesionId);

  return resultadoMerge;
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