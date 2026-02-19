/**
 * GET /api/client/moodboard
 * Client — Get moodboard items
 */

import { requireClient } from "~/server/utils/serverAuth";
import { getMoodboardByQuoteId } from "~/server/utils/client-portal";

export default defineEventHandler(async (event) => {
  const { quoteRequest } = await requireClient(event);

  try {
    const items = await getMoodboardByQuoteId(quoteRequest.id);

    return {
      success: true,
      data: items,
      moodboardNote: quoteRequest.moodboard_note || null,
    };
  } catch (err) {
    console.error("Error getting moodboard:", err);
    throw createError({
      statusCode: 500,
      message: "Failed to get moodboard",
    });
  }
});
