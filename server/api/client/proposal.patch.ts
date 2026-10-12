/**
 * PATCH /api/client/proposal
 * Client — Accept or request revision on proposal
 */

import { requireClient } from "~/server/utils/serverAuth";
import {
  getLatestSentProposal,
  updateProposal,
} from "~/server/utils/client-portal";
import {
  sendRevisionRequestNotification,
  ADMIN_EMAIL,
} from "~/server/utils/email";
import { generateMagicLink } from "~/server/utils/supabase";
import type { QuoteRequest } from "~/server/utils/quotes-types";

/**
 * Email à Laetitia, avec un lien magique vers la fiche (comme pour une
 * nouvelle demande). Un échec d'envoi ne doit pas faire échouer la
 * réponse de la cliente, déjà enregistrée.
 */
async function notifyRevisionRequest(
  quote: QuoteRequest,
  comment: string
) {
  const coupleName = quote.partner2_name
    ? `${quote.partner1_name} & ${quote.partner2_name}`
    : quote.partner1_name;
  const baseUrl =
    process.env.NUXT_PUBLIC_SITE_URL || "http://localhost:3001";
  const quotePath = `/fr/dashboard/quotes/${quote.id}`;

  let dashboardUrl = `${baseUrl}${quotePath}`;
  try {
    const { link } = await generateMagicLink(
      ADMIN_EMAIL,
      `${baseUrl}/fr/confirm?redirect=${encodeURIComponent(quotePath)}`
    );
    if (link) dashboardUrl = link;
  } catch (err) {
    console.error("Error generating admin magic link:", err);
  }

  try {
    await sendRevisionRequestNotification({
      coupleName,
      comment,
      dashboardUrl,
    });
  } catch (err) {
    console.error("Error sending revision email:", err);
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

    // Prévenir Laetitia : sans email, une demande de modification ne se
    // voyait qu'en ouvrant la fiche. await obligatoire sur Vercel.
    if (action === "revision") {
      await notifyRevisionRequest(quoteRequest, comment || "");
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
