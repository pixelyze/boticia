/**
 * PATCH /api/admin/portal/:quoteId
 * Admin — Toggle portal_enabled + moodboard_note
 */

import { requireAdmin } from "~/server/utils/serverAuth";
import { updateQuotePortal } from "~/server/utils/client-portal";

export default defineEventHandler(async (event) => {
  await requireAdmin(event);
  const quoteId = getRouterParam(event, "quoteId");

  if (!quoteId) {
    throw createError({
      statusCode: 400,
      message: "Quote ID is required",
    });
  }

  const body = await readBody(event);
  const { portal_enabled, moodboard_note } = body as {
    portal_enabled?: boolean;
    moodboard_note?: string;
  };

  try {
    const updated = await updateQuotePortal(quoteId, {
      portal_enabled,
      moodboard_note,
    });

    if (!updated) {
      throw createError({
        statusCode: 500,
        message: "Failed to update portal settings",
      });
    }

    return {
      success: true,
      data: updated,
    };
  } catch (err: any) {
    if (err.statusCode) throw err;
    console.error("Error updating portal:", err);
    throw createError({
      statusCode: 500,
      message: "Failed to update portal settings",
    });
  }
});
