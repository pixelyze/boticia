/**
 * DELETE /api/cms/pages/:id
 * Delete a page
 */

import { deletePage, getPageById } from "~/server/utils/cms";

export default defineEventHandler(async (event) => {
  // TODO: Add authentication check
  // const user = await requireAuth(event);

  const id = getRouterParam(event, "id");

  if (!id) {
    throw createError({
      statusCode: 400,
      message: "Page ID is required",
    });
  }

  try {
    // Check if page exists
    const existing = await getPageById(id);

    if (!existing) {
      throw createError({
        statusCode: 404,
        message: "Page not found",
      });
    }

    const success = await deletePage(id);

    if (!success) {
      throw createError({
        statusCode: 500,
        message: "Failed to delete page",
      });
    }

    return {
      success: true,
      message: "Page deleted successfully",
    };
  } catch (err: any) {
    if (err.statusCode) {
      throw err;
    }

    console.error("Error deleting page:", err);

    throw createError({
      statusCode: 500,
      message: "Failed to delete page",
    });
  }
});
