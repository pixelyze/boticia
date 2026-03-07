/**
 * PATCH /api/quotes/:id/activity/:activityId
 * Admin — Update a note's text in the activity log
 */

import { requireAdmin } from "~/server/utils/serverAuth";
import { updateQuoteActivity } from "~/server/utils/quotes";

export default defineEventHandler(async (event) => {
  await requireAdmin(event);

  const activityId = getRouterParam(event, "activityId");

  if (!activityId) {
    throw createError({
      statusCode: 400,
      message: "Activity ID is required",
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
    const data = await updateQuoteActivity(
      activityId,
      body.text.trim()
    );
    return { success: true, data };
  } catch (err: any) {
    if (err.statusCode) throw err;
    console.error("Error updating activity:", err);
    throw createError({
      statusCode: 500,
      message: "Failed to update activity",
    });
  }
});
