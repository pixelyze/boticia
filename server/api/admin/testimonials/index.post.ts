/**
 * POST /api/admin/testimonials
 * Admin — Ajoute un avis (placé en dernier).
 */

import { requireAdminSession } from "~/server/utils/serverAuth";
import { createTestimonial } from "~/server/utils/testimonials";
import { parseTestimonialInput } from "~/utils/testimonials";

export default defineEventHandler(async (event) => {
  await requireAdminSession(event);

  const parsed = parseTestimonialInput(await readBody(event));
  if ("error" in parsed) {
    throw createError({ statusCode: 400, message: parsed.error });
  }

  try {
    return { success: true, data: await createTestimonial(parsed.data) };
  } catch (err) {
    console.error("Error creating testimonial:", err);
    throw createError({ statusCode: 500, message: "Failed to create testimonial" });
  }
});
