/**
 * POST /api/admin/testimonials/reorder
 * Admin — Nouvel ordre d'affichage : { ids: [premier, deuxième, …] }.
 */

import { requireAdminSession } from "~/server/utils/serverAuth";
import { reorderTestimonials } from "~/server/utils/testimonials";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export default defineEventHandler(async (event) => {
  await requireAdminSession(event);

  const ids = (await readBody(event))?.ids;
  if (
    !Array.isArray(ids) ||
    ids.length === 0 ||
    ids.length > 200 ||
    !ids.every((id) => typeof id === "string" && UUID.test(id))
  ) {
    throw createError({ statusCode: 400, message: "ids must be a list of testimonial ids" });
  }

  try {
    await reorderTestimonials(ids);
    return { success: true };
  } catch (err) {
    console.error("Error reordering testimonials:", err);
    throw createError({ statusCode: 500, message: "Failed to reorder testimonials" });
  }
});
