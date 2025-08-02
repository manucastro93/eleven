// ✅ store/carrito.ts
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
  codigo: string;
  precio: number;
  cantidad: number;
  imagen?: string;
  comentario?: string;
  slug: string;
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

const [versionCarrito, setVersionCarrito] = createSignal(0);

export function CarritoProvider(props: { children: JSX.Element }) {
  const stored = localStorage.getItem('carrito');
  const [carrito, setCarritoRaw] = createSignal<ItemCarrito[]>(
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
    setCarritoRaw(prev => {
      const existente = prev.find(p => p.id === item.id);
      const actualizado = existente
        ? prev.map(p =>
            p.id === item.id
              ? { ...p, cantidad: p.cantidad + item.cantidad }
              : p
          )
        : [...prev, item];
      return actualizado;
    });
    setPasoCarrito(1);
    setVersionCarrito(v => v + 1);
  };

  const quitarDelCarrito = (id: number) => {
    setCarritoRaw(prev => {
      const actualizado = prev.filter(p => p.id !== id);
      setVersionCarrito(v => v + 1);
      return actualizado;
    });
  };

  const vaciarCarrito = () => {
    setCarritoRaw([]);
    setVersionCarrito(v => v + 1);
  };

  const total = () =>
    carrito().reduce((sum, p) => sum + p.precio * p.cantidad, 0);

  const wrappedSetCarrito = (items: ItemCarrito[]) => {
    setCarritoRaw(items);
    setVersionCarrito(v => v + 1);
  };

  return (
    <CarritoContext.Provider
      value={{
        carrito,
        setCarrito: wrappedSetCarrito,
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

export { versionCarrito };
