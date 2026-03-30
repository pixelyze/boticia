/**
 * Middleware global — redirige tout vers /coming-soon EN PROD UNIQUEMENT
 * En dev (localhost), le site fonctionne normalement.
 * Supprimer ce fichier quand le site est prêt à être lancé.
 */
export default defineNuxtRouteMiddleware((to) => {
  // Ne pas rediriger en dev
  if (process.dev) return;

  const path = to.path;

  const allowed = [
    "/coming-soon",
    "/login",
    "/dashboard",
    "/mon-projet",
    "/confirm",
    "/dev",
    "/api",
  ];

  const pathWithoutLocale = path.replace(/^\/(fr|en|ja)/, "") || "/";

  if (
    path === "/coming-soon" ||
    allowed.some((a) => pathWithoutLocale.startsWith(a))
  ) {
    return;
  }

  return navigateTo("/coming-soon");
});
