import { models } from "@/config/db";
import { sequelize } from "@/config/db";
import { Op } from "sequelize";

interface FiltrosPedidos {
  clienteId?: number;
  estadoPedidoId?: number;
  localId?: number;
  desde?: string;
  hasta?: string;
  limit?: number;
  offset?: number;
}

export async function listarPedidos({
  clienteId,
  estadoPedidoId,
  localId,
  desde,
  hasta,
  limit = 20,
  offset = 0,
}: FiltrosPedidos) {
  const where: any = {};

  if (clienteId) where.clienteId = clienteId;
  if (estadoPedidoId) where.estadoPedidoId = estadoPedidoId;
  if (localId) where.localId = localId;

  if (desde || hasta) {
    const desdeDate = desde ? new Date(desde) : undefined;
    const hastaDate = hasta ? new Date(hasta) : undefined;

    if (
      (desdeDate && isNaN(desdeDate.getTime())) ||
      (hastaDate && isNaN(hastaDate.getTime()))
    ) {
      throw new Error("Las fechas ingresadas no son válidas.");
    }

    if (
      desdeDate !== undefined &&
      hastaDate !== undefined &&
      desdeDate > hastaDate
    ) {
      throw new Error(
        'La fecha "desde" no puede ser posterior a la fecha "hasta".'
      );
    }

    where.createdAt = {};
    if (desdeDate) where.createdAt[Op.gte] = desdeDate;
    if (hastaDate) where.createdAt[Op.lte] = hastaDate;
  }

  const { rows, count } = await models.Pedido.findAndCountAll({
    where,
    include: [
      { model: models.Cliente, as: "cliente" },
      { model: models.EstadoPedido, as: "estadoPedido" },
      { model: models.MetodoEnvio, as: "metodoEnvio" },
      { model: models.MetodoPago, as: "metodoPago" },
    ],
    limit,
    offset,
    order: [["createdAt", "DESC"]],
  });

  return { pedidos: rows, total: count };
}
/*
export async function crearPedido(pedidoData: any) {
  const t = await sequelize.transaction();
  try {
    const {
      cliente,
      productos,
      metodoEnvioId,
      metodoPagoId,
      observaciones,
      ipId
    } = pedidoData;

    const {
      cuitOCuil,
      nombre,
      email,
      telefono,
      razonSocial,
      direccion,
      localidad,
      provincia
    } = cliente;

    let clienteExistente = await models.Cliente.findOne({ where: { cuitOCuil }, transaction: t });

    if (clienteExistente) {
      await clienteExistente.update({
        nombre,
        email,
        telefono: telefono ?? '',
        razonSocial: razonSocial ?? '',
        direccion,
        localidad,
        provincia
      }, { transaction: t });
    } else {
      clienteExistente = await models.Cliente.create({
        cuitOCuil,
        nombre,
        email,
        telefono: telefono ?? '',
        razonSocial: razonSocial ?? '',
        direccion,
        localidad,
        provincia
      }, { transaction: t });
    }

    let total = 0;

    // Validar productos y calcular total
    const productosValidados = [];

    for (const item of productos) {
      const producto = await models.Producto.findByPk(item.productoId, { transaction: t });
      if (!producto) {
        throw new Error(`Producto con ID ${item.productoId} no encontrado`);
      }

      const cantidad = Number(item.cantidad);
      if (isNaN(cantidad) || cantidad <= 0) {
        throw new Error(`Cantidad inválida para el producto ID ${item.productoId}`);
      }

      const subtotal = cantidad * Number(producto.precio);
      total += subtotal;

      productosValidados.push({
        productoId: producto.id,
        cantidad,
        observaciones: item.observaciones ?? '',
        precioUnitario: producto.precio
      });
    }

    const nuevoPedido = await models.Pedido.create({
      clienteId: clienteExistente.id,
      transporte,
      formaPago,
      formaEnvio,
      observaciones,
      estadoPedidoId: 1,     // por defecto "pendiente"
      estadoEdicion: false,
      total
    }, { transaction: t });

    for (const item of productosValidados) {
      await models.PedidoProducto.create({
        pedidoId: nuevoPedido.id,
        ...item
      }, { transaction: t });
    }

    await t.commit();
    return nuevoPedido;
  } catch (error) {
    await t.rollback();
    throw error;
  }
}

export async function obtenerPedidosPorIP(ip: string) {
  return models.Pedido.findAll({
    where: { ipId: ip },
    include: [
      { model: models.Cliente, as: "cliente" },
      { model: models.EstadoPedido, as: "estadoPedido" },
      { model: models.MetodoEnvio, as: "metodoEnvio" },
      { model: models.MetodoPago, as: "metodoPago" },
    ],
  });
}*/

export async function obtenerPedidosPorClienteId(clienteId: number) {
  try {
    const pedidos = await models.Pedido.findAll({
      where: { clienteId },
      include: [
        { model: models.Cliente, as: "cliente" },
        { model: models.EstadoPedido, as: "estadoPedido" },
        { model: models.MetodoEnvio, as: "metodoEnvio" },
        { model: models.MetodoPago, as: "metodoPago" },
      ],
    });
    return pedidos;
  } catch (error) {
    throw new Error("Error al obtener los pedidos del cliente");
  }
}

export async function obtenerPedidoPorId(pedidoId: number) {
  if (!pedidoId) throw new Error("pedidoId es requerido");

  const pedidos = await models.Pedido.findAll({
    where: { id: pedidoId },
    order: [["createdAt", "DESC"]],
    include: [
      {
        model: models.Producto,
        as: "productos",
        attributes: [
          "id",
          "nombre",
          "descripcion",
          "codigo",
          "precio",
          "slug",
          "activo",
          "imagen"
        ],
        through: {
          attributes: ["cantidad", "precioUnitario"], // Detalle del join PedidoProducto
        },
        include: [
          {
            model: models.Categoria,
            as: "categoria",
            attributes: ["id", "nombre", "slug", "orden"]
          }
        ]
      }
    ],
    attributes: [
      "id",
      "total",
      "estadoPedidoId",
      "estadoEdicion",
      "formaEnvio",
      "transporte",
      "formaPago",
      "telefono",
      "email",
      "nombreFantasia",
      "cuit",
      "categoriaFiscal",
      "razonSocial",
      "direccion",
      "localidad",
      "provincia",
      "codigoPostal",
      "observaciones",
      "createdAt"
    ]
  });

  return pedidos.map((pedido: any) => ({
    id: pedido.id,
    total: pedido.total,
    estadoPedidoId: pedido.estadoPedidoId,
    estadoEdicion: pedido.estadoEdicion,
    formaEnvio: pedido.formaEnvio,
    transporte: pedido.transporte,
    formaPago: pedido.formaPago,
    telefono: pedido.telefono,
    email: pedido.email,
    nombreFantasia: pedido.nombreFantasia,
    cuit: pedido.cuit,
    categoriaFiscal: pedido.categoriaFiscal,
    razonSocial: pedido.razonSocial,
    direccion: pedido.direccion,
    localidad: pedido.localidad,
    provincia: pedido.provincia,
    codigoPostal: pedido.codigoPostal,
    observaciones: pedido.observaciones,
    createdAt: pedido.createdAt,
    productos: (pedido.productos || []).map((producto: any) => ({
      productoId: producto.id,
      cantidad: producto.PedidoProducto?.cantidad ?? 1,
      precio: producto.PedidoProducto?.precioUnitario ?? producto.precio,
      producto: {
        id: producto.id,
        nombre: producto.nombre,
        descripcion: producto.descripcion,
        codigo: producto.codigo,
        precio: producto.precio,
        slug: producto.slug,
        activo: producto.activo,
        imagen: producto.imagen,
        categoria: producto.categoria
      }
    }))
  }));
}

export async function actualizarPedidoCliente(id: number, data: any) {
  try {
    const pedido = await models.Pedido.findByPk(id);
    if (!pedido) throw new Error("Pedido no encontrado");
    await pedido.update(data);
    return pedido;
  } catch (error) {
    throw new Error("Error al actualizar el pedido");
  }
}

export async function cancelarPedidoCliente(id: number) {
  try {
    const pedido = await models.Pedido.findByPk(id);
    if (!pedido) throw new Error("Pedido no encontrado");
    await pedido.update({ estadoPedidoId: 4 });
    return pedido;
  } catch (error) {
    throw new Error("Error al cancelar el pedido");
  }
}

export async function actualizarEstadoPedido(id: number, estado: number) {
  try {
    const pedido = await models.Pedido.findByPk(id);
    if (!pedido) throw new Error("Pedido no encontrado");
    await pedido.update({ estadoPedidoId: estado });
    return pedido;
  } catch (error) {
    throw new Error("Error al actualizar el estado del pedido");
  }
}

export async function actualizarProductoPedido(
  pedidoId: number,
  productoId: number,
  cantidad: number,
  observaciones?: string
) {
  const t = await sequelize.transaction();
  try {
    // Traer el pedido y validar estado
    const pedido = await models.Pedido.findByPk(pedidoId, { transaction: t });
    if (!pedido) throw new Error('Pedido no encontrado');
    if (pedido.estadoPedidoId !== 1) throw new Error('Solo se puede editar pedidos pendientes');

    // Traer el producto real
    const producto = await models.Producto.findByPk(productoId, { transaction: t });
    if (!producto) throw new Error('Producto no encontrado');

    // Validar stock suficiente
    if (producto.stock < cantidad) {
      throw new Error(`Stock insuficiente para "${producto.nombre}". Stock disponible: ${producto.stock}`);
    }

    // Validar precio actual (opcional: podrías actualizar el precio en PedidoProducto si tu lógica lo permite)
    // Si no querés que cambie el precio, solo validá que el precio de PedidoProducto == producto.precio

    // Actualizar detalle en PedidoProducto
    const detalle = await models.PedidoProducto.findOne({
      where: { pedidoId, productoId },
      transaction: t
    });
    if (!detalle) throw new Error('Detalle de producto en el pedido no encontrado');

    await detalle.update({ cantidad, observaciones: observaciones ?? '' }, { transaction: t });

    // (Opcional) recalculá el total del pedido
    await recalcularTotalPedido(pedidoId, t);

    await t.commit();
    return true;
  } catch (error) {
    await t.rollback();
    throw error;
  }
}

export async function agregarProductoAPedido(
  pedidoId: number,
  productoId: number,
  cantidad: number,
  observaciones?: string
) {
  const t = await sequelize.transaction();
  try {
    const pedido = await models.Pedido.findByPk(pedidoId, { transaction: t });
    if (!pedido) throw new Error('Pedido no encontrado');
    if (pedido.estadoPedidoId !== 1) throw new Error('Solo se puede editar pedidos pendientes');

    const producto = await models.Producto.findByPk(productoId, { transaction: t });
    if (!producto) throw new Error('Producto no encontrado');

    if (producto.stock < cantidad) {
      throw new Error(`Stock insuficiente para "${producto.nombre}". Stock disponible: ${producto.stock}`);
    }

    // Agregar nuevo detalle
    await models.PedidoProducto.create({
      pedidoId,
      productoId,
      cantidad,
      precioUnitario: producto.precio,
      observaciones: observaciones ?? ''
    }, { transaction: t });

    await recalcularTotalPedido(pedidoId, t);

    await t.commit();
    return true;
  } catch (error) {
    await t.rollback();
    throw error;
  }
}

export async function eliminarProductoDePedido(pedidoId: number, productoId: number) {
  const t = await sequelize.transaction();
  try {
    const pedido = await models.Pedido.findByPk(pedidoId, { transaction: t });
    if (!pedido) throw new Error('Pedido no encontrado');
    if (pedido.estadoPedidoId !== 1) throw new Error('Solo se puede editar pedidos pendientes');

    const detalle = await models.PedidoProducto.findOne({
      where: { pedidoId, productoId },
      transaction: t
    });
    if (!detalle) throw new Error('Detalle de producto no encontrado');

    await detalle.destroy({ transaction: t });

    await recalcularTotalPedido(pedidoId, t);

    await t.commit();
    return true;
  } catch (error) {
    await t.rollback();
    throw error;
  }
}

async function recalcularTotalPedido(pedidoId: number, transaction: any) {
  const detalles = await models.PedidoProducto.findAll({
    where: { pedidoId },
    transaction
  });

  let total = 0;
  for (const det of detalles) {
    const producto = await models.Producto.findByPk(det.productoId, { transaction });
    if (producto) {
      total += Number(det.cantidad) * Number(producto.precio);
    }
  }
  await models.Pedido.update({ total }, { where: { id: pedidoId }, transaction });
}

export async function duplicarPedidoACarrito(pedidoId: number, clienteId: number) {
  const t = await sequelize.transaction();
  try {
    // 1. Traer pedido y detalles originales
    const pedido = await models.Pedido.findByPk(pedidoId, { transaction: t });
    if (!pedido) throw new Error('Pedido no encontrado');
    const ipId = pedido.ipId;   // <== FIX: ahora ipId existe

    const detalles = await models.PedidoProducto.findAll({
      where: { pedidoId },
      transaction: t
    });
    
    // 2. Crear nuevo carrito
    const nuevoCarrito = await models.Carrito.create({
      clienteId,
      total: 0,
      estadoEdicion: 1
    }, { transaction: t });

    let total = 0;
    const productosAgregados = [];
    const productosSinStock = [];

    for (const item of detalles) {
      const producto = await models.Producto.findByPk(item.productoId, { transaction: t });
      if (!producto) {
        productosSinStock.push({
          productoId: item.productoId,
          motivo: 'Producto discontinuado o no encontrado'
        });
        continue;
      }
      if (producto.stock < item.cantidad) {
        productosSinStock.push({
          productoId: item.productoId,
          motivo: `Stock insuficiente (${producto.stock} disponibles)`
        });
        continue;
      }
      // Ok, lo agregás al carrito con precio actualizado
      await models.CarritoProducto.create({
        carritoId: nuevoCarrito.id,
        productoId: producto.id,
        cantidad: item.cantidad,
        precioUnitario: producto.precio
      }, { transaction: t });
      productosAgregados.push({
        productoId: producto.id,
        cantidad: item.cantidad,
        precioUnitario: producto.precio
      });
      total += Number(item.cantidad) * Number(producto.precio);
    }

    // Actualizás total del carrito
    await nuevoCarrito.update({ total }, { transaction: t });

    await t.commit();

    return {
      carritoId: nuevoCarrito.id,
      productosAgregados,
      productosSinStock
    };
  } catch (error) {
    await t.rollback();
    throw error;
  }
}

export async function actualizarEstadoEdicion(
  pedidoId: number,
  estadoEdicion: boolean,
  fechaEdicion: Date | null
) {
  const pedido = await models.Pedido.findByPk(pedidoId);
  if (!pedido) throw new Error("Pedido no encontrado");
  await pedido.update({
    estadoEdicion,
    fechaEdicion
  });
  return pedido;
}