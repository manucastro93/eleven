import axios from 'axios';
import { models } from '@/config/db';
import slugify from 'slugify';
import { setProgresoSyncProductos } from '@/index'; // ✅ nuevo import

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
  rubro?: { id: number | null; nombre: string | null };
  sub_rubro?: { id: number | null; nombre: string | null };
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
      timeout: 15000
    });
  } catch (error: any) {
    console.warn(`⚠️ ECONNRESET en offset ${offset}. Reintentando intento ${intento}...`, error.message);
    if (error.code === 'ECONNRESET' && intento <= 3) {
      await esperar(2000 * intento);
      return obtenerPaginaDesdeDux(offset, limit, intento + 1);
    } else {
      throw error;
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

    const porcentaje = offset / total * 50;
    setProgresoSyncProductos(porcentaje); // ✅ reemplazo
    console.log(`Porcentaje de proceso total: ${porcentaje.toFixed(0)}%`);
    console.log('⏳ Esperando 5 segundos por rate-limit Dux...');
    await esperar(5000);
  }

  return todos;
}

async function buscarOCrearCategoriaPorIdDux(
  idDux: number | null | undefined,
  nombre: string | null | undefined
) {
  const idFinal = typeof idDux === 'number' ? idDux : null;
  const nombreFinal = nombre?.trim() || 'Sin categoría';
  const whereClause: any = idDux != null
    ? { id_dux: idDux }
    : { nombre: nombreFinal };

  const [categoria] = await models.Categoria.findOrCreate({
    where: whereClause,
    defaults: {
      nombre: nombreFinal,
      slug: slugify(nombreFinal, { lower: true }),
      descripcion: '',
      destacada: false,
      id_dux: idFinal ?? undefined
    }
  });

  return categoria;
}

async function buscarOCrearSubcategoriaPorIdDux(
  idDux: number | null | undefined,
  nombre: string | null | undefined,
  categoriaId: number
) {
  const idFinal = typeof idDux === 'number' ? idDux : null;
  const nombreFinal = nombre?.trim() || 'Sin subcategoría';
  const whereClause: any = idDux != null
    ? { id_dux: idDux, categoriaId }
    : { nombre: nombreFinal, categoriaId };

  const [subcategoria] = await models.Subcategoria.findOrCreate({
    where: whereClause,
    defaults: {
      nombre: nombreFinal,
      slug: slugify(nombreFinal, { lower: true }),
      descripcion: '',
      destacada: false,
      id_dux: idFinal ?? undefined,
      categoriaId
    }
  });

  return subcategoria;
}

export async function sincronizarProductosDesdeDux() {
  const items = await obtenerTodosLosItemsDesdeDux();

  let creados = 0;
  let actualizados = 0;
  const totalProds = items.length;
  let porcentajeGuardado = 50;
  console.log(`Se comienza a guardar los ${totalProds} productos desde Dux en la BD.`);

  for (const item of items) {
    porcentajeGuardado += (50 / totalProds);
    setProgresoSyncProductos(porcentajeGuardado); // ✅ reemplazo
    console.log(`Porcentaje de proceso total: ${porcentajeGuardado.toFixed(0)}%.`);

    try {
      const categoria = await buscarOCrearCategoriaPorIdDux(
        item.rubro?.id ?? null,
        item.rubro?.nombre ?? null
      );

      const subcategoria = await buscarOCrearSubcategoriaPorIdDux(
        item.sub_rubro?.id ?? null,
        item.sub_rubro?.nombre ?? null,
        categoria.id
      );

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
        subcategoriaId: subcategoria.id,
        activo: true,
        slug: slugify(`${item.item}-${item.cod_item}`, { lower: true }),
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
    actualizados
  };
}
