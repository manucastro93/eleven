import { Router } from 'express';

import clienteRoutes from './cliente.routes';
import productoRoutes from './producto.routes';
import categoriaRoutes from "./categoria.routes";
import pedidoRoutes from './pedido.routes';
import usuarioRoutes from './usuario.routes';
import estadoPedidoRoutes from './estadoPedido.routes';
import metodoEnvioRoutes from './metodoEnvio.routes';
import metodoPagoRoutes from './metodoPago.routes';
import rolRoutes from './rol.routes';
import permisoRoutes from './permiso.routes';
import moduloRoutes from './modulo.routes';
import auditoriaRoutes from './auditoria.routes';
import historialRoutes from './historial.routes';
import ipRoutes from './ip.routes';
import authRoutes from './auth.routes';
import notificacionRoutes from './notificacion.routes';
import localRoutes from './local.routes';
import direccionRoutes from './direccion.routes';
import estadisticasRoutes from './estadisticas.routes';
import bannerRoutes from './banner.routes'
import logSesionRoutes from './logSesion.routes';
import publicRoutes from './public';

const router = Router();

router.use('/clientes', clienteRoutes);
router.use('/productos', productoRoutes);
router.use("/categorias", categoriaRoutes);
router.use('/pedidos', pedidoRoutes);
router.use('/usuarios', usuarioRoutes);
router.use('/estados-pedido', estadoPedidoRoutes);
router.use('/metodos-envio', metodoEnvioRoutes);
router.use('/metodos-pago', metodoPagoRoutes);
router.use('/roles', rolRoutes);
router.use('/permisos', permisoRoutes);
router.use('/modulos', moduloRoutes);
router.use('/auditorias', auditoriaRoutes);
router.use('/historial', historialRoutes);
router.use('/ips', ipRoutes);
router.use('/auth', authRoutes);
router.use('/notificaciones', notificacionRoutes);
router.use('/locales', localRoutes);
router.use('/direcciones', direccionRoutes);
router.use('/estadisticas', estadisticasRoutes);
router.use('/banners', bannerRoutes);
router.use(logSesionRoutes);
router.use('/public', publicRoutes);

export default router;