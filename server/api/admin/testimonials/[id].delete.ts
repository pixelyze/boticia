/**
 * DELETE /api/admin/testimonials/:id
 * Admin — Supprime un avis.
 */

import { requireAdminSession } from "~/server/utils/serverAuth";
import { deleteTestimonial } from "~/server/utils/testimonials";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export default defineEventHandler(async (event) => {
  await requireAdminSession(event);

  const id = getRouterParam(event, "id");
  if (!id || !UUID.test(id)) {
    throw createError({ statusCode: 400, message: "Invalid testimonial id" });
  }

  try {
    if (!(await deleteTestimonial(id))) {
      throw createError({ statusCode: 404, message: "Testimonial not found" });
    }
    return { success: true };
  } catch (err: any) {
    if (err.statusCode) throw err;
    console.error("Error deleting testimonial:", err);
    throw createError({ statusCode: 500, message: "Failed to delete testimonial" });
  }
});
