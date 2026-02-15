/**
 * DELETE /api/cms/sections/:id
 * Delete a section
 */

import { deleteSection, getSectionById } from "~/server/utils/cms";

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");

  if (!id) {
    throw createError({
      statusCode: 400,
      message: "Section ID is required",
    });
  }

  try {
    const existing = await getSectionById(id);

    if (!existing) {
      throw createError({
        statusCode: 404,
        message: "Section not found",
      });
    }

    const success = await deleteSection(id);

    if (!success) {
      throw createError({
        statusCode: 500,
        message: "Failed to delete section",
      });
    }

    return {
      success: true,
      message: "Section deleted successfully",
    };
  } catch (err: any) {
    if (err.statusCode) {
      throw err;
    }

    console.error("Error deleting section:", err);

    throw createError({
      statusCode: 500,
      message: "Failed to delete section",
    });
  }
});
