import { Request, Response } from 'express';
import { enviarCodigoVerificacion, verificarCodigo } from '@/workflows/validacionWhatsapp.workflow';

export async function enviarCodigo(req: Request, res: Response) {
  try {
    const { numero } = req.body;
    if (!numero || typeof numero !== 'string') {
      return res.status(400).json({ error: 'Número inválido' });
    }

    await enviarCodigoVerificacion(numero);
    res.json({ success: true });
  } catch (err) {
    console.error('[enviarCodigo]', err);
    res.status(500).json({ error: 'Error al enviar el código' });
  }
}

export async function validarCodigo(req: Request, res: Response) {
  try {
    const { numero, codigo } = req.body;
    if (!numero || !codigo) {
      return res.status(400).json({ error: 'Número y código requeridos' });
    }

    const ok = await verificarCodigo(numero, codigo);
    if (!ok) return res.status(401).json({ success: false, error: 'Código inválido o expirado' });

    res.json({ success: true });
  } catch (err) {
    console.error('[validarCodigo]', err);
    res.status(500).json({ error: 'Error al verificar código' });
  }
}
