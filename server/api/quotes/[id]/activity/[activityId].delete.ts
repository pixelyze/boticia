/**
 * DELETE /api/quotes/:id/activity/:activityId
 * Admin — Delete a note from the activity log
 */

import { requireAdmin } from "~/server/utils/serverAuth";
import { deleteQuoteActivity } from "~/server/utils/quotes";

export default defineEventHandler(async (event) => {
  await requireAdmin(event);

  const activityId = getRouterParam(event, "activityId");

  if (!activityId) {
    throw createError({
      statusCode: 400,
      message: "Activity ID is required",
    });
  }

  try {
    await deleteQuoteActivity(activityId);
    return { success: true };
  } catch (err: any) {
    if (err.statusCode) throw err;
    console.error("Error deleting activity:", err);
    throw createError({
      statusCode: 500,
      message: "Failed to delete activity",
    });
  }
});
