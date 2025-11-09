/**
 * babele-dev.js
 * Carga temporal de traducciones de dnd5e-manuales sin activar el módulo completo.
 * Ejecutar desde la consola de Foundry:
 *   await import("/modules/dnd5e-manuales/babele-dev.js");
 */

const MODULE_ID = "dnd5e-manuales";
const DEBUG = true; // Cambia a false para silenciar logs de depuración

(async () => {
  if (!game.babele) {
    ui.notifications.error("⚠️ Babele no está activo. Activa Babele primero.");
    return;
  }

  // Registrar todas las subcarpetas explícitamente
const MANUALS = ["phb", "dmg", "mm"];
MANUALS.forEach(dir => {
  game.babele.register({
    module: MODULE_ID,
    lang: "es",
    dir: `translations/${dir}`
  });
});

  // Recargar traducciones si ya había registros previos
  if (typeof game.babele.reload === "function") {
    await game.babele.reload();
    ui.notifications.info("♻️ Traducciones recargadas en caliente (dnd5e-manuales).");
  } else {
    ui.notifications.info("✅ Traducciones cargadas en caliente (dnd5e-manuales).");
  }
})();
