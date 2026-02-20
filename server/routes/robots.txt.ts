export default defineEventHandler((event) => {
  const config = useRuntimeConfig();
  const siteUrl =
    config.public.siteUrl || "https://boticia.fr";

  const content = [
    "User-agent: *",
    "Allow: /",
    "",
    `Sitemap: ${siteUrl}/sitemap.xml`,
  ].join("\n");

  setResponseHeader(event, "content-type", "text/plain");
  return content;
});
