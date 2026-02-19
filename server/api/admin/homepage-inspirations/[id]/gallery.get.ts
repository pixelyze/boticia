/**
 * GET /api/admin/homepage-inspirations/:id/gallery
 * Admin — List gallery images of a category
 */

import { requireAdmin } from "~/server/utils/serverAuth";
import { getImagesByCategory } from "~/server/utils/homepage-inspirations";

export default defineEventHandler(async (event) => {
  await requireAdmin(event);
  const id = getRouterParam(event, "id");

  if (!id) {
    throw createError({
      statusCode: 400,
      message: "Category ID is required",
    });
  }

  try {
    const images = await getImagesByCategory(id);
    return { success: true, data: images };
  } catch (err) {
    console.error("Error:", err);
    return { success: false, data: [] };
  }
});
