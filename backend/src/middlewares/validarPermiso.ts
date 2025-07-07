import { Request, Response, NextFunction } from 'express';
import { models } from '@/config/db';
import { AuthenticatedRequest } from './validarToken';

export function validarPermiso(nombreModulo: string, accion: string) {
  return async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const rolUsuarioId = req.usuario?.rolUsuarioId;

    if (!rolUsuarioId) {
      return res.status(403).json({ mensaje: 'Acceso denegado: sin rol' });
    }

    // Buscar el permiso correspondiente al módulo + acción
    const permiso = await models.Permiso.findOne({
      where: { accion },
      include: [
        {
          model: models.Modulo,
          as: 'modulo',
          where: { nombre: nombreModulo }
        }
      ]
    });

    if (!permiso) {
      return res.status(403).json({ mensaje: 'Permiso no encontrado' });
    }

    // Buscar si ese rol tiene asociado ese permiso
    const tienePermiso = await models.RolPermiso.findOne({
      where: {
        rolUsuarioId,
        permisoId: permiso.id
      }
    });

    if (!tienePermiso) {
      return res.status(403).json({ mensaje: 'No tiene permiso para esta acción' });
    }

    next();
  };
}
