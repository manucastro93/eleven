// src/services/public/clientesDuxPublic.service.ts
import { models } from "@/config/db";

export async function buscarClientePorCuit(cuit: string) {
  // Ajustá el modelo y campos si hay diferencias
  const cliente = await models.ClienteDux.findOne({
    where: { cuitCuil: cuit }
  });
  return cliente;
}
