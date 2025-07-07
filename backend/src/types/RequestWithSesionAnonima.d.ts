import { Request } from 'express';

export interface RequestWithSesionAnonima extends Request {
  sesionAnonimaId?: string;
}
