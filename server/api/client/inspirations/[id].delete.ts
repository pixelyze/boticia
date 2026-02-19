/**
 * DELETE /api/client/inspirations/:id
 * Client — Delete an inspiration photo
 */

import { requireClient } from "~/server/utils/serverAuth";
import {
  getInspirationById,
  deleteInspiration,
} from "~/server/utils/client-portal";
import { getSupabase } from "~/server/utils/supabase";

export default defineEventHandler(async (event) => {
  const { quoteRequest } = await requireClient(event);
  const id = getRouterParam(event, "id");

  if (!id) {
    throw createError({
      statusCode: 400,
      message: "Inspiration ID is required",
    });
  }

  try {
    const inspiration = await getInspirationById(id);

    if (!inspiration) {
      throw createError({
        statusCode: 404,
        message: "Inspiration not found",
      });
    }

    // Verify ownership
    if (inspiration.quote_id !== quoteRequest.id) {
      throw createError({
        statusCode: 403,
        message: "Not authorized",
      });
    }

    // Delete from storage
    await getSupabase()
      .storage.from("client-inspirations")
      .remove([inspiration.storage_path]);

    // Delete from database
    const deleted = await deleteInspiration(id);

    if (!deleted) {
      throw createError({
        statusCode: 500,
        message: "Failed to delete inspiration",
      });
    }

    return { success: true };
  } catch (err: any) {
    if (err.statusCode) throw err;
    console.error("Error deleting inspiration:", err);
    throw createError({
      statusCode: 500,
      message: "Failed to delete inspiration",
    });
  }
});
