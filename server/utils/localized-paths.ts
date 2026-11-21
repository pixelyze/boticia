/**
 * Adresses des pages publiques par langue. Le français garde ses adresses ;
 * l'anglais et le japonais utilisent les adresses anglaises.
 * Doit rester aligné avec les defineI18nRoute des pages.
 */
export const EN_SLUGS: Record<string, string> = {
  "/mariages": "/weddings",
  "/evenements": "/events",
  "/ateliers": "/workshops",
  "/creations": "/portfolio",
  "/devis": "/quote",
  "/legal": "/legal-notice",
};

// Adresse complète d'une page (adresse française) dans une langue
export function localizedPath(locale: string, frPath: string): string {
  if (frPath === "/") return `/${locale}`;
  const slug = locale === "fr" ? frPath : EN_SLUGS[frPath] ?? frPath;
  return `/${locale}${slug}`;
}
