import { Request, Response, NextFunction } from 'express';
import { models } from '@/config/db';
import { registrarAuditoria } from '@/services/auditoria.service';
import { AuthenticatedRequest } from './validarToken';
import type { ModelStatic, Model } from 'sequelize';

// Mapa de modelos conocidos, con tipado seguro
const modelsMap: Record<string, ModelStatic<Model>> = {
  Cliente: models.Cliente,
  Provincia: models.Provincia,
  Localidad: models.Localidad,
  Direccion: models.Direccion,
  Producto: models.Producto,
  ImagenProducto: models.ImagenProducto,
  Categoria: models.Categoria,
  ProductoCategoria: models.ProductoCategoria,
  EstadoPedido: models.EstadoPedido,
  MetodoEnvio: models.MetodoEnvio,
  MetodoPago: models.MetodoPago,
  Pedido: models.Pedido,
  PedidoProducto: models.PedidoProducto,
  IP: models.IP,
  SesionIP: models.SesionIP,
  LogSesion: models.LogSesion,
  HistorialCliente: models.HistorialCliente,
  UsuarioAdmin: models.UsuarioAdmin,
  RolUsuario: models.RolUsuario,
  Modulo: models.Modulo,
  Permiso: models.Permiso,
  RolPermiso: models.RolPermiso,
  Auditoria: models.Auditoria,
  HistorialEstadoPedido: models.HistorialEstadoPedido,
  Local: models.Local,
  Notificacion: models.Notificacion
};

export function registrarAuditoriaMiddleware(modeloNombre: keyof typeof modelsMap, accion: string) {
  return async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const usuarioId = req.usuario?.id;
    if (!usuarioId) return next();

    let recursoId: number | null = null;
    if (req.params.id) {
      recursoId = Number(req.params.id);
      if (isNaN(recursoId)) return next();
    }

    try {
      const modulo = await models.Modulo.findOne({ where: { nombre: modeloNombre + 's' } });
      if (!modulo) return next();

      const modelo = modelsMap[modeloNombre];
      if (!modelo || typeof modelo.findByPk !== 'function') return next();

      const datosAntes = recursoId ? await modelo.findByPk(recursoId) : null;

      res.on('finish', async () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          let datosDespues: any = null;
          let idFinal = recursoId;
      
          if (recursoId) {
            datosDespues = await modelo.findByPk(recursoId);
          } else {
            datosDespues = await modelo.findOne({ order: [['createdAt', 'DESC']] });
            idFinal = datosDespues?.get('id') ?? null;
          }
      
          const extraData = {
            ip: req.ip,
            userAgent: req.headers['user-agent']
          };
      
          await registrarAuditoria({
            usuarioId,
            moduloId: modulo.id,
            accion,
            recursoId: idFinal,
            datosAntes: datosAntes?.toJSON?.() ?? null,
            datosDespues: datosDespues?.toJSON?.() ?? null,
            extraData
          });
        }
      });
      

      next();
    } catch (error) {
      console.error('Error en middleware de auditoría:', error);
      next(); // nunca interrumpas el flujo por un fallo de log
    }
  };
}
