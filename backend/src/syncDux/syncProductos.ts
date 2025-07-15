import dotenv from "dotenv";
dotenv.config();

import { sequelize } from "@/config/db";
import { sincronizarProductosDesdeDux } from "@/services/syncProductosDesdeDux.service";

async function ejecutar() {
  console.log(`[${new Date().toISOString()}] 🚀 Iniciando sincronización...`);

  try {
    console.log("⏳ Ejecutando sincronizarProductosDesdeDux...");
    const resultadoProductos = await sincronizarProductosDesdeDux();

    console.log(
      `✅ Productos sincronizados: creados=${resultadoProductos.creados}, actualizados=${resultadoProductos.actualizados}}`
    );
  } catch (error) {
    console.error("❌ Error general en la sincronización:", error instanceof Error ? error.message : error);
  } finally {
    try {
      await sequelize.close();
      console.log(`[${new Date().toISOString()}] 🔚 Finalizó sincronización.`);
    } catch (closeError) {
      console.error("⚠️ Error al cerrar conexión a la base de datos:", closeError);
    }
  }
}

ejecutar().catch((unhandledError) => {
  console.error("💥 Error no controlado en ejecutar():", unhandledError);
  process.exit(1);
});
