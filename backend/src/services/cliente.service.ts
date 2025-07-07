import { models } from "@/config/db";
import { Op } from "sequelize";

interface ListarClientesParams {
  search?: string;
  limit?: number;
  offset?: number;
  provincia?: string;
  localidad?: string;
}

export async function listarClientes({
  search = '',
  limit = 20,
  offset = 0,
  provincia,
  localidad
}: ListarClientesParams) {
  const where: any = {};

  if (search) {
    where[Op.or] = [
      { nombre: { [Op.like]: `%${search}%` } },
      { email: { [Op.like]: `%${search}%` } },
      { razonSocial: { [Op.like]: `%${search}%` } },
      { cuitOCuil: { [Op.like]: `%${search}%` } },
    ];
  }

  if (provincia) {
    where.provincia = { [Op.like]: `%${provincia}%` };
  }

  if (localidad) {
    where.localidad = { [Op.like]: `%${localidad}%` };
  }

  const { rows, count } = await models.Cliente.findAndCountAll({
    where,
    limit,
    offset,
    order: [['nombre', 'ASC']],
  });

  return { clientes: rows, total: count };
}


export async function obtenerClientePorId(id: number) {
  return models.Cliente.findByPk(id);
}

export async function actualizarClienteDesdeAdmin(id: number, data: any) {
  const cliente = await models.Cliente.findByPk(id);
  if (!cliente) throw new Error("Cliente no encontrado");
  await cliente.update(data);
  return cliente;
}

export async function crearClienteDesdeFormulario(data: {
  nombre: string;
  email: string;
  telefono?: string;
  razonSocial?: string;
  cuitOCuil: string;
  direccion: string;
  localidad: string;
  provincia: string;
}) {
  const {
    nombre,
    email,
    telefono,
    razonSocial,
    cuitOCuil,
    direccion,
    localidad,
    provincia,
  } = data;

  if (
    !nombre ||
    !email ||
    !cuitOCuil ||
    !direccion ||
    !localidad ||
    !provincia
  ) {
    throw new Error("Faltan datos obligatorios del cliente");
  }

  const existente = await models.Cliente.findOne({ where: { cuitOCuil } });

  if (existente) {
    await existente.update({
      nombre,
      email,
      telefono,
      razonSocial,
      direccion,
      localidad,
      provincia,
    });
    return existente;
  }

  return models.Cliente.create({
    nombre,
    email,
    telefono: telefono ?? "",
    razonSocial: razonSocial ?? "",
    cuitOCuil,
    direccion,
    localidad,
    provincia,
  });
}

export async function buscarClientePorCuit(cuitOCuil: string) {
  return models.Cliente.findOne({ where: { cuitOCuil } });
}
