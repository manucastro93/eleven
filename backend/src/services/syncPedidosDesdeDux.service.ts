import axios from 'axios';
import { models } from '@/config/db';

const API_URL_PEDIDOS = process.env.DUX_API_URL_PEDIDOS!;
const API_KEY = process.env.DUX_API_KEY!;

function esperar(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function obtenerPaginaPedidosDesdeDux(
  idEmpresa: number,
  idSucursal: number,
  fechaDesde: string,
  fechaHasta: string,
  offset: number,
  limit: number,
  intento = 1
): Promise<any> {
  try {
    const res = await axios.request({
        method: 'GET',
        url: `${API_URL_PEDIDOS}?idEmpresa=${idEmpresa}&idSucursal=${idSucursal}&fechaDesde=${fechaDesde}&fechaHasta=${fechaHasta}&offset=${offset}&limit=${limit}`,
        headers: {
            authorization: API_KEY,
            accept: 'application/json'
        },
        timeout: 15000
        });
        console.log(res.data)
        return res;
  } catch (error: any) {
    console.warn(`⚠️ ECONNRESET en offset ${offset}. Reintentando intento ${intento}...`, error.message);

    if (error.code === 'ECONNRESET' && intento <= 3) {
      await esperar(2000 * intento);
      return obtenerPaginaPedidosDesdeDux(idEmpresa, idSucursal, fechaDesde, fechaHasta, offset, limit, intento + 1);
    } else {
      throw error;
    }
  }
}

async function obtenerTodosLosPedidosDesdeDux(
  idEmpresa: number,
  idSucursal: number,
  fechaDesde: string,
  fechaHasta: string
): Promise<any[]> {
  const todos: any[] = [];
  let offset = 0;
  const limit = 50;
  let pagina = 1;
  let total = 1;

  while (true) {
    console.log(`📦 Pidiendo página ${pagina} (offset ${offset})`);

    const res = await obtenerPaginaPedidosDesdeDux(idEmpresa, idSucursal, fechaDesde, fechaHasta, offset, limit);

    const lote = res.data.results;
    if (!lote?.length) break;

    if (pagina === 1 && res.data.paging?.total) {
      total = res.data.paging.total;
      console.log(`🔢 Total pedidos reportado por Dux: ${total}`);
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

export async function sincronizarPedidosDesdeDux(
  idEmpresa: number,
  idSucursal: number,
  fechaDesde: string,
  fechaHasta: string
) {
  const pedidos = await obtenerTodosLosPedidosDesdeDux(idEmpresa, idSucursal, fechaDesde, fechaHasta);

  let creados = 0;
  let actualizados = 0;

  for (const pedido of pedidos) {
    try {
      const [pedidoRecord, fueCreado] = await models.PedidoDux.upsert({
        id: pedido.id,
        nro_pedido: pedido.nro_pedido,
        id_cliente: pedido.id_cliente,
        cliente: pedido.cliente,
        id_personal: pedido.id_personal,
        personal: pedido.personal,
        id_empresa: pedido.id_empresa,
        id_sucursal: pedido.id_sucursal,
        fecha: new Date(pedido.fecha),
        observaciones: pedido.observaciones,
        monto_exento: parseFloat(pedido.monto_exento),
        monto_gravado: parseFloat(pedido.monto_gravado),
        monto_iva: parseFloat(pedido.monto_iva),
        monto_descuento: parseFloat(pedido.monto_descuento),
        total: parseFloat(pedido.total),
        estado_facturacion: pedido.estado_facturacion,
        estado_remito: pedido.estado_remito,
        anulado: pedido.anulado_boolean,
        id_moneda: pedido.id_moneda,
        moneda: pedido.moneda,
        cotizacion_moneda: parseFloat(pedido.cotizacion_moneda),
        cotizacion_dolar: parseFloat(pedido.cotizacion_dolar),
        monto_percepcion_impuesto: parseFloat(pedido.monto_percepcion_impuesto),
        ctd_facturada: parseFloat(pedido.ctd_facturada),
        ctd_con_remito: parseFloat(pedido.ctd_con_remito),
        ctd_facturada_con_remito: parseFloat(pedido.ctd_facturada_con_remito)
      });

      if (fueCreado) creados++;
      else actualizados++;

      // Procesar detalles
      await models.PedidoProductoDux.destroy({ where: { pedido_dux_id: pedido.id } }); // limpiar primero

      for (const detalle of pedido.detalles) {
        await models.PedidoProductoDux.create({
          pedido_dux_id: pedido.id,
          cod_item: detalle.cod_item,
          item: detalle.item,
          descripcion: detalle.descripcion || '',
          ctd: parseFloat(detalle.ctd),
          precio_uni: parseFloat(detalle.precio_uni),
          porc_desc: parseFloat(detalle.porc_desc),
          porc_iva: parseFloat(detalle.porc_iva),
          id_moneda: detalle.id_moneda,
          moneda: detalle.moneda,
          cotizacion_moneda: parseFloat(detalle.cotizacion_moneda),
          cotizacion_dolar: parseFloat(detalle.cotizacion_dolar),
          ctd_facturada: parseFloat(detalle.ctd_facturada),
          ctd_con_remito: parseFloat(detalle.ctd_con_remito),
          ctd_facturada_con_remito: parseFloat(detalle.ctd_facturada_con_remito),
          ctd_unidad_pesable: parseFloat(detalle.ctd_unidad_pesable)
        });
      }

    } catch (error) {
      console.error(`❌ Error procesando pedido ${pedido.id}:`, error);
    }
  }

  console.log('\n🎉 Sincronización de pedidos finalizada.');

  return {
    mensaje: `Se sincronizaron ${pedidos.length} pedidos desde Dux.`,
    creados,
    actualizados
  };
}
