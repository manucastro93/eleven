import { Sequelize } from 'sequelize';

import { Cliente } from './Cliente';
import { Producto } from './Producto';
import { ImagenProducto } from './ImagenProducto';
import { Categoria } from './Categoria';
import { Subcategoria } from './Subcategoria';
import { ProductoCategoria } from './ProductoCategoria';
import { EstadoPedido } from './EstadoPedido';
import { MetodoEnvio } from './MetodoEnvio';
import { MetodoPago } from './MetodoPago';
import { Pedido } from './Pedido';
import { PedidoProducto } from './PedidoProducto';
import { IP } from './IP';
import { LogSesion } from './LogSesion';
import { HistorialCliente } from './HistorialCliente';
import { UsuarioAdmin } from './UsuarioAdmin';
import { RolUsuario } from './RolUsuario';
import { Modulo } from './Modulo';
import { Permiso } from './Permiso';
import { RolPermiso } from './RolPermiso';
import { Auditoria } from './Auditoria';
import { HistorialEstadoPedido } from './HistorialEstadoPedido';
import { Local } from './Local';
import { Notificacion } from './Notificacion';
import { Banner } from './Banner';
import { SesionAnonima } from './SesionAnonima';
import { Carrito } from './Carrito';
import { CarritoProducto } from './CarritoProducto';
import { PedidoDux } from './PedidoDux';
import { PedidoProductoDux } from './PedidoProductoDux';
import { MensajeInformativo } from './MensajeInformativo';

export function initModels(sequelize: Sequelize) {
  // Inicialización
  Cliente.initModel(sequelize);
  Producto.initModel(sequelize);
  ImagenProducto.initModel(sequelize);
  Categoria.initModel(sequelize);
  Subcategoria.initModel(sequelize);
  ProductoCategoria.initModel(sequelize);
  EstadoPedido.initModel(sequelize);
  MetodoEnvio.initModel(sequelize);
  MetodoPago.initModel(sequelize);
  Pedido.initModel(sequelize);
  PedidoProducto.initModel(sequelize);
  IP.initModel(sequelize);
  LogSesion.initModel(sequelize);
  HistorialCliente.initModel(sequelize);
  UsuarioAdmin.initModel(sequelize);
  RolUsuario.initModel(sequelize);
  Modulo.initModel(sequelize);
  Permiso.initModel(sequelize);
  RolPermiso.initModel(sequelize);
  Auditoria.initModel(sequelize);
  HistorialEstadoPedido.initModel(sequelize);
  Local.initModel(sequelize);
  Notificacion.initModel(sequelize);
  Banner.initModel(sequelize);
  SesionAnonima.initModel(sequelize);
  Carrito.initModel(sequelize);
  CarritoProducto.initModel(sequelize);
  PedidoDux.initModel(sequelize);
  PedidoProductoDux.initModel(sequelize);
  MensajeInformativo.initModel(sequelize);

  Carrito.belongsTo(Cliente, { as: 'cliente', foreignKey: 'clienteId' });
  Carrito.belongsTo(IP, { as: 'ip', foreignKey: 'ipId' });

  Carrito.belongsToMany(Producto, {as: 'productos',through: CarritoProducto,foreignKey: 'carritoId',otherKey: 'productoId'});

  Producto.belongsToMany(Carrito, {as: 'carritos',through: CarritoProducto,foreignKey: 'productoId',otherKey: 'carritoId'});

  CarritoProducto.belongsTo(Carrito, { as: 'carrito', foreignKey: 'carritoId' });
  CarritoProducto.belongsTo(Producto, { as: 'producto', foreignKey: 'productoId' });

  Categoria.hasMany(Subcategoria, { as: 'subcategorias', foreignKey: 'categoriaId' });
  Subcategoria.belongsTo(Categoria, { as: 'categoria', foreignKey: 'categoriaId' });
  
  Producto.belongsTo(Subcategoria, { as: 'subcategoria', foreignKey: 'subcategoriaId' });
  Subcategoria.hasMany(Producto, { as: 'productos', foreignKey: 'subcategoriaId' });

  // Relaciones Cliente
  Cliente.hasMany(Pedido, { as: 'pedidos', foreignKey: 'clienteId' });
  Cliente.hasMany(HistorialCliente, { as: 'historiales', foreignKey: 'clienteId' });
  Cliente.hasMany(IP, { as: 'ips', foreignKey: 'clienteId' });

  IP.belongsTo(Cliente, { as: 'cliente', foreignKey: 'clienteId' });

  // Relación SesionAnonima ↔ Cliente
  Cliente.hasMany(SesionAnonima, { as: 'sesionesAnonimas', foreignKey: 'clienteId' });
  SesionAnonima.belongsTo(Cliente, { as: 'cliente', foreignKey: 'clienteId' });

  // Relación lógica LogSesion ↔ SesionAnonima
  LogSesion.belongsTo(SesionAnonima, { as: 'sesion', foreignKey: 'sesionAnonimaId' });
  SesionAnonima.hasMany(LogSesion, { as: 'logs', foreignKey: 'sesionAnonimaId' });

  // Producto
  Producto.hasMany(ImagenProducto, { as: 'imagenes', foreignKey: 'productoId' });
  Producto.belongsTo(Categoria, {as: 'categoria',foreignKey: 'categoriaId'});
  Categoria.hasMany(Producto, {as: 'productos',foreignKey: 'categoriaId'});

  // Pedido
  Pedido.belongsTo(Cliente, { as: 'cliente', foreignKey: 'clienteId' });
  Pedido.belongsTo(IP, { as: 'ip', foreignKey: 'ipId' });
  Pedido.belongsTo(EstadoPedido, { as: 'estado', foreignKey: 'estadoPedidoId' });
  Pedido.belongsTo(MetodoEnvio, { as: 'metodoEnvio', foreignKey: 'metodoEnvioId' });
  Pedido.belongsTo(MetodoPago, { as: 'metodoPago', foreignKey: 'metodoPagoId' });
  Pedido.belongsToMany(Producto, {as: 'productos',through: PedidoProducto,foreignKey: 'pedidoId',otherKey: 'productoId'});
  Producto.belongsToMany(Pedido, {as: 'pedidos',through: PedidoProducto,foreignKey: 'productoId',otherKey: 'pedidoId'});
  Producto.hasMany(PedidoProducto, { as: 'pedidoProductos', foreignKey: 'productoId' });

  // PedidoProducto
  PedidoProducto.belongsTo(Pedido, { as: 'pedido', foreignKey: 'pedidoId' });
  PedidoProducto.belongsTo(Producto, { as: 'producto', foreignKey: 'productoId' });

  // HistorialCliente
  HistorialCliente.belongsTo(Cliente, { as: 'cliente', foreignKey: 'clienteId' });
  HistorialCliente.belongsTo(IP, { as: 'ip', foreignKey: 'ipId' });
  HistorialCliente.belongsTo(UsuarioAdmin, { as: 'admin', foreignKey: 'usuarioAdminId' });

  // UsuarioAdmin
  UsuarioAdmin.belongsTo(RolUsuario, { as: 'rol', foreignKey: 'rolUsuarioId' });
  UsuarioAdmin.hasMany(Auditoria, { as: 'auditorias', foreignKey: 'usuarioAdminId' });
  UsuarioAdmin.hasMany(Notificacion, { as: 'notificaciones', foreignKey: 'usuarioId' });

  // Permisos y roles
  RolUsuario.hasMany(Permiso, { as: 'permisos', foreignKey: 'rolUsuarioId' });
  Permiso.belongsTo(RolUsuario, { as: 'rol', foreignKey: 'rolUsuarioId' });
  Permiso.belongsTo(Modulo, { as: 'modulo', foreignKey: 'moduloId' });

  // HistorialEstadoPedido
  Pedido.hasMany(HistorialEstadoPedido, {as: 'historialEstados',foreignKey: 'pedidoId'});
  HistorialEstadoPedido.belongsTo(Pedido, {as: 'pedido',foreignKey: 'pedidoId'});

  // Local ↔ Pedido
  Pedido.belongsTo(Local, { as: 'local', foreignKey: 'localId' });
  Local.hasMany(Pedido, { as: 'pedidos', foreignKey: 'localId' });

  // PedidoDux
  PedidoDux.hasMany(PedidoProductoDux, { as: 'productos', foreignKey: 'pedido_dux_id' });
  PedidoProductoDux.belongsTo(PedidoDux, { as: 'pedido', foreignKey: 'pedido_dux_id' });


  // Notificaciones ↔ UsuarioAdmin ya cubierto arriba

  return {
    Cliente,
    Producto,
    ImagenProducto,
    Categoria,
    Subcategoria,
    ProductoCategoria,
    EstadoPedido,
    MetodoEnvio,
    MetodoPago,
    Pedido,
    PedidoProducto,
    IP,
    LogSesion,
    HistorialCliente,
    UsuarioAdmin,
    RolUsuario,
    Modulo,
    Permiso,
    RolPermiso,
    Auditoria,
    HistorialEstadoPedido,
    Local,
    Notificacion,
    Banner,
    SesionAnonima,
    Carrito,
    CarritoProducto,
    PedidoDux,
    PedidoProductoDux
  };
}
