export default defineEventHandler((event) => {
  const config = useRuntimeConfig();
  const siteUrl =
    config.public.siteUrl || "https://boticia.fr";
  const locales = ["fr", "en", "ja"];
  const hreflangMap: Record<string, string> = {
    fr: "fr-FR",
    en: "en-US",
    ja: "ja-JP",
  };
  const pages: { path: string; priority: string }[] = [
    { path: "/", priority: "1.0" },
    { path: "/mariages", priority: "0.9" },
    { path: "/evenements", priority: "0.9" },
    { path: "/ateliers", priority: "0.9" },
    { path: "/creations", priority: "0.8" },
    { path: "/about", priority: "0.7" },
    { path: "/devis", priority: "0.7" },
    { path: "/faq", priority: "0.6" },
    { path: "/legal", priority: "0.3" },
  ];
  const today = new Date().toISOString().split("T")[0];

  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml +=
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"';
  xml +=
    ' xmlns:xhtml="http://www.w3.org/1999/xhtml">\n';

  for (const { path: page, priority } of pages) {
    for (const loc of locales) {
      const path =
        page === "/" ? `/${loc}` : `/${loc}${page}`;
      xml += "  <url>\n";
      xml += `    <loc>${siteUrl}${path}</loc>\n`;
      xml += `    <lastmod>${today}</lastmod>\n`;
      xml += `    <priority>${priority}</priority>\n`;

      // Alternate hreflang links (BCP-47 codes)
      for (const altLoc of locales) {
        const altPath =
          page === "/"
            ? `/${altLoc}`
            : `/${altLoc}${page}`;
        xml += `    <xhtml:link rel="alternate" hreflang="${hreflangMap[altLoc]}" href="${siteUrl}${altPath}" />\n`;
      }
      // x-default points to French (default locale)
      const xDefaultPath = page === "/" ? "/fr" : `/fr${page}`;
      xml += `    <xhtml:link rel="alternate" hreflang="x-default" href="${siteUrl}${xDefaultPath}" />\n`;

      xml += "  </url>\n";
    }
  }

  xml += "</urlset>";

  setResponseHeader(event, "content-type", "application/xml");
  return xml;
});
