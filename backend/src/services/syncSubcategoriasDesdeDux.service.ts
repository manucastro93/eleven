import axios from 'axios';
import slugify from 'slugify';
import { models } from '@/config/db';

const API_URL = process.env.DUX_API_URL_SUBRUBROS!;
const API_KEY = process.env.DUX_API_KEY!;

interface DuxSubRubro {
  id_sub_rubro: number;
  sub_rubro: string;
  id_rubro: number;
  rubro: string;
}

function esperar(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function obtenerPaginaSubrubros(offset: number, limit: number, intento = 1): Promise<DuxSubRubro[]> {
  try {
    const res = await axios.get<DuxSubRubro[]>(API_URL, {
      headers: { Accept: 'application/json', Authorization: API_KEY },
      params: { offset, limit },
      timeout: 10000,
    });
    return Array.isArray(res.data) ? res.data : [];
  } catch (error: any) {
    if (error.response?.status === 429) {
      const waitTime = 6000 * intento;
      console.warn(`⚠️ Too Many Requests en offset ${offset}. Esperando ${waitTime / 1000}s y reintentando (intento ${intento})...`);
      await esperar(waitTime);
      if (intento < 5) return obtenerPaginaSubrubros(offset, limit, intento + 1);
      throw new Error('Demasiados intentos fallidos por rate-limit de Dux.');
    }
    if (error.code === 'ECONNRESET' && intento <= 3) {
      await esperar(2000 * intento);
      return obtenerPaginaSubrubros(offset, limit, intento + 1);
    }
    throw error;
  }
}

async function obtenerTodosLosSubrubros(): Promise<DuxSubRubro[]> {
  const todos: DuxSubRubro[] = [];
  let offset = 0;
  const limit = 50;
  while (true) {
    const lote = await obtenerPaginaSubrubros(offset, limit);
    if (!lote.length) break;
    todos.push(...lote);
    offset += limit;
    if (lote.length < limit) break;
    await esperar(6000); // 6 segundos mínimo entre requests
  }
  return todos;
}

export async function sincronizarSubcategoriasDesdeDux() {
  console.log('📥 Consultando subrubros desde Dux...');

  try {
    const subrubros = await obtenerTodosLosSubrubros();
    console.log(`🔢 Subrubros obtenidos: ${subrubros.length}`);

    let creados = 0;
    let actualizados = 0;

    for (const subrubro of subrubros) {
      const nombreFinal = subrubro.sub_rubro?.trim() || 'Sin subcategoría';

      console.log(`🔄 Procesando subrubro → id_sub_rubro: ${subrubro.id_sub_rubro}, nombre: "${nombreFinal}", id_rubro: ${subrubro.id_rubro}`);

      try {
        const categoria = await models.Categoria.findByPk(subrubro.id_rubro);
        if (!categoria) {
          console.warn(`⚠️ Rubro con ID ${subrubro.id_rubro} no encontrado. Saltando subrubro ${subrubro.id_sub_rubro}.`);
          continue;
        }

        const [subcategoria, creado] = await models.Subcategoria.findOrCreate({
          where: {
            categoriaId: subrubro.id_rubro,
            id_sub_rubro: subrubro.id_sub_rubro
          },
          defaults: {
            id_sub_rubro: subrubro.id_sub_rubro,
            nombre: nombreFinal,
            slug: slugify(nombreFinal, { lower: true }),
            descripcion: '',
            destacada: false,
            categoriaId: subrubro.id_rubro,
          },
        });

        if (!creado) {
          console.log(`🔁 Subcategoría ya existente. Actualizando ID ${subcategoria.id}`);
          await subcategoria.update({
            nombre: nombreFinal,
            slug: slugify(nombreFinal, { lower: true }),
            categoriaId: subrubro.id_rubro,
          });
          actualizados++;
        } else {
          console.log(`🆕 Subcategoría creada con ID ${subcategoria.id}`);
          creados++;
        }
      } catch (err) {
        console.error(`❌ Error procesando subrubro ${subrubro.id_sub_rubro}:`, err);
      }
    }

    console.log(`✅ Subcategorías creadas: ${creados}, actualizadas: ${actualizados}`);
    return { mensaje: 'Sincronización de subcategorías completada.', creados, actualizados };
  } catch (error) {
    console.error('❌ Error general al sincronizar subrubros desde Dux:', error);
    throw error;
  }
}
