/**
 * GET /api/admin/galleries/:id/images
 * Admin — List all images for a gallery
 */

import { requireAdmin } from "~/server/utils/serverAuth";
import { getGalleryImages } from "~/server/utils/galleries";

export default defineEventHandler(async (event) => {
  await requireAdmin(event);
  const id = getRouterParam(event, "id");

  if (!id) {
    throw createError({
      statusCode: 400,
      message: "Gallery ID is required",
    });
  }

  try {
    const images = await getGalleryImages(id);
    return { success: true, data: images };
  } catch (err) {
    console.error("Error:", err);
    throw createError({
      statusCode: 500,
      message: "Failed to fetch gallery images",
    });
  }
});
