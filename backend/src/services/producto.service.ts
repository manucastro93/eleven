import { models } from '@/config/db';
import { Op } from 'sequelize';
import { promises as fs } from 'fs';
import path from "path";
import type { ProductoCreationAttributes } from '@/models/Producto';

interface ProductoUpdateData {
  nombre?: string;
  descripcion?: string;
  codigo?: string;
  precio?: number;
  activo?: boolean;
  stock?: number;
  categoriaId?: number;
  subcategoriaId?: number | null;
  imagen?: string | null;
  habilitado?: string | null;
  fecha_creacion?: Date | null;
  slug?: string;
}

export async function crearProducto(data: ProductoCreationAttributes, imagenes: string[] = []) {
  const {
    nombre, descripcion, codigo, precio, activo = true,
    stock, categoriaId, subcategoriaId = null, imagen = null,
    habilitado = null, fecha_creacion = null, slug = null,
  } = data;

  if (!nombre || !descripcion || !codigo || precio === undefined || stock === undefined || !categoriaId) {
    throw new Error('Faltan datos obligatorios para crear el producto.');
  }

  const existente = await models.Producto.findOne({ where: { codigo } });
  if (existente) throw new Error('Ya existe un producto con ese código.');

  const producto = await models.Producto.create({
    nombre,
    descripcion,
    codigo,
    precio,
    activo,
    stock,
    categoriaId,
    subcategoriaId,
    imagen: imagen ?? undefined,
    habilitado: habilitado ?? "SI",
    fecha_creacion,
    slug: slug ?? undefined,
    });

  await Promise.all(
    imagenes.map((url, index) =>
      models.ImagenProducto.create({ productoId: producto.id, url, orden: index })
    )
  );

  return producto;
}

export async function actualizarProducto(
  id: number,
  data: ProductoUpdateData,
  imagenes?: string[]
) {
  const producto = await models.Producto.findByPk(id);
  if (!producto) throw new Error('Producto no encontrado.');

  // Solo actualiza campos presentes en data
  for (const campo in data) {
    if (Object.prototype.hasOwnProperty.call(data, campo)) {
      (producto as any)[campo] = (data as any)[campo];
    }
  }

  await producto.save();

  if (imagenes) {
    await models.ImagenProducto.destroy({ where: { productoId: id } });

    await Promise.all(
      imagenes.map((url, index) =>
        models.ImagenProducto.create({ productoId: id, url, orden: index })
      )
    );
  }

  return producto;
}

export async function listarProductos({
  search = "",
  limit = 20,
  offset = 0,
  orderBy = "codigo",
  orderDir = "ASC",
  categoriaId = null
}: {
  search?: string;
  limit?: number;
  offset?: number;
  orderBy?: string;
  orderDir?: "ASC" | "DESC";
  categoriaId?: number | null;
}) {
  const searchFilter = search.trim();
  const where: any = {};

  if (searchFilter) {
    where[Op.or] = [
      { nombre: { [Op.like]: `%${searchFilter}%` } },
      { codigo: { [Op.like]: `%${searchFilter}%` } }
    ];
  }

  if (categoriaId) {
    where.categoriaId = categoriaId;
  }

  let order: any = [];

  if (orderBy === "categoria.nombre") {
    order = [[{ model: models.Categoria, as: "categoria" }, "nombre", orderDir]];
  } else {
    order = [[orderBy, orderDir]];
  }

  return await models.Producto.findAndCountAll({
    where,
    include: [
      { model: models.Categoria, as: "categoria" }, // principal
      { model: models.Subcategoria, as: "subcategoria" },
      {
        model: models.Categoria,
        as: "categoriasAdicionales", // adicionales
        through: { attributes: [] }
      },
      { model: models.ImagenProducto, as: "imagenes" }
    ],
    order,
    limit,
    offset
  });
}

export async function obtenerProductoPorId(id: number) {
  const producto = await models.Producto.findByPk(id, {
    include: [
      {
        model: models.ImagenProducto,
        as: "imagenes",
        separate: true,
        order: [['orden', 'ASC']]
      },
      {
        model: models.ItemMenu,
        as: "itemsMenu",
        through: { attributes: [] }
      },
      { model: models.Categoria, as: "categoria" },
      { model: models.Subcategoria, as: "subcategoria" },
    ]
  });

  if (!producto) throw new Error("Producto no encontrado.");

  return producto;
}

export async function eliminarImagen(id: number) {
  const img = await models.ImagenProducto.findByPk(id);
  if (!img) throw new Error('Imagen no encontrada.');

  const productoId = img.productoId;

  // 1️⃣ Eliminar la imagen
  await img.destroy();

  // 2️⃣ Reordenar las restantes
  const imagenes = await models.ImagenProducto.findAll({
    where: { productoId },
    order: [['orden', 'ASC']]
  });

  for (let i = 0; i < imagenes.length; i++) {
    imagenes[i].orden = i;
    await imagenes[i].save();
  }
}

export async function ordenarImagenes(productoId: number, ordenIds: number[]) {
  for (let i = 0; i < ordenIds.length; i++) {
    await models.ImagenProducto.update(
      { orden: i },
      { where: { id: ordenIds[i], productoId } }
    );
  }
}

export async function agregarImagenes(productoId: number, files: Express.Multer.File[]) {
  const producto = await models.Producto.findByPk(productoId);
  if (!producto) throw new Error('Producto no encontrado.');

  const imagenesActuales = await models.ImagenProducto.findAll({
    where: { productoId }
  });

  // Buscar máximo orden actual
  const maxOrden = imagenesActuales.reduce((max, img) => Math.max(max, img.orden), -1);

  const nuevasImagenes = [];

  for (let i = 0; i < files.length; i++) {
    const file = files[i];

    const extension = path.extname(file.originalname).toLowerCase() || '.jpg';

    const nombreBase = producto.codigo.replace(/[^a-zA-Z0-9]/g, ''); // limpio código
    const letra = String.fromCharCode(97 + maxOrden + i + 1); // 'a', 'b', ...

    const nombreArchivo = `${nombreBase}${letra}${extension}`;
    const filePath = path.join(__dirname, '..', '..', 'uploads', 'productos', nombreArchivo);

    await fs.writeFile(filePath, file.buffer);

    const nuevaImagen = await models.ImagenProducto.create({
      productoId,
      url: `/uploads/productos/${nombreArchivo}`,
      orden: maxOrden + i + 1
    });

    nuevasImagenes.push(nuevaImagen);
  }

  return nuevasImagenes;
}

export async function actualizarItemsMenuProducto(id: number, itemsMenuIds: number[]) {
  const producto = await models.Producto.findByPk(id);
  if (!producto) throw new Error("Producto no encontrado.");

  await producto.setItemsMenu(itemsMenuIds);
}
