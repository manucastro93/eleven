import dotenv from "dotenv";
dotenv.config();

import { sequelize } from "@/config/db";
import { sincronizarPedidosDesdeDux } from "@/services/syncPedidosDesdeDux.service";

async function ejecutar() {
  console.log(`[${new Date().toISOString()}] 🚀 Iniciando sincronización de pedidos...`);

  const idEmpresa = 2362;
  const idSucursal = 6;
  const fechaDesde = '2025-06-20';
  const fechaHasta = '2025-06-24';

  try {
    console.log("⏳ Ejecutando sincronizarPedidosDesdeDux...");
    const resultado = await sincronizarPedidosDesdeDux(idEmpresa, idSucursal, fechaDesde, fechaHasta);

    console.log(
      `✅ Pedidos sincronizados: creados=${resultado.creados}, actualizados=${resultado.actualizados}`
    );
  } catch (error) {
    console.error("❌ Error general en la sincronización de pedidos:", error instanceof Error ? error.message : error);
  } finally {
    try {
      await sequelize.close();
      console.log(`[${new Date().toISOString()}] 🔚 Finalizó sincronización de pedidos.`);
    } catch (closeError) {
      console.error("⚠️ Error al cerrar conexión a la base de datos:", closeError);
    }
  }
}

ejecutar().catch((unhandledError) => {
  console.error("💥 Error no controlado en ejecutar():", unhandledError);
  process.exit(1);
});
