/**
 * DELETE /api/admin/homepage-inspirations/:id/cover
 * Admin — Delete cover image of a category
 */

import { requireAdmin } from "~/server/utils/serverAuth";
import {
  getCategoryById,
  updateCategory,
} from "~/server/utils/homepage-inspirations";
import { getSupabase } from "~/server/utils/supabase";

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
    const category = await getCategoryById(id);
    if (!category) {
      throw createError({
        statusCode: 404,
        message: "Category not found",
      });
    }

    if (category.cover_storage_path) {
      await getSupabase()
        .storage.from("homepage-inspirations")
        .remove([category.cover_storage_path]);
    }

    const updated = await updateCategory(id, {
      cover_filename: null,
      cover_original_filename: null,
      cover_mime_type: null,
      cover_file_size: null,
      cover_storage_path: null,
      cover_public_url: null,
    });

    if (!updated) {
      throw createError({
        statusCode: 500,
        message: "Failed to remove cover",
      });
    }

    return { success: true, data: updated };
  } catch (err: any) {
    if (err.statusCode) throw err;
    console.error("Error deleting cover:", err);
    throw createError({
      statusCode: 500,
      message: "Failed to delete cover",
    });
  }
});
