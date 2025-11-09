/**
 * babele-register.js
 * Registro automático de traducciones de manuales oficiales con Babele.
 */

const DEBUG = true; // Cambia a false para silenciar logs de depuración

Hooks.once("init", async () => {
  const moduleId = "dnd5e-manuales";

  if (!game.babele) {
    console.warn(`⚠️ [${moduleId}] Babele no está activo. No se registrarán las traducciones.`);
    return;
  }

  const baseDir = `modules/${moduleId}/translations`;

  try {
    // Intentar listar subcarpetas dentro de translations/
    const response = await fetch(`${baseDir}/`);
    const text = await response.text();

    // Buscar carpetas por patrón de href (index HTML de Foundry)
    const matches = [...text.matchAll(/href="([^\/]+)\/"/g)];
    const subdirs = matches.map(m => m[1]);

    if (subdirs.length === 0) {
      console.warn(`⚠️ [${moduleId}] No se detectaron subcarpetas dentro de /translations.`);
    } else if (DEBUG) {
      console.log(`📘 [${moduleId}] Carpetas de traducción detectadas:`, subdirs);
    }

    for (const dir of subdirs) {
      if (DEBUG) console.log(`🔹 [${moduleId}] Registrando: translations/${dir}`);
      game.babele.register({
        module: moduleId,
        lang: "es",
        dir: `translations/${dir}`
      });
    }

    if (DEBUG) console.log(`✅ [${moduleId}] Registro de traducciones completado.`);

    // Opcional: aviso visual en el chat de Foundry
    if (DEBUG) {
      ChatMessage.create({
        speaker: { alias: "📚 dnd5e-manuales" },
        content: "Las traducciones de los manuales en español se han cargado correctamente."
      });
    }

  } catch (err) {
    console.error(`❌ [${moduleId}] Error al registrar traducciones:`, err);
  }
});
