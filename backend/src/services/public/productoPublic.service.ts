import { Op, Sequelize } from "sequelize";
import { models } from "@/config/db";
import dayjs from "dayjs";

interface FiltrosProducto {
  categoria?: string;
  busqueda?: string;
  orden?: string;
  pagina?: number;
  limite?: number;
}

export async function listarProductosPublicos({
  categoria,
  busqueda = "",
  orden = "nombre-asc",
  pagina = 1,
  limite = 12,
}: FiltrosProducto) {
  const offset = (pagina - 1) * limite;

  const where: any = { activo: true };
  if (busqueda) {
    where[Op.or] = [
      { nombre: { [Op.iLike]: `%${busqueda}%` } },
      { codigo: { [Op.iLike]: `%${busqueda}%` } },
    ];
  }

  const include: any[] = [
    {
      model: models.ImagenProducto,
      as: "imagenes",
    },
    {
      model: models.Categoria,
      as: "categoria",
    },
  ];

  // Si viene categoría por slug
  if (categoria && categoria !== "todos") {
    include.push({
      model: models.Categoria,
      as: "categoria",
      where: { slug: categoria },
      required: true,
    });
  }

  let attributes: any = undefined;
  let group: any = undefined;
  let order: any = [["nombre", "ASC"]];

  if (orden === "precio-asc") order = [["precio", "ASC"]];
  else if (orden === "precio-desc") order = [["precio", "DESC"]];
  else if (orden === "nombre-desc") order = [["nombre", "DESC"]];
  else if (orden === "novedades" || orden === "fecha-desc") {
    order = [["createdAt", "DESC"]];
  } else if (orden === "destacado") {
  attributes = {
    include: [
      [
        Sequelize.literal(`(
          SELECT SUM(pp.cantidad)
          FROM PedidosProductos AS pp
          INNER JOIN Pedidos AS p ON pp.pedidoId = p.id
          WHERE pp.productoId = Producto.id
            AND p.deletedAt IS NULL
            AND pp.deletedAt IS NULL
            AND p.createdAt >= '${dayjs().subtract(1, "month").format("YYYY-MM-DD HH:mm:ss")}'
        )`),
        "ventasUltimoMes",
      ],
    ],
  };

  order = [[Sequelize.literal("ventasUltimoMes"), "DESC"]];
}


  const productos = await models.Producto.findAll({
    where,
    include,
    attributes,
    group,
    order,
    offset,
    limit: limite,
  });

  return productos;
}
