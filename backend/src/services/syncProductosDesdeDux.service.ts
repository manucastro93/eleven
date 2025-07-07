import axios from 'axios';
import { models } from '@/config/db';
import slugify from 'slugify';

const API_URL = process.env.DUX_API_URL_PRODUCTOS!;
const API_KEY = process.env.DUX_API_KEY!;
const nombreListaDeseada = "MAYORISTA";

interface DuxProducto {
  cod_item: string;
  item: string;
  descripcion: string;
  costo: string;
  precios: {
    id: number;
    nombre: string;
    precio: string;
  }[];
  sub_rubro?: { nombre: string };
  stock?: {
    stock_real?: string;
  }[];
}

function esperar(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function calcularStock(item: DuxProducto): number {
  if (!Array.isArray(item.stock)) return 0;
  return item.stock.reduce((acc, s) => acc + parseFloat(s.stock_real || '0'), 0);
}

async function obtenerPaginaDesdeDux(offset: number, limit: number, intento = 1): Promise<any> {
  try {
    return await axios.get(API_URL, {
      headers: { Authorization: API_KEY, Accept: 'application/json' },
      params: { offset, limit },
      timeout: 15000 // 15 segundos por request
    });
  } catch (error: any) {
    console.warn(`⚠️ ECONNRESET en offset ${offset}. Reintentando intento ${intento}...`, error.message);

    if (error.code === 'ECONNRESET' && intento <= 3) {
      await esperar(2000 * intento); // backoff progresivo: 2s, 4s, 6s
      return obtenerPaginaDesdeDux(offset, limit, intento + 1);
    } else {
      throw error; // si no es ECONNRESET o ya reintentó 3 veces → lanzar
    }
  }
}

async function obtenerTodosLosItemsDesdeDux(): Promise<DuxProducto[]> {
  const todos: DuxProducto[] = [];
  let offset = 0;
  const limit = 50;
  let pagina = 1;
  let total = 1;

  while (true) {
    console.log(`📦 Pidiendo página ${pagina} (offset ${offset})`);

    const res = await obtenerPaginaDesdeDux(offset, limit);

    const lote = res.data.results;
    if (!lote?.length) break;

    if (pagina === 1 && res.data.paging?.total) {
      total = res.data.paging.total;
      console.log(`🔢 Total productos reportado por Dux: ${total}`);
    }

    todos.push(...lote);

    offset += limit;
    pagina++;

    if (offset >= total) break;

    console.log('⏳ Esperando 5 segundos por rate-limit Dux...');
    await esperar(5000);
  }

  return todos;
}

export async function sincronizarProductosDesdeDux() {
  const items = await obtenerTodosLosItemsDesdeDux();

  let creados = 0;
  let actualizados = 0;
  const categoriasCreadas = new Set<number>();

  for (const item of items) {
    try {
      const nombreCategoria =
      (Array.isArray(item.sub_rubro)
        ? item.sub_rubro[0]?.nombre
        : item.sub_rubro?.nombre)?.trim() || 'Sin categoría';


      const [categoria, fueCreada] = await models.Categoria.findOrCreate({
        where: { nombre: nombreCategoria },
        defaults: {
          nombre: nombreCategoria,
          slug: slugify(nombreCategoria, { lower: true }),
          descripcion: '',
          orden: 0,
          destacada: false
        }
      });

      if (fueCreada) categoriasCreadas.add(categoria.id);

      const productoExistente = await models.Producto.findOne({
        where: { codigo: item.cod_item }
      });

      const precioLista = item.precios.find(
        (p) => p.nombre === nombreListaDeseada
      )?.precio;

      const precioFinal = precioLista ? parseFloat(precioLista) : 0;

      const data = {
        nombre: item.item,
        descripcion: item.descripcion || '',
        codigo: item.cod_item,
        precio: precioFinal,
        stock: calcularStock(item),
        categoriaId: categoria.id,
        activo: true
      };

      if (productoExistente) {
        await productoExistente.update(data);
        actualizados++;
      } else {
        await models.Producto.create(data);
        creados++;
      }

    } catch (error) {
      console.error(`❌ Error procesando item ${item.cod_item}:`, error);
    }
  }

  console.log('\n🎉 Sincronización finalizada.');

  return {
    mensaje: `Se sincronizaron ${items.length} productos desde Dux.`,
    creados,
    actualizados,
    categoriasNuevas: categoriasCreadas.size
  };
}
