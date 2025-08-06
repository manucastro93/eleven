import { models } from "@/config/db";
import type { PedidoResumen } from "@/types/pedido.type";

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

  // Map a PedidoResumen[]
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

export async function cancelarPedido(id: number) {
  const pedido = await models.Pedido.findByPk(id);
  if (!pedido) {
    console.error("[cancelarPedido] Pedido no encontrado:", id);
    throw new Error('Pedido no encontrado');
  }
  pedido.estadoPedidoId = 5;
  await pedido.save();
}

