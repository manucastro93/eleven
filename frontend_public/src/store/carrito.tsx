import {
  createContext,
  useContext,
  createSignal,
  createEffect,
  type JSX,
} from 'solid-js';
import { asegurarSesionAnonima } from "@/utils/sesionAnonima";
import {
  getCarritoActivo,
  getCarritoActivoPorSesion,
  crearCarrito,
  agregarProductoACarrito,
  eliminarProductoDeCarrito,
  actualizarCantidadProductoCarrito,
  actualizarObservacionesEnCarrito as apiActualizarObservaciones,
  finalizarEdicionCarrito,
} from "@/services/carrito.service";
import { obtenerClienteDeLocalStorage } from '@/utils/localStorage';

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
  inicializarCarrito: () => void;
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
  modoEdicion: () => boolean;
  fechaEdicion: () => string | null;
  tiempoRestanteEdicion: () => number | null;
  finalizarEdicion: () => Promise<void>;
  pedidoEditandoId: () => number | null;
  setPedidoEditandoId: (v: number) => void;
  carritoId: () => number | null;

};

const CarritoContext = createContext<CarritoContextType>();

function calcularTiempoRestante(fechaEdicion: string | null): number | null {
  if (!fechaEdicion) return null;
  const tiempoTranscurrido = (Date.now() - new Date(fechaEdicion).getTime()) / 1000;
  const restante = Math.max(0, 1800 - Math.floor(tiempoTranscurrido)); // 30min
  return restante > 0 ? restante : 0;
}

export function CarritoProvider(props: { children: JSX.Element }) {
  // State principal
  const [carrito, setCarrito] = createSignal<ItemCarrito[]>([]);
  const [carritoId, setCarritoId] = createSignal<number | null>(null);
  const [pedidoEditandoId, setPedidoEditandoId] = createSignal<number | null>(null);
  const [observacionesGeneral, setObservacionesGeneral] = createSignal('');
  const [mostrarCarrito, setMostrarCarrito] = createSignal(false);
  const [pasoCarrito, setPasoCarrito] = createSignal<1 | 2>(1);

  // Edición (control desde BD)
  const [modoEdicion, setModoEdicion] = createSignal(false);
  const [fechaEdicion, setFechaEdicion] = createSignal<string | null>(null);
  const [tiempoRestanteEdicion, setTiempoRestanteEdicion] = createSignal<number | null>(null);

  // ------ INICIALIZACIÓN DEL CARRITO: SIEMPRE BACKEND ------
  // Intenta traer el carrito activo primero por cliente (si hay), si no por sesión anónima.
  // Si no existe, lo crea. Todo el mapeo va después.
  async function inicializarCarrito() {
    // 1. Intentar traer cliente de localStorage
    const cliente = obtenerClienteDeLocalStorage();
    let backendCarrito: any = null;

    // 2. Buscar carrito activo por cliente (si hay cliente identificado)
    if (cliente?.id) {
      try {
        backendCarrito = await getCarritoActivo(cliente.id);
        setPedidoEditandoId(backendCarrito.pedidoId);
      } catch {
        console.error("No tiene carrito")
      }
    }

    // 3. Si no existe carrito por cliente, buscarlo por sesión anónima
    if (!backendCarrito) {
      const sesionAnonimaId = await asegurarSesionAnonima();
      console.log("Si no existe carrito por cliente, buscarlo por sesión anónima: ",sesionAnonimaId)
      try {
        backendCarrito = await getCarritoActivoPorSesion(sesionAnonimaId);
      } catch {
        // Si falla, sigue el flujo
      }

      // 4. Si tampoco hay carrito por sesión, crearlo
      if (!backendCarrito) {
        backendCarrito = await crearCarrito({
          sesionAnonimaId,
          total: 0,
          estadoEdicion: 0,
        });
      }
    }

    // 5. Setear ID de carrito global/local
    setCarritoId(backendCarrito.id);

    // 6. Mapear productos traídos del backend a tu formato de frontend
    setCarrito(
      (backendCarrito.items || []).map((prod: any) => ({
        id: prod.producto.id,
        nombre: prod.producto.nombre,
        codigo: prod.producto.codigo,
        precio: Number(prod.precioUnitario),
        cantidad: prod.cantidad,
        imagen: prod.producto.imagen || "",
        observaciones: prod.observaciones ?? "",
        slug: prod.producto.slug || "",
      }))
    );

    // 7. Modo edición y fecha edición
    setModoEdicion(!!backendCarrito.estadoEdicion);
    setFechaEdicion(backendCarrito.fechaEdicion ?? null);

    // 8. Observaciones generales (si hay)
    if (backendCarrito.observaciones) {
      setObservacionesGeneral(backendCarrito.observaciones);
    }
  }

  // Init al montar app (o al cambiar de sesión)
  createEffect(() => { inicializarCarrito(); });

  // Mantener tiempo restante actualizado (si está en edición)
  createEffect(() => {
    if (modoEdicion() && fechaEdicion()) {
      const interval = setInterval(() => {
        setTiempoRestanteEdicion(calcularTiempoRestante(fechaEdicion()));
      }, 1000);
      setTiempoRestanteEdicion(calcularTiempoRestante(fechaEdicion()));
      return () => clearInterval(interval);
    } else {
      setTiempoRestanteEdicion(null);
    }
  });

  // Métodos CRUD sincronizados a backend:
  const agregarAlCarrito = async (item: ItemCarrito) => {
    if (!carritoId()) await inicializarCarrito();
    await agregarProductoACarrito({
      carritoId: carritoId()!,
      productoId: item.id,
      cantidad: item.cantidad,
      precioUnitario: item.precio,
      observaciones: item.observaciones,
    });
    await inicializarCarrito(); // refrescá el carrito siempre
    setPasoCarrito(1);
  };

  const actualizarCantidadEnCarrito = async (productoId: number, cantidad: number, observaciones?: string) => {
    if (!carritoId()) return;
    await actualizarCantidadProductoCarrito(carritoId()!, productoId, cantidad, observaciones || "");
    await inicializarCarrito();
  };

  const quitarDelCarrito = async (id: number) => {
    if (!carritoId()) return;
    await eliminarProductoDeCarrito(carritoId()!, id);
    await inicializarCarrito();
  };

  const actualizarObservacionesEnCarrito = async (productoId: number, cantidad: number, observaciones: string) => {
    if (!carritoId()) return;
    await apiActualizarObservaciones(carritoId()!, productoId, cantidad, observaciones);
    await inicializarCarrito();
  };

  const vaciarCarrito = async () => {
    setCarrito([]);
    // Si necesitás endpoint para vaciar, agregalo en el backend y llamalo acá.
    await inicializarCarrito();
  };

  // ---- EDICIÓN ----
  // Confirmar cambios (guardar pedido y finalizar edición)
  const finalizarEdicion = async () => {
    if (!carritoId()) return;
    await finalizarEdicionCarrito(carritoId()!);
    setPedidoEditandoId(null);
    await inicializarCarrito();
  };

  // --- utilidades ---
  const total = () => carrito().reduce((sum, p) => sum + p.precio * p.cantidad, 0);

  // --- Setters ---
  const wrappedSetCarrito = (items: ItemCarrito[]) => setCarrito(items);

  return (
    <CarritoContext.Provider
      value={{
        carrito,
        inicializarCarrito,
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
        actualizarObservacionesEnCarrito,
        modoEdicion,
        fechaEdicion,
        tiempoRestanteEdicion,
        finalizarEdicion,
        pedidoEditandoId,
        setPedidoEditandoId,
        carritoId,
      }}
    >
      {props.children}
    </CarritoContext.Provider>
  );
}

export const useCarrito = () => {
  const ctx = useContext(CarritoContext);
  if (!ctx) throw new Error('useCarrito debe usarse dentro de <CarritoProvider>');
  return ctx;
};
