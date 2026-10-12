/**
 * POST /api/quotes/:id/notes
 * Admin — Add a note to the activity log
 */

import { requireAdmin } from "~/server/utils/serverAuth";
import { getSupabase } from "~/server/utils/supabase";

export default defineEventHandler(async (event) => {
  await requireAdmin(event);

  const id = getRouterParam(event, "id");

  if (!id) {
    throw createError({
      statusCode: 400,
      message: "Quote request ID is required",
    });
  }

  const body = await readBody(event);

  if (!body?.text || typeof body.text !== "string") {
    throw createError({
      statusCode: 400,
      message: "Note text is required",
    });
  }

  try {
    // Insertion directe (et non addQuoteActivity, qui avale les erreurs) :
    // l'enregistrement en temps réel a besoin de l'id pour les mises à
    // jour suivantes, et d'une vraie erreur si l'écriture échoue.
    const { data, error } = await getSupabase()
      .from("quote_activity_log")
      .insert({
        quote_id: id,
        action: "note_added",
        details: { text: body.text.trim() },
      })
      .select("id")
      .single();

    if (error) throw new Error(error.message);

    return { success: true, data };
  } catch (err: any) {
    if (err.statusCode) {
      throw err;
    }

    console.error("Error adding note:", err);

    throw createError({
      statusCode: 500,
      message: "Failed to add note",
    });
  }
});
