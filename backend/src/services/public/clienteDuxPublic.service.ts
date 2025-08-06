import { models } from "@/config/db";

export async function buscarClientePorCuit(cuit: string) {
  const cliente = await models.ClienteDux.findOne({
    where: { cuitCuil: cuit }
  });
  return cliente;
}
