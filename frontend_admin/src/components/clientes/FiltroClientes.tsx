interface Props {
  filtro: {
    search: string;
    page: number;
  };
  setFiltro: (f: any) => void;
}

export default function FiltroClientes(props: Props) {
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
        placeholder="Buscar por nombre, CUIT o email"
        class="border border-gray-300 rounded px-3 py-2 w-64"
      />
    </div>
  );
}
