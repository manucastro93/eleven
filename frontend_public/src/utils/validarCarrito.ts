import type { ConfirmarCarritoPayload } from "@/types/carrito.type";

export function validarCarrito(payload: Partial<ConfirmarCarritoPayload>): string | null {
  if (!payload.telefono) return "Verificá tu WhatsApp antes de continuar.";
  if (!payload.email) return "Verificá el email antes de continuar.";
  if (!payload.direccion || !payload.localidad || !payload.provincia) return "Completá la dirección.";
  if (!payload.formaEnvio) return "Seleccioná la forma de entrega.";
  if (!payload.formaPago) return "Seleccioná la forma de pago.";
  return null; // OK
}
