/**
 * GET /api/galleries/:slug
 * Public — Get published gallery images by slug
 */

import { getGalleryImagesBySlug } from "~/server/utils/galleries";

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, "slug");

  if (!slug) {
    throw createError({
      statusCode: 400,
      message: "Gallery slug is required",
    });
  }

  try {
    const images = await getGalleryImagesBySlug(slug);
    return { success: true, data: images };
  } catch (err) {
    console.error("Error:", err);
    return { success: false, data: [] };
  }
});
