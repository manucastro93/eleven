import { Request, Response } from 'express';
import * as clienteService from '@/services/cliente.service';

export async function getClientes(req: Request, res: Response) {
  try {
    const {
      search = '',
      limit = 20,
      offset = 0,
      provincia,
      localidad
    } = req.query;

    const result = await clienteService.listarClientes({
      search: String(search),
      limit: Number(limit),
      offset: Number(offset),
      provincia: provincia ? String(provincia) : undefined,
      localidad: localidad ? String(localidad) : undefined
    });

    res.json(result);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ mensaje: error.message });
    } else {
      res.status(400).json({ mensaje: 'Error inesperado', detalle: error });
    }
  }
}

export async function getClientePorId(req: Request, res: Response) {
  const id = Number(req.params.id);
  try {
    const cliente = await clienteService.obtenerClientePorId(id);
    if (!cliente) return res.status(404).json({ mensaje: 'Cliente no encontrado' });
    res.json(cliente);
  } catch (error) {
    res.status(400).json({ mensaje: error instanceof Error ? error.message : 'Error inesperado' });
  }
}

export async function putClienteDesdeAdmin(req: Request, res: Response) {
  const id = Number(req.params.id);
  try {
    const actualizado = await clienteService.actualizarClienteDesdeAdmin(id, req.body);
    res.json(actualizado);
  } catch (error) {
    res.status(400).json({ mensaje: error instanceof Error ? error.message : 'Error inesperado' });
  }
}

export async function postCliente(req: Request, res: Response) {
  try {
    const cliente = await clienteService.crearClienteDesdeFormulario(req.body);
    res.status(201).json(cliente);
  } catch (error: any) {
    console.error('Error al crear cliente:', error);
    res.status(400).json({ mensaje: error.message || 'Error al crear cliente' });
  }
}

export async function getClientePorCuit(req: Request, res: Response) {
  const cuitOCuil = req.params.cuitOCuil;
  try {
    const cliente = await clienteService.buscarClientePorCuit(cuitOCuil);
    if (!cliente) {
      return res.status(404).json({ mensaje: 'Cliente no encontrado' });
    }
    res.json(cliente);
  } catch (error) {
    console.error('Error al buscar cliente:', error);
    res.status(500).json({ mensaje: 'Error al buscar cliente' });
  }
}