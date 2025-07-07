import { Request, Response } from 'express';
import { models } from '@/config/db';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import * as permisoService from '@/services/permiso.service';

const SECRET = process.env.JWT_SECRET || 'secreto';
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'refresh';

export async function login(req: Request, res: Response) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ mensaje: 'Email y contraseña requeridos' });
  }

  const usuario = await models.UsuarioAdmin.findOne({ where: { email, activo: true } });
  if (!usuario) {
    return res.status(401).json({ mensaje: 'Credenciales inválidas' });
  }

  if (!usuario.passwordHash) {
    return res.status(403).json({ mensaje: 'El usuario aún no definió su contraseña' });
  }

  const esValido = await bcrypt.compare(password, usuario.passwordHash);
  if (!esValido) {
    return res.status(401).json({ mensaje: 'Credenciales inválidas' });
  }

  const accessToken = jwt.sign(
    { id: usuario.id, email: usuario.email, rolUsuarioId: usuario.rolUsuarioId },
    SECRET,
    { expiresIn: '15m' }
  );

  const refreshToken = jwt.sign(
    { id: usuario.id },
    REFRESH_SECRET,
    { expiresIn: '7d' }
  );

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: false, // usá false solo en desarrollo sin https
    sameSite: "lax", // o "none" si vas a usar https
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  const permisos = await permisoService.listarPermisosPorRol(usuario.rolUsuarioId);
  
  res.json({
    usuario: {
      id: usuario.id,
      email: usuario.email,
      nombre: usuario.nombre,
      rol: usuario.rolUsuarioId,
    },
    accessToken,
    permisos
  });
}

export async function refreshToken(req: Request, res: Response) {
  const token = req.cookies?.refreshToken;
  if (!token) {
    return res.status(401).json({ mensaje: 'No se encontró refreshToken' });
  }

  try {
    const payload: any = jwt.verify(token, REFRESH_SECRET);

    const usuario = await models.UsuarioAdmin.findByPk(payload.id);

    if (!usuario || !usuario.activo) {
      return res.status(403).json({ mensaje: 'Usuario inválido' });
    }

    const accessToken = jwt.sign(
      { id: usuario.id, email: usuario.email, rolUsuarioId: usuario.rolUsuarioId },
      SECRET,
      { expiresIn: '15m' }
    );

    // 🚀 Traemos también los permisos
    const permisos = await permisoService.listarPermisosPorRol(usuario.rolUsuarioId);

    res.json({
      usuario: {
        id: usuario!.id,
        email: usuario!.email,
        nombre: usuario!.nombre,
        rol: usuario!.rolUsuarioId,
      },
      accessToken,
      permisos
    });
  } catch (err) {
    return res.status(403).json({ mensaje: 'Refresh token inválido' });
  }
}

export async function logout(req: Request, res: Response) {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    sameSite: "lax", // tiene que ser igual que el seteo original
    secure: false, // usar true en producción con https
  });

   res.sendStatus(204);
}

