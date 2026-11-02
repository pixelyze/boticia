/**
 * PATCH /api/admin/testimonials/:id
 * Admin — Modifie un avis. Deux formes :
 * - { is_published } seul : affiché / masqué depuis la liste ;
 * - l'avis complet (textes, nom, précisions) depuis la fenêtre d'édition.
 */

import { requireAdminSession } from "~/server/utils/serverAuth";
import { updateTestimonial } from "~/server/utils/testimonials";
import { parseTestimonialInput } from "~/utils/testimonials";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export default defineEventHandler(async (event) => {
  await requireAdminSession(event);

  const id = getRouterParam(event, "id");
  if (!id || !UUID.test(id)) {
    throw createError({ statusCode: 400, message: "Invalid testimonial id" });
  }

  const body = (await readBody(event)) ?? {};
  const keys = Object.keys(body);

  let input;
  if (keys.length === 1 && keys[0] === "is_published") {
    input = { is_published: body.is_published === true };
  } else {
    const parsed = parseTestimonialInput(body);
    if ("error" in parsed) {
      throw createError({ statusCode: 400, message: parsed.error });
    }
    input = parsed.data;
  }

  try {
    const testimonial = await updateTestimonial(id, input);
    if (!testimonial) {
      throw createError({ statusCode: 404, message: "Testimonial not found" });
    }
    return { success: true, data: testimonial };
  } catch (err: any) {
    if (err.statusCode) throw err;
    console.error("Error updating testimonial:", err);
    throw createError({ statusCode: 500, message: "Failed to update testimonial" });
  }
});
