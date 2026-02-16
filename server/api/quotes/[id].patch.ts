/**
 * PATCH /api/quotes/:id
 * Admin — Update quote request (status + admin_notes)
 */

import { requireAdmin } from "~/server/utils/serverAuth";
import {
  getQuoteRequestById,
  updateQuoteRequest,
} from "~/server/utils/quotes";
import type { UpdateQuoteRequestInput } from "~/server/utils/quotes-types";

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
