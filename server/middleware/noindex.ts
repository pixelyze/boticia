/**
 * Server middleware — keeps non-production deployments (demo.boticia.fr,
 * Vercel previews) out of search engines, so they never compete with
 * boticia.fr as duplicate content.
 */
export default defineEventHandler((event) => {
  const vercelEnv = process.env.VERCEL_ENV;
  if (vercelEnv && vercelEnv !== "production") {
    setResponseHeader(event, "x-robots-tag", "noindex, nofollow");
  }
});
