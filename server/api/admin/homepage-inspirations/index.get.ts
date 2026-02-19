/**
 * GET /api/admin/homepage-inspirations
 * Admin — List all homepage inspiration categories
 */

import { requireAdmin } from "~/server/utils/serverAuth";
import { getAllCategories } from "~/server/utils/homepage-inspirations";

export default defineEventHandler(async (event) => {
  await requireAdmin(event);

  try {
    const categories = await getAllCategories();
    return { success: true, data: categories };
  } catch (err) {
    console.error("Error:", err);
    return { success: false, data: [] };
  }
});
