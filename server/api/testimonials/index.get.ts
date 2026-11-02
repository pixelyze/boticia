/**
 * GET /api/testimonials?locale=fr|en|ja
 * Avis publiés pour la page d'accueil, dans la langue du visiteur
 * (anglais pour le japonais, français si l'anglais manque).
 */

import { getPublishedTestimonials } from "~/server/utils/testimonials";
import { localizeTestimonial } from "~/utils/testimonials";

// PUBLIC: avis publiés de la page d'accueil, lecture seule
export default defineEventHandler(async (event) => {
  const locale = String(getQuery(event).locale || "fr");

  try {
    const testimonials = await getPublishedTestimonials();
    return {
      success: true,
      data: testimonials.map((t) => localizeTestimonial(t, locale)),
    };
  } catch (err) {
    console.error("Error getting testimonials:", err);
    return { success: false, data: [] };
  }
});
