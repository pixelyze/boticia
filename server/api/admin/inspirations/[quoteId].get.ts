/**
 * GET /api/admin/inspirations/:quoteId
 * Admin — View client inspirations (read-only)
 */

import { requireAdmin } from "~/server/utils/serverAuth";
import { getInspirationsByQuoteId } from "~/server/utils/client-portal";

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
    const inspirations = await getInspirationsByQuoteId(
      quoteId
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
