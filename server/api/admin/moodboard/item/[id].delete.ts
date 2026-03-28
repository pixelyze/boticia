/**
 * DELETE /api/admin/moodboard/item/:id
 * Admin — Delete a moodboard item
 */

import { requireAdmin } from "~/server/utils/serverAuth";
import {
  getMoodboardItemById,
  deleteMoodboardItem,
} from "~/server/utils/client-portal";
import { addQuoteActivity } from "~/server/utils/quotes";
import { getSupabase } from "~/server/utils/supabase";

export default defineEventHandler(async (event) => {
  await requireAdmin(event);
  const id = getRouterParam(event, "id");

  if (!id) {
    throw createError({
      statusCode: 400,
      message: "Item ID is required",
    });
  }

  try {
    const item = await getMoodboardItemById(id);

    if (!item) {
      throw createError({
        statusCode: 404,
        message: "Moodboard item not found",
      });
    }

    // Delete from storage if it's a file
    if (item.storage_path) {
      await getSupabase()
        .storage.from("project-moodboard")
        .remove([item.storage_path]);
    }

    const deleted = await deleteMoodboardItem(id);

    if (!deleted) {
      throw createError({
        statusCode: 500,
        message: "Failed to delete moodboard item",
      });
    }

    // Log activity
    await addQuoteActivity(item.quote_id, "moodboard_removed", {
      filename: item.original_filename,
    });

    return { success: true };
  } catch (err: any) {
    if (err.statusCode) throw err;
    console.error("Error deleting moodboard item:", err);
    throw createError({
      statusCode: 500,
      message: "Failed to delete moodboard item",
    });
  }
});
