/**
 * GET /api/quotes/:id
 * Admin — Get quote request detail
 */

import { requireAdmin } from "~/server/utils/serverAuth";
import { getQuoteRequestById } from "~/server/utils/quotes";

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
    const quote = await getQuoteRequestById(id);

    if (!quote) {
      throw createError({
        statusCode: 404,
        message: "Quote request not found",
      });
    }

    return {
      success: true,
      data: quote,
    };
  } catch (err: any) {
    if (err.statusCode) {
      throw err;
    }

    console.error("Error getting quote request:", err);

    throw createError({
      statusCode: 500,
      message: "Failed to get quote request",
    });
  }
});
