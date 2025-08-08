import { Op, Sequelize } from "sequelize";
import { models } from "@/config/db";
import dayjs from "dayjs";

interface FiltrosProducto {
  categoria?: string;
  subcategoria?: string;
  busqueda?: string;
  orden?: string;
  pagina?: number;
  limite?: number;
}

export async function listarProductosPublicos({
  categoria,
  subcategoria,
  busqueda = "",
  orden = "nombre-asc",
  pagina = 1,
  limite = 12,
}: FiltrosProducto) {
  const offset = (pagina - 1) * limite;

  const where: any = {
    activo: true,
    stock: { [Op.gt]: 10 },
    precio: { [Op.gt]: 0 },
  };

  // ✅ Filtro por búsqueda (usando LIKE en lugar de ILIKE)
  if (busqueda) {
    where[Op.or] = [
      { nombre: { [Op.like]: `%${busqueda}%` } },
      { codigo: { [Op.like]: `%${busqueda}%` } },
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
    {
      model: models.Subcategoria,
      as: "subcategoria",
      required: !!subcategoria,
      where: subcategoria ? { slug: subcategoria } : undefined,
    },
  ];

  // ✅ Filtro por categoría
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

  // ✅ Ordenamientos disponibles
  if (orden === "precio-asc") order = [["precio", "ASC"]];
  else if (orden === "precio-desc") order = [["precio", "DESC"]];
  else if (orden === "nombre-desc") order = [["nombre", "DESC"]];
  else if (orden === "nombre-asc") order = [["nombre", "ASC"]];
  else if (orden === "novedades" || orden === "fecha_creacion-desc") {
    order = [["fecha_creacion", "DESC"]];
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

  // ✅ Consulta final
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

export async function obtenerProductoPorSlug(slug: string) {
  const producto = await models.Producto.findOne({
    where: {
      slug,
      activo: true,
    },
    include: [
      {
        model: models.ImagenProducto,
        as: "imagenes",
      },
      {
        model: models.Categoria,
        as: "categoria",
      },
      { model: models.Subcategoria, as: "subcategoria" },
    ],
  });

  return producto;
}

export async function listarProductosRelacionadosBackend(categoriaSlug: string, excluirId: number) {
  const productos = await models.Producto.findAll({
    where: {
      activo: true,
      id: { [Op.ne]: excluirId },
    },
    include: [
      {
        model: models.Categoria,
        as: "categoria",
        where: { slug: categoriaSlug },
        required: true,
      },
      {
        model: models.ImagenProducto,
        as: "imagenes",
      },
    ],
    limit: 10,
    order: [["createdAt", "DESC"]],
  });

  return productos;
}
