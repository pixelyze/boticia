/**
 * POST /api/quotes
 * Public — Submit a quote request
 */

import { createQuoteRequest } from "~/server/utils/quotes";
import type {
  CreateQuoteRequestInput,
  WorkshopTypeKey,
} from "~/server/utils/quotes-types";
import {
  FLORAL_NEED_KEYS,
  EVENT_NEED_KEYS,
  WORKSHOP_TYPE_KEYS,
} from "~/server/utils/quotes-types";
import {
  sendNewQuoteNotification,
  sendQuoteConfirmationEmail,
  ADMIN_EMAIL,
} from "~/server/utils/email";
import { generateMagicLink } from "~/server/utils/supabase";

// PUBLIC: quote request form
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

  // Prestations : obligatoires dans le formulaire (étape 6), vérifiées ici
  // aussi pour qu'un appel direct à l'API ne crée pas de demande vide.
  if (body.service_type === "atelier") {
    if (
      !WORKSHOP_TYPE_KEYS.includes(body.workshop_type as WorkshopTypeKey)
    ) {
      throw createError({
        statusCode: 400,
        message: "workshop_type is required for an atelier",
      });
    }
  } else {
    const allowed: string[] =
      body.service_type === "mariage" ? FLORAL_NEED_KEYS : EVENT_NEED_KEYS;
    const needs = Array.isArray(body.floral_needs) ? body.floral_needs : [];
    if (
      needs.length === 0 ||
      !needs.every((need) => allowed.includes(need))
    ) {
      throw createError({
        statusCode: 400,
        message: "floral_needs must list at least one valid service",
      });
    }
  }

  // Budget : obligatoire dans le formulaire pour un mariage (seul type
  // pour lequel la question est posée).
  if (
    body.service_type === "mariage" &&
    !["lt_2500", "lt_4000", "lt_10000"].includes(body.budget || "")
  ) {
    throw createError({
      statusCode: 400,
      message: "budget is required for a mariage",
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

    // Notify admin — must be awaited on serverless (Vercel kills the function on response)
    const coupleName = body.partner2_name
      ? `${body.partner1_name} & ${body.partner2_name}`
      : body.partner1_name;
    const baseUrl = process.env.NUXT_PUBLIC_SITE_URL || "http://localhost:3001";
    const quotePath = `/fr/dashboard/quotes/${quote.id}`;

    // Le CTA embarque un lien magique pour que l'admin ouvre la fiche
    // directement depuis sa boîte mail, sans reconnexion. Il passe par
    // /confirm : la session doit être établie avant d'atteindre une page
    // protégée, sinon le middleware éjecte vers le login.
    let ctaUrl = `${baseUrl}${quotePath}`;
    try {
      const { link } = await generateMagicLink(
        ADMIN_EMAIL,
        `${baseUrl}/fr/confirm?redirect=${encodeURIComponent(quotePath)}`
      );
      // Sans lien magique on garde le lien nu : l'email part quand même,
      // elle devra juste se connecter.
      if (link) ctaUrl = link;
    } catch (err) {
      console.error("Error generating admin magic link:", err);
    }

    try {
      await sendNewQuoteNotification({
        coupleName,
        email: body.email,
        phone: body.phone,
        serviceType: body.service_type,
        weddingDate: body.wedding_date,
        meetingDate: body.meeting_date,
        meetingTime: body.meeting_time,
        dashboardUrl: ctaUrl,
      });
    } catch (err) {
      console.error("Error sending admin notification:", err);
    }

    // Confirmation à la cliente, avec un lien direct vers son espace
    // (le formulaire lui dit qu'elle pourra y ajouter ses photos).
    const locale = ["fr", "en", "ja"].includes(body.locale || "")
      ? body.locale
      : "fr";
    try {
      const { link } = await generateMagicLink(
        body.email,
        `${baseUrl}/${locale}/confirm`
      );
      await sendQuoteConfirmationEmail({
        email: body.email,
        coupleName,
        serviceType: body.service_type,
        meetingDate: body.meeting_date,
        meetingTime: body.meeting_time,
        portalUrl: link || `${baseUrl}/${locale}/login`,
        loginUrl: `${baseUrl}/${locale}/login`,
        locale,
      });
    } catch (err) {
      console.error("Error sending client confirmation:", err);
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
