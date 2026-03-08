/**
 * POST /api/quotes
 * Public — Submit a quote request
 */

import { createQuoteRequest } from "~/server/utils/quotes";
import type { CreateQuoteRequestInput } from "~/server/utils/quotes-types";

export default defineEventHandler(async (event) => {
  const body = await readBody<CreateQuoteRequestInput>(event);

  // Validate required fields
  const validServiceTypes = ["mariage", "evenement", "atelier"];
  if (!body.service_type || !validServiceTypes.includes(body.service_type)) {
    throw createError({
      statusCode: 400,
      message: "service_type must be mariage, evenement, or atelier",
    });
  }

  if (!body.partner1_name?.trim()) {
    throw createError({
      statusCode: 400,
      message: "partner1_name is required",
    });
  }

  if (!body.email?.trim()) {
    throw createError({
      statusCode: 400,
      message: "email is required",
    });
  }

  if (!body.phone?.trim()) {
    throw createError({
      statusCode: 400,
      message: "phone is required",
    });
  }

  if (!body.meeting_date?.trim()) {
    throw createError({
      statusCode: 400,
      message: "meeting_date is required",
    });
  }

  if (!body.meeting_time?.trim()) {
    throw createError({
      statusCode: 400,
      message: "meeting_time is required",
    });
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(body.email)) {
    throw createError({
      statusCode: 400,
      message: "Invalid email format",
    });
  }

  try {
    const quote = await createQuoteRequest(body);

    if (!quote) {
      throw createError({
        statusCode: 500,
        message: "Failed to create quote request",
      });
    }

    return {
      success: true,
      data: { id: quote.id },
    };
  } catch (err: any) {
    if (err.statusCode) {
      throw err;
    }

    console.error("Error creating quote request:", err);

    throw createError({
      statusCode: 500,
      message: "Failed to create quote request",
    });
  }
});
