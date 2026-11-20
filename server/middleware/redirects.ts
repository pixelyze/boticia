/**
 * Server middleware — 301 redirects for SEO.
 * Handles:
 * - Deleted pages (coming-soon → homepage)
 * - Renamed pages (about → studio)
 * - Bare URLs without locale prefix → /fr/...
 */

const DELETED_PAGES = [
  "/coming-soon",
  "/fr/coming-soon",
  "/en/coming-soon",
  "/ja/coming-soon",
];

const LOCALE_PAGES = [
  "/mariages",
  "/evenements",
  "/ateliers",
  "/creations",
  "/studio",
  "/faq",
  "/legal",
  "/devis",
];

// Pages renommées : l'ancienne adresse renvoie vers la nouvelle (301),
// pour garder le référencement acquis. « Qui suis-je ? » → « Le studio ».
const RENAMED_PAGES: Record<string, string> = {
  "/about": "/fr/studio",
  "/fr/about": "/fr/studio",
  "/en/about": "/en/studio",
  "/ja/about": "/ja/studio",
};

export default defineEventHandler((event) => {
  const path = getRequestURL(event).pathname;

  // Renamed pages → new address
  const renamed = RENAMED_PAGES[path.replace(/\/$/, "")];
  if (renamed) {
    return sendRedirect(event, renamed, 301);
  }

  // Deleted pages → homepage
  if (DELETED_PAGES.includes(path)) {
    return sendRedirect(event, "/fr", 301);
  }

  // Bare pages without locale → /fr/...
  if (LOCALE_PAGES.includes(path)) {
    return sendRedirect(event, `/fr${path}`, 301);
  }
});
