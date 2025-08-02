import axios from 'axios';
import { models } from '@/config/db';
import slugify from 'slugify';
import { setProgresoSyncProductos } from '@/index';
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);

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
  rubro?: { 
    id: number; 
    rubro: string | null 
  };
  sub_rubro?: {
    id: number;
    sub_rubro: string | null;
    id_rubro: number;
  };
  stock?: {
    id: number;
    stock_real?: string;
  }[];
  imagen_url: string;
  fecha_creacion: string;
  habilitado: string;
}

function calcularStock(item: DuxProducto): number {
  if (!Array.isArray(item.stock)) return 0;
  const idsValidos = [4286, 4283]; //DEPOSITO Y DEPO SARMIENTO
  return item.stock
    .filter(s => idsValidos.includes(Number(s.id)))
    .reduce((acc, s) => acc + parseFloat(s.stock_real || '0'), 0);
}

function esperar(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
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
    setProgresoSyncProductos(porcentaje);
    console.log(`Porcentaje de proceso total: ${porcentaje.toFixed(0)}%`);
    console.log('⏳ Esperando 5 segundos por rate-limit Dux...');
    await esperar(5000);
  }

  return todos;
}

export async function sincronizarProductosDesdeDux() {
  const items = await obtenerTodosLosItemsDesdeDux();

  let creados = 0;
  let actualizados = 0;
  const totalProds = items.length;
  let porcentajeGuardado = 50;

  console.log(`📝 Guardando ${totalProds} productos en la BD...`);

  for (const item of items) {
    porcentajeGuardado += (50 / totalProds);
    setProgresoSyncProductos(porcentajeGuardado);
    console.log(`Progreso total: ${porcentajeGuardado.toFixed(0)}%.`);

    try {
      const categoriaId = item.rubro?.id;
      if (!categoriaId) {
        console.warn(`⚠️ Producto sin categoría: ${item.cod_item}. Saltando.`);
        continue; // No se permite producto sin categoría
      }

      let subcategoriaId: number | null = null;

      if (item.sub_rubro?.id && item.rubro?.id) {
        const subcat = await models.Subcategoria.findOne({
          where: {
            id_sub_rubro: item.sub_rubro.id,
            categoriaId: item.rubro.id
          }
        });
        subcategoriaId = subcat?.id || null;
      }

      const precioLista = item.precios.find(
        (p) => p.nombre === nombreListaDeseada
      )?.precio;

      const precioFinal = precioLista ? parseFloat(precioLista) : 0;

      const fechaCreacion: Date | null = item.fecha_creacion
        ? dayjs(item.fecha_creacion, "MMM D, YYYY h:mm:ss A").toDate()
        : null;

      const data = {
        nombre: item.item,
        descripcion: item.descripcion || '',
        codigo: item.cod_item,
        precio: precioFinal,
        stock: calcularStock(item),
        categoriaId,
        subcategoriaId,
        activo: true,
        imagen:item.imagen_url,
        habilitado: item.habilitado,
        fecha_creacion: fechaCreacion,
        slug: slugify(`${item.item}-${item.cod_item}`, { lower: true }),
      };

      const productoExistente = await models.Producto.findOne({
        where: { codigo: item.cod_item }
      });

      if (productoExistente) {
        await productoExistente.update(data);
        actualizados++;
      } else {
        await models.Producto.create(data);
        creados++;
      }
    } catch (error) {
      console.error(`❌ Error procesando producto ${item.cod_item}:`, error);
    }
  }

  console.log('\n✅ Sincronización de productos finalizada.');

  return {
    mensaje: `Se sincronizaron ${items.length} productos desde Dux.`,
    creados,
    actualizados
  };
}
