import { models } from '@/config/db';
import { sequelize } from '@/config/db';
import { Op } from 'sequelize';

interface FiltrosCarrito {
  clienteId?: number;
  estadoEdicion?: number;
  desde?: string;
  hasta?: string;
  limit?: number;
  offset?: number;
}

export async function listarCarritos({
  clienteId,
  estadoEdicion = 1,
  desde,
  hasta,
  limit = 20,
  offset = 0
}: FiltrosCarrito) {
  const where: any = { estadoEdicion };

  if (clienteId) where.clienteId = clienteId;

  if (desde || hasta) {
    const desdeDate = desde ? new Date(desde) : undefined;
    const hastaDate = hasta ? new Date(hasta) : undefined;

    if ((desdeDate && isNaN(desdeDate.getTime())) || (hastaDate && isNaN(hastaDate.getTime()))) {
      throw new Error('Las fechas ingresadas no son válidas.');
    }

    if (desdeDate && hastaDate && desdeDate > hastaDate) {
      throw new Error('La fecha "desde" no puede ser posterior a la fecha "hasta".');
    }

    where.createdAt = {};
    if (desdeDate) where.createdAt[Op.gte] = desdeDate;
    if (hastaDate) where.createdAt[Op.lte] = hastaDate;
  }

  const { rows, count } = await models.Carrito.findAndCountAll({
    where,
    include: [
      { model: models.Cliente, as: 'cliente' },
      { model: models.IP, as: 'ip' },
      {
        model: models.Producto,
        as: 'productos',
        through: { attributes: ['cantidad', 'precioUnitario'] }
      }
    ],
    limit,
    offset,
    order: [['createdAt', 'DESC']]
  });

  return { carritos: rows, total: count };
}

export async function obtenerCarritoActivo(clienteId: number) {
  const carrito = await models.Carrito.findOne({
    where: { clienteId, estadoEdicion: 1 },
    include: [
      { model: models.Producto, as: 'productos', through: { attributes: ['cantidad', 'precioUnitario', 'observaciones'] } }
    ]
  });
  return carrito;
}

export async function agregarProductoACarrito(carritoId: number, productoId: number, cantidad: number, precioUnitario: number, observaciones?: string) {
  return models.CarritoProducto.upsert({
    carritoId,
    productoId,
    cantidad,
    precioUnitario,
    observaciones
  });
}

export async function crearCarrito(data: any) {
  return models.Carrito.create(data);
}

export async function actualizarCarrito(id: number, data: any) {
  const carrito = await models.Carrito.findByPk(id);
  if (!carrito) throw new Error('Carrito no encontrado');
  await carrito.update(data);
  return carrito;
}

export async function eliminarProductoDeCarrito(carritoId: number, productoId: number) {
  return models.CarritoProducto.destroy({ where: { carritoId, productoId } });
}

export async function eliminarCarrito(id: number) {
  const carrito = await models.Carrito.findByPk(id);
  if (!carrito) throw new Error('Carrito no encontrado');
  await carrito.destroy();
  return true;
}

export async function confirmarCarrito(carritoId: number, metodoEnvioId: number, metodoPagoId: number, estadoPedidoId = 1) {
  const t = await sequelize.transaction();
  try {
    const carrito = await models.Carrito.findByPk(carritoId, {
      include: [{ model: models.CarritoProducto, as: 'productos' }],
      transaction: t
    });

    if (!carrito) throw new Error('Carrito no encontrado');

    const pedido = await models.Pedido.create({
        clienteId: carrito.clienteId,
        ipId: carrito.ipId,
        total: carrito.total,
        observaciones: carrito.observaciones ?? null,
        estadoPedidoId,
        metodoEnvioId,
        metodoPagoId,
        estadoEdicion: false
        }, { transaction: t });


    const productos = await models.CarritoProducto.findAll({
      where: { carritoId },
      transaction: t
    });

    for (const prod of productos) {
      await models.PedidoProducto.create({
        pedidoId: pedido.id,
        productoId: prod.productoId,
        cantidad: prod.cantidad,
        precioUnitario: prod.precioUnitario,
        observaciones: prod.observaciones
      }, { transaction: t });
    }

    await carrito.update({ estadoEdicion: 0 }, { transaction: t });

    await t.commit();
    return pedido;
  } catch (error) {
    await t.rollback();
    throw new Error('Error al confirmar el carrito');
  }
}
