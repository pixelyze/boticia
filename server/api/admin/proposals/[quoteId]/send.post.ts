/**
 * POST /api/admin/proposals/:quoteId/send
 * Admin — Envoyer le devis en préparation à la cliente.
 *
 * Le brouillon le plus récent devient une version figée (V1, V2…) ; la
 * version précédente est marquée remplacée mais reste dans l'historique.
 * La demande passe en "Devis envoyé" si elle n'y est pas encore, et la
 * cliente reçoit un email à chaque version.
 */

import { requireAdmin } from "~/server/utils/serverAuth";
import {
  getProposalsByQuoteId,
  updateProposal,
} from "~/server/utils/client-portal";
import {
  getQuoteRequestById,
  updateQuoteRequest,
  addQuoteActivity,
} from "~/server/utils/quotes";
import { sendProposalNotification } from "~/server/utils/email";

// Statuts où le devis est déjà parti : on ne fait pas reculer le pipeline.
const ALREADY_SENT = ["quote_sent", "signed", "completed"];

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

  const proposals = await getProposalsByQuoteId(quoteId);
  // getProposalsByQuoteId trie par date de dépôt, du plus récent au plus ancien.
  const draft = proposals.find((p) => !p.sent_at);
  if (!draft) {
    throw createError({
      statusCode: 400,
      message: "Aucun devis en préparation à envoyer",
    });
  }

  const sent = proposals.filter((p) => p.sent_at);
  const version = Math.max(0, ...sent.map((p) => p.version || 0)) + 1;
  const now = new Date().toISOString();

  for (const previous of sent.filter((p) => !p.superseded_at)) {
    await updateProposal(previous.id, { superseded_at: now });
  }

  const proposal = await updateProposal(draft.id, {
    status: "pending",
    sent_at: now,
    version,
  });
  if (!proposal) {
    throw createError({
      statusCode: 500,
      message: "Failed to send proposal",
    });
  }

  if (!ALREADY_SENT.includes(quote.status)) {
    await updateQuoteRequest(quoteId, { status: "quote_sent" });
    await addQuoteActivity(quoteId, "status_changed", {
      from: quote.status,
      to: "quote_sent",
    });
  }

  // await obligatoire : Vercel interrompt la fonction dès la réponse.
  const coupleName = quote.partner2_name
    ? `${quote.partner1_name} & ${quote.partner2_name}`
    : quote.partner1_name;
  const base = process.env.NUXT_PUBLIC_SITE_URL || "http://localhost:3001";
  try {
    await sendProposalNotification(
      quote.email,
      coupleName,
      `${base}/${quote.locale || "fr"}/mon-projet/proposition`,
      quote.locale,
      proposal.description
    );
  } catch (err) {
    console.error("Error sending proposal email:", err);
  }

  return { success: true, data: proposal };
});
