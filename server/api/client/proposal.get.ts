/**
 * GET /api/client/proposal
 * Client — Get latest proposal
 */

import { requireClient } from "~/server/utils/serverAuth";
import {
  getLatestSentProposal,
  updateProposal,
} from "~/server/utils/client-portal";
import { getClientMessages } from "~/server/utils/quotes";

export default defineEventHandler(async (event) => {
  const { quoteRequest } = await requireClient(event);

  try {
    // Dernière version envoyée : brouillons et versions remplacées
    // restent invisibles pour la cliente.
    const latest = await getLatestSentProposal(quoteRequest.id);

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
      // Ses messages « Écrire à Laëtitia » sur cette version.
      messages: latest
        ? await getClientMessages(quoteRequest.id, latest.id)
        : [],
    };
  } catch (err) {
    console.error("Error getting proposal:", err);
    throw createError({
      statusCode: 500,
      message: "Failed to get proposal",
    });
  }
});
