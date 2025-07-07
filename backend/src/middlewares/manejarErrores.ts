
import { Request, Response, NextFunction } from 'express';

export function manejarErrores(err: any, req: Request, res: Response, next: NextFunction) {
  console.error(err);

  const status = err.status || 500;
  const mensaje = err.message || 'Error interno del servidor';

  res.status(status).json({ mensaje });
}
