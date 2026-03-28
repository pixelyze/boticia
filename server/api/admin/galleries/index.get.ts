/**
 * GET /api/admin/galleries
 * Admin — List all galleries
 */

import { requireAdmin } from "~/server/utils/serverAuth";
import { getAllGalleries } from "~/server/utils/galleries";

export default defineEventHandler(async (event) => {
  await requireAdmin(event);

  try {
    const galleries = await getAllGalleries();
    return { success: true, data: galleries };
  } catch (err) {
    console.error("Error:", err);
    throw createError({
      statusCode: 500,
      message: "Failed to fetch galleries",
    });
  }
});
