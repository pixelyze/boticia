/**
 * Server middleware — 301 redirects for SEO.
 * Handles:
 * - Deleted pages (coming-soon → homepage)
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
  "/about",
  "/faq",
  "/legal",
  "/devis",
];

export default defineEventHandler((event) => {
  const path = getRequestURL(event).pathname;

  // Deleted pages → homepage
  if (DELETED_PAGES.includes(path)) {
    return sendRedirect(event, "/fr", 301);
  }

  // Bare pages without locale → /fr/...
  if (LOCALE_PAGES.includes(path)) {
    return sendRedirect(event, `/fr${path}`, 301);
  }
});
