
import { Request, Response } from 'express';
import * as usuarioService from '@/services/usuarioAdmin.service';

export async function postUsuarioAdmin(req: Request, res: Response) {
  try {
    const usuario = await usuarioService.crearUsuarioAdmin(req.body);
    res.status(201).json(usuario);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ mensaje: error.message });
    } else {
      res.status(400).json({ mensaje: 'Error inesperado', detalle: error });
    }
  }
}

export async function putUsuarioAdmin(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    const actualizado = await usuarioService.actualizarUsuarioAdmin(id, req.body);
    res.json(actualizado);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ mensaje: error.message });
    } else {
      res.status(400).json({ mensaje: 'Error inesperado', detalle: error });
    }
  }
}

export async function putDefinirPassword(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    const { nuevaPassword } = req.body;
    const actualizado = await usuarioService.definirPassword(id, nuevaPassword);
    res.json(actualizado);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ mensaje: error.message });
    } else {
      res.status(400).json({ mensaje: 'Error inesperado', detalle: error });
    }
  }
}

export async function getUsuariosAdmin(req: Request, res: Response) {
  try {
    const { search = '', limit = 20, offset = 0 } = req.query;
    const resultado = await usuarioService.listarUsuariosAdmin({
      search: String(search),
      limit: Number(limit),
      offset: Number(offset)
    });
    res.json(resultado);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ mensaje: error.message });
    } else {
      res.status(400).json({ mensaje: 'Error inesperado', detalle: error });
    }
  }
}

export async function getUsuarioAdminPorId(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    const usuario = await usuarioService.obtenerUsuarioAdminPorId(id);
    res.json(usuario);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ mensaje: error.message });
    } else {
      res.status(400).json({ mensaje: 'Error inesperado', detalle: error });
    }
  }
}

export async function deleteUsuarioAdmin(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    await usuarioService.desactivarUsuarioAdmin(id);
    res.status(204).send();
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ mensaje: error.message });
    } else {
      res.status(400).json({ mensaje: 'Error inesperado', detalle: error });
    }
  }
}
