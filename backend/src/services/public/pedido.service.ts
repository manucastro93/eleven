import { models } from "@/config/db";
import { sequelize } from "@/config/db";
import { Op } from "sequelize";
import type { PedidoResumen, PedidoProducto } from "@/types/pedido.type";

export async function listarPedidosPorCliente(clienteId: number): Promise<PedidoResumen[]> {
  if (!clienteId) throw new Error("clienteId es requerido");

  const pedidos = await models.Pedido.findAll({
    where: { clienteId },
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
          "imagen",
        ],
        through: {
          attributes: ["cantidad", "precioUnitario", "observaciones"], // Detalle del join PedidoProducto
        },
        include: [
          {
            model: models.Categoria,
            as: "categoria",
            attributes: ["id", "nombre", "slug", "orden"],
          },
        ],
      },
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
      "createdAt",
    ],
  });

  // Map a PedidoResumen[]
  return pedidos.map((pedido: any) => ({
    id: pedido.id,
    clienteId: pedido.clienteId,
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
      observaciones: producto.PedidoProducto?.observaciones ?? "",
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
        categoria: producto.categoria,
      },
    })),
  }));
}

export async function cancelarPedido(id: number) {
  const pedido = await models.Pedido.findByPk(id);
  if (!pedido) {
    console.error("[cancelarPedido] Pedido no encontrado:", id);
    throw new Error("Pedido no encontrado");
  }
  pedido.estadoPedidoId = 5;
  await pedido.save();
}

export async function obtenerPedidoPorId(pedidoId: number) {
  if (!pedidoId) throw new Error("pedidoId es requerido");

  const pedido: any = await models.Pedido.findOne({
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
          "imagen",
        ],
        through: {
          attributes: ["cantidad", "precioUnitario", "observaciones"], // Detalle del join PedidoProducto
        },
        include: [
          {
            model: models.Categoria,
            as: "categoria",
            attributes: ["id", "nombre", "slug", "orden"],
          },
        ],
      },
    ],
    attributes: [
      "id",
      "total",
      "estadoPedidoId",
      "estadoEdicion",
      "fechaEdicion",
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
      "createdAt",
    ],
  });

  if (!pedido) throw new Error("Pedido no encontrado");

  // --- Limpiar edición si expiró ---
  if (pedido.estadoEdicion && pedido.fechaEdicion) {
    const fechaEdicionMs = new Date(pedido.fechaEdicion).getTime();
    const tiempoTranscurrido = (Date.now() - fechaEdicionMs) / 1000;
    if (tiempoTranscurrido > 1800) {
      await pedido.update({ estadoEdicion: false, fechaEdicion: null });
      pedido.estadoEdicion = false;
      pedido.fechaEdicion = null;
    }
  }

  return {
    id: pedido.id,
    total: pedido.total,
    estadoPedidoId: pedido.estadoPedidoId,
    estadoEdicion: pedido.estadoEdicion,
    fechaEdicion: pedido.fechaEdicion,
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
      observaciones: producto.PedidoProducto?.observaciones ?? "",
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
        categoria: producto.categoria,
      },
    })),
  };
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
    fechaEdicion,
  });
  return pedido;
}

export async function duplicarPedidoACarrito(
  pedidoId: number,
  clienteId: number
) {
  const t = await sequelize.transaction();
  try {
    // 1. Traer pedido y detalles originales
    const pedido = await models.Pedido.findByPk(pedidoId, { transaction: t });
    if (!pedido) throw new Error("Pedido no encontrado");
    const ipId = pedido.ipId; // <== FIX: ahora ipId existe

    const detalles = await models.PedidoProducto.findAll({
      where: { pedidoId },
      transaction: t,
    });

    // 2. Crear nuevo carrito
    const nuevoCarrito = await models.Carrito.create(
      {
        clienteId,
        total: 0,
        estadoEdicion: 1,
      },
      { transaction: t }
    );

    let total = 0;
    const productosAgregados = [];
    const productosSinStock = [];

    for (const item of detalles) {
      const producto = await models.Producto.findByPk(item.productoId, {
        transaction: t,
      });
      if (!producto) {
        productosSinStock.push({
          productoId: item.productoId,
          motivo: "Producto discontinuado o no encontrado",
        });
        continue;
      }
      if (producto.stock < item.cantidad) {
        productosSinStock.push({
          productoId: item.productoId,
          motivo: `Stock insuficiente (${producto.stock} disponibles)`,
        });
        continue;
      }
      // Ok, lo agregás al carrito con precio actualizado
      await models.CarritoProducto.create(
        {
          carritoId: nuevoCarrito.id,
          productoId: producto.id,
          cantidad: item.cantidad,
          observaciones: item.observaciones || "",
          precioUnitario: producto.precio,
        },
        { transaction: t }
      );
      productosAgregados.push({
        productoId: producto.id,
        cantidad: item.cantidad,
        observaciones: item.observaciones || "",
        precioUnitario: producto.precio,
      });
      total += Number(item.cantidad) * Number(producto.precio);
    }

    // Actualizás total del carrito
    await nuevoCarrito.update({ total }, { transaction: t });

    await t.commit();

    return {
      carritoId: nuevoCarrito.id,
      productosAgregados,
      productosSinStock,
    };
  } catch (error) {
    await t.rollback();
    throw error;
  }
}

export async function iniciarEdicionPedido(pedidoId: number) {
  // 1. Traer el pedido a editar (con productos y clienteId)
  const pedido: any = await models.Pedido.findOne({
    where: { id: pedidoId },
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
        through: { attributes: ["cantidad", "precioUnitario", "observaciones"] },
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
      "clienteId",
      "total",
      "estadoPedidoId",
      "estadoEdicion",
      "fechaEdicion",
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
  if (!pedido) throw new Error("Pedido no encontrado");

  // 2. Desactivar estadoEdicion en otros pedidos de este cliente
  await models.Pedido.update(
    { estadoEdicion: false, fechaEdicion: null },
    { where: { clienteId: pedido.clienteId } }
  );

  // 3. Poner en edición el pedido actual
  await pedido.update({
    estadoEdicion: true,
    fechaEdicion: new Date()
  });

  // 4. Buscar o crear carrito del cliente
  let carrito = await models.Carrito.findOne({
    where: { clienteId: pedido.clienteId }
  });
  if (!carrito) {
    carrito = await models.Carrito.create({
      clienteId: pedido.clienteId,
      total: 0,
      estadoEdicion: 1,
      fechaEdicion: new Date(),
      pedidoId: pedidoId
    });
  } else {
    // Actualizá estado y fecha
    await carrito.update({
      estadoEdicion: 1,
      fechaEdicion: new Date(),
      pedidoId: pedidoId
    });
    // Borrá todos los productos anteriores
    await models.CarritoProducto.destroy({ where: { carritoId: carrito.id }, force: true });
  }

  // 5. Cargar productos del pedido en CarritoProducto
  let total = 0;
  // Traé productos de la relación N:N (Pedido -> productos) usando pedido.productos
  for (const producto of pedido.productos) {
    const { cantidad, precioUnitario, observaciones } = producto.PedidoProducto;
    await models.CarritoProducto.create({
      carritoId: carrito.id,
      productoId: producto.id,
      cantidad,
      precioUnitario,
      observaciones: observaciones ?? ""
    });
    total += Number(cantidad) * Number(precioUnitario);
  }

  // 6. Actualizá total y observaciones del carrito
  await carrito.update({
    total,
    observaciones: pedido.observaciones || ""
  });

  // 7. Listo, devolvés el pedido actualizado (opcional: también el carrito)
  return pedido;
}

export async function confirmarEdicionPedido(
  pedidoId: number,
  data: {
    carritoId: number;
    direccion?: string;
    localidad?: string;
    provincia?: string;
    codigoPostal?: string;
    formaEnvio?: string;
    transporte?: string;
    formaPago?: string;
  }) {
  const t = await sequelize.transaction();
  try {
    // 1. Traer el pedido original
    const pedido = await models.Pedido.findByPk(pedidoId, { transaction: t });
    if (!pedido) throw new Error("Pedido no encontrado");

    // 2. Traer el carrito de edición
    const carrito = await models.Carrito.findByPk(data.carritoId, {
      include: [
        {
          model: models.CarritoProducto,
          as: "items",
        }
      ],
      transaction: t,
    });
    if (!carrito) throw new Error("Carrito no encontrado");

    // 3. Validar que el carrito está en modo edición
    if (!carrito.estadoEdicion) throw new Error("El carrito no está en modo edición");

    // 4. Sobreescribir encabezado del pedido con datos del carrito
    //   (actualizá solo campos que el usuario puede modificar)
    await pedido.update(
      {
        total: carrito.total,
        observaciones: carrito.observaciones || "",
        estadoEdicion: false,
        fechaEdicion: null,
        direccion: data.direccion ?? pedido.direccion,
        localidad: data.localidad ?? pedido.localidad,
        provincia: data.provincia ?? pedido.provincia,
        codigoPostal: data.codigoPostal ?? pedido.codigoPostal,
        formaEnvio: data.formaEnvio ?? pedido.formaEnvio,
        transporte: data.transporte ?? pedido.transporte,
        formaPago: data.formaPago ?? pedido.formaPago,
      },
      { transaction: t }
    );

    // 5. Eliminar todos los productos actuales del pedido
    await models.PedidoProducto.destroy({
      where: { pedidoId },
      force: true,
      transaction: t,
    });

    // 6. Agregar los nuevos productos del carrito al pedido
    const items = await models.CarritoProducto.findAll({
      where: { carritoId: data.carritoId },
      transaction: t,
    });

    if (!items.length) {
      throw new Error("No se puede guardar un pedido sin productos.");
    }

    for (const item of items) {
      await models.PedidoProducto.create(
        {
          pedidoId,
          productoId: item.productoId,
          cantidad: item.cantidad,
          precioUnitario: item.precioUnitario,
          observaciones: item.observaciones || "",
        },
        { transaction: t }
      );
    }

    // 7. Eliminar el carrito de edición (o ponerlo inactivo)
    await carrito.destroy({ force: true, transaction: t });

    await t.commit();
    return true;
  } catch (error) {
    await t.rollback();
    throw error;
  }
}
