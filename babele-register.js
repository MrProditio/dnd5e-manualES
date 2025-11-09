/**
 * babele-register.js
 * Registro automático de traducciones de manuales oficiales con Babele.
 */

Hooks.once("init", async () => {
  if (!game.babele) {
    console.warn("⚠️ [dnd5e-manualES] Babele no está activo. No se registrarán las traducciones.");
    return;
  }

  const moduleId = "dnd5e-manualES";
  const baseDir = `modules/${moduleId}/translations`;

  try {
    // Obtener listado de subcarpetas dentro de translations/
    const response = await fetch(`${baseDir}/`);
    const text = await response.text();

    // Usamos una expresión regular para detectar las subcarpetas
    const matches = [...text.matchAll(/href="([^\/]+)\/"/g)];
    const subdirs = matches.map(m => m[1]);

    if (subdirs.length === 0) {
      console.warn(`⚠️ [${moduleId}] No se detectaron subcarpetas dentro de /translations.`);
    } else {
      console.log(`📘 [${moduleId}] Carpetas de traducción detectadas:`, subdirs);
    }

    // Registrar cada subcarpeta con Babele
    for (const dir of subdirs) {
      console.log(`🔹 [${moduleId}] Registrando: translations/${dir}`);
      game.babele.register({
        module: moduleId,
        lang: "es",
        dir: `translations/${dir}`
      });
    }

    console.log(`✅ [${moduleId}] Registro de traducciones completado.`);
  } catch (err) {
    console.error(`❌ [${moduleId}] Error al registrar traducciones:`, err);
  }
});
