import dotenv from "dotenv";
dotenv.config();

import { sequelize } from "@/config/db";
import { sincronizarProductosDesdeDux } from "@/services/syncProductosDesdeDux.service";
import { sincronizarCategoriasDesdeDux } from "@/services/syncCategoriasDesdeDux.service";
import { sincronizarSubcategoriasDesdeDux } from "@/services/syncSubcategoriasDesdeDux.service";

async function ejecutar() {
  console.log(`[${new Date().toISOString()}] 🚀 Iniciando sincronización...`);

  try {
    console.log("⏳ Sincronizando categorías...");
    const cats = await sincronizarCategoriasDesdeDux();
    console.log(`✅ Categorías: creadas=${cats.creados}, actualizadas=${cats.actualizados}`);

    console.log("⏳ Sincronizando subcategorías...");
    const subs = await sincronizarSubcategoriasDesdeDux();
    console.log(`✅ Subcategorías: creadas=${subs.creados}, actualizadas=${subs.actualizados}`);

    console.log("⏳ Sincronizando productos...");
    const productos = await sincronizarProductosDesdeDux();
    console.log(`✅ Productos: creados=${productos.creados}, actualizados=${productos.actualizados}`);
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
  console.error("💥 Error no controlado:", unhandledError);
  process.exit(1);
});
