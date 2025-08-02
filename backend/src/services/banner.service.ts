import { models } from '@/config/db';
import { Op } from 'sequelize';

interface ListarBannersParams {
  search?: string;
  limit?: number;
  offset?: number;
}

export async function listarBanners({
  search = '',
  limit = 20,
  offset = 0
}: ListarBannersParams) {
  const where: any = {};

  // Si se pasa un término de búsqueda, se filtra por texto de los banners
  if (search) {
    where.texto = { [Op.like]: `%${search}%` };
  }

  // Consulta para obtener los banners con paginación
  const { rows, count } = await models.Banner.findAndCountAll({
    where,
    limit,
    offset,
    order: [['orden', 'ASC']] // Ordenamos por fecha de creación (más recientes primero)
  });
  return { banners: rows, total: count };
}

export async function obtenerBannerPorId(id: number) {
  return models.Banner.findByPk(id);
}

export async function crearBanner(data: any) {
  // Obtener el orden más alto actual
  const maxOrden = await models.Banner.max('orden');
  const nuevoOrden = typeof maxOrden === 'number' ? maxOrden + 1 : 0;
  return models.Banner.create({
    ...data,
    orden: nuevoOrden,
  });
}


export async function actualizarBanner(id: number, data: any) {
  const banner = await models.Banner.findByPk(id);
  if (!banner) throw new Error('Banner no encontrado');
  await banner.update(data); // Actualizamos el banner con los nuevos datos
  return banner;
}

export async function eliminarBanner(id: number) {
    try {
      const banner = await models.Banner.findByPk(id);
      if (!banner) throw new Error('Banner no encontrado');
  
      await banner.destroy(); 
  
      return banner;
    } catch (error) {
      throw new Error('Error al eliminar el banner');
    }
  }

export async function actualizarOrdenBanners(listaOrden: { id: number; orden: number }[]) {
  const promises = listaOrden
    .filter(({ id }) => !!id && !isNaN(id))
    .map(({ id, orden }) =>
      models.Banner.update({ orden }, { where: { id } })
    );

  await Promise.all(promises);
}

  
