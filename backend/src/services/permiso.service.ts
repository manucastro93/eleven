
import { models } from '@/config/db';

export async function listarPermisos() {
  return await models.Permiso.findAll({
    include: [{ model: models.Modulo }],
    order: [['moduloId', 'ASC'], ['accion', 'ASC']]
  });
}

export async function listarPermisosPorRol(rolUsuarioId: number) {
  const permisos = await models.Permiso.findAll({
    where: { rolUsuarioId },
    include: [{ model: models.Modulo, as: 'modulo' }],
    order: [
      [{ model: models.Modulo, as: 'modulo' }, 'grupo', 'ASC'],
      [{ model: models.Modulo, as: 'modulo' }, 'orden', 'ASC'],
      ['accion', 'ASC']
    ]
  });

  const permisosPorModulo = permisos.reduce((acc: any[], permiso: any) => {
    const moduloId = permiso.moduloId;
    const moduloNombre = permiso.modulo?.nombre || '';
    const ruta = permiso.modulo?.ruta || '';
    const icono = permiso.modulo?.icono || '';
    const grupo = permiso.modulo?.grupo || '';
    const orden = permiso.modulo?.orden || 0;

    let modulo = acc.find((m) => m.moduloId === moduloId);
    if (!modulo) {
      modulo = {
        moduloId,
        moduloNombre,
        ruta,
        icono,
        grupo,
        orden,
        acciones: []
      };
      acc.push(modulo);
    }

    modulo.acciones.push(permiso.accion);

    return acc;
  }, []);

  // Orden final
  permisosPorModulo.sort((a, b) => a.orden - b.orden);

  return permisosPorModulo;
}