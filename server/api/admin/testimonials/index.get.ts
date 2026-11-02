/**
 * GET /api/admin/testimonials
 * Admin — Tous les avis (publiés ou masqués), dans l'ordre d'affichage.
 */

import { requireAdminSession } from "~/server/utils/serverAuth";
import { getAllTestimonials } from "~/server/utils/testimonials";

export default defineEventHandler(async (event) => {
  await requireAdminSession(event);

  try {
    return { success: true, data: await getAllTestimonials() };
  } catch (err) {
    console.error("Error listing testimonials:", err);
    throw createError({ statusCode: 500, message: "Failed to list testimonials" });
  }
});
