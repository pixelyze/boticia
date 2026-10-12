/**
 * GET /api/client/project
 * Client — Get project overview (quote + counters)
 */

import { requireClient } from "~/server/utils/serverAuth";
import {
  countInspirations,
  getLatestSentMoodboard,
  getLatestSentProposal,
} from "~/server/utils/client-portal";

export default defineEventHandler(async (event) => {
  const { quoteRequest } = await requireClient(event);

  try {
    const [inspirationCount, moodboard, latestProposal] =
      await Promise.all([
        countInspirations(quoteRequest.id),
        getLatestSentMoodboard(quoteRequest.id),
        getLatestSentProposal(quoteRequest.id),
      ]);

    // Les notes internes de Laëtitia ne doivent jamais partir chez la
    // cliente (elles seraient lisibles dans l'onglet réseau).
    const { admin_notes, kanban_position, ...quote } = quoteRequest;

    return {
      success: true,
      data: {
        quote,
        counts: {
          inspirations: inspirationCount,
          moodboard: moodboard.length,
          proposals: latestProposal ? 1 : 0,
        },
        // Ce que voit la cliente : dernières versions envoyées.
        latestProposal,
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
