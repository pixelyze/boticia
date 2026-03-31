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

  // Autoriser la homepage
  if (pathWithoutLocale === "/") return;

  if (
    path === "/coming-soon" ||
    allowed.some((a) => pathWithoutLocale.startsWith(a))
  ) {
    return;
  }

  // Extraire le locale du path pour rediriger avec le bon préfixe
  const localeMatch = path.match(/^\/(fr|en|ja)/);
  const locale = localeMatch ? localeMatch[1] : "fr";
  return navigateTo(`/${locale}/coming-soon`);
});
