/**
 * Middleware global — redirige tout vers /coming-soon
 * Sauf : /coming-soon, /login, /dashboard, /mon-projet, /confirm, /dev, /api
 * Supprimer ce fichier quand le site est prêt à être lancé.
 */
export default defineNuxtRouteMiddleware((to) => {
  const path = to.path;

  // Pages autorisées (pas de redirection)
  const allowed = [
    "/coming-soon",
    "/login",
    "/dashboard",
    "/mon-projet",
    "/confirm",
    "/dev",
    "/api",
  ];

  // Vérifier si le chemin (sans le préfixe locale) est autorisé
  const pathWithoutLocale = path.replace(/^\/(fr|en|ja)/, "") || "/";

  if (
    path === "/coming-soon" ||
    allowed.some((a) => pathWithoutLocale.startsWith(a))
  ) {
    return;
  }

  return navigateTo("/coming-soon");
});
