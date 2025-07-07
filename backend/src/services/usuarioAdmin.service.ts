import { models } from '@/config/db';
import bcrypt from 'bcrypt';
import { Op } from 'sequelize';

interface UsuarioAdminData {
  nombre: string;
  email: string;
  rolUsuarioId: number;
}

interface UsuarioAdminUpdateData {
  [key: string]: any;
  nombre?: string;
  rolUsuarioId?: number;
  activo?: boolean;
}

export async function crearUsuarioAdmin(data: UsuarioAdminData) {
  const { nombre, email, rolUsuarioId } = data;

  if (!nombre || !email || !rolUsuarioId) {
    throw new Error('Faltan datos obligatorios para crear el usuario.');
  }

  const existente = await models.UsuarioAdmin.findOne({ where: { email } });
  if (existente) throw new Error('Ya existe un usuario con ese email.');

  return await models.UsuarioAdmin.create({
    nombre,
    email,
    passwordHash: '',
    rolUsuarioId,
    activo: true
  });
}

export async function definirPassword(id: number, nuevaPassword: string) {
  const usuario = await models.UsuarioAdmin.findByPk(id);
  if (!usuario) throw new Error('Usuario no encontrado.');

  if (!nuevaPassword || nuevaPassword.length < 6) {
    throw new Error('La contraseña debe tener al menos 6 caracteres.');
  }

  const hash = await bcrypt.hash(nuevaPassword, 10);
  usuario.passwordHash = hash;
  await usuario.save();
  return usuario;
}

export async function actualizarUsuarioAdmin(id: number, data: UsuarioAdminUpdateData) {
  const usuario = await models.UsuarioAdmin.findByPk(id);
  if (!usuario) throw new Error('Usuario no encontrado.');

  const campos = ['nombre', 'rolUsuarioId', 'activo'];
  for (const campo of campos) {
    if (data[campo] !== undefined) {
      (usuario as any)[campo] = data[campo]; // evitar TS error de index
    }
  }

  await usuario.save();
  return usuario;
}

export async function listarUsuariosAdmin({
  search = '',
  limit = 20,
  offset = 0
}: {
  search?: string;
  limit?: number;
  offset?: number;
}) {
  return await models.UsuarioAdmin.findAndCountAll({
    where: {
      [Op.or]: [
        { nombre: { [Op.iLike]: `%${search}%` } },
        { email: { [Op.iLike]: `%${search}%` } }
      ]
    },
    include: [{ model: models.RolUsuario }],
    order: [['nombre', 'ASC']],
    limit,
    offset
  });
}

export async function obtenerUsuarioAdminPorId(id: number) {
  const usuario = await models.UsuarioAdmin.findByPk(id, {
    include: [{ model: models.RolUsuario }]
  });
  if (!usuario) throw new Error('Usuario no encontrado.');
  return usuario;
}

export async function desactivarUsuarioAdmin(id: number) {
  const usuario = await models.UsuarioAdmin.findByPk(id);
  if (!usuario) throw new Error('Usuario no encontrado.');

  usuario.activo = false;
  await usuario.save();
}
