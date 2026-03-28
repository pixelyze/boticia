export default defineEventHandler((event) => {
  const config = useRuntimeConfig();
  const siteUrl =
    config.public.siteUrl || "https://boticia.fr";
  const locales = ["fr", "en", "ja"];
  const pages = [
    "/",
    "/about",
    "/devis",
    "/mariages",
    "/evenements",
    "/ateliers",
    "/creations",
    "/faq",
    "/legal",
  ];
  const today = new Date().toISOString().split("T")[0];

  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml +=
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"';
  xml +=
    ' xmlns:xhtml="http://www.w3.org/1999/xhtml">\n';

  for (const page of pages) {
    for (const loc of locales) {
      const path =
        page === "/" ? `/${loc}` : `/${loc}${page}`;
      xml += "  <url>\n";
      xml += `    <loc>${siteUrl}${path}</loc>\n`;
      xml += `    <lastmod>${today}</lastmod>\n`;

      // Alternate hreflang links
      for (const altLoc of locales) {
        const altPath =
          page === "/"
            ? `/${altLoc}`
            : `/${altLoc}${page}`;
        xml += `    <xhtml:link rel="alternate" hreflang="${altLoc}" href="${siteUrl}${altPath}" />\n`;
      }

      xml += "  </url>\n";
    }
  }

  xml += "</urlset>";

  setResponseHeader(event, "content-type", "application/xml");
  return xml;
});
