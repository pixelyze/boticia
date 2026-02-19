/**
 * GET /api/inspirations/homepage
 * Public — Get published homepage inspiration categories
 */

import { getPublishedCategories } from "~/server/utils/homepage-inspirations";

export default defineEventHandler(async () => {
  try {
    const categories = await getPublishedCategories();
    return { success: true, data: categories };
  } catch (err) {
    console.error("Error:", err);
    return { success: false, data: [] };
  }
});
