import { createSignal, createEffect } from "solid-js";
import { listarClientes } from "@/services/cliente.service";
import { listarEstadosPedido } from "@/services/estadoPedido.service";

interface Props {
  filtro: {
    search: string;
    clienteId: number | null;
    estadoId: number | null;
    page: number;
  };
  setFiltro: (f: any) => void;
}

export default function FiltroPedidos(props: Props) {
  const [clientes, setClientes] = createSignal<{ id: number; nombre: string }[]>([]);
  const [estados, setEstados] = createSignal<{ id: number; nombre: string }[]>([]);

    createEffect(async () => {
    try {
        const res = await listarClientes();
        setClientes(res.clientes);
        
        const resEstados = await listarEstadosPedido();
        setEstados(resEstados);
    } catch (err) {
        console.error("Error al cargar filtros:", err);
        setClientes([]);
        setEstados([]);
    }
    });

  return (
    <div class="flex flex-wrap gap-4 mb-6">
      <input
        type="text"
        value={props.filtro.search}
        onInput={(e) =>
          props.setFiltro({
            ...props.filtro,
            search: e.currentTarget.value,
            page: 1,
          })
        }
        placeholder="Buscar por Nº Pedido o Cliente"
        class="border border-gray-300 rounded px-3 py-2 w-64"
      />

      <select
        value={props.filtro.clienteId || ""}
        onInput={(e) =>
          props.setFiltro({
            ...props.filtro,
            clienteId: e.currentTarget.value
              ? parseInt(e.currentTarget.value)
              : null,
            page: 1,
          })
        }
        class="border border-gray-300 rounded px-3 py-2 w-64"
      >
        <option value="">Todos los clientes</option>
        {clientes().map((cli) => (
          <option value={cli.id}>{cli.nombre}</option>
        ))}
      </select>

      <select
        value={props.filtro.estadoId || ""}
        onInput={(e) =>
          props.setFiltro({
            ...props.filtro,
            estadoId: e.currentTarget.value
              ? parseInt(e.currentTarget.value)
              : null,
            page: 1,
          })
        }
        class="border border-gray-300 rounded px-3 py-2 w-64"
      >
        <option value="">Todos los estados</option>
        {estados().map((est) => (
          <option value={est.id}>{est.nombre}</option>
        ))}
      </select>
    </div>
  );
}
