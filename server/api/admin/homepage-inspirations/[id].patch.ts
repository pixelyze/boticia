/**
 * PATCH /api/admin/homepage-inspirations/:id
 * Admin — Update a homepage inspiration category
 */

import { requireAdmin } from "~/server/utils/serverAuth";
import { updateCategory } from "~/server/utils/homepage-inspirations";

export default defineEventHandler(async (event) => {
  await requireAdmin(event);
  const id = getRouterParam(event, "id");

  if (!id) {
    throw createError({
      statusCode: 400,
      message: "Category ID is required",
    });
  }

  try {
    const body = await readBody(event);
    const category = await updateCategory(id, body);

    if (!category) {
      throw createError({
        statusCode: 404,
        message: "Category not found",
      });
    }

    return { success: true, data: category };
  } catch (err: any) {
    if (err.statusCode) throw err;
    console.error("Error updating category:", err);
    throw createError({
      statusCode: 500,
      message: "Failed to update category",
    });
  }
});
