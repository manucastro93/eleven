import { MensajeInformativo } from "@/models/MensajeInformativo";
import { Op } from "sequelize";

interface CrearMensajeDTO {
  mensaje: string;
  activo?: boolean;
}

interface ActualizarMensajeDTO {
  mensaje?: string;
  activo?: boolean;
  orden?: number;
}

export async function listarMensajesPublicos() {
  return MensajeInformativo.findAll({
    where: { activo: true },
    order: [["orden", "ASC"]]
  });
}

export async function listarMensajesAdmin() {
  return MensajeInformativo.findAll({
    paranoid: false,
    order: [["orden", "ASC"]]
  });
}

export async function crearMensaje(data: CrearMensajeDTO) {
  return MensajeInformativo.create({
    mensaje: data.mensaje,
    activo: data.activo ?? true
  });
}

export async function actualizarMensaje(id: number, data: ActualizarMensajeDTO) {
  const mensaje = await MensajeInformativo.findByPk(id);
  if (!mensaje) throw new Error("Mensaje no encontrado");

  return mensaje.update(data);
}

export async function eliminarMensaje(id: number) {
  const mensaje = await MensajeInformativo.findByPk(id);
  if (!mensaje) throw new Error("Mensaje no encontrado");

  await mensaje.destroy(); // soft delete gracias a paranoid: true
}
