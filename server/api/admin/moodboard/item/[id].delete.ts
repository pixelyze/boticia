/**
 * DELETE /api/admin/moodboard/item/:id
 * Admin — Delete a moodboard item
 */

import { requireAdmin } from "~/server/utils/serverAuth";
import {
  getMoodboardItemById,
  deleteMoodboardItem,
} from "~/server/utils/client-portal";
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

    // Un élément envoyé fait partie d'une version figée du moodboard.
    if (item.sent_at) {
      throw createError({
        statusCode: 409,
        message: "Cet élément a été envoyé : il ne peut plus être supprimé",
      });
    }

    // Par prudence, on n'efface le fichier que s'il n'est plus référencé par
    // aucun autre élément (une version envoyée pourrait l'utiliser).
    if (item.storage_path) {
      const { count } = await getSupabase()
        .from("project_moodboard_items")
        .select("id", { count: "exact", head: true })
        .eq("storage_path", item.storage_path)
        .neq("id", item.id);
      if (!count) {
        await getSupabase()
          .storage.from("project-moodboard")
          .remove([item.storage_path]);
      }
    }

    const deleted = await deleteMoodboardItem(id);

    if (!deleted) {
      throw createError({
        statusCode: 500,
        message: "Failed to delete moodboard item",
      });
    }

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
