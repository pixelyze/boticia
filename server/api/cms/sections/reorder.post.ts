/**
 * POST /api/cms/sections/reorder
 * Reorder sections
 * Body: { sectionIds: string[] }
 */

import { reorderSections } from "~/server/utils/cms";

export default defineEventHandler(async (event) => {
  const body = await readBody<{ sectionIds: string[] }>(event);

  if (!body.sectionIds || !Array.isArray(body.sectionIds)) {
    throw createError({
      statusCode: 400,
      message: "sectionIds array is required",
    });
  }

  try {
    const success = await reorderSections(body.sectionIds);

    if (!success) {
      throw createError({
        statusCode: 500,
        message: "Failed to reorder sections",
      });
    }

    return {
      success: true,
      message: "Sections reordered successfully",
    };
  } catch (err) {
    console.error("Error reordering sections:", err);

    throw createError({
      statusCode: 500,
      message: "Failed to reorder sections",
    });
  }
});
