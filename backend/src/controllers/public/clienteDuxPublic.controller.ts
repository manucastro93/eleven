// src/controllers/public/clientesDuxPublic.controller.ts
import { Request, Response } from 'express';
import * as clientesDuxPublicService from "@/services/public/clienteDuxPublic.service";

export async function buscarClientePorCuit(req: Request, res: Response) {
  try {
    const cuit = req.query.cuit?.toString();
    if (!cuit) return res.status(400).json({ mensaje: "Falta el parámetro CUIT." });

    const cliente = await clientesDuxPublicService.buscarClientePorCuit(cuit);

    if (cliente) {
      return res.json({
        encontrado: true,
        cliente
      });
    } else {
      return res.json({ encontrado: false });
    }
  } catch (error) {
    console.error('Error al buscar ClienteDux', error);
    res.status(500).json({ mensaje: 'Error al buscar ClienteDux' });
  }
}
