/**
 * PATCH /api/quotes/:id
 * Admin — Update quote request (status + admin_notes)
 */

import { requireAdmin } from "~/server/utils/serverAuth";
import {
  getQuoteRequestById,
  updateQuoteRequest,
  addQuoteActivity,
} from "~/server/utils/quotes";
import type { UpdateQuoteRequestInput } from "~/server/utils/quotes-types";
import {
  sendMoodboardNotification,
  sendProposalNotification,
} from "~/server/utils/email";

export default defineEventHandler(async (event) => {
  await requireAdmin(event);

  const id = getRouterParam(event, "id");

  if (!id) {
    throw createError({
      statusCode: 400,
      message: "Quote request ID is required",
    });
  }

  const body = await readBody<UpdateQuoteRequestInput>(event);

  try {
    const existing = await getQuoteRequestById(id);

    if (!existing) {
      throw createError({
        statusCode: 404,
        message: "Quote request not found",
      });
    }

    const quote = await updateQuoteRequest(id, body);

    if (!quote) {
      throw createError({
        statusCode: 500,
        message: "Failed to update quote request",
      });
    }

    const coupleName = existing.partner2_name
      ? `${existing.partner1_name} & ${existing.partner2_name}`
      : existing.partner1_name;
    const locale = existing.locale || "fr";
    const portalBase = `${process.env.NUXT_PUBLIC_SITE_URL || "http://localhost:3001"}/${locale}/mon-projet`;

    // Log activity for status changes
    if (body.status && body.status !== existing.status) {
      await addQuoteActivity(id, "status_changed", {
        from: existing.status,
        to: body.status,
      });

      if (body.status === "quote_sent") {
        // await obligatoire : Vercel interrompt la fonction dès la réponse
        // envoyée, une promesse non attendue ne partirait jamais.
        try {
          await sendProposalNotification(
            existing.email,
            coupleName,
            `${portalBase}/proposition`
          );
        } catch (err) {
          console.error("Error sending proposal email:", err);
        }
      }
    }

    // L'envoi du moodboard n'est plus un changement de statut : il se
    // déclenche au passage de moodboard_sent_at de vide à renseigné.
    if (body.moodboard_sent_at && !existing.moodboard_sent_at) {
      await addQuoteActivity(id, "moodboard_sent", {});

      try {
        await sendMoodboardNotification(
          existing.email,
          coupleName,
          `${portalBase}/moodboard`
        );
      } catch (err) {
        console.error("Error sending moodboard email:", err);
      }
    }

    // Log activity for note updates
    if (
      body.admin_notes !== undefined &&
      body.admin_notes !== existing.admin_notes
    ) {
      await addQuoteActivity(id, "note_updated", {});
    }

    // Log activity for meeting scheduling
    if (
      body.meeting_date &&
      (body.meeting_date !== existing.meeting_date ||
        body.meeting_time !== existing.meeting_time)
    ) {
      await addQuoteActivity(id, "meeting_scheduled", {
        date: body.meeting_date,
        time: body.meeting_time || "",
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

    console.error("Error updating quote request:", err);

    throw createError({
      statusCode: 500,
      message: "Failed to update quote request",
    });
  }
});
