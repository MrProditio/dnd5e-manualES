/**
 * babele-dev.js
 * Carga temporal de traducciones de dnd5e-manuales sin activar el módulo completo.
 * Ejecutar desde la consola de Foundry:
 *   await import("/modules/dnd5e-manualES/babele-dev.js");
 */

const MODULE_ID = "dnd5e-manuales";
const DEBUG = true; // Cambia a false para silenciar logs de depuración

if (!game.babele) {
  ui.notifications.error("⚠️ Babele no está activo. Activa Babele primero.");
  throw new Error("Babele no cargado");
}

(async () => {
  const baseDir = `modules/${MODULE_ID}/translations`;

  // Intentar listar subcarpetas dentro de translations/
  try {
    const response = await fetch(`${baseDir}/`);
    const text = await response.text();

    const matches = [...text.matchAll(/href="([^\/]+)\/"/g)];
    const subdirs = matches.map(m => m[1]);

    if (subdirs.length === 0) {
      console.warn(`⚠️ [${MODULE_ID}] No se detectaron subcarpetas dentro de /translations`);
      return;
    }

    if (DEBUG) console.log(`📘 [${MODULE_ID}] Carpetas de traducción detectadas:`, subdirs);

    // Registrar cada subcarpeta
    for (const dir of subdirs) {
      if (DEBUG) console.log(`🔹 Registrando: translations/${dir}`);
      game.babele.register({
        module: MODULE_ID,
        lang: "es",
        dir: `translations/${dir}`
      });
    }

    // Recargar traducciones si ya había registros previos
    if (typeof game.babele.reload === "function") {
      await game.babele.reload();
      ui.notifications.info("♻️ Traducciones recargadas en caliente (dnd5e-manuales).");
    } else {
      ui.notifications.info("✅ Traducciones cargadas en caliente (dnd5e-manuales).");
    }

  } catch (err) {
    console.error(`❌ [${MODULE_ID}] Error al cargar traducciones en caliente:`, err);
  }
})();
