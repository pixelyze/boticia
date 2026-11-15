export default defineEventHandler((event) => {
  const config = useRuntimeConfig();
  const siteUrl =
    config.public.siteUrl || "https://boticia.fr";

  setResponseHeader(event, "content-type", "text/plain");

  // Demo and previews: block all crawling (duplicate of boticia.fr)
  const vercelEnv = process.env.VERCEL_ENV;
  if (vercelEnv && vercelEnv !== "production") {
    return ["User-agent: *", "Disallow: /"].join("\n");
  }

  const content = [
    "User-agent: *",
    "Allow: /",
    "",
    "# Private areas (auth-gated) — bare + i18n-prefixed",
    "Disallow: /dashboard",
    "Disallow: /admin",
    "Disallow: /mon-projet",
    "Disallow: /login",
    "Disallow: /confirm",
    "Disallow: /dev",
    "Disallow: /*/dashboard",
    "Disallow: /*/admin",
    "Disallow: /*/mon-projet",
    "Disallow: /*/login",
    "Disallow: /*/confirm",
    "Disallow: /*/dev",
    "",
    "# API endpoints",
    "Disallow: /api",
    "",
    `Sitemap: ${siteUrl}/sitemap.xml`,
  ].join("\n");

  return content;
});
