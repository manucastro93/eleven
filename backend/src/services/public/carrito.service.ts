import { models } from "@/config/db";
import { sequelize } from "@/config/db";
import { Op } from "sequelize";

interface FiltrosCarrito {
  clienteId?: number;
  estadoEdicion?: number;
  desde?: string;
  hasta?: string;
  limit?: number;
  offset?: number;
}

async function actualizarTotalCarrito(carritoId: number) {
  const productos = await models.CarritoProducto.findAll({
    where: { carritoId },
  });
  const total = productos.reduce(
    (acc, item) => acc + Number(item.cantidad) * Number(item.precioUnitario),
    0
  );
  await models.Carrito.update({ total }, { where: { id: carritoId } });
}

export async function listarCarritos({
  clienteId,
  estadoEdicion = 0,
  desde,
  hasta,
  limit = 20,
  offset = 0,
}: FiltrosCarrito) {
  const where: any = {};

  if (clienteId) where.clienteId = clienteId;

  if (desde || hasta) {
    const desdeDate = desde ? new Date(desde) : undefined;
    const hastaDate = hasta ? new Date(hasta) : undefined;

    if (
      (desdeDate && isNaN(desdeDate.getTime())) ||
      (hastaDate && isNaN(hastaDate.getTime()))
    ) {
      throw new Error("Las fechas ingresadas no son válidas.");
    }

    if (desdeDate && hastaDate && desdeDate > hastaDate) {
      throw new Error(
        'La fecha "desde" no puede ser posterior a la fecha "hasta".'
      );
    }

    where.createdAt = {};
    if (desdeDate) where.createdAt[Op.gte] = desdeDate;
    if (hastaDate) where.createdAt[Op.lte] = hastaDate;
  }

  const { rows, count } = await models.Carrito.findAndCountAll({
    where,
    include: [
      { model: models.Cliente, as: "cliente" },
      { model: models.IP, as: "ip" },
      {
        model: models.Producto,
        as: "productos",
        through: { attributes: ["cantidad", "precioUnitario"] },
      },
    ],
    limit,
    offset,
    order: [["createdAt", "DESC"]],
  });

  return { carritos: rows, total: count };
}

export async function obtenerCarritoActivoPorSesion(sesionAnonimaId: string) {
  const carrito = await models.Carrito.findOne({
    where: { sesionAnonimaId },
    include: [
      {
        model: models.CarritoProducto,
        as: "items",
        include: [
          {
            model: models.Producto,
            as: "producto",
            attributes: ["id", "nombre", "codigo", "precio", "imagen", "slug"],
          },
        ],
      },
    ],
  });

  if (!carrito) return null;

  // Si TS se queja por 'items', castealo o agregá el tipo correcto
  //const items = (carrito as any).items || [];
  //casteado:
  const items = ((carrito as { items?: any[] })?.items) ?? [];

  return {
    id: carrito.id,
    clienteId: carrito.clienteId,
    sesionAnonimaId: carrito.sesionAnonimaId,
    total: carrito.total,
    observaciones: carrito.observaciones,
    estadoEdicion: carrito.estadoEdicion,
    fechaEdicion: carrito.fechaEdicion,
    createdAt: carrito.createdAt,
    updatedAt: carrito.updatedAt,
    deletedAt: carrito.deletedAt,
    items: items.map((item: any) => ({
      id: item.id,
      carritoId: item.carritoId,
      productoId: item.productoId,
      cantidad: item.cantidad,
      precioUnitario: item.precioUnitario,
      observaciones: item.observaciones,
      producto: item.producto
        ? {
            id: item.producto.id,
            nombre: item.producto.nombre,
            codigo: item.producto.codigo,
            precio: item.producto.precio,
            imagen: item.producto.imagen,
            slug: item.producto.slug,
          }
        : null,
    })),
  };
}

export async function obtenerCarritoActivo(clienteId: number) {
  const carrito = await models.Carrito.findOne({
    where: { clienteId },
    include: [
      {
        model: models.CarritoProducto,
        as: "items",
        include: [
          {
            model: models.Producto,
            as: "producto",
            attributes: ["id", "nombre", "codigo", "precio", "imagen", "slug"],
          },
        ],
      },
    ],
  });
  if (!carrito) return null;

  // Uniformizá el formato de respuesta (igual que por sesión)
  const items = ((carrito as { items?: any[] })?.items) ?? [];

  return {
    id: carrito.id,
    pedidoId: carrito.pedidoId,
    clienteId: carrito.clienteId,
    sesionAnonimaId: carrito.sesionAnonimaId,
    total: carrito.total,
    observaciones: carrito.observaciones,
    estadoEdicion: carrito.estadoEdicion,
    fechaEdicion: carrito.fechaEdicion,
    createdAt: carrito.createdAt,
    updatedAt: carrito.updatedAt,
    deletedAt: carrito.deletedAt,
    items: items.map((item: any) => ({
      id: item.id,
      carritoId: item.carritoId,
      productoId: item.productoId,
      cantidad: item.cantidad,
      precioUnitario: item.precioUnitario,
      observaciones: item.observaciones,
      producto: item.producto
        ? {
            id: item.producto.id,
            nombre: item.producto.nombre,
            codigo: item.producto.codigo,
            precio: item.producto.precio,
            imagen: item.producto.imagen,
            slug: item.producto.slug,
          }
        : null,
    })),
  };
}

export async function obtenerCarritoPorId(carritoId: number) {
  const carrito = await models.Carrito.findOne({
    where: { id: carritoId },
    include: [
      {
        model: models.CarritoProducto,
        as: "items",
        include: [
          {
            model: models.Producto,
            as: "producto",
          },
        ],
      },
    ],
  });
  await actualizarTotalCarrito(carritoId);
  return carrito;
}

export async function agregarProductoACarrito(
  carritoId: number,
  productoId: number,
  cantidad: number,
  precioUnitarioFront: number, // ignoramos este valor, usamos el de la BD
  observaciones?: string
) {
  // 1. Traer producto real
  const producto = await models.Producto.findByPk(productoId);
  if (!producto) throw new Error("Producto no encontrado");

  // 2. Validar stock
  /*
  if (producto.stock < cantidad) {
    throw new Error(
      `Stock insuficiente para "${producto.nombre}". Stock disponible: ${producto.stock}`
    );
  }*/

  // 3. Usar precio vigente de la BD
  const precioUnitario = producto.precio;

  // 3bis. Verificar carrito existe
  const carrito = await models.Carrito.findByPk(carritoId);
  if (!carrito) throw new Error("Carrito no encontrado");

  // 4. Upsert del producto en el carrito
  await models.CarritoProducto.upsert({
    carritoId,
    productoId,
    cantidad,
    precioUnitario,
    observaciones,
  });

  // 5. Actualizar total del carrito
  await actualizarTotalCarrito(carritoId);

  return true;
}

export async function crearCarrito(data: any) {
  try {
    let carrito;

    // 1. Buscar si ya hay un carrito abierto para el cliente o la sesión anónima
    if (data.clienteId) {
      carrito = await models.Carrito.findOne({
        where: {
          clienteId: data.clienteId,
        },
      });
    } else if (data.sesionAnonimaId) {
      carrito = await models.Carrito.findOne({
        where: {
          sesionAnonimaId: data.sesionAnonimaId,
        },
      });
    }

    if (carrito) {
      // Limpiá los productos anteriores (opcional, si querés que al duplicar reemplace todo)
      await models.CarritoProducto.destroy({
        where: { carritoId: carrito.id },
        force: true,
      });
      return carrito;
    }

    // 2. Si no hay, creá uno nuevo
    const nuevoCarrito = await models.Carrito.create(data);
    return nuevoCarrito;
  } catch (error) {
    console.error("Error al crear carrito:", error);
    if (error instanceof Error) {
      if ("errors" in error && Array.isArray((error as any).errors)) {
        console.error("Detalles del error:");
        for (const e of (error as any).errors) {
          console.error(
            `- Path: ${e.path}, Message: ${e.message}, Value: ${e.value}`
          );
        }
      }
      throw error;
    } else {
      throw new Error("Error desconocido al crear carrito");
    }
  }
}

export async function actualizarCarrito(id: number, data: any) {
  const carrito = await models.Carrito.findByPk(id);
  if (!carrito) throw new Error("Carrito no encontrado");
  await carrito.update(data);
  return carrito;
}

export async function eliminarProductoDeCarrito(
  carritoId: number,
  productoId: number
) {
  await models.CarritoProducto.destroy({
    where: { carritoId, productoId },
    force: true,
  });
  await actualizarTotalCarrito(carritoId);
  return true;
}

export async function eliminarCarrito(id: number) {
  const carrito = await models.Carrito.findByPk(id);
  if (!carrito) throw new Error("Carrito no encontrado");

  await models.CarritoProducto.destroy({ where: { carritoId: id } });
  await carrito.destroy();

  return true;
}

export async function actualizarObservacionesGeneral(carritoId: number,observaciones: string) {
  const carrito = await models.Carrito.findByPk(carritoId);
  if (!carrito) return null;
  carrito.observaciones = observaciones;
  await carrito.save();
  return carrito;
}

export async function finalizarEdicionCarrito(carritoId: number): Promise<void> {
  const carrito = await models.Carrito.findByPk(carritoId);
  if (!carrito) throw new Error("Carrito no encontrado");
  //await carrito.update({ estadoEdicion: 0, fechaEdicion: null });
  await models.CarritoProducto.destroy({ where: { carritoId }, force: true});
  await carrito.destroy({ force: true});
}

export async function obtenerEstadoEdicionCarrito(
  carritoId: number
): Promise<{ estadoEdicion: boolean; fechaEdicion: string | null }> {
  const carrito = await models.Carrito.findByPk(carritoId, {
    attributes: ["estadoEdicion", "fechaEdicion"],
  });
  if (!carrito) throw new Error("Carrito no encontrado");
  return {
    estadoEdicion: Boolean(carrito.estadoEdicion),
    fechaEdicion: carrito.fechaEdicion
      ? carrito.fechaEdicion instanceof Date
        ? carrito.fechaEdicion.toISOString()
        : carrito.fechaEdicion
      : null,
  };
}

export async function confirmarCarrito(
  carritoId: number,
  datos: {
    transporte?: string;
    formaPago: string;
    formaEnvio: string;
    telefono: string;
    email: string;
    nombreFantasia: string;
    cuit: string;
    razonSocial: string;
    direccion: string;
    localidad: string;
    provincia: string;
    codigoPostal: string;
    categoriaFiscal: string;
    estadoPedidoId?: number;
  }
) {
  const {
    transporte,
    formaPago,
    formaEnvio,
    telefono,
    email,
    nombreFantasia,
    cuit,
    razonSocial,
    direccion,
    localidad,
    provincia,
    codigoPostal,
    categoriaFiscal = "",
    estadoPedidoId = 1,
  } = datos;

  const t = await sequelize.transaction();
  try {
    // 0. Buscar o crear/actualizar cliente
    let cliente = await models.Cliente.findOne({
      where: { cuitOCuil: cuit },
      transaction: t,
    });

    let datosAntes: object = {};
    let datosDespues: object = {};
    let clienteActualizado = false;

    const camposCliente = {
      razonSocial,
      nombre: nombreFantasia,
      email,
      direccion,
      localidad,
      provincia,
      codigoPostal,
      telefono,
      categoriaFiscal,
      transporte,
      formaEnvio,
      formaPago
    };

    if (cliente) {
      // Guardar snapshot de los datos ANTES de actualizar
      datosAntes = {
        razonSocial: cliente.razonSocial,
        nombre: cliente.nombre,
        email: cliente.email,
        direccion: cliente.direccion,
        localidad: cliente.localidad,
        provincia: cliente.provincia,
        codigoPostal: cliente.codigoPostal,
        telefono: cliente.telefono,
        categoriaFiscal: cliente.categoriaFiscal,
        formaEnvio: cliente.formaEnvio,
        formaPago: cliente.formaPago,
        transporte: cliente.transporte
      };

      // Actualizar solo si hay algún cambio real
      const cambios = Object.entries(camposCliente).some(
        ([key, val]) => (cliente as any)[key] !== val
      );

      if (cambios) {
        await cliente.update(camposCliente, { transaction: t });
        clienteActualizado = true;
        datosDespues = { ...camposCliente };
      }
    } else {
      cliente = await models.Cliente.create(
        {
          ...camposCliente,
          cuitOCuil: cuit,
        },
        { transaction: t }
      );
    }

    // Si hubo update, registrar historial
    if (clienteActualizado) {
      await models.HistorialCliente.create(
        {
          clienteId: cliente.id,
          datosAntes,
          datosDespues,
          origen: "pedido",
          usuarioId: null,
        },
        { transaction: t }
      );
    }

    // 1. Traer el carrito con productos
    const carrito = await models.Carrito.findByPk(carritoId, {
      include: [{ model: models.CarritoProducto, as: "items" }],
      transaction: t,
    });
    if (!carrito) throw new Error("Carrito no encontrado");

    const productosCarrito = await models.CarritoProducto.findAll({
      where: { carritoId },
      transaction: t,
    });

    // 2. Validar stock y precio para cada producto
    for (const prod of productosCarrito) {
      const producto = await models.Producto.findByPk(prod.productoId, {
        transaction: t,
      });
      if (!producto)
        throw new Error(`Producto ID ${prod.productoId} no encontrado`);

      if (producto.stock < 10) {
        throw new Error(
          `Stock insuficiente para "${producto.nombre}".`
        );
      }
      if (Number(prod.precioUnitario) !== Number(producto.precio)) {
        throw new Error(
          `El precio de "${producto.nombre}" ha cambiado. Nuevo precio: $${producto.precio}`
        );
      }
    }

    // 3. Reservar stock
    for (const prod of productosCarrito) {
      await models.Producto.increment(
        { stock: -prod.cantidad },
        { where: { id: prod.productoId }, transaction: t }
      );
    }

    // 4. Crear pedido y productos
    const pedido = await models.Pedido.create(
      {
        clienteId: cliente.id,
        total: carrito.total,
        observaciones: carrito.observaciones ?? null,
        estadoPedidoId,
        transporte,
        formaPago,
        formaEnvio,
        categoriaFiscal,
        telefono,
        email,
        nombreFantasia,
        cuit,
        razonSocial,
        direccion,
        localidad,
        provincia,
        codigoPostal,
        estadoEdicion: false,
      },
      { transaction: t }
    );

    for (const prod of productosCarrito) {
      await models.PedidoProducto.create(
        {
          pedidoId: pedido.id,
          productoId: prod.productoId,
          cantidad: prod.cantidad,
          precioUnitario: prod.precioUnitario,
          observaciones: prod.observaciones,
        },
        { transaction: t }
      );
    }

    // 5. Eliminar carrito y su detalle
    //BORRADO REAL:
    await models.CarritoProducto.destroy({
      where: { carritoId },
      force: true,
      transaction: t,
    });
    await carrito.destroy({ force: true, transaction: t });

    /* BORRADO LOGICO:
    await models.CarritoProducto.destroy({ where: { carritoId }, transaction: t });
    await carrito.destroy({ transaction: t });*/

    await t.commit();
    return pedido;
  } catch (error) {
    await t.rollback();
    throw error;
  }
}