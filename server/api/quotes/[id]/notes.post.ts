/**
 * POST /api/quotes/:id/notes
 * Admin — Add a note to the activity log
 */

import { requireAdmin } from "~/server/utils/serverAuth";
import { addQuoteActivity } from "~/server/utils/quotes";

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
    await addQuoteActivity(id, "note_added", {
      text: body.text.trim(),
    });

    return { success: true };
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
