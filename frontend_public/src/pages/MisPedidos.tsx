import { createSignal, For, Show } from "solid-js";
import type { PedidoResumen, Pedido } from "@/types/pedido.type";
import { formatearPrecio } from "@/utils/formato";
import ModalDetallePedido from "@/components/MisPedidos/ModalDetallePedido";

const pedidosMock: Pedido[] = [
  {
    id: 1,
    cliente: {
      id: 1,
      nombre: "Juan Pérez",
      email: "juan@example.com",
      telefono: "1234567890",
      cuitOCuil: "20-12345678-9",
      direccion: "Calle Falsa 123",
      localidad: "Córdoba",
      provincia: "Córdoba"
    },
    productos: [
      {
        productoId: 1,
        cantidad: 2,
        producto: {
          id: 1,
          nombre: "Mate Imperial",
          descripcion: "Mate de alta calidad",
          codigo: "MAT-001",
          precio: 2500,
          imagenes: [{ id: 1, url: "/img/productos/prod1.png", orden: 1 }],
          activo: true,
          categorias: [],
          categoria: { id: 1, nombre: "Mates", slug: "mates", orden: 1 },
          slug: "mate-imperial"
        }
      }
    ],
    estadoPedidoId: 1,
    metodoEnvioId: 1,
    metodoPagoId: 1,
    total: 5000,
    createdAt: "2024-07-11T10:00:00Z"
  },
  {
    id: 2,
    cliente: {
      id: 1,
      nombre: "Juan Pérez",
      email: "juan@example.com",
      telefono: "1234567890",
      cuitOCuil: "20-12345678-9",
      direccion: "Calle Falsa 123",
      localidad: "Córdoba",
      provincia: "Córdoba"
    },
    productos: [
      {
        productoId: 2,
        cantidad: 1,
        producto: {
          id: 2,
          nombre: "Termo Acero",
          descripcion: "Termo 1L acero inoxidable",
          codigo: "TER-002",
          precio: 8000,
          imagenes: [{ id: 2, url: "/img/productos/prod2.png", orden: 1 }],
          activo: true,
          categorias: [],
          categoria: { id: 2, nombre: "Termos", slug: "termos", orden: 2 },
          slug: "termo-acero"
        }
      }
    ],
    estadoPedidoId: 3,
    metodoEnvioId: 1,
    metodoPagoId: 2,
    total: 8000,
    createdAt: "2024-07-10T14:30:00Z"
  }
];

function formatearFecha(fecha: string): string {
  const d = new Date(fecha);
  return `${d.getDate().toString().padStart(2, "0")}/${(d.getMonth() + 1)
    .toString()
    .padStart(2, "0")}/${d.getFullYear()}`;
}

export default function MisPedidos() {
  const [pedidoSeleccionado, setPedidoSeleccionado] = createSignal<number | null>(null);

  const getColor = (estadoId: number) => {
    switch (estadoId) {
      case 1: return "bg-blue-100";     // En proceso
      case 2: return "bg-yellow-100";   // Enviado
      case 3: return "bg-green-100";    // Entregado
      case 4: return "bg-red-100";      // Cancelado
      default: return "bg-gray-100";
    }
  };

  return (
    <div class="max-w-4xl mx-auto px-4 py-8">
      <h1 class="text-2xl font-bold mb-6">Mis pedidos</h1>

      <For each={pedidosMock}>
        {(pedido) => (
          <div
            class={`rounded shadow p-4 mb-4 cursor-pointer transition ${getColor(pedido.estadoPedidoId)}`}
            onClick={() => setPedidoSeleccionado(pedido.id)}
          >
            <div class="flex justify-between">
              <div>
                <p class="font-semibold">Pedido #{pedido.id}</p>
                <p class="text-sm text-gray-600">Fecha: {formatearFecha(pedido.createdAt)}</p>
              </div>
              <div class="text-right">
                <p class="font-semibold text-sm">Total: {formatearPrecio(pedido.total)}</p>
              </div>
            </div>
          </div>
        )}
      </For>

      <Show when={pedidoSeleccionado()}>
        <ModalDetallePedido
          pedido={pedidosMock.find(p => p.id === pedidoSeleccionado())!}
          onClose={() => setPedidoSeleccionado(null)}
        />
      </Show>
    </div>
  );
}
