import {
  createContext,
  useContext,
  createSignal,
  createEffect,
  type JSX,
} from 'solid-js';

export type ItemCarrito = {
  id: number;
  nombre: string;
  precio: number;
  cantidad: number;
  imagen?: string;
  comentario?: string;
};

type CarritoContextType = {
  carrito: () => ItemCarrito[];
  setCarrito: (items: ItemCarrito[]) => void;
  agregarAlCarrito: (item: ItemCarrito) => void;
  quitarDelCarrito: (id: number) => void;
  vaciarCarrito: () => void;
  total: () => number;
  mostrarCarrito: () => boolean;
  setMostrarCarrito: (v: boolean) => void;
  pasoCarrito: () => 1 | 2;
  setPasoCarrito: (v: 1 | 2) => void;
  comentarioGeneral: () => string;
  setComentarioGeneral: (v: string) => void;
};

const CarritoContext = createContext<CarritoContextType>();

export function CarritoProvider(props: { children: JSX.Element }) {
  const stored = localStorage.getItem('carrito');
  const [carrito, setCarrito] = createSignal<ItemCarrito[]>(
    stored ? JSON.parse(stored) : []
  );

  const storedComentario = localStorage.getItem('comentarioGeneral');
  const [comentarioGeneral, setComentarioGeneral] = createSignal(
    storedComentario || ''
  );

  const [mostrarCarrito, setMostrarCarrito] = createSignal(false);
  const [pasoCarrito, setPasoCarrito] = createSignal<1 | 2>(1);

  createEffect(() => {
    localStorage.setItem('carrito', JSON.stringify(carrito()));
  });

  createEffect(() => {
    localStorage.setItem('comentarioGeneral', comentarioGeneral());
  });

  const agregarAlCarrito = (item: ItemCarrito) => {
    setCarrito(prev => {
      const existente = prev.find(p => p.id === item.id);
      if (existente) {
        return prev.map(p =>
          p.id === item.id
            ? { ...p, cantidad: p.cantidad + item.cantidad }
            : p
        );
      }
      return [...prev, item];
    });
    // No se abre más automáticamente
    setPasoCarrito(1);
  };

  const quitarDelCarrito = (id: number) => {
    setCarrito(prev => prev.filter(p => p.id !== id));
  };

  const vaciarCarrito = () => setCarrito([]);

  const total = () =>
    carrito().reduce((sum, p) => sum + p.precio * p.cantidad, 0);

  return (
    <CarritoContext.Provider
      value={{
        carrito,
        setCarrito,
        agregarAlCarrito,
        quitarDelCarrito,
        vaciarCarrito,
        total,
        mostrarCarrito,
        setMostrarCarrito,
        pasoCarrito,
        setPasoCarrito,
        comentarioGeneral,
        setComentarioGeneral,
      }}
    >
      {props.children}
    </CarritoContext.Provider>
  );
}

export const useCarrito = () => {
  const ctx = useContext(CarritoContext);
  if (!ctx)
    throw new Error('useCarrito debe usarse dentro de <CarritoProvider>');
  return ctx;
};
