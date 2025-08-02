import type { ClienteFormulario } from "@/types/cliente.type";

export function guardarClienteEnLocalStorage(cliente: ClienteFormulario) {
  localStorage.setItem("cliente", JSON.stringify(cliente));
}

export function obtenerClienteDeLocalStorage(): ClienteFormulario | null {
  const data = localStorage.getItem("cliente");
  return data ? JSON.parse(data) : null;
}

export function actualizarClienteEnLocalStorage(
  campo: keyof ClienteFormulario | string,
  valor: any
) {
  const data = localStorage.getItem("cliente");
  let cliente = data ? JSON.parse(data) : {};
  cliente[campo] = valor;
  localStorage.setItem("cliente", JSON.stringify(cliente));
}
