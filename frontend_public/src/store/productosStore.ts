import { createStore } from 'solid-js/store';
import type { ProductosState } from '@/types/producto.type';

const [productosStore, setProductosStore] = createStore<ProductosState>({
  filtros: {
    categoria: undefined,
    orden: 'nombre-asc',
    busqueda: '',
  },
  productos: [],
  paginaActual: 1,
  scrollY: 0,
});

export { productosStore, setProductosStore };
