/**
 * GET /api/client/proposal
 * Client — Get latest proposal
 */

import { requireClient } from "~/server/utils/serverAuth";
import {
  getProposalsByQuoteId,
  updateProposal,
} from "~/server/utils/client-portal";

export default defineEventHandler(async (event) => {
  const { quoteRequest } = await requireClient(event);

  try {
    const proposals = await getProposalsByQuoteId(
      quoteRequest.id
    );

    // Only show non-draft proposals to client
    const visible = proposals.filter(
      (p) => p.status !== "draft"
    );

    const latest = visible[0] || null;

    // Mark as viewed if pending
    if (latest && latest.status === "pending") {
      await updateProposal(latest.id, {
        status: "viewed",
        viewed_at: new Date().toISOString(),
      });
      latest.status = "viewed";
      latest.viewed_at = new Date().toISOString();
    }

    return {
      success: true,
      data: latest,
    };
  } catch (err) {
    console.error("Error getting proposal:", err);
    throw createError({
      statusCode: 500,
      message: "Failed to get proposal",
    });
  }
});
