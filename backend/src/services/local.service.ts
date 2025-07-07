import { models } from '@/config/db';
import type { LocalCreationAttributes } from '@/models/Local';

export async function getLocales() {
  return await models.Local.findAll({
    include: [{ model: models.Localidad }]
  });
}

export async function getLocalPorId(id: number) {
  return await models.Local.findByPk(id, {
    include: [{ model: models.Localidad }]
  });
}

export async function crearLocal(data: LocalCreationAttributes) {
  return await models.Local.create(data);
}

export async function actualizarLocal(id: number, data: Partial<LocalCreationAttributes>) {
  const local = await models.Local.findByPk(id);
  if (!local) throw new Error('Local no encontrado');
  return await local.update(data);
}
