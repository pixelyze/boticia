/**
 * GET /api/admin/proposals/:quoteId
 * Admin — List proposals for a quote
 */

import { requireAdmin } from "~/server/utils/serverAuth";
import { getProposalsByQuoteId } from "~/server/utils/client-portal";

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
    const proposals = await getProposalsByQuoteId(quoteId);

    return {
      success: true,
      data: proposals,
    };
  } catch (err) {
    console.error("Error getting proposals:", err);
    throw createError({
      statusCode: 500,
      message: "Failed to get proposals",
    });
  }
});
