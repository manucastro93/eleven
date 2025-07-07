import { v4 as uuidv4 } from 'uuid';
import { Response, NextFunction } from 'express';
import { crearSesionAnonima } from '@/services/public/sesionAnonima.service';

import { RequestWithSesionAnonima } from '@/types/RequestWithSesionAnonima';

export const manejarSesionAnonima = async (
  req: RequestWithSesionAnonima,
  res: Response,
  next: NextFunction
) => {
  console.log('✅ Middleware manejarSesionAnonima ejecutado');

  let sesionId = req.cookies.clienteAnonimoId;

  if (!sesionId) {
    sesionId = uuidv4();
    const expiracion = new Date();
    expiracion.setHours(23, 59, 59, 999);

    res.cookie('clienteAnonimoId', sesionId, {
      httpOnly: false,
      expires: expiracion,
    });

    await crearSesionAnonima(
      sesionId,
      req.ip ?? '0.0.0.0',
      req.headers['user-agent'] ?? '',
      expiracion
    );
  }

  req.sesionAnonimaId = sesionId;
  next();
};
