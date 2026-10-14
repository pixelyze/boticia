/**
 * PATCH /api/client/proposal
 * Client — Accept the proposal, or write to Laëtitia about it ("revision").
 * Writing can happen as many times as she wants : each message is kept in
 * the quote's activity log, the proposal keeps the latest one.
 */

import { requireClient } from "~/server/utils/serverAuth";
import {
  getLatestSentProposal,
  updateProposal,
} from "~/server/utils/client-portal";
import {
  sendRevisionRequestNotification,
  sendProposalAcceptedNotification,
  ADMIN_EMAIL,
} from "~/server/utils/email";
import { generateMagicLink } from "~/server/utils/supabase";
import {
  addQuoteActivity,
  getClientMessages,
} from "~/server/utils/quotes";
import type { QuoteRequest } from "~/server/utils/quotes-types";

/** Nom affiché du couple (ou de la cliente seule). */
function coupleNameOf(quote: QuoteRequest): string {
  return quote.partner2_name
    ? `${quote.partner1_name} & ${quote.partner2_name}`
    : quote.partner1_name;
}

/**
 * Lien vers la fiche pour Laëtitia, avec un lien magique (comme pour une
 * nouvelle demande) : elle l'ouvre depuis sa boîte mail sans se reconnecter.
 */
async function adminFicheUrl(quote: QuoteRequest): Promise<string> {
  const baseUrl =
    process.env.NUXT_PUBLIC_SITE_URL || "http://localhost:3001";
  const quotePath = `/fr/dashboard/quotes/${quote.id}`;

  try {
    const { link } = await generateMagicLink(
      ADMIN_EMAIL,
      `${baseUrl}/fr/confirm?redirect=${encodeURIComponent(quotePath)}`
    );
    if (link) return link;
  } catch (err) {
    console.error("Error generating admin magic link:", err);
  }
  return `${baseUrl}${quotePath}`;
}

/**
 * Emails à Laëtitia. Un échec d'envoi ne doit pas faire échouer la
 * réponse de la cliente, déjà enregistrée.
 */
async function notifyRevisionRequest(
  quote: QuoteRequest,
  comment: string
) {
  try {
    await sendRevisionRequestNotification({
      coupleName: coupleNameOf(quote),
      comment,
      dashboardUrl: await adminFicheUrl(quote),
    });
  } catch (err) {
    console.error("Error sending revision email:", err);
  }
}

async function notifyProposalAccepted(
  quote: QuoteRequest,
  version?: number | null
) {
  try {
    await sendProposalAcceptedNotification({
      coupleName: coupleNameOf(quote),
      version,
      dashboardUrl: await adminFicheUrl(quote),
    });
  } catch (err) {
    console.error("Error sending acceptance email:", err);
  }
}

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

  const message = (comment || "").trim();
  if (action === "revision" && !message) {
    throw createError({
      statusCode: 400,
      message: "A message is required",
    });
  }

  try {
    // La réponse porte sur la dernière version envoyée, celle qu'elle voit.
    const latest = await getLatestSentProposal(quoteRequest.id);

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
            client_comment: message,
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

    // Prévenir Laetitia : sans email, une demande de modification ne se
    // voyait qu'en ouvrant la fiche. await obligatoire sur Vercel.
    if (action === "accept") {
      await notifyProposalAccepted(quoteRequest, latest.version);
    }

    if (action === "revision") {
      await addQuoteActivity(quoteRequest.id, "client_message", {
        text: message,
        proposal_id: latest.id,
        version: latest.version || 1,
      });
      await notifyRevisionRequest(quoteRequest, message);
    }

    return {
      success: true,
      data: updated,
      messages: await getClientMessages(quoteRequest.id, latest.id),
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
