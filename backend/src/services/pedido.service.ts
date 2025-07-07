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
        observaciones: item.observaciones ?? ''
      });
    }

    const nuevoPedido = await models.Pedido.create({
      clienteId: clienteExistente.id,
      metodoEnvioId,
      metodoPagoId,
      observaciones,
      ipId,
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
}

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

export async function obtenerPedidoPorId(id: number) {
  try {
    const pedido = await models.Pedido.findByPk(id, {
      include: [
        { model: models.Cliente, as: "cliente" },
        { model: models.EstadoPedido, as: "estadoPedido" },
        { model: models.MetodoEnvio, as: "metodoEnvio" },
        { model: models.MetodoPago, as: "metodoPago" },
      ],
    });
    return pedido;
  } catch (error) {
    throw new Error("Error al obtener el pedido");
  }
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
