import { ItemMenu } from '@/models/ItemMenu';
import slugify from "slugify";

export async function listarItems() {
  return await ItemMenu.findAll({
    order: [['orden', 'ASC']]
  });
}

export async function crearItem(data: {
  nombre: string;
  activo?: boolean;
  icono?: string;
}) {
  const slug = slugify(data.nombre, { lower: true, strict: true });

  const maxOrdenRaw = await ItemMenu.max("orden");
  const maxOrden = typeof maxOrdenRaw === "number" ? maxOrdenRaw : 0;
  const nuevoOrden = maxOrden + 1;

  return await ItemMenu.create({
    nombre: data.nombre,
    slug,
    activo: data.activo ?? true,
    icono: data.icono,
    orden: nuevoOrden,
  });
}


export async function eliminarItem(id: number) {
  const item = await ItemMenu.findByPk(id);
  if (!item) throw new Error('Item no encontrado');
  await item.destroy();
}

export async function editarItem(id: number, data: {
  nombre?: string;
  slug?: string;
  activo?: boolean;
  icono?: string;
}) {
  const item = await ItemMenu.findByPk(id);
  if (!item) throw new Error('Item no encontrado');
  await item.update(data);
  return item;
}

export async function actualizarOrdenItems(ids: { id: number; orden: number }[]) {
  const updates = ids.map(({ id, orden }) =>
    ItemMenu.update({ orden }, { where: { id } })
  );
  await Promise.all(updates);
}