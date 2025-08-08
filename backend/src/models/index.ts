import { Sequelize } from "sequelize";

import { Cliente } from "./Cliente";
import { ClienteDux } from "./ClienteDux";
import { Producto } from "./Producto";
import { ImagenProducto } from "./ImagenProducto";
import { Categoria } from "./Categoria";
import { Subcategoria } from "./Subcategoria";
import { ProductoCategoria } from "./ProductoCategoria";
import { EstadoPedido } from "./EstadoPedido";
import { MetodoEnvio } from "./MetodoEnvio";
import { MetodoPago } from "./MetodoPago";
import { Pedido } from "./Pedido";
import { PedidoProducto } from "./PedidoProducto";
import { IP } from "./IP";
import { LogSesion } from "./LogSesion";
import { HistorialCliente } from "./HistorialCliente";
import { UsuarioAdmin } from "./UsuarioAdmin";
import { RolUsuario } from "./RolUsuario";
import { Modulo } from "./Modulo";
import { Permiso } from "./Permiso";
import { RolPermiso } from "./RolPermiso";
import { Auditoria } from "./Auditoria";
import { HistorialEstadoPedido } from "./HistorialEstadoPedido";
import { Local } from "./Local";
import { Notificacion } from "./Notificacion";
import { Banner } from "./Banner";
import { SesionAnonima } from "./SesionAnonima";
import { Carrito } from "./Carrito";
import { CarritoProducto } from "./CarritoProducto";
import { PedidoDux } from "./PedidoDux";
import { PedidoProductoDux } from "./PedidoProductoDux";
import { MensajeInformativo } from "./MensajeInformativo";
import { ItemMenu } from "./ItemMenu";
import { ProductoItemMenu } from "./ProductoItemMenu";
import { WhatsappVerificacion } from "./WhatsappVerificacion";

export function initModels(sequelize: Sequelize) {
  // Inicialización
  Cliente.initModel(sequelize);
  ClienteDux.initModel(sequelize);
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
  ItemMenu.initModel(sequelize);
  ProductoItemMenu.initModel(sequelize);
  WhatsappVerificacion.initModel(sequelize);

  Carrito.belongsTo(Cliente, { as: "cliente", foreignKey: "clienteId" });
  Carrito.belongsToMany(Producto, {as: "productos",through: CarritoProducto,foreignKey: "carritoId",otherKey: "productoId",});
  Carrito.hasMany(CarritoProducto, { as: "items", foreignKey: "carritoId" });
  Carrito.belongsTo(Pedido, { as: "pedidoEnEdicion", foreignKey: "pedidoId" });

  Producto.belongsToMany(Carrito, {as: "carritos",through: CarritoProducto,foreignKey: "productoId",otherKey: "carritoId",});

  CarritoProducto.belongsTo(Carrito, {as: "carrito",foreignKey: "carritoId",});
  CarritoProducto.belongsTo(Producto, {as: "producto",foreignKey: "productoId",});

  Categoria.hasMany(Subcategoria, {as: "subcategorias",foreignKey: "categoriaId",  });
  Subcategoria.belongsTo(Categoria, {as: "categoria",foreignKey: "categoriaId",});

  Producto.belongsTo(Subcategoria, {as: "subcategoria",foreignKey: "subcategoriaId",});
  Subcategoria.hasMany(Producto, {as: "productos",foreignKey: "subcategoriaId",});

  // Relaciones Cliente
  Cliente.hasMany(Pedido, { as: "pedidos", foreignKey: "clienteId" });
  Cliente.hasMany(HistorialCliente, {as: "historiales",foreignKey: "clienteId",});
  Cliente.hasMany(IP, { as: "ips", foreignKey: "clienteId" });

  IP.belongsTo(Cliente, { as: "cliente", foreignKey: "clienteId" });

  // Relación SesionAnonima ↔ Cliente
  Cliente.hasMany(SesionAnonima, {as: "sesionesAnonimas",foreignKey: "clienteId",});
  SesionAnonima.belongsTo(Cliente, { as: "cliente", foreignKey: "clienteId" });

  // Relación lógica LogSesion ↔ SesionAnonima
  LogSesion.belongsTo(SesionAnonima, {as: "sesion",foreignKey: "sesionAnonimaId",});
  SesionAnonima.hasMany(LogSesion, {as: "logs",foreignKey: "sesionAnonimaId",});

  // Producto
  Producto.hasMany(ImagenProducto, {as: "imagenes",foreignKey: "productoId",});
  Producto.belongsTo(Categoria, { as: "categoria", foreignKey: "categoriaId" });
  Producto.belongsToMany(Categoria, {as: "categoriasAdicionales",through: ProductoCategoria,foreignKey: "productoId",otherKey: "categoriaId",});

  Categoria.belongsToMany(Producto, {as: "productosAdicionales", through: ProductoCategoria,foreignKey: "categoriaId",otherKey: "productoId",});
  Categoria.hasMany(Producto, { as: "productos", foreignKey: "categoriaId" });

  // Pedido
  Pedido.belongsTo(Cliente, { as: "cliente", foreignKey: "clienteId" });
  Pedido.belongsTo(EstadoPedido, {as: "estado",foreignKey: "estadoPedidoId",});
  Pedido.belongsToMany(Producto, {as: "productos",through: PedidoProducto,foreignKey: "pedidoId",otherKey: "productoId",});
  Pedido.hasOne(Carrito, { as: "carritoEdicion", foreignKey: "pedidoId" });

  Producto.belongsToMany(Pedido, {as: "pedidos",through: PedidoProducto,foreignKey: "productoId",otherKey: "pedidoId",});
  Producto.hasMany(PedidoProducto, {as: "pedidoProductos",foreignKey: "productoId",});


  // PedidoProducto
  PedidoProducto.belongsTo(Pedido, { as: "pedido", foreignKey: "pedidoId" });
  PedidoProducto.belongsTo(Producto, {as: "producto",foreignKey: "productoId",});

  // HistorialCliente
  HistorialCliente.belongsTo(Cliente, {as: "cliente",foreignKey: "clienteId",});
  HistorialCliente.belongsTo(UsuarioAdmin, {as: "admin",foreignKey: "usuarioAdminId",});

  // UsuarioAdmin
  UsuarioAdmin.belongsTo(RolUsuario, { as: "rol", foreignKey: "rolUsuarioId" });
  UsuarioAdmin.hasMany(Auditoria, {as: "auditorias",foreignKey: "usuarioAdminId",});
  UsuarioAdmin.hasMany(Notificacion, {as: "notificaciones",foreignKey: "usuarioId",});

  // Permisos y roles
  RolUsuario.hasMany(Permiso, { as: "permisos", foreignKey: "rolUsuarioId" });
  Permiso.belongsTo(RolUsuario, { as: "rol", foreignKey: "rolUsuarioId" });
  Permiso.belongsTo(Modulo, { as: "modulo", foreignKey: "moduloId" });

  // HistorialEstadoPedido
  Pedido.hasMany(HistorialEstadoPedido, {as: "historialEstados",foreignKey: "pedidoId",});
  HistorialEstadoPedido.belongsTo(Pedido, {as: "pedido",foreignKey: "pedidoId",});

 
  // PedidoDux
  PedidoDux.hasMany(PedidoProductoDux, {as: "productos",foreignKey: "pedido_dux_id",});
  PedidoProductoDux.belongsTo(PedidoDux, {as: "pedido",foreignKey: "pedido_dux_id",});

  Producto.belongsToMany(ItemMenu, {through: "ProductoItemMenu",as: "itemsMenu",foreignKey: "productoId",});

  ItemMenu.belongsToMany(Producto, {through: "ProductoItemMenu",as: "productos",foreignKey: "itemMenuId",});

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
    PedidoProductoDux,
    ItemMenu,
    ProductoItemMenu,
    WhatsappVerificacion,
    ClienteDux
  };
}
