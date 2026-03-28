/**
 * GET /api/dev/email-preview?template=moodboard|proposal
 * Dev only — Returns rendered email HTML for preview
 */

import { renderWelcome } from "~/server/emails/compiled";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const template = (query.template as string) || "moodboard";

  const portalUrl = "http://localhost:3001/fr/mon-projet";

  let html = "";
  let subject = "";

  if (template === "moodboard") {
    subject = "Votre moodboard floral est prêt — Boticia";
    html = renderWelcome({
      logoUrl: "http://localhost:3001/logo-boticia.png",
      title: "Votre moodboard est prêt !",
      greeting: "Bonjour Clémentine,",
      message:
        "Votre moodboard floral est maintenant disponible dans votre espace client. " +
        "Ce livre floral a été conçu pour vous aider à mieux visualiser le résultat final de votre composition florale.",
      ctaText: "Voir mon moodboard",
      ctaUrl: `${portalUrl}/moodboard`,
      footerText: "Boticia — Atelier de design floral",
    });
  } else if (template === "new-quote") {
    subject = "Nouvelle demande de Clémentine Vallet — Boticia";
    html = renderWelcome({
      logoUrl: "http://localhost:3001/logo-boticia.png",
      title: "Nouvelle demande de devis",
      greeting: "Bonjour Laetitia,",
      message:
        'Vous avez reçu une nouvelle demande de <strong>Clémentine Vallet</strong>.<br/><br/>' +
        '<strong>Type :</strong> Mariage<br/>' +
        '<strong>Contact :</strong> clementine.vallet@gmail.com — +33 06 47 96 15 80<br/>' +
        '<strong>Date :</strong> 3 avril 2026<br/>' +
        '<strong>RDV souhaité :</strong> 30 avril 2026 à 14h00',
      ctaText: "Voir la demande",
      ctaUrl: "http://localhost:3001/fr/dashboard/quotes/123",
      footerText: "Boticia — Notification admin",
    });
  } else if (template === "proposal") {
    subject = "Votre devis floral est disponible — Boticia";
    html = renderWelcome({
      logoUrl: "http://localhost:3001/logo-boticia.png",
      title: "Votre devis floral est disponible",
      greeting: "Bonjour Clémentine,",
      message:
        "Votre devis floral personnalisé est maintenant disponible dans votre espace client. " +
        "Prenez le temps de le consulter et n'hésitez pas à nous contacter pour toute question.",
      ctaText: "Consulter mon devis",
      ctaUrl: `${portalUrl}/proposition`,
      footerText: "Boticia — Atelier de design floral",
    });
  }

  // Return raw HTML if ?raw=true
  if (query.raw === "true") {
    setResponseHeader(event, "Content-Type", "text/html");
    return html;
  }

  return { subject, html };
});
