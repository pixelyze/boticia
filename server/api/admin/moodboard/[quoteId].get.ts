/**
 * GET /api/admin/moodboard/:quoteId
 * Admin — List moodboard items for a quote
 */

import { requireAdmin } from "~/server/utils/serverAuth";
import { getMoodboardByQuoteId } from "~/server/utils/client-portal";

export default defineEventHandler(async (event) => {
  await requireAdmin(event);

  const quoteId = getRouterParam(event, "quoteId");

  if (!quoteId) {
    throw createError({
      statusCode: 400,
      message: "Quote ID is required",
    });
  }

  try {
    const items = await getMoodboardByQuoteId(quoteId);

    return {
      success: true,
      data: items,
    };
  } catch (err) {
    console.error("Error getting moodboard:", err);
    throw createError({
      statusCode: 500,
      message: "Failed to get moodboard",
    });
  }
});
