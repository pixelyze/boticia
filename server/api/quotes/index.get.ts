/**
 * GET /api/quotes
 * Admin — List quote requests with optional status filter
 */

import { requireAdmin } from "~/server/utils/serverAuth";
import { getQuoteRequests } from "~/server/utils/quotes";

export default defineEventHandler(async (event) => {
  await requireAdmin(event);

  const query = getQuery(event);

  const filters = {
    status: query.status as string | undefined,
  };

  try {
    const quotes = await getQuoteRequests(filters);

    return {
      success: true,
      data: quotes,
      count: quotes.length,
    };
  } catch (err) {
    console.error("Error getting quote requests:", err);

    throw createError({
      statusCode: 500,
      message: "Failed to get quote requests",
    });
  }
});
