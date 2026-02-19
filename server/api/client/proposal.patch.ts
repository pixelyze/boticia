/**
 * PATCH /api/client/proposal
 * Client — Accept or request revision on proposal
 */

import { requireClient } from "~/server/utils/serverAuth";
import {
  getProposalsByQuoteId,
  updateProposal,
} from "~/server/utils/client-portal";

export default defineEventHandler(async (event) => {
  const { quoteRequest } = await requireClient(event);
  const body = await readBody(event);

  const { action, comment } = body as {
    action: "accept" | "revision";
    comment?: string;
  };

  if (!action || !["accept", "revision"].includes(action)) {
    throw createError({
      statusCode: 400,
      message: "Invalid action. Use 'accept' or 'revision'.",
    });
  }

  try {
    const proposals = await getProposalsByQuoteId(
      quoteRequest.id
    );
    const visible = proposals.filter(
      (p) => p.status !== "draft"
    );
    const latest = visible[0];

    if (!latest) {
      throw createError({
        statusCode: 404,
        message: "No proposal found",
      });
    }

    if (latest.status === "accepted") {
      throw createError({
        statusCode: 400,
        message: "Proposal already accepted",
      });
    }

    const updateData =
      action === "accept"
        ? {
            status: "accepted" as const,
            responded_at: new Date().toISOString(),
          }
        : {
            status: "revision_requested" as const,
            responded_at: new Date().toISOString(),
            client_comment: comment || "",
          };

    const updated = await updateProposal(
      latest.id,
      updateData
    );

    if (!updated) {
      throw createError({
        statusCode: 500,
        message: "Failed to update proposal",
      });
    }

    return {
      success: true,
      data: updated,
    };
  } catch (err: any) {
    if (err.statusCode) throw err;
    console.error("Error updating proposal:", err);
    throw createError({
      statusCode: 500,
      message: "Failed to update proposal",
    });
  }
});
