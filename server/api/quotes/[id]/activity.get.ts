/**
 * GET /api/quotes/:id/activity
 * Admin — Get activity log for a quote
 */

import { requireAdmin } from "~/server/utils/serverAuth";
import { getQuoteActivityLog } from "~/server/utils/quotes";

export default defineEventHandler(async (event) => {
  await requireAdmin(event);

  const id = getRouterParam(event, "id");

  if (!id) {
    throw createError({
      statusCode: 400,
      message: "Quote request ID is required",
    });
  }

  try {
    const data = await getQuoteActivityLog(id);

    return {
      success: true,
      data,
    };
  } catch (err: any) {
    if (err.statusCode) {
      throw err;
    }

    console.error("Error getting activity log:", err);

    throw createError({
      statusCode: 500,
      message: "Failed to get activity log",
    });
  }
});
