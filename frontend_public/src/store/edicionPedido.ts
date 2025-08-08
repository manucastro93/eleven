import { createSignal } from "solid-js";
import { iniciarEdicionPedido as apiIniciarEdicion } from "@/services/pedido.service";
import { actualizarClienteEnLocalStorage } from "@/utils/localStorage";
import type { Pedido } from "@/types/pedido.type";
import { opcionesPago, opcionesEnvio } from "@/constants/opciones";

const [pedidoEditando, setPedidoEditando] = createSignal<Pedido | null>(null);

export async function iniciarEdicionPedido(pedidoId: number) {
  // 1. Marcar el pedido en edición y obtenerlo
  const pedido = await apiIniciarEdicion(pedidoId);
  setPedidoEditando(pedido);

  // 2. Setear datos del cliente en localStorage (si querés, esto sí tiene sentido)
  actualizarClienteEnLocalStorage("telefono", pedido.telefono);
  actualizarClienteEnLocalStorage("email", pedido.email);
  actualizarClienteEnLocalStorage("nombre", pedido.nombreFantasia);
  actualizarClienteEnLocalStorage("cuitOCuil", pedido.cuit);
  actualizarClienteEnLocalStorage("razonSocial", pedido.razonSocial);
  actualizarClienteEnLocalStorage("direccion", pedido.direccion);
  actualizarClienteEnLocalStorage("localidad", pedido.localidad);
  actualizarClienteEnLocalStorage("provincia", pedido.provincia);
  actualizarClienteEnLocalStorage("codigoPostal", pedido.codigoPostal);
  actualizarClienteEnLocalStorage("transporte", pedido.transporte);

  // Forma de envío: buscá el objeto por label o value
  const formaEnvioObj =
    opcionesEnvio.find(opt => opt.label === pedido.formaEnvio || opt.value === pedido.formaEnvio) ?? null;
  actualizarClienteEnLocalStorage("formaEnvio", formaEnvioObj);

  // Forma de pago: buscá el objeto por label o value
  const formaPagoObj =
    opcionesPago.find(opt => opt.label === pedido.formaPago || opt.value === pedido.formaPago) ?? null;
  actualizarClienteEnLocalStorage("formaPago", formaPagoObj);
}

export { pedidoEditando };
