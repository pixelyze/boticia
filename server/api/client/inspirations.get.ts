/**
 * GET /api/client/inspirations
 * Client — List inspiration photos
 */

import { requireClient } from "~/server/utils/serverAuth";
import { getInspirationsByQuoteId } from "~/server/utils/client-portal";

export default defineEventHandler(async (event) => {
  const { quoteRequest } = await requireClient(event);

  try {
    const inspirations = await getInspirationsByQuoteId(
      quoteRequest.id
    );

    return {
      success: true,
      data: inspirations,
    };
  } catch (err) {
    console.error("Error getting inspirations:", err);
    throw createError({
      statusCode: 500,
      message: "Failed to get inspirations",
    });
  }
});
