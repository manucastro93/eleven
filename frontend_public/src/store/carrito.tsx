import {
  createContext,
  useContext,
  createSignal,
  createEffect,
  type JSX,
  observable,
} from 'solid-js';
import { asegurarSesionAnonima } from "@/utils/sesionAnonima";
import {
  getCarritoActivoPorSesion,
  crearCarrito,
  agregarProductoACarrito,
  eliminarProductoDeCarrito,
  actualizarCantidadProductoCarrito,
} from "@/services/carrito.service";
import { actualizarObservacionesEnCarrito as apiActualizarObservaciones } from "@/services/carrito.service";

export type ItemCarrito = {
  id: number;
  nombre: string;
  codigo: string;
  precio: number;
  cantidad: number;
  imagen?: string;
  observaciones?: string;
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
  observacionesGeneral: () => string;
  setObservacionesGeneral: (v: string) => void;
  actualizarCantidadEnCarrito: (productoId: number, cantidad: number, observaciones?: string) => Promise<void>;
  actualizarObservacionesEnCarrito: (productoId: number, cantidad: number, observaciones: string) => Promise<void>;
};

const CarritoContext = createContext<CarritoContextType>();

const [versionCarrito, setVersionCarrito] = createSignal(0);

async function asegurarCarritoBackend(): Promise<number> {
  const sesionAnonimaId = await asegurarSesionAnonima();
  let carrito = null;
  try {
    carrito = await getCarritoActivoPorSesion(sesionAnonimaId);
  } catch (_) {}
  if (!carrito) {
    carrito = await crearCarrito({
      sesionAnonimaId,
      total: 0,
      estadoEdicion: 1
    });
  }
  localStorage.setItem("carritoId", String(carrito.id));
  return carrito.id;
}

export function CarritoProvider(props: { children: JSX.Element }) {
  const stored = localStorage.getItem('carrito');
  const [carrito, setCarritoRaw] = createSignal<ItemCarrito[]>(
    stored ? JSON.parse(stored) : []
  );

  const storedObservaciones = localStorage.getItem('observacionesGeneral');
  const [observacionesGeneral, setObservacionesGeneral] = createSignal(
    storedObservaciones || ''
  );

  const [mostrarCarrito, setMostrarCarrito] = createSignal(false);
  const [pasoCarrito, setPasoCarrito] = createSignal<1 | 2>(1);

  createEffect(() => {
    localStorage.setItem('carrito', JSON.stringify(carrito()));
  });

  createEffect(() => {
    localStorage.setItem('observacionesGeneral', observacionesGeneral());
  });

  const agregarAlCarrito = async (item: ItemCarrito) => {
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

    try {
      const carritoId = await asegurarCarritoBackend();
      await agregarProductoACarrito({
        carritoId,
        productoId: item.id,
        cantidad: item.cantidad,
        precioUnitario: item.precio,
        observaciones: item.observaciones ? item.observaciones : undefined,
      });
    } catch (err) {
      console.error("No se pudo sincronizar el carrito backend:", err);
    }
  };

  const actualizarCantidadEnCarrito = async (productoId: number, cantidad: number, observaciones?: string) => {
    setCarritoRaw(prev => {
      const actualizado = prev.map(p =>
        p.id === productoId ? { ...p, cantidad } : p
      );
      setVersionCarrito(v => v + 1);
      return actualizado;
    });

    const carritoId = localStorage.getItem("carritoId");
    if (carritoId) {
      try {
        await actualizarCantidadProductoCarrito(Number(carritoId), productoId, cantidad, observaciones || "");
      } catch (err) {
        console.error("Error actualizando cantidad en backend:", err);
      }
    }
  };

  const quitarDelCarrito = async (id: number) => {
    setCarritoRaw(prev => {
      const actualizado = prev.filter(p => p.id !== id);
      setVersionCarrito(v => v + 1);
      return actualizado;
    });

    const carritoId = localStorage.getItem("carritoId");
    if (carritoId) {
      try {
        await eliminarProductoDeCarrito(Number(carritoId), id);
      } catch (err) {
        console.error("No se pudo eliminar el producto del carrito backend:", err);
      }
    }
  };

  const actualizarObservacionesEnCarrito = async (productoId: number, cantidad: number, observaciones: string) => {
    const carritoIdStr = localStorage.getItem("carritoId");
    if (!carritoIdStr) return;

    const carritoId = Number(carritoIdStr);
    try {
      await apiActualizarObservaciones(carritoId, productoId, cantidad, observaciones);
    } catch (error) {
      console.error("Error actualizando observaciones en backend:", error);
    }
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
        observacionesGeneral,
        setObservacionesGeneral,
        actualizarCantidadEnCarrito,
        actualizarObservacionesEnCarrito
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
