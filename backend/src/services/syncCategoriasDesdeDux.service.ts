import axios from 'axios';
import slugify from 'slugify';
import { models } from '@/config/db';

const API_URL = process.env.DUX_API_URL_RUBROS!;
const API_KEY = process.env.DUX_API_KEY!;

interface DuxRubro {
  id_rubro: number;
  rubro: string;
  eliminado: 'S' | 'N';
}

function esperar(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function obtenerPaginaRubros(offset: number, limit: number, intento = 1): Promise<DuxRubro[]> {
  try {
    const res = await axios.get<DuxRubro[]>(API_URL, {
      headers: { Accept: 'application/json', Authorization: API_KEY },
      params: { offset, limit },
      timeout: 10000,
    });
    return Array.isArray(res.data) ? res.data : [];
  } catch (error: any) {
    // Dux devuelve 429 si te pasás de rápido
    if (error.response?.status === 429) {
      const waitTime = 6000 * intento;
      console.warn(`⚠️ Too Many Requests en offset ${offset}. Esperando ${waitTime / 1000}s y reintentando (intento ${intento})...`);
      await esperar(waitTime);
      if (intento < 5) return obtenerPaginaRubros(offset, limit, intento + 1);
      throw new Error('Demasiados intentos fallidos por rate-limit de Dux.');
    }
    if (error.code === 'ECONNRESET' && intento <= 3) {
      await esperar(2000 * intento);
      return obtenerPaginaRubros(offset, limit, intento + 1);
    }
    throw error;
  }
}

async function obtenerTodosLosRubros(): Promise<DuxRubro[]> {
  const todos: DuxRubro[] = [];
  let offset = 0;
  const limit = 50;
  while (true) {
    const lote = await obtenerPaginaRubros(offset, limit);
    if (!lote.length) break;
    todos.push(...lote);
    offset += limit;
    if (lote.length < limit) break;
    await esperar(6000); // siempre 6 segundos mínimo entre llamados, no menos
  }
  return todos;
}

export async function sincronizarCategoriasDesdeDux() {
  console.log('📥 Consultando rubros desde Dux...');

  try {
    const rubros = (await obtenerTodosLosRubros()).filter(r => r.eliminado !== 'S');
    console.log(`🔢 Rubros válidos obtenidos: ${rubros.length}`);

    let creados = 0;
    let actualizados = 0;

    for (const rubro of rubros) {
      const nombreFinal = rubro.rubro?.trim() || 'Sin categoría';

      const [categoria, creado] = await models.Categoria.findOrCreate({
        where: { id: rubro.id_rubro },
        defaults: {
          id: rubro.id_rubro,
          nombre: nombreFinal,
          slug: slugify(nombreFinal, { lower: true }),
          descripcion: '',
          destacada: false,
        },
      });

      if (!creado) {
        await categoria.update({
          nombre: nombreFinal,
          slug: slugify(nombreFinal, { lower: true }),
        });
        actualizados++;
      } else {
        creados++;
      }
    }

    console.log(`✅ Categorías creadas: ${creados}, actualizadas: ${actualizados}`);
    return { mensaje: 'Sincronización de categorías completada.', creados, actualizados };
  } catch (error) {
    console.error('❌ Error al sincronizar rubros desde Dux:', error);
    throw error;
  }
}
