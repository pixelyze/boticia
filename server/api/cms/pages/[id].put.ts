/**
 * PUT /api/cms/pages/:id
 * Update a page
 */

import { updatePage, getPageById } from "~/server/utils/cms";
import type { UpdatePageInput } from "~/server/utils/cms-types";

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

  const body = await readBody<UpdatePageInput>(event);

  try {
    // Check if page exists
    const existing = await getPageById(id);

    if (!existing) {
      throw createError({
        statusCode: 404,
        message: "Page not found",
      });
    }

    const page = await updatePage(id, body);

    if (!page) {
      throw createError({
        statusCode: 500,
        message: "Failed to update page",
      });
    }

    return {
      success: true,
      data: page,
    };
  } catch (err: any) {
    if (err.statusCode) {
      throw err;
    }

    console.error("Error updating page:", err);

    throw createError({
      statusCode: 500,
      message: "Failed to update page",
    });
  }
});
