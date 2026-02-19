/**
 * GET /api/client/project
 * Client — Get project overview (quote + counters)
 */

import { requireClient } from "~/server/utils/serverAuth";
import {
  countInspirations,
  getMoodboardByQuoteId,
  getProposalsByQuoteId,
} from "~/server/utils/client-portal";

export default defineEventHandler(async (event) => {
  const { quoteRequest } = await requireClient(event);

  try {
    const [inspirationCount, moodboard, proposals] =
      await Promise.all([
        countInspirations(quoteRequest.id),
        getMoodboardByQuoteId(quoteRequest.id),
        getProposalsByQuoteId(quoteRequest.id),
      ]);

    return {
      success: true,
      data: {
        quote: quoteRequest,
        counts: {
          inspirations: inspirationCount,
          moodboard: moodboard.length,
          proposals: proposals.length,
        },
        latestProposal: proposals[0] || null,
      },
    };
  } catch (err) {
    console.error("Error getting client project:", err);
    throw createError({
      statusCode: 500,
      message: "Failed to get project",
    });
  }
});
