/**
 * GET /api/inspirations/:categoryId
 * Public — Get images for a specific inspiration category
 */

import { getImagesByCategory } from "~/server/utils/homepage-inspirations";

export default defineEventHandler(async (event) => {
  try {
    const categoryId = getRouterParam(event, "categoryId");

    if (!categoryId) {
      throw createError({
        statusCode: 400,
        statusMessage: "Missing categoryId",
      });
    }

    const images = await getImagesByCategory(categoryId);
    return { success: true, data: images };
  } catch (err: any) {
    if (err.statusCode) throw err;
    console.error("Error:", err);
    return { success: false, data: [] };
  }
});
