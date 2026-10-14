/**
 * POST /api/admin/moodboard/:quoteId/send
 * Admin — Envoyer le moodboard en préparation à la cliente.
 *
 * Les éléments en préparation deviennent une version figée (V1, V2…) :
 * la cliente voit désormais cette version, les précédentes restent dans
 * l'historique de la fiche. Un email part à chaque version.
 */

import { requireAdmin } from "~/server/utils/serverAuth";
import { getMoodboardByQuoteId } from "~/server/utils/client-portal";
import {
  addQuoteActivity,
  getQuoteRequestById,
  updateQuoteRequest,
} from "~/server/utils/quotes";
import { sendMoodboardNotification } from "~/server/utils/email";
import { getSupabase } from "~/server/utils/supabase";

export default defineEventHandler(async (event) => {
  await requireAdmin(event);

  const quoteId = getRouterParam(event, "quoteId");
  if (!quoteId) {
    throw createError({ statusCode: 400, message: "Quote ID is required" });
  }

  const quote = await getQuoteRequestById(quoteId);
  if (!quote) {
    throw createError({ statusCode: 404, message: "Quote not found" });
  }

  const items = await getMoodboardByQuoteId(quoteId);
  const drafts = items.filter((i) => !i.sent_at);
  if (drafts.length === 0) {
    throw createError({
      statusCode: 400,
      message: "Aucun élément en préparation à envoyer",
    });
  }

  const version =
    Math.max(0, ...items.filter((i) => i.sent_at).map((i) => i.version || 0)) +
    1;
  const now = new Date().toISOString();

  const { error } = await getSupabase()
    .from("project_moodboard_items")
    .update({ sent_at: now, version })
    .in(
      "id",
      drafts.map((i) => i.id)
    );
  if (error) {
    console.error("Error sending moodboard:", error.message);
    throw createError({
      statusCode: 500,
      message: "Failed to send moodboard",
    });
  }

  // moodboard_sent_at = date du dernier envoi (étiquette du pipeline).
  // Le mot en préparation devient celui de la version envoyée (vu par la
  // cliente) ; il est gardé dans le journal pour l'historique de la fiche.
  const note = (quote.moodboard_draft_note || "").trim();
  await updateQuoteRequest(quoteId, {
    moodboard_sent_at: now,
    moodboard_note: note || null,
    moodboard_draft_note: null,
  });
  if (note) {
    await addQuoteActivity(quoteId, "moodboard_note", { version, text: note });
  }

  // await obligatoire : Vercel interrompt la fonction dès la réponse.
  const coupleName = quote.partner2_name
    ? `${quote.partner1_name} & ${quote.partner2_name}`
    : quote.partner1_name;
  const base = process.env.NUXT_PUBLIC_SITE_URL || "http://localhost:3001";
  try {
    await sendMoodboardNotification(
      quote.email,
      coupleName,
      `${base}/${quote.locale || "fr"}/mon-projet/moodboard`,
      quote.locale,
      note
    );
  } catch (err) {
    console.error("Error sending moodboard email:", err);
  }

  return { success: true, data: { version, sent_at: now } };
});
