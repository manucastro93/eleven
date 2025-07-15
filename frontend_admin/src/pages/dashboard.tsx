import { createSignal, Show } from "solid-js";
import AdminLayout from "@/layout/AdminLayout";
import DashboardCard from "@/components/dashboard/DashboardCard";
import GraficoVentasMensuales from "@/components/dashboard/GraficoVentasMensuales";
import ModalPedidosPendientes from "@/components/dashboard/ModalPedidosPendientes";
import ModalPedidosEnProceso from "@/components/dashboard/ModalPedidosEnProceso";
import ModalPedidosDelMes from "@/components/dashboard/ModalPedidosDelMes";
import DetallePedidoModal from "@/components/dashboard/DetallePedidoModal";
import ModalProductosMasVendidos from "@/components/dashboard/ModalProductosMasVendidos";
import ModalCategoriasMasVendidas from "@/components/dashboard/ModalCategoriasMasVendidas";
import ModalStockBajo from "@/components/dashboard/ModalStockBajo";
import ModalClientesTop from "@/components/dashboard/ModalClientesTop";
import GraficoVentasDelMes from "@/components/dashboard/GraficoVentasDelMes";
import { calcularDiasDemora } from "@/utils/fecha.utils";
import {
  ShoppingCart,
  PackageCheck,
  PackageSearch,
  BarChart2,
  Tag,
  Layers,
  User
} from "lucide-solid";
import type { PedidoDashboard } from "@/types/pedido";

export default function DashboardPage() {
  const [mostrarModal, setMostrarModal] = createSignal(false);
  const [mostrarModalProceso, setMostrarModalProceso] = createSignal(false);
  const [mostrarModalMes, setMostrarModalMes] = createSignal(false);
  const [selectedPedido, setSelectedPedido] = createSignal<PedidoDashboard | null>(null);
  const [selectedProceso, setSelectedProceso] = createSignal<PedidoDashboard | null>(null);
  const [mostrarModalProductos, setMostrarModalProductos] = createSignal(false);
  const [mostrarModalCategorias, setMostrarModalCategorias] = createSignal(false);
  const [mostrarModalStock, setMostrarModalStock] = createSignal(false);
  const [mostrarModalClientesTop, setMostrarModalClientesTop] = createSignal(false);

  const pedidosDummy: PedidoDashboard[] = [
    {
      id: 101,
      cliente: "Juan Pérez",
      fecha: "2025-06-30",
      estado: "pendiente",
      items: [{ producto: "Mate Camionero", cantidad: 1 }],
      total: 15000,
    },
    {
      id: 102,
      cliente: "Lucía Gómez",
      fecha: "2025-07-06",
      estado: "pendiente",
      items: [{ producto: "Bombilla Acero", cantidad: 2 }],
      total: 6000,
    },
    {
      id: 103,
      cliente: "Carlos Díaz",
      fecha: "2025-07-03",
      estado: "pendiente",
      items: [{ producto: "Yerbera", cantidad: 1 }],
      total: 4000,
    },
    {
      id: 104,
      cliente: "Mariana Ríos",
      fecha: "2025-06-28",
      estado: "pendiente",
      items: [
        { producto: "Bolso Matero", cantidad: 1 },
        { producto: "Mate Imperial", cantidad: 1 },
      ],
      total: 25000,
    },
    {
      id: 105,
      cliente: "Eduardo Sosa",
      fecha: "2025-06-20",
      estado: "pendiente",
      items: [{ producto: "Mate Camionero", cantidad: 3 }],
      total: 45000,
    },
  ].map((p) => ({
    ...p,
    diasDemora: calcularDiasDemora(p.fecha),
  }));

  const pedidosProcesoDummy: PedidoDashboard[] = [
    {
      id: 201,
      cliente: "Laura Méndez",
      fecha: "2025-07-04",
      estado: "en_proceso",
      items: [{ producto: "Termo Acero", cantidad: 1 }],
      total: 10000,
    },
    {
      id: 202,
      cliente: "Pedro Acosta",
      fecha: "2025-06-30",
      estado: "en_proceso",
      items: [{ producto: "Set Matero", cantidad: 2 }],
      total: 30000,
    },
  ].map((p) => ({
    ...p,
    diasEnProceso: calcularDiasDemora(p.fecha),
  }));

  const productosMasVendidos = [
    { nombre: "Mate Camionero", cantidad: 125 },
    { nombre: "Bombilla Acero", cantidad: 85 },
    { nombre: "Termo Acero", cantidad: 60 },
    { nombre: "Set Matero", cantidad: 42 },
  ];

  const categoriasMasVendidas = [
    { nombre: "Accesorios", cantidad: 215 },
    { nombre: "Mates", cantidad: 143 },
    { nombre: "Termos", cantidad: 101 },
  ];

  const productosStockBajo = [
    { nombre: "Mate Camionero", codigo: "MAT-CAM-001", stock: 2 },
    { nombre: "Yerbera Clásica", codigo: "YER-CLAS-007", stock: 4 },
    { nombre: "Bolso Matero Eco", codigo: "BOL-MAT-015", stock: 1 },
  ];

  const clientesTop = [
    { nombre: "Juan Pérez", total: 25800, cantidadPedidos: 4 },
    { nombre: "Lucía Gómez", total: 19450, cantidadPedidos: 3 },
    { nombre: "Carlos Díaz", total: 13900, cantidadPedidos: 2 },
  ];

  return (
    <AdminLayout>
      <h1 class="text-2xl font-semibold mb-6">Dashboard</h1>

      {/* Tarjetas */}
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
        <DashboardCard
          icon={<ShoppingCart />}
          title="Pedidos del mes"
          value={(pedidosDummy.length + pedidosProcesoDummy.length).toString()}
          color="bg-blue-50"
          onClick={() => setMostrarModalMes(true)}
        />
        <DashboardCard
          icon={<PackageCheck />}
          title="Pedidos pendientes"
          value={pedidosDummy.length.toString()}
          color="bg-yellow-50"
          onClick={() => setMostrarModal(true)}
        />
        <DashboardCard
          icon={<PackageSearch />}
          title="Pedidos en proceso"
          value={pedidosProcesoDummy.length.toString()}
          color="bg-orange-50"
          onClick={() => setMostrarModalProceso(true)}
        />
        <DashboardCard
          icon={<BarChart2 />}
          title="Producto más vendido"
          value="Mate Camionero"
          color="bg-green-50"
          onClick={() => setMostrarModalProductos(true)}
        />
        <DashboardCard
          icon={<Tag />}
          title="Categoría más vendida"
          value="Accesorios"
          color="bg-purple-50"
          onClick={() => setMostrarModalCategorias(true)}
        />
        <DashboardCard
          icon={<Layers />}
          title="Stock bajo"
          value={`${productosStockBajo.length} productos`}
          color="bg-red-50"
          onClick={() => setMostrarModalStock(true)}
        />
        <DashboardCard
          icon={<User />}
          title="Cliente top"
          value="Juan Pérez"
          color="bg-indigo-50"
          onClick={() => setMostrarModalClientesTop(true)}
        />
      </div>

      {/* Gráfico */}

      <div class="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <GraficoVentasDelMes />
        <GraficoVentasMensuales />
      </div>


      {/* Modal Pedidos Pendientes */}
      <Show when={mostrarModal()}>
        <ModalPedidosPendientes
          pedidos={pedidosDummy}
          onClose={() => {
            setMostrarModal(false);
            setSelectedPedido(null);
          }}
          onVerDetalle={(pedido) => setSelectedPedido(pedido)}
        />
      </Show>

      {/* Detalle Pedido Pendiente */}
      <Show when={selectedPedido()}>
        <DetallePedidoModal
          pedido={selectedPedido()!}
          onClose={() => setSelectedPedido(null)}
        />
      </Show>

      {/* Modal Pedidos en Proceso */}
      <Show when={mostrarModalProceso()}>
        <ModalPedidosEnProceso
          pedidos={pedidosProcesoDummy}
          onClose={() => {
            setMostrarModalProceso(false);
            setSelectedProceso(null);
          }}
          onVerDetalle={(p) => setSelectedProceso(p)}
        />
      </Show>

      {/* Detalle Pedido en Proceso */}
      <Show when={selectedProceso()}>
        <DetallePedidoModal
          pedido={selectedProceso()!}
          onClose={() => setSelectedProceso(null)}
        />
      </Show>

      {/* Modal Pedidos del Mes */}
      <Show when={mostrarModalMes()}>
        <ModalPedidosDelMes
          pedidos={[...pedidosDummy, ...pedidosProcesoDummy]}
          onClose={() => setMostrarModalMes(false)}
          onVerDetalle={(pedido) => setSelectedPedido(pedido)}
        />
      </Show>

      <Show when={mostrarModalProductos()}>
        <ModalProductosMasVendidos
          productos={productosMasVendidos}
          onClose={() => setMostrarModalProductos(false)}
        />
      </Show>

      <Show when={mostrarModalCategorias()}>
        <ModalCategoriasMasVendidas
          categorias={categoriasMasVendidas}
          onClose={() => setMostrarModalCategorias(false)}
        />
      </Show>

      <Show when={mostrarModalStock()}>
        <ModalStockBajo
          productos={productosStockBajo}
          onClose={() => setMostrarModalStock(false)}
        />
      </Show>

      <Show when={mostrarModalClientesTop()}>
        <ModalClientesTop
          clientes={clientesTop}
          onClose={() => setMostrarModalClientesTop(false)}
        />
      </Show>

    </AdminLayout>
  );
}
